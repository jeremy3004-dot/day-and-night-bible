# Roadmap: EveryBible

## Overview

Milestone 1 is complete: the app now has a trustworthy v1 baseline for startup, auth, sync, reading, audio, discipleship, and release delivery. Milestone 2 is a new roadmap focused on productization: better retention loops, premium Scripture UX, stronger Learn and group flows, more scalable content systems, and the platform foundations needed for growth.

This roadmap keeps the brownfield posture. The app already contains meaningful capability; the work now is to remove the most visible “not finished yet” seams, speed up the surfaces people open most, and add the data, analytics, and monetization hooks needed for a durable business.

## Phase Status Key

- Phases 1-5: executed baseline work from Milestone 1
- Phases 6-11: active Milestone 2 roadmap
- Decimal phases remain reserved for inserted urgent work

## Completed Baseline Phases

- [x] **Phase 1: Startup And Backend Hardening**
- [x] **Phase 2: Onboarding And Preference Cohesion**
- [x] **Phase 3: Core Reading And Audio Polish**
- [x] **Phase 4: Discipleship And Group Rollout**
- [x] **Phase 5: Release Hardening And Distribution**

## Active Milestone 2 Phases

- [ ] **Phase 6: Scripture Data And Daily Rhythm** - Replace brittle runtime Bible seeding with a bundled indexed data layer, then turn Home into a premium “today” hub
- [ ] **Phase 7: Premium Reader And Personal Study** - Deepen the Bible reader with better study controls, personalization, and premium interaction quality
- [ ] **Phase 8: Guided Learn And Group Productionization** - Make Learn and group study feel complete, connected, and trustworthy in the live shell
- [ ] **Phase 9: Audio, Sync, And Personal Library Reliability** - Make listening continuity, download ownership, and offline/sync durability feel product-grade
- [ ] **Phase 10: Content, Localization, And Retention Systems** - Add translation/content-pack readiness, better localization coverage, and smarter reminders/recommendations
- [ ] **Phase 11: Performance, Accessibility, Analytics, And Monetization Foundations** - Lock in scale-ready quality, insight, and premium business hooks

## Phase Details

### Phase 6: Scripture Data And Daily Rhythm
**Goal**: Strengthen the app’s highest-traffic Scripture data path and use that stronger foundation to create a motivating daily-use home experience.
**Depends on**: Phase 5
**Requirements**: RHYTHM-01, RHYTHM-02, READER-04, READER-05
**Success Criteria**:
  1. Bible initialization uses a bundled seeded database with an atomic readiness check and recovery path for broken legacy local data.
  2. Offline Bible search and first Bible open feel meaningfully faster and more dependable than the JSON import path.
  3. Home gives the user one clear next action, visible momentum, and stronger cross-links into reading, audio, and discipleship.
**Plans**: 2 plans

Plans:
- [x] 06-01: Replace runtime Bible seeding with a bundled indexed SQLite asset and recovery-safe bootstrap
- [x] 06-02: Redesign Home into a premium daily-rhythm dashboard with stronger momentum and next-action guidance

### Phase 7: Premium Reader And Personal Study
**Goal**: Turn the reader into the app’s strongest daily ritual surface.
**Depends on**: Phase 6
**Requirements**: READER-01, READER-02, READER-03
**Success Criteria**:
  1. Reader controls for translation, typography, and audio feel cohesive and low friction.
  2. Reader architecture supports saved personal study actions such as bookmarks, highlights, and notes without breaking offline behavior.
  3. Reader and browser loading, empty, and error states feel intentional and localized.
**Plans**: 3 plans

Plans:
- [ ] 07-01: Unify reader controls, microstates, and study affordance entrypoints
- [ ] 07-02: Add an offline-safe personal study layer for bookmarks, highlights, and notes
- [ ] 07-03: Polish reader/browser empty, loading, and localization coverage

### Phase 8: Guided Learn And Group Productionization
**Goal**: Make Learn and group study feel like a real product, not a preview surface.
**Depends on**: Phase 7
**Requirements**: DISC-02, DISC-03, DISC-04, GROUP-03, GROUP-04, GROUP-05
**Success Criteria**:
  1. Learn shows clear journey progress, next lesson, and meaningful completion momentum.
  2. Lesson content deep-links into Scripture and avoids placeholder dead ends.
  3. Group create/join/manage/session flows feel complete and resilient under local and synced paths.
