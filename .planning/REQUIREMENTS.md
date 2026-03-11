# Requirements: EveryBible

**Defined:** 2026-03-11  
**Core Value:** When someone opens the app, they should immediately know what to do next with God’s Word, be able to do it with low friction, and feel momentum building over time whether they are online or offline.

## Milestone 1 Requirements

These requirements established the stable v1 foundation and are now treated as shipped baseline requirements.

### Authentication And Sync

- [x] **AUTH-01**: User can create an account with email and password
- [x] **AUTH-02**: User can sign in with Apple on iOS and Google on supported builds
- [x] **AUTH-03**: User session persists securely across app restarts
- [x] **SYNC-01**: Signed-in user can sync reading progress and current reading position across devices
- [x] **SYNC-02**: Signed-in user can sync user preferences such as theme, language, locale, and reminder settings

### Onboarding And Preferences

- [x] **LOCL-01**: First launch guides user through interface language, country, and content-language setup
- [x] **LOCL-02**: User can update locale and language choices later from settings without breaking existing data
- [x] **PRIV-01**: User can enable discreet mode with a PIN and have the app relock after backgrounding
- [x] **PREF-01**: User can manage theme, font size, and daily reminder preferences from settings

### Reading

- [x] **READ-01**: User can browse books and chapters and open bundled Berean Standard Bible content offline
- [x] **READ-02**: User can search scripture locally without network access
- [x] **READ-03**: User can keep and restore current reading position and reading streak across app sessions
- [x] **READ-04**: User sees a reliable daily scripture / verse-of-the-day surface that degrades gracefully when optional text or audio is unavailable

### Audio

- [x] **AUDIO-01**: User can stream chapter audio when a supported translation is available and the audio API is configured
- [x] **AUDIO-02**: User can control playback with play, pause, seek, rate, auto-advance, and sleep timer behaviors
- [x] **AUDIO-03**: User can download audio by book or translation and replay downloaded audio offline

### Discipleship And Groups

- [x] **DISC-01**: User can access Four Fields discipleship journeys and lesson content from the mobile app
- [x] **GROUP-01**: User can create, join, and manage study groups without losing existing local progress
- [x] **GROUP-02**: Group leaders can record lesson progress and session activity with backend rules that protect group data when sync is enabled

### Release Quality

- [x] **REL-01**: Startup, auth, sync, reading, and audio critical paths are covered by regression checks before TestFlight or production release
- [x] **REL-02**: Native project settings, Expo config, and release metadata stay aligned across iOS and Android builds

## Milestone 2 Requirements

### Daily Rhythm And Retention

- [ ] **RHYTHM-01**: Home shows one clear “today” action that adapts to reading, listening, and lesson progress.
- [ ] **RHYTHM-02**: Streak, chapter, and lesson momentum are visible in a motivating but low-noise way.
- [ ] **RHYTHM-03**: Reminder and notification systems reinforce real next actions instead of generic prompts.

### Premium Reading Experience

- [ ] **READER-01**: Bible reader supports a premium interaction loop for translation, typography, audio, and contextual study actions.
- [ ] **READER-02**: Reader can evolve toward bookmarks, highlights, notes, and saved reflections without breaking offline behavior.
- [ ] **READER-03**: Reader and browser empty/loading/error states feel intentional and localized.
- [ ] **READER-04**: Bundled Scripture data initializes atomically from a pre-seeded local database and can recover from broken or partial legacy installs without destructive runtime imports.
- [ ] **READER-05**: Offline Scripture search uses indexed local queries that stay fast enough to support deeper reading and multi-translation expansion.

### Audio And Personal Library

- [ ] **LIB-01**: Audio resume, download state, and playback continuity are durable and understandable across sessions.
- [ ] **LIB-02**: User can see what is available offline, streaming-only, or not yet supported without dead-end ambiguity.
- [ ] **LIB-03**: Personal saved content and recent activity can become a reusable library surface.

### Guided Discipleship

