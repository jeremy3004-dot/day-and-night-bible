---
phase: 31-push-notification-implementation
plan: "01"
subsystem: notifications
tags: [notifications, expo-notifications, android-channels, service-layer, i18n]
dependency_graph:
  requires: []
  provides:
    - src/services/notifications/notificationService.ts
    - src/services/notifications/index.ts
  affects:
    - App.tsx
    - src/screens/more/SettingsScreen.tsx
    - src/i18n/locales/en.ts
    - src/i18n/locales/es.ts
    - src/i18n/locales/ne.ts
    - src/i18n/locales/hi.ts
tech_stack:
  added:
    - expo-notifications (direct in service layer — not via SettingsScreen)
  patterns:
    - Module-scope setNotificationHandler for foreground notification display
    - Stable notification identifier pattern (cancelScheduledNotificationAsync by ID, never cancelAll)
    - i18n.t() in service layer (not the hook — same pattern as other services)
    - Android notification channels (idempotent, created on mount)
key_files:
  created:
    - src/services/notifications/notificationService.ts
    - src/services/notifications/notificationService.test.ts
    - src/services/notifications/index.ts
  modified:
    - App.tsx
    - src/screens/more/SettingsScreen.tsx
    - src/i18n/locales/en.ts
    - src/i18n/locales/es.ts
    - src/i18n/locales/ne.ts
    - src/i18n/locales/hi.ts
decisions:
  - "Use cancelScheduledNotificationAsync('daily-reading-reminder') instead of cancelAllScheduledNotificationsAsync — preserves other app notifications like future group alerts"
  - "Call setupNotificationHandler() at module scope before SplashScreen.preventAutoHideAsync() — ensures foreground handler is registered before any notification can arrive"
  - "setupAndroidChannels() called in AppContent useEffect (not startup coordinator) — channels are idempotent so mounting order is safe"
  - "i18n.t() used in service layer via direct i18n import (not useTranslation hook) — consistent with other service files, works outside React component tree"
metrics:
  duration: "~6 minutes"
  completed_date: "2026-03-25"
  tasks_completed: 2
  files_modified: 9
---

# Phase 31 Plan 01: Notification Service Extraction Summary

**One-liner:** Foreground notification handler wired at module scope, cancelAllScheduledNotifications replaced with stable-identifier cancel, notification logic extracted from SettingsScreen into dedicated service with Android channels and 6-test suite.

## What Was Built

### Task 1: notificationService.ts with tests, barrel export, and Android channels

Created `src/services/notifications/notificationService.ts` with 5 exported functions:

- `setupNotificationHandler()` — registers foreground handler so banners display instead of being silently dropped (was missing, causing all in-app notifications to be invisible to users)
- `setupAndroidChannels()` — creates `daily-reminder` (DEFAULT importance) and `group-alerts` (HIGH importance) channels; no-op on iOS
- `requestNotificationPermissions()` — checks existing permission before requesting, returns boolean
- `scheduleDailyReminder(hour, minute)` — cancels existing `daily-reading-reminder` by ID then schedules with stable identifier
- `cancelDailyReminder()` — cancels only `daily-reading-reminder` (NOT all notifications)

Created `src/services/notifications/notificationService.test.ts` with 6 tests using node:test runner.

Created barrel export `src/services/notifications/index.ts`.

Added `notifications` namespace with 4 keys to en/es/ne/hi locale files:
- `channelDailyReminder`, `channelGroupAlerts`, `groupSessionTitle`, `groupSessionBody`

### Task 2: App.tsx and SettingsScreen.tsx wired to service

**App.tsx:**
- `setupNotificationHandler()` called at module scope (after `SplashScreen.preventAutoHideAsync`, before any component renders)
- `setupAndroidChannels()` called in `AppContent` via `useEffect([], [])` on mount
- `addNotificationResponseReceivedListener` registered in `AppContent` for future tap-to-navigate support
- `addPushTokenListener` registered in `AppContent` for Plan 02 token refresh handling

**SettingsScreen.tsx:**
- Removed inline `scheduleDailyReminder` function (was calling `cancelAllScheduledNotificationsAsync`)
- Removed `import * as Notifications from 'expo-notifications'`
- Now imports `scheduleDailyReminder`, `cancelDailyReminder`, `requestNotificationPermissions` from `../../services/notifications`
- `handleNotificationToggle` uses `requestNotificationPermissions()` instead of inline permission check
- Disabling notifications calls `cancelDailyReminder()` instead of `cancelAllScheduledNotificationsAsync()`

## Deviations from Plan

None — plan executed exactly as written.

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create notificationService with stable identifier and Android channels | 4aa2cde | notificationService.ts, notificationService.test.ts, index.ts, en.ts, es.ts, ne.ts, hi.ts |
| 2 | Wire foreground handler in App.tsx and refactor SettingsScreen | 5785955 | App.tsx, SettingsScreen.tsx |

## Known Stubs

None — all functions are fully implemented. The `addPushTokenListener` callback logs the token and notes "Plan 02 will add: registerPushToken(userId) here" — this is intentional scaffolding for the next plan, not a user-visible stub.

## Self-Check: PASSED
