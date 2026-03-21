# Quick Task 8 Context: Fix privacy preferences keyboard overlap

## User Request

The discreet icon secure-code setup form in Settings was sliding under the iOS keyboard, making the input fields hard to see and use.

## Root Cause

`PrivacyPreferencesScreen` was using a plain `ScrollView` with no keyboard avoidance, while similar form screens like sign-in and sign-up already use `KeyboardAvoidingView` plus `keyboardShouldPersistTaps="handled"`.

## Constraints

- keep the current privacy/discreet flow and save behavior unchanged
- use the existing React Native form pattern already present in auth screens
- add a deterministic regression before changing production code