**Plans**: 3 plans

Plans:
- [ ] 08-01: Rebuild Learn around guided next-step progression and visible momentum
- [ ] 08-02: Connect lesson scripture references, richer study presentation, and home/learn reinforcement
- [ ] 08-03: Finish group lifecycle flows, session history, and synced member continuity

### Phase 9: Audio, Sync, And Personal Library Reliability
**Goal**: Make read/listen continuity and offline ownership durable across sessions and reconnects.
**Depends on**: Phase 8
**Requirements**: LIB-01, LIB-02, LIB-03
**Success Criteria**:
  1. Audio playback ownership is centralized enough that resume, queue, and auto-advance behavior stay predictable.
  2. Offline-versus-streaming availability is clearly expressed across reader, downloads, and library surfaces.
  3. Progress and media sync use replayable dirty-state handling rather than fragile fire-and-forget updates.
**Plans**: 3 plans

Plans:
- [ ] 09-01: Refactor audio playback ownership and durable resume state
- [ ] 09-02: Build a personal library surface for recents, saved content, and download visibility
- [ ] 09-03: Harden sync queue behavior for progress and media-related state

### Phase 10: Content, Localization, And Retention Systems
**Goal**: Make the product ready for more content, more languages, and smarter engagement loops.
**Depends on**: Phase 9
**Requirements**: RHYTHM-03, CONTENT-01, CONTENT-02, CONTENT-03
**Success Criteria**:
  1. Translation and content-pack expansion have explicit app and backend contracts instead of placeholder affordances.
  2. Daily content, recommendations, and reminder messaging are driven by reusable data contracts.
  3. Localization coverage reaches all live user-facing surfaces with fewer hardcoded English fallbacks.
**Plans**: 3 plans

Plans:
- [ ] 10-01: Add content manifest contracts and additional translation/content-pack readiness
- [ ] 10-02: Build reminder and recommendation plumbing around real next actions
- [ ] 10-03: Complete localization coverage across live screens and states

### Phase 11: Performance, Accessibility, Analytics, And Monetization Foundations
**Goal**: Make EveryBible measurable, scalable, accessible, and premium-ready.
**Depends on**: Phase 10
**Requirements**: PLATFORM-01, PLATFORM-02, PLATFORM-03, BIZ-01, BIZ-02
**Success Criteria**:
  1. Startup and navigation performance are measured and improved on real-device critical paths.
  2. Accessibility quality is audited and improved across Home, Bible, Learn, audio, and settings.
  3. Analytics, release diagnostics, and entitlement hooks exist for retention experiments and premium rollout.
**Plans**: 3 plans

Plans:
- [ ] 11-01: Add measurable performance budgets and startup/navigation optimization work
- [ ] 11-02: Audit and improve accessibility on the core app journey
- [ ] 11-03: Add analytics taxonomy, operational diagnostics, and premium entitlement foundations

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Startup And Backend Hardening | 2/2 | Complete | 2026-03-11 |
| 2. Onboarding And Preference Cohesion | 2/2 | Complete | 2026-03-11 |
| 3. Core Reading And Audio Polish | 2/2 | Complete | 2026-03-11 |
| 4. Discipleship And Group Rollout | 3/3 | Complete | 2026-03-11 |
| 5. Release Hardening And Distribution | 2/2 | Complete | 2026-03-11 |
| 6. Scripture Data And Daily Rhythm | 2/2 | Complete | 2026-03-11 |
| 7. Premium Reader And Personal Study | 0/3 | Planned | - |
| 8. Guided Learn And Group Productionization | 0/3 | Planned | - |
| 9. Audio, Sync, And Personal Library Reliability | 0/3 | Planned | - |
| 10. Content, Localization, And Retention Systems | 0/3 | Planned | - |
| 11. Performance, Accessibility, Analytics, And Monetization Foundations | 0/3 | Planned | - |
