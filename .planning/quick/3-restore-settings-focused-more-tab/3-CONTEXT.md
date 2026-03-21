# Quick Task 3 Context: Restore settings-focused More tab

## Request

Revert the `More` tab back to a settings/profile-focused destination and remove the saved-library experience that was added later.

Specific user intent:

- the `More` tab should be about settings and personal info
- it should not contain the saved library hub
- favorites, playlists, queue, and listening history do not need to live there
- the “Keep your listening path together…” section should be removed

## Regression source

The current stack had drifted in three places:

- `src/screens/more/MoreScreen.tsx` exposed a `Saved Library` entry in the More menu
- `src/navigation/MoreStack.tsx` still registered a dedicated `Library` route
- `src/screens/bible/BibleReaderScreen.tsx` still exposed an `Open saved library` action in the reader sheet

The library hub content itself lived in `src/screens/more/LibraryScreen.tsx`.

## Desired outcome

- `More` becomes profile/settings-focused again
- the `Library` route is removed from the More stack
- the reader no longer routes into the removed library hub
- the obsolete library screen can be deleted
