# Auth And Supabase Recovery Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore fully working Supabase-backed authentication and sync for Day and Night Bible, including email auth, Google sign-in, Apple sign-in, and repeatable release environment setup.

**Architecture:** Recover the backend target first, then reconnect the mobile app to a valid Supabase project, then configure external auth providers through provider dashboards plus Supabase Auth configuration, and finally harden release environments so TestFlight/App Store builds cannot ship without backend configuration.

**Tech Stack:** Expo React Native, TypeScript, Zustand, Supabase Auth, Supabase Postgres, EAS Build, Apple Sign In, Google Sign-In

---

## Current Findings

1. The old app target `https://hceuvmtzaseyvtlheexj.supabase.co` was dead in DNS as of 2026-03-10.
2. The Supabase account available in this environment does not list project ref `hceuvmtzaseyvtlheexj`.
3. A replacement project now exists at `https://ganmududzdzpruvdulkg.supabase.co` and is `ACTIVE_HEALTHY`.
4. Checked-in database migrations are now applied to the replacement project, including a new `20260310_fix_function_search_path` hardening migration.
5. EAS `development`, `preview`, and `production` environments now point at the replacement project and include Google client IDs.
6. Hosted Supabase auth config has been pushed from `supabase/config.toml` with the Day and Night Bible deep-link redirects and external Apple/Google provider blocks enabled.
7. A disposable email sign-up / sign-in smoke test passed against the replacement project, and the signup trigger created `profiles`, `user_progress`, and `user_preferences` rows correctly.

## Execution Status

### Completed

- Created replacement production project `ganmududzdzpruvdulkg` in `jeremy3004-dot's Org`.
- Applied app schema and migrations for profiles, sync, onboarding preferences, and groups.
- Cleared Supabase security advisor warnings by fixing mutable `search_path` trigger functions.
- Repointed local development env to the live project.
- Synced EAS `development`, `preview`, and `production` env vars to the live project.
- Pushed Supabase hosted auth config from CLI with mobile deep-link redirects.
- Hardened app auth diagnostics so build config, backend reachability, and provider-state failures are separated more clearly.
- Added auth regression coverage for provider-disabled and backend-unreachable cases.

### Still Needs Real-Device Verification

- Google sign-in on device with a real Google account
- Apple sign-in on physical iPhone/TestFlight
- Password reset email delivery end to end

The provider configuration accepted empty secret values during `supabase config push`, which is promising for native ID-token flows, but real-device verification is still required before treating Apple/Google auth as fully proven.

## Recommended Recovery Path

Use a new or re-linked Supabase project that is actually accessible, apply the checked-in schema/migrations, configure EAS environments from that live project, then enable Google and Apple providers through the provider dashboards plus the Supabase Auth Management API.

This is safer than continuing to patch the app around a dead or inaccessible backend target.

## Phase 1: Backend Ownership Recovery

### Task 1: Choose the production Supabase organization

**Decision needed:**
- `jeremy3004-dot's Org` (`sbtkfkoeshfkqrkhrimy`) - recommended default
- `Ironclad Technologies LLC` (`mlfwekvuzlaacjnkhdyx`)

**Success criteria:**
- We have an organization selected for the replacement or relinked Day and Night Bible backend.

### Task 2: Create or relink the production Supabase project

**Preferred path:**
- Create a fresh project named `Day and Night Bible` if the original `hceuvmtzaseyvtlheexj` project cannot be recovered through the correct account.

**Files / systems:**
- Supabase organization/project via MCP
- `/Users/dev/Projects/Day and Night Bible/.env`
- `/Users/dev/Projects/Day and Night Bible/.env.example`

**Success criteria:**
- A real, accessible Supabase project exists for Day and Night Bible.
- The project URL resolves in DNS.
- The project can be queried via Supabase MCP and CLI.

### Task 3: Apply database schema and migrations

**Files:**
- `/Users/dev/Projects/Day and Night Bible/supabase/schema.sql`
- `/Users/dev/Projects/Day and Night Bible/supabase/migrations/20240101000000_initial_schema.sql`
- `/Users/dev/Projects/Day and Night Bible/supabase/migrations/20260306_group_sync_foundation.sql`
- `/Users/dev/Projects/Day and Night Bible/supabase/migrations/20260306_production_hardening.sql`
- `/Users/dev/Projects/Day and Night Bible/supabase/migrations/20260307_expand_interface_languages.sql`
- `/Users/dev/Projects/Day and Night Bible/supabase/migrations/20260307_locale_onboarding_preferences.sql`

**Success criteria:**
- `profiles`, `user_progress`, `user_preferences`, `groups`, `group_members`, and `group_sessions` all exist.
- RLS policies and helper functions exist.
- App sync tables align with checked-in app code.

## Phase 2: Release Environment Repair

### Task 4: Replace dead local env references

