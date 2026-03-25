// Edge Function: send-group-notification
// Fans out push notifications to all active devices of group members when a
// group session is recorded. Excludes the session creator to avoid notifying
// the person who just triggered the action.
//
// Called by the app via supabase.functions.invoke('send-group-notification') after
// a successful group session insert in groupService.ts.
//
// Request body: {
//   group_id: string,        — UUID of the group
//   title: string,           — notification title
//   body: string,            — notification body
//   exclude_user_id?: string — user_id to skip (the session creator)
// }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';
const EXPO_PUSH_BATCH_SIZE = 100;

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  sound: 'default';
  data: {
    screen: string;
    groupId: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json().catch(() => ({})) as {
      group_id?: string;
      title?: string;
      body?: string;
      exclude_user_id?: string;
    };

    const { group_id, title, body: notifBody, exclude_user_id } = body;

    if (!group_id || !title || !notifBody) {
      return new Response(
        JSON.stringify({ success: false, error: 'group_id, title, and body are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Step 1: Get all members of the group
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', group_id);

    if (membersError) {
      throw new Error(`Failed to query group_members: ${membersError.message}`);
    }

    if (!members || members.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, reason: 'no_members' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Step 2: Filter out the session creator (exclude_user_id)
    const memberUserIds = members
      .map((m: { user_id: string }) => m.user_id)
      .filter((id: string) => id !== exclude_user_id);

    if (memberUserIds.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, reason: 'only_creator_in_group' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Step 3: Get active push tokens for the filtered members
    const { data: devices, error: devicesError } = await supabase
      .from('user_devices')
      .select('push_token')
      .eq('is_active', true)
      .in('user_id', memberUserIds);

    if (devicesError) {
      throw new Error(`Failed to query user_devices: ${devicesError.message}`);
    }

    if (!devices || devices.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, reason: 'no_active_tokens' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Step 4: Build Expo push messages
    const messages: ExpoPushMessage[] = devices.map((d: { push_token: string }) => ({
      to: d.push_token,
      title,
      body: notifBody,
      sound: 'default',
      data: { screen: 'GroupDetail', groupId: group_id },
    }));

    // Step 5: Send in batches of 100 (Expo limit per request)
    let totalSent = 0;
    let totalErrors = 0;

    for (let i = 0; i < messages.length; i += EXPO_PUSH_BATCH_SIZE) {
      const batch = messages.slice(i, i + EXPO_PUSH_BATCH_SIZE);

      try {
        const response = await fetch(EXPO_PUSH_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(batch),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'unknown error');
          console.error(`Expo Push API batch failed (${response.status}): ${errorText}`);
          totalErrors += batch.length;
        } else {
          totalSent += batch.length;
        }
      } catch (batchError) {
        console.error('Expo Push API batch request threw:', batchError);
        totalErrors += batch.length;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: totalSent, errors: totalErrors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('send-group-notification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
