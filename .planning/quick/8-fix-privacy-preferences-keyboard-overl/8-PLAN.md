# Quick Task 8 Plan: Fix privacy preferences keyboard overlap

## Objective

Keep the discreet secure-code inputs visible and scrollable when the keyboard is open.

## Scope

- update `src/screens/more/PrivacyPreferencesScreen.tsx`
- add one regression test that locks keyboard-safe layout scaffolding

## Tasks

### Task 1: Reproduce the regression in a source test

Files: `src/screens/more/privacyPreferencesScreenSource.test.ts`

Action: Add a failing guard that requires the screen to use keyboard avoidance, handled taps, and enough bottom scroll space for the secure-code card.

### Task 2: Bring the screen onto the shared form pattern

Files: `src/screens/more/PrivacyPreferencesScreen.tsx`

Action: Wrap the scrollable form area in `KeyboardAvoidingView`, keep the scroll view tappable while the keyboard is open, and add bottom breathing room so the secure-code card can scroll fully above the keyboard.

## Verification

```bash
node --test --import tsx src/screens/more/privacyPreferencesScreenSource.test.ts src/screens/more/settingsScreenSource.test.ts
npx eslint src/screens/more/PrivacyPreferencesScreen.tsx src/screens/more/privacyPreferencesScreenSource.test.ts
```