**Files:**
- `/Users/dev/Projects/Day and Night Bible/.env`
- `/Users/dev/Projects/Day and Night Bible/.env.example`

**Changes:**
- Point local env to the accessible live Supabase project.
- Keep secrets out of git.

**Success criteria:**
- Local development resolves a live Supabase URL.
- Local auth guard no longer returns configuration failures.

### Task 5: Configure EAS environment variables

**Systems:**
- EAS project env for `production`
- EAS project env for `preview`
- optionally `development`

**Variables to set:**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` or publishable key if we intentionally migrate naming/usage
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_BIBLE_IS_API_KEY` if audio streaming should work in release builds

**Success criteria:**
- `eas env:list --environment production` shows the expected variables.
- Future cloud or local EAS builds have consistent release config.

## Phase 3: Supabase Auth Provider Setup

### Task 6: Configure email auth basics

**Systems:**
- Supabase Auth settings
- app sign-up and password reset flows

**Success criteria:**
- Email/password sign-up works.
- Password reset emails can be triggered from the app.

### Task 7: Configure Google sign-in in Supabase Auth

**External setup required:**
- Google Cloud OAuth clients
- Supabase Auth Management API config

**Requirements from Supabase docs:**
- Google provider enabled
- registered client IDs for web + iOS + Android
- Google client secret set in Supabase Auth

**Success criteria:**
- `signInWithGoogle()` reaches Supabase and returns a valid session on device.

### Task 8: Configure Apple sign-in in Supabase Auth

**External setup required:**
- Apple Developer identifier/service ID/signing key
- generated Apple provider secret
- Supabase Auth Management API config

**Requirements from Supabase docs:**
- Apple provider enabled
- valid Services ID
- valid generated Apple secret

**Success criteria:**
- `signInWithApple()` returns a valid Supabase session on iOS device.

## Phase 4: App-Side Hardening

### Task 9: Improve auth diagnostics in-app

**Files:**
- `/Users/dev/Projects/Day and Night Bible/src/services/auth/authErrors.ts`
- `/Users/dev/Projects/Day and Night Bible/src/services/auth/authService.ts`
- `/Users/dev/Projects/Day and Night Bible/src/screens/auth/SignInScreen.tsx`
- `/Users/dev/Projects/Day and Night Bible/src/screens/auth/SignUpScreen.tsx`

**Changes:**
- Separate “missing build env”, “dead backend host”, “provider disabled”, and “user cancelled”.
- Show actionable user-facing error messages.

**Success criteria:**
- Auth failures are diagnosable from UI and logs without guessing.

### Task 10: Add backend health checks

**Files:**
- `/Users/dev/Projects/Day and Night Bible/src/services/supabase/client.ts`
- `/Users/dev/Projects/Day and Night Bible/src/services/auth/authService.ts`
- `/Users/dev/Projects/Day and Night Bible/src/services/sync/syncService.ts`

**Changes:**
- Add a lightweight startup/backend reachability probe.
- Fail gracefully when project URL is dead or network is unavailable.

**Success criteria:**
- The app distinguishes “offline” from “backend misconfigured”.

### Task 11: Add regression tests

**Files:**
- `/Users/dev/Projects/Day and Night Bible/src/services/auth/googleSignIn.test.ts`
- `/Users/dev/Projects/Day and Night Bible/src/services/supabase/client.test.ts`
- new tests for auth configuration states

**Cases to cover:**
- missing env
- dead Supabase URL
- Google env present but provider disabled
- Apple unavailable on non-iOS

## Phase 5: Validation And Release

### Task 12: Validate backend connectivity

**Checks:**
- email sign-up
- email sign-in
- password reset trigger
- Google sign-in
- Apple sign-in
- sync create/update on live backend

### Task 13: Build and verify release artifacts

**Checks:**
- `npm run lint`
- `npm test -- --runInBand`
- `npx tsc --noEmit`
- local EAS iOS build
- `scripts/testflight_precheck.sh`

### Task 14: Ship to TestFlight and verify tester visibility

**Checks:**
- new build number strictly above latest uploaded iOS build
- build visible in App Store Connect
- build attached to `Internal Testers`
- `curryj@protonmail.com` has build access

## Blockers

1. The original Supabase target is dead/inaccessible and should be treated as retired.
2. Google sign-in still needs real-device validation against the live backend.
3. Apple sign-in still needs real-device validation against the live backend.
4. If provider flows fail in real-device testing, the next likely missing inputs are Google client-secret ownership and Apple provider-secret ownership outside this repo.

## Recommended Next Move

1. Run local verification (`lint`, `test`, `tsc`) against the rewired app.
2. Cut a new iOS build with the live Supabase env.
3. Install on device/TestFlight and verify email, Google, and Apple sign-in.
4. If provider auth still fails, use the runtime error wording added in this pass to identify whether the failure is provider-disabled, audience mismatch, or backend reachability.
