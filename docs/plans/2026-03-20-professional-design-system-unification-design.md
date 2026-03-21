# EveryBible Professional Design System Unification

## Direction

The app should feel calm, premium, and trustworthy within the first few seconds. The right model is not "more styled"; it is more disciplined. EveryBible keeps its dark Bible-reader identity and warm red accent, but the rest of the system needs to become cleaner, more structured, and less decorative.

## Core Decisions

- Typography: use one structured mobile sans system across the UI with a small, explicit scale for screen titles, section titles, card titles, body copy, and micro labels
- Spacing: normalize the app to a 4-point rhythm with a practical scale of 4, 8, 12, 16, 24, 32, and 48
- Radius: reduce drift by using a small radius set instead of screen-by-screen values
- Surface hierarchy: establish clear background, surface, elevated surface, and border roles so cards and panels read consistently
- Accent usage: reserve the red accent for primary action, active state, and key progress signal rather than letting each screen invent extra emphasis

## Practical Scope

This pass targets the main impression surfaces first:

- bottom tab shell
- Home
- Bible browser
- chapter selector / book hub
- Learn list
- More
- Profile
- Reading Activity
- mini-player

## What Changes Visually

- cleaner charcoal neutrals and less parchment/cream drift
- more consistent card padding and border radii
- calmer hierarchy with fewer decorative shapes
- stronger, more consistent titles and section headers
- simpler chrome and more trust-building alignment between screens

## What Does Not Change

- the core product structure
- the red accent identity
- the Bible listen/read interaction model
- feature scope or backend contracts
