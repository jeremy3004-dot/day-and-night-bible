# Quick Task 4 Context: Remove Harvest listened-green state and counts

## Request

Simplify the Harvest chapter list so listened items do not change into a green completed state and the UI does not show progress counters like `9/19 Read`.

Specific user intent:

- Harvest sections should stay neutral instead of turning green after listening
- section cards should not show per-section progress counts
- the Harvest hero should not show a read-count metric

## Regression source

The current Harvest list is still wired to reading progress in `src/screens/learn/CourseListScreen.tsx`.

- it subscribes to `useProgressStore`
- it computes `completedCount` for the hero card
- it computes `sectionCompletedCount` for each section
- it renders a green `checkmark-circle` for listened chapters

## Desired outcome

- Harvest rows keep a simple neutral open/play affordance
- no `x/y Read` counters remain on section cards
- no read-count chip remains in the Harvest hero
