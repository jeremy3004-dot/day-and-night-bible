# Quick Task 6 Context: Remove bottom tab corner gaps

## Request

Flatten the top edge of the bottom tab bar so it spans cleanly across the screen and does not leave black corner wedges on the left and right sides.

Specific user intent:

- the bottom tab should go straight across
- the rounded top corners should be removed
- the black gaps between the background and tab bar should disappear

## Regression source

The shared bottom tab style in `src/navigation/TabNavigator.tsx` still rounds the top corners:

- `borderTopLeftRadius: radius.lg`
- `borderTopRightRadius: radius.lg`

That creates the visible dark wedges at the upper-left and upper-right edges of the tab bar.

## Desired outcome

- the root tab bar uses a straight top edge
- no rounded top corner styling remains in the shared tab bar style