- [ ] **DISC-02**: Learn tab feels like a guided journey with clear progress, next lesson, and completion momentum.
- [ ] **DISC-03**: Lesson surfaces support live Scripture deep links and richer study presentation instead of placeholder or static scaffolding.
- [ ] **DISC-04**: Home and Learn reinforce each other so lesson momentum is visible outside the Learn tab.

### Group Study And Community

- [ ] **GROUP-03**: Group create/join/manage flows feel complete and trustworthy on mobile.
- [ ] **GROUP-04**: Synced groups support real member visibility, session history, and progress continuity instead of preview states.
- [ ] **GROUP-05**: Shared study actions are protected by backend rules and stay resilient under reconnect/offline transitions.

### Content And Translation Platform

- [ ] **CONTENT-01**: Product can support additional translations and content-pack lifecycle beyond the bundled baseline.
- [ ] **CONTENT-02**: Daily content, lesson recommendations, and discovery surfaces are driven by explicit contracts rather than scattered UI fallbacks.
- [ ] **CONTENT-03**: Localization coverage reaches all live user-facing surfaces, especially Learn and group flows.

### Performance, Accessibility, And Insight

- [ ] **PLATFORM-01**: Startup, navigation, and core screen transitions stay fast under real-device conditions.
- [ ] **PLATFORM-02**: Accessibility labels, dynamic text behavior, and contrast are audited across key flows.
- [ ] **PLATFORM-03**: Product analytics and operational diagnostics can measure retention loops, broken funnels, and release regressions.

### Growth And Monetization Foundations

- [ ] **BIZ-01**: The app can introduce subscription or premium entitlements without blocking the free core reading and discipleship loop.
- [ ] **BIZ-02**: Home, reader, and learn surfaces expose explicit premium and experiment hooks so conversion work can be measured instead of improvised.

## Later Requirements

- **WEB-01**: A maintained web experience with meaningful feature parity.
- **REALTIME-01**: Group members receive near-real-time shared progress updates where it materially improves study collaboration.
- **PARTNER-01**: Churches or content partners can publish plans, lessons, or campaigns through managed content tooling.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom backend outside Supabase | Existing auth, sync, and SQL-policy architecture already centers on Supabase |
| General-purpose social feed | Pulls focus away from Scripture, habits, and discipleship |
| Broad AI feature set before core loops are mature | Adds complexity before the product’s strongest workflows are fully shaped |
| Full web parity in this milestone | Mobile experience remains the product focus |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| RHYTHM-01 | Phase 6 | Planned |
| RHYTHM-02 | Phase 6 | Planned |
| RHYTHM-03 | Phase 10 | Planned |
| READER-01 | Phase 7 | Planned |
| READER-02 | Phase 7 | Planned |
| READER-03 | Phase 7 | Planned |
| READER-04 | Phase 6 | Planned |
| READER-05 | Phase 6 | Planned |
| LIB-01 | Phase 9 | Planned |
| LIB-02 | Phase 9 | Planned |
| LIB-03 | Phase 9 | Planned |
| DISC-02 | Phase 8 | Planned |
| DISC-03 | Phase 8 | Planned |
| DISC-04 | Phase 8 | Planned |
| GROUP-03 | Phase 8 | Planned |
| GROUP-04 | Phase 8 | Planned |
| GROUP-05 | Phase 8 | Planned |
| CONTENT-01 | Phase 10 | Planned |
| CONTENT-02 | Phase 10 | Planned |
| CONTENT-03 | Phase 10 | Planned |
| PLATFORM-01 | Phase 11 | Planned |
| PLATFORM-02 | Phase 11 | Planned |
| PLATFORM-03 | Phase 11 | Planned |
| BIZ-01 | Phase 11 | Planned |
| BIZ-02 | Phase 11 | Planned |

**Coverage**

- Milestone 1 baseline requirements: 21
- Milestone 2 active requirements: 25
- Total mapped Milestone 2 requirements: 25
- Unmapped Milestone 2 requirements: 0

---
*Last updated: 2026-03-11 for Milestone 2 roadmap kickoff*
