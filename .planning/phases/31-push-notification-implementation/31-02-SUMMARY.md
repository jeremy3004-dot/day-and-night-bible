---
phase: 31-push-notification-implementation
plan: "02"
subsystem: notifications
tags: [notifications, push-tokens, expo-push-api, edge-functions, supabase, groups]
dependency_graph:
  requires:
    - src/services/notifications/notificationService.ts (Plan 01 output)
    - supabase/migrations/20260322140200_create_user_devices_table.sql
    - supabase/migrations/20260306000000_group_sync_foundation.sql
  provides:
    - src/services/notifications/notificationService.ts (extended with push token functions)
    - supabase/functions/send-group-notification/index.ts
  affects:
    - App.tsx
    - src/services/groups/groupService.ts
    - src/services/notifications/index.ts
tech_stack:
  added:
    - expo-constants (already installed — used for EAS projectId in getExpoPushTokenAsync)
    - Expo Push API (https://exp.host/--/api/v2/push/send) via Edge Function
  patterns:
    - Module-level cachedPushToken variable for sign-out deactivation without re-querying
    - Fire-and-forget IIFE pattern for non-fatal post-insert side effects
    - Supabase Edge Function fan-out: group_members → user_devices → Expo Push API batches
key_files:
  created:
    - supabase/functions/send-group-notification/index.ts
  modified:
    - src/services/notifications/notificationService.ts
    - src/services/notifications/notificationService.test.ts
    - src/services/notifications/index.ts
    - App.tsx
    - src/services/groups/groupService.ts
decisions:
  - "Cache the Expo push token in a module-level variable (cachedPushToken) instead of re-querying user_devices on sign-out — avoids an async Supabase read in the sign-out path and keeps deactivatePushToken synchronously gate-able"
  - "Fire-and-forget group notification trigger uses a void IIFE with internal try/catch instead of .catch() on the outer promise — enables awaiting getCurrentUserId() inside without leaking an async promise to the caller's return path"
  - "Edge Function queries group name from groups table inside the notification trigger rather than requiring callers to pass groupName — keeps recordSyncedGroupSession API stable and avoids a breaking change"
  - "Use auth-state transition detection (prevAuthRef + isAuthenticated diff) in App.tsx for deactivatePushToken — avoids modifying authStore.signOut() which would couple notification logic to the auth service"
metrics:
  duration: "~4 minutes"
  completed_date: "2026-03-25"
  tasks_completed: 2
  files_modified: 6
---

# Phase 31 Plan 02: Push Token Registration and Group Session Notifications Summary

**One-liner:** Expo push token registration wired to user_devices on sign-in with sign-out deactivation, Deno Edge Function fans out group session alerts via Expo Push API with 100-message batching and creator exclusion.

## What Was Built

### Task 1 (TDD): registerPushToken, deactivatePushToken, getCachedPushToken in notificationService

Extended `src/services/notifications/notificationService.ts` with three new exports:

- `registerPushToken(userId: string): Promise<string | null>` — obtains the Expo push token via `getExpoPushTokenAsync({ projectId })` where projectId comes from `Constants.expoConfig.extra.eas.projectId`; upserts to `user_devices` with `onConflict: 'user_id,push_token'`; caches token in module-level `cachedPushToken`; returns `null` on any error (simulator, permission denied, offline, RLS) without throwing
- `deactivatePushToken(userId: string): Promise<void>` — marks the cached token `is_active: false` in `user_devices`, clears `cachedPushToken`; no-op if no token cached; best-effort, never throws
- `getCachedPushToken(): string | null` — synchronous getter for the module-level cache; available for future group service direct use

Added 4 new tests to `notificationService.test.ts` (inline implementation pattern matching Plan 01):
1. registerPushToken calls getExpoPushTokenAsync with correct projectId, upserts with correct fields and onConflict
2. registerPushToken swallows getExpoPushTokenAsync errors (simulator scenario)
3. registerPushToken swallows Supabase upsert errors
4. deactivatePushToken calls update with is_active=false, clears cachedToken

Updated `src/services/notifications/index.ts` — added barrel exports for all three new functions.

**Wired in App.tsx:**
- `isAuthenticated` and `user` now subscribed from `useAuthStore`
- `useEffect([isAuthenticated, user?.uid])` — calls `registerPushToken(user.uid)` when authenticated
- Sign-out detection via `prevAuthRef` + `prevUserUidRef` — calls `deactivatePushToken(prevUid)` when auth transitions from true to false
- Push token refresh listener updated from stub comment to live `registerPushToken(currentUser.uid)` call

### Task 2: send-group-notification Edge Function and group session alert trigger

**Created `supabase/functions/send-group-notification/index.ts`:**

Deno Edge Function following the exact `aggregate-engagement` pattern (CORS headers, `SUPABASE_SERVICE_ROLE_KEY`, `Deno.serve`):

1. Validates required request body fields: `group_id`, `title`, `body`
2. Queries `group_members` for all `user_id` values in the group
3. Filters out `exclude_user_id` (session creator) from the member list
4. Queries `user_devices` for `.eq('is_active', true).in('user_id', memberUserIds)`
5. Early returns with `{ success: true, sent: 0, reason: ... }` if no members / no tokens
6. Builds Expo push messages with `data: { screen: 'GroupDetail', groupId }` for future tap-to-navigate
7. Batches into chunks of 100 (Expo Push API limit) and POSTs each batch to `https://exp.host/--/api/v2/push/send`
8. Returns `{ success: true, sent: totalSent, errors: totalErrors }`
9. Outer try/catch returns 500 with error message on unexpected failures

**Wired in `src/services/groups/groupService.ts`:**

Added imports: `getCurrentUserId` from `'../supabase'` and `i18n` from `'../../i18n'`.

After the successful `group_sessions.insert()` in `recordSyncedGroupSession`, added a void IIFE:
- Fetches group name from `groups` table by `groupId`
- Calls `supabase.functions.invoke('send-group-notification', { body: { group_id, title: i18n.t('notifications.groupSessionTitle'), body: i18n.t('notifications.groupSessionBody', { groupName }), exclude_user_id } })`
- All errors swallowed in internal catch — session insert result is never affected

## Deviations from Plan

None — plan executed exactly as written.

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 RED | Add failing tests for registerPushToken and deactivatePushToken | 4aad6d5 | notificationService.test.ts |
| 1 GREEN | Add registerPushToken, deactivatePushToken, getCachedPushToken | a746fd3 | notificationService.ts, index.ts, App.tsx, notificationService.test.ts (lint fix) |
| 2 | Build send-group-notification Edge Function and wire group session alert | 44bed59 | supabase/functions/send-group-notification/index.ts, groupService.ts |

## Known Stubs

None — all functions are fully implemented. The Edge Function is ready for deployment to Supabase via `supabase functions deploy send-group-notification`. The Expo Push Service handles APNs/FCM routing automatically via the EAS projectId — no credentials required in app code.

## Self-Check: PASSED
