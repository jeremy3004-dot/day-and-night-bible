# Milestone 2 Product And Platform Notes

**Compiled:** 2026-03-11

## Source Inputs

- Refero screen and flow research across reading, settings, dashboard, onboarding, and course patterns
- Exa web/company research on YouVersion, Dwell, Hallow, and Glorify-style retention loops
- Internal codebase audit from parallel agents focused on UX gaps and platform leverage

## Product Takeaways

- Premium faith apps win by reducing “what should I do next?” through a small number of high-signal daily actions.
- The best home dashboards combine one clear next action, visible momentum, and a restrained stack of secondary actions.
- Reader controls work best as focused contextual surfaces, not scattered permanent chrome.
- Learn and course surfaces feel premium when progress is staged, visible, and anchored to the next unfinished step.
- Group experiences become meaningful when they are tied to a specific passage, lesson day, or shared ritual instead of generic social activity.

## Codebase Takeaways

- Learn/group is the biggest concentration of visible unfinished UX in the live shell.
- Bible bootstrap and search are the biggest technical leverage points under the core reading experience.
- Audio ownership and sync durability will need architectural attention after the current phase.

## Milestone Decision

Phase 6 should combine platform leverage and product direction:

1. Replace runtime Bible JSON seeding with a bundled indexed SQLite asset and recovery-safe bootstrap.
2. Use the stronger Scripture layer to redesign Home into a daily-rhythm hub.

This keeps the roadmap product-led without ignoring the most consequential reliability/performance bottleneck.
