# Quick Task 8 Summary: Fix privacy preferences keyboard overlap

## Status

Completed in the working tree. Not yet committed or pushed.

## Delivered

- added a regression test for keyboard-safe discreet-code setup
- wrapped the privacy preferences form area in `KeyboardAvoidingView`
- enabled handled taps on the scroll view while the keyboard is open
- added bottom padding so the secure-code card can scroll clear of the keyboard

## Files Changed

- `src/screens/more/PrivacyPreferencesScreen.tsx`
- `src/screens/more/privacyPreferencesScreenSource.test.ts`
- `.planning/quick/8-fix-privacy-preferences-keyboard-overl/8-CONTEXT.md`
- `.planning/quick/8-fix-privacy-preferences-keyboard-overl/8-PLAN.md`
- `.planning/quick/8-fix-privacy-preferences-keyboard-overl/8-SUMMARY.md`

## Verification

```bash
node --test --import tsx src/screens/more/privacyPreferencesScreenSource.test.ts src/screens/more/settingsScreenSource.test.ts
npx eslint src/screens/more/PrivacyPreferencesScreen.tsx src/screens/more/privacyPreferencesScreenSource.test.ts
```
