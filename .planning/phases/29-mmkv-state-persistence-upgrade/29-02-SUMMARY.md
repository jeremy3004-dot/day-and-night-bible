---
phase: 29-mmkv-state-persistence-upgrade
plan: 02
subsystem: state
tags: [tanstack-query, react-query, queryclient, provider, react-native, foundation]

# Dependency graph
requires:
  - phase: 29-01
    provides: MMKV persistence upgrade complete — stable store structure
provides:
  - "@tanstack/react-query@5 installed"
  - "Shared QueryClient with RN-appropriate defaults (src/services/queryClient.ts)"
  - "AppState focus manager wired via focusManager.setFocused"
  - "Online/offline manager wired via onlineManager + NetInfo"
  - "App root wrapped in QueryClientProvider — useQuery available to all future hooks"
affects:
  - 30-animated-chapter-swipe-and-reader-gestures
  - any future plan that migrates Supabase calls to useQuery

# Tech tracking
tech-stack:
  added:
    - "@tanstack/react-query@^5.95.2"
  patterns:
    - "Shared queryClient singleton — one QueryClient instance for the entire app"
    - "focusManager.setFocused(status === 'active') via AppState.addEventListener for foreground refetch"
    - "onlineManager.setEventListener with NetInfo.addEventListener for online/offline state"
    - "QueryClientProvider as outermost provider in App() — wraps I18nextProvider > SafeAreaProvider > ThemeProvider"

key-files:
  created:
    - src/services/queryClient.ts
  modified:
    - App.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "Place QueryClientProvider as outermost provider in App() — wraps all other providers so future useQuery hooks can work regardless of which provider tree they sit in"
  - "Use focusManager.setFocused() (not setEventListener) for AppState integration — simpler, no subscription cleanup required at module level"
  - "No Supabase calls migrated in this plan — additive foundation only; existing fetch patterns untouched"

requirements-completed:
  - PERF-01

# Metrics
duration: 2min
completed: 2026-03-25
---

# Phase 29 Plan 02: TanStack Query Foundation Summary

**@tanstack/react-query@5 installed and wired into the app root with RN focus and online management — additive foundation for future useQuery migration of Supabase fetches**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-25T01:43:13Z
- **Completed:** 2026-03-25T01:45:21Z
- **Tasks:** 2 of 2 (all complete)
- **Files modified:** 4 (1 new file)

## Accomplishments

- Installed `@tanstack/react-query@5` (resolves to `^5.95.2`)
- Created `src/services/queryClient.ts` exporting shared `QueryClient` with RN-appropriate defaults:
  - `staleTime: 5 * 60 * 1000` (5 minutes)
  - `gcTime: 10 * 60 * 1000` (10 minutes garbage collection)
  - `retry: 2`
- Wired `focusManager.setFocused(status === 'active')` via `AppState.addEventListener` — queries refetch when app foregrounds
- Wired `onlineManager.setEventListener` via `NetInfo.addEventListener` — queries pause/resume based on network connectivity
- Wrapped App root in `QueryClientProvider` as outermost provider — all future `useQuery` hooks have access
- 62 existing release regression tests still pass; TypeScript clean; no existing behavior changed

## Task Commits

1. **Task 1: Install TanStack Query v5 and create queryClient with RN focus/online managers** — `89ff145` (feat)
2. **Task 2: Wrap App root in QueryClientProvider** — `28749b8` (feat)

## Files Created/Modified

- `src/services/queryClient.ts` — Shared QueryClient, focusManager, onlineManager setup
- `App.tsx` — QueryClientProvider import and wrapper around provider tree
- `package.json` — @tanstack/react-query@^5.95.2 added to dependencies
- `package-lock.json` — Lock file updated

## Decisions Made

- `QueryClientProvider` placed as the outermost provider in `App()` (outside `I18nextProvider`) — TanStack Query is infrastructure that has no i18n or theme dependency; this placement ensures future `useQuery` hooks work anywhere in the tree regardless of which providers they need
- Used `focusManager.setFocused()` directly in `AppState` callback (not `focusManager.setEventListener`) — the plan's explicit recommendation for simplicity; no subscription cleanup required at the module level since the module lives for the app lifetime
- No existing Supabase fetch patterns migrated — this plan is foundation-only per the plan spec; future phases can incrementally adopt `useQuery(() => existingServiceFunction())`

## Deviations from Plan

None — plan executed exactly as written. The App.tsx provider tree in the actual file matched what the plan described, and `QueryClientProvider` wraps `I18nextProvider` as specified.

## Known Stubs

None — the QueryClient is fully configured with real defaults. The `QueryClientProvider` wrapper is live. No placeholder values or deferred wiring. Future plans calling `useQuery` will have access to the configured client immediately.

## Next Phase Readiness

- Both tasks complete — code changes committed, TypeScript clean, 62 tests pass
- TanStack Query is available for `useQuery` hooks throughout the app
- Focus and online managers are wired — queries will automatically refetch on app foreground and reconnect
- Move to Phase 30 (Animated Chapter Swipe and Reader Gestures) or any future plan that uses `useQuery` for Supabase data fetching

---
*Phase: 29-mmkv-state-persistence-upgrade*
*Completed: 2026-03-25*
