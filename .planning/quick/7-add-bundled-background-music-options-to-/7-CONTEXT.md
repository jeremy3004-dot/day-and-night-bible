# Quick Task 7 Context: Add bundled background music options to Bible listen mode

## Request

Add a music-note control to the listen utility row so users can choose a bundled background sound bed while listening to scripture.

Specific user intent:

- the listen utility row should gain a music-note button beside the existing repeat, timer, and speed controls
- tapping that button should open a picker for bundled options: ambient, piano, soft guitar, sitar, and ocean waves
- the sounds should ship inside the app instead of downloading later
- the implementation should use free/openly licensed source material with source notes captured in the repo

## Locked implementation choices

- background music should follow Bible narration state instead of becoming an independent player
- the selected sound should persist, but the loop should only play while scripture audio is actively playing
- the existing placeholder `Audio options` affordance should be replaced by a real picker instead of adding another duplicate screen
- the asset pack should prefer CC0 sources; if one category needs a credit-bearing source, that source must be documented clearly

## Desired outcome

- listen mode exposes a discoverable bundled music picker
- the chosen background sound resumes automatically on future listening sessions
- scripture narration and background audio can play together without breaking repeat, sleep timer, queueing, or chapter navigation
- the repo contains the bundled assets plus a source/license record for each shipped sound
