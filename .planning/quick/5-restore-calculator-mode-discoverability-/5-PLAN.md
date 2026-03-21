# Quick Task 5 Plan: Restore calculator mode discoverability in Settings

## Objective

Make the calculator disguise mode easy to find again from the More tab settings area.

## Scope

- add a regression test for the Settings shortcut
- update `src/screens/more/SettingsScreen.tsx`

## Tasks

### Task 1: Add a failing regression test

Files:
- `src/screens/more/settingsScreenSource.test.ts`

Action:
- assert that `SettingsScreen` still routes to `PrivacyPreferences`
- assert that the shortcut uses calculator-oriented affordances instead of a generic lock row
- assert that the row includes discreet-mode copy so users can recognize the feature

### Task 2: Restore discoverability

Files:
- `src/screens/more/SettingsScreen.tsx`

Action:
- update the privacy shortcut row to use a calculator icon
- surface discreet-mode copy on the row while keeping the current mode label on the right

### Task 3: Verify

```bash
node --test --import tsx src/screens/more/settingsScreenSource.test.ts
npm run typecheck
npm run lint
```
