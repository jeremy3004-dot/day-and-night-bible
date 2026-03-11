# Phase 6 Research

## Phase Goal

Strengthen Scripture data readiness and use that stronger foundation to make Home feel like a premium daily-use surface.

## Why This Phase Comes First

- The current Bible bootstrap parses a large JSON payload on device and clears existing verse data before reseeding.
- A failed import can leave the Bible experience in a broken state until restart.
- Search currently relies on `LIKE '%query%'`, which is functional but weak for scale and responsiveness.
- Home is currently too static to drive habit formation, but it should be rebuilt on top of dependable Scripture data rather than fragile loading behavior.

## External Product Signals

- YouVersion and Hallow-style products emphasize a small number of repeatable daily actions with visible progress and reminders.
- Dwell-style listening products show the value of making read/listen state feel calm, premium, and resumable.
- Refero dashboard references reinforced that a premium home should combine one clear primary action, visible momentum, and a short list of meaningful secondary actions.

## Internal Product Signals

- Learn and group flows remain an important later-phase target, but the Bible experience is still the app’s central promise.
- Home, daily Scripture, Bible browser, and Bible reader all become stronger if bundled content access is faster and more reliable.

## Phase Strategy

- Plan 06-01 focuses on the data platform: seeded SQLite asset, readiness verification, recovery-safe import, and indexed search.
- Plan 06-02 will use that stronger data layer to redesign Home into a better daily rhythm hub.
