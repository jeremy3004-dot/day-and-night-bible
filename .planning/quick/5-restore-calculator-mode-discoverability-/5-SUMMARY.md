# Quick Task 5 Summary: Restore calculator mode discoverability in Settings

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- restored a clearly calculator-related shortcut in More -> Settings for the disguise mode
- kept the existing `PrivacyPreferences` route and current mode label
- surfaced discreet-mode copy on the row so the feature is recognizable again

## Files Changed

- `src/screens/more/SettingsScreen.tsx`
- `src/screens/more/settingsScreenSource.test.ts`
- `.planning/quick/5-restore-calculator-mode-discoverability-/5-CONTEXT.md`
- `.planning/quick/5-restore-calculator-mode-discoverability-/5-PLAN.md`
- `.planning/quick/5-restore-calculator-mode-discoverability-/5-SUMMARY.md`

## Verification

```bash
node --test --import tsx src/screens/more/settingsScreenSource.test.ts
npm run typecheck
npm run lint
```
