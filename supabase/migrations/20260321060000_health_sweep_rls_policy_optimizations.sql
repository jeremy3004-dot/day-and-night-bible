-- Health sweep remediation:
-- 1. Wrap auth.uid() calls inside SELECTs so Postgres can cache them per statement in RLS.
-- 2. Add the missing foreign-key index for group_sessions.created_by.

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Group members can view groups" ON public.groups;
CREATE POLICY "Group members can view groups" ON public.groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.group_members members
      WHERE members.group_id = groups.id
        AND members.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Leaders can create groups" ON public.groups;
CREATE POLICY "Leaders can create groups" ON public.groups
  FOR INSERT WITH CHECK (leader_id = (select auth.uid()));

DROP POLICY IF EXISTS "Leaders can update groups" ON public.groups;
CREATE POLICY "Leaders can update groups" ON public.groups
  FOR UPDATE USING (leader_id = (select auth.uid()))
  WITH CHECK (leader_id = (select auth.uid()));

DROP POLICY IF EXISTS "Leaders can delete groups" ON public.groups;
CREATE POLICY "Leaders can delete groups" ON public.groups
  FOR DELETE USING (leader_id = (select auth.uid()));

DROP POLICY IF EXISTS "Group members can view membership" ON public.group_members;
CREATE POLICY "Group members can view membership" ON public.group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.group_members visible_members
      WHERE visible_members.group_id = group_members.group_id
        AND visible_members.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can join groups as themselves" ON public.group_members;
CREATE POLICY "Users can join groups as themselves" ON public.group_members
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users and leaders can leave groups" ON public.group_members;
CREATE POLICY "Users and leaders can leave groups" ON public.group_members
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.groups managed_groups
      WHERE managed_groups.id = group_members.group_id
        AND managed_groups.leader_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Leaders can update membership" ON public.group_members;
CREATE POLICY "Leaders can update membership" ON public.group_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM public.groups managed_groups
      WHERE managed_groups.id = group_members.group_id
        AND managed_groups.leader_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.groups managed_groups
      WHERE managed_groups.id = group_members.group_id
        AND managed_groups.leader_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Group members can view sessions" ON public.group_sessions;
CREATE POLICY "Group members can view sessions" ON public.group_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.group_members members
      WHERE members.group_id = group_sessions.group_id
        AND members.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Group members can insert sessions" ON public.group_sessions;
CREATE POLICY "Group members can insert sessions" ON public.group_sessions
  FOR INSERT WITH CHECK (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.group_members members
      WHERE members.group_id = group_sessions.group_id
        AND members.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Session creators can update sessions" ON public.group_sessions;
CREATE POLICY "Session creators can update sessions" ON public.group_sessions
  FOR UPDATE USING (created_by = (select auth.uid()))
  WITH CHECK (created_by = (select auth.uid()));

CREATE INDEX IF NOT EXISTS idx_group_sessions_created_by ON public.group_sessions(created_by);
