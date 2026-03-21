# Quick Task 5 Context: Restore calculator mode discoverability in Settings

## Request

Bring back an obvious way to find the calculator-style disguise mode from the More tab settings area.

Specific user intent:

- the app should still be able to switch into a calculator-style disguise mode
- that option should be visible again from More -> Settings
- the setting should look clearly related to the calculator disguise, not hidden behind a generic label

## Regression source

The calculator disguise flow still exists in `src/screens/more/PrivacyPreferencesScreen.tsx`, but the entry point in `src/screens/more/SettingsScreen.tsx` looks like a generic privacy row:

- it uses a `lock-closed-outline` icon
- it only shows the broad privacy title
- nothing in the row hints at the calculator disguise option

## Desired outcome

- Settings exposes a clearly calculator-related shortcut to `PrivacyPreferences`
- the row keeps using existing translations and current mode status
- the privacy/calculator route remains part of the More stack
