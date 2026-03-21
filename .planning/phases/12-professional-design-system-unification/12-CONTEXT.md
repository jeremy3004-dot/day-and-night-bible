# Phase 12 Context: Professional Design System Unification

## Why This Phase Exists

User feedback is now less about missing capability and more about visual trust. The app works, but the main surfaces still feel assembled from good-enough screens rather than one confident product system. The next phase is an intentional design-system pass to remove that "vibe coded" feeling through disciplined typography, spacing, surface hierarchy, and chrome consistency.

## Design Direction

- Keep EveryBible's current dark/red direction rather than rebranding
- Shift the palette toward cleaner charcoal neutrals and away from creamy/parchment drift
- Use one structured mobile typography system across the app
- Standardize spacing, border radii, and shadow hierarchy
- Simplify decorative treatments so content and navigation feel authoritative, not embellished

## Primary Surfaces

- App shell and bottom tabs
- Home
- Bible browser
- Book hub / chapter selector
- Learn / Harvest list
- More
- Profile
- Reading Activity
- Shared mini-player and card surfaces used across tabs

## Risks

- Visual changes can accidentally regress readability or reduce contrast if the new palette is too subtle
- App-wide token changes can affect many screens at once, so the first step must centralize decisions clearly
- Typography changes must avoid harming startup or introducing a brittle font-loading dependency

## Verification Expectations

- Source-level regression tests should prove the app now depends on a shared design system module
- High-traffic screens should import and consume the shared design tokens instead of ad hoc styling only
- Automated lint/typecheck/test must pass
- Device QA still matters for spacing, contrast, and visual balance on smaller iPhones
