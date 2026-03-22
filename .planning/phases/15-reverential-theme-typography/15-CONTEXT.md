# Phase 15: Reverential Theme & Typography - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the current generic "tech app" visual language (cool blue-grey palette, coral accent, rounded-everything, excessive shadows, nested cards, system sans-serif) with a reverential, typographically disciplined aesthetic inspired by premium Bible apps (ESV, Glorify, Alabaster). Deliver three theme modes (Dark, Light, Low-light), a custom bundled serif font, and apply the new design language across all individual screens — not just tokens.

</domain>

<decisions>
## Implementation Decisions

### Color palette & accent strategy
- **D-01:** Accent color is minimal — typography, spacing, and tonal contrast do the visual hierarchy work. Color accent is reserved strictly for interactive affordances (tappable elements, active/selected states, toggles). No decorative color.
- **D-02:** Dark mode backgrounds use warm near-black tones (not cool blue-grey). Reference palette direction: ~#0C0B09 range, warm-tinted.
- **D-03:** Text colors use warm cream/off-white on dark backgrounds (not pure #FFFFFF). Think #F0EBE0 range.
- **D-04:** Card surfaces and elevated elements use subtle warm dark grey, barely lifted from background. No blue tint. No heavy shadows/glows.
- **D-05:** Light mode uses warm off-white/cream backgrounds (not clinical blue-white #f5f7fa). Warm paper tone.
- **D-06:** Low-light mode is warm sepia-toned — the feeling of reading parchment by candlelight. Amber/brown-shifted backgrounds and text.

### Theme modes
- **D-07:** Three theme modes: Dark (primary, optimized first), Light (secondary), Low-light/Sepia (third, for nighttime reading).
- **D-08:** Dark mode is the hero experience and the default design target. Light and Low-light are derived variants, not afterthoughts but secondary.
- **D-09:** User preference for theme mode persists via existing authStore preferences mechanism (extend the current 'dark'/'light'/'system' to include 'low-light' option).

### Typography
- **D-10:** Bundle a custom serif font with the app (~100-200KB acceptable size increase). Claude's discretion on exact typeface — candidates include EB Garamond, Cormorant Garamond, or similar classical serif with good screen rendering.
- **D-11:** Claude's discretion on where serif vs. sans-serif is used across the app (reading surfaces, titles, navigation, buttons, labels). The goal is reverential without being impractical for UI affordances.
- **D-12:** The current `readingFontFamily` (Georgia/serif) in system.ts is replaced by the bundled custom serif for all reading surfaces.

### Visual language — stripping generic patterns
- **D-13:** Strip "AI-generated UI" patterns: excessive rounded corners everywhere, drop shadows/glows for hierarchy, nested cards-inside-cards, generic Inter/Roboto system sans-serif as the default voice.
- **D-14:** Claude's discretion on replacement approach — candidates include: mostly square/subtle radius (2-4px), removing card containers in favor of spacing and dividers, flattening visual hierarchy, killing nested cards, reducing border radius globally.
- **D-15:** Individual screens are updated in this phase — this is NOT just a token swap. Every screen gets the new visual language applied.

### Scope of screen-level changes
- **D-16:** All screens in the app are swept: Home, Bible browser/book hub/reader, Learn/Harvest, More/Settings/Profile, Reading Activity, audio player, group screens, onboarding.
- **D-17:** The sweep applies the new palette, typography, and stripped visual patterns. It does NOT change layouts, navigation structure, or feature logic.
- **D-18:** Hardcoded colors (previously audited: ~31 instances across 8 files) must be migrated to theme tokens.

### Claude's Discretion
- Exact serif typeface selection (EB Garamond, Cormorant Garamond, or other)
- Serif vs. sans-serif boundary across the app (which surfaces get serif, which keep functional sans)
- Border radius values (how far toward square/print-editorial to go)
- Card removal vs. card simplification per screen
- Shadow/elevation removal strategy
- Exact hex values for all three palettes (Dark, Light, Low-light) — guided by the reference images
- Divider/separator styling to replace removed card boundaries
- Tab bar treatment (the Glorify reference shows a frosted/glass tab bar)
- Verse number and section heading typographic treatment

</decisions>

<specifics>
## Specific Ideas

### Reference apps the user provided screenshots of:
1. **Glorify app** (dark mode home screen) — Premium editorial feel, warm near-black background, warm cream serif italic for verse-of-the-day, subtle warm grey card surfaces, frosted glass tab bar with warm tones. Modern-reverential.
2. **Ornate Nehemiah** (dark mode reader) — Deep black background, gold/cream serif text, decorative drop cap "T", architectural book illustration, all-caps book title. Classical/ornamental.
3. **ESV Bible app** (dark mode reader) — Ultra-minimal, near-black background, warm off-white serif text, minimal header (book/chapter/version only), italic serif section headings. Maximum restraint.
4. **ESV Bible app** (mixed mode reader) — Similar restraint, serif body text, clean hierarchy.
5. **Genesis reader** (light + dark, side by side) — Shows "Classic/Stylish/Modern" font selector with red accent pip, serif typography, clean white light mode. Demonstrates how a red accent can be used sparingly (bookmark marker only).
6. **EveryBible current** (Nehemiah reader, dark) — Current state for comparison. Cool-toned grey, serif reading font (Georgia), warm-ish text but cold background.

### User's diagnosis of the current problem:
> "The problem is that it uses a lot of the codex generic UI/UX like rounded corners everywhere, Inter/Roboto fonts, excessive shadows/glows, nested cards, generic layouts"

This is the core motivation: the app currently reads as "AI-generated tech product" instead of a reverential Bible reading experience.

### Reference screenshots location:
- `.context/attachments/57fc70801296d43c61e6aec7eca6fe0c.webp` — Glorify hero
- `.context/attachments/Screenshot 2026-03-22 at 11.12.45 AM.png` — EveryBible current (Nehemiah)
- `.context/attachments/Screenshot 2026-03-22 at 11.12.51 AM.png` — Ornate Nehemiah
- `.context/attachments/Screenshot 2026-03-22 at 11.13.01 AM.png` — ESV dark reader
- `.context/attachments/Screenshot 2026-03-22 at 11.13.06 AM.png` — ESV dark reader (variant)
- `.context/attachments/Screenshot 2026-03-22 at 11.23.27 AM.png` — Glorify hero (angle 2)
- `.context/attachments/Screenshot 2026-03-22 at 11.26.23 AM.png` — Genesis light+dark with settings

</specifics>

<canonical_refs>
## Canonical References

### Theme system
- `src/contexts/ThemeContext.tsx` — Current theme provider, dark/light color palettes, ThemeColors interface (must be extended for low-light mode)
- `src/design/system.ts` — Design tokens: spacing, radius, typography, shadows, layout constants

### Prior design work
- `.planning/phases/12-professional-design-system-unification/` — Phase 12 established the current design system; Phase 15 replaces its color/type direction while keeping its structural discipline
- `.planning/phases/12-professional-design-system-unification/12-01-PLAN.md` — Design token definitions that Phase 15 supersedes

### Color usage audit (from prior session)
- Most-used color properties: secondaryText (197), primaryText (183), cardBorder (135), accentGreen (68), accentPrimary (58)
- Hardcoded colors: ~31 instances across 8 files including GroupSessionScreen (9), BibleReaderScreen (rgba glass effects), and 6 others
- Bible-specific color system: bibleBackground, bibleSurface, bibleElevatedSurface, biblePrimaryText, bibleSecondaryText, bibleAccent, bibleControlBackground

### Stores
- `src/stores/authStore.ts` — User preferences including theme selection (must extend to support 'low-light' option)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **ThemeContext.tsx**: Already provides `useTheme()` hook, `ThemeColors` interface, `ThemeProvider` wrapper. Extend with third palette and new color values.
- **system.ts**: Design token file with spacing, radius, typography, shadows, layout. Typography section already separates UI fonts from reading fonts — extend with custom serif.
- **Existing `bible*` color tokens**: The theme already has dedicated Bible reading surface colors separate from app UI colors. This separation is useful for the reverential treatment.

### Established Patterns
- **StyleSheet.create()** with `useTheme()` colors used across all screens — the migration path is clear: update tokens and sweep screens.
- **Zustand + AsyncStorage persistence** for theme preference — extend the existing `preferences.theme` union type.
- **expo-font** is already in the dependency tree — can be used to load bundled custom serif.

### Integration Points
- **ThemeContext.tsx** is the single source of truth for all colors — changing it propagates everywhere that uses `useTheme()`.
- **system.ts** is the single source of truth for typography, spacing, radius — changing it propagates everywhere that imports tokens.
- **authStore preferences.theme** controls which palette is active — must add 'low-light' to the type union.
- **Hardcoded colors** (~31 instances) need individual migration to theme tokens.
- **Individual screen StyleSheet.create()** blocks need visual audit and cleanup (strip nested cards, excessive radius, shadows).

</code_context>

<deferred>
## Deferred Ideas

- Custom font size/style selector per-user (like the Genesis app's "Classic/Stylish/Modern" toggle) — could be a future personalization phase
- Book-specific ornamental illustrations (like the ornate Nehemiah architecture drawing) — content/art phase, not theme
- Drop cap rendering for chapter openings — interesting typographic flourish but adds complexity, evaluate separately
- Animated theme transitions between modes — polish, not core

</deferred>

---

*Phase: 15-reverential-theme-and-typography*
*Context gathered: 2026-03-22*
