# Quick Task 9 Context: Reader back arrow and centered translation chip

## User Request

- make the top-left premium reader control a left-facing back arrow
- show only the currently selected translation in the chip under `Listen / Read`
- keep that translation chip centered under the `Listen / Read` rail

## Root Cause

- the premium reader top-left button still used a downward chevron icon even though it navigated back
- the translation chip label was built from all audio-available translations instead of the active translation
- the dock container was centered, but the chip touch target inherited a left-aligned glass-button style, which pulled it off-center

## Constraints

- keep the existing premium reader layout and translation sheet behavior
- preserve the overflow translation picker path
- lock the requested behavior with a source regression before relying on the UI fix
