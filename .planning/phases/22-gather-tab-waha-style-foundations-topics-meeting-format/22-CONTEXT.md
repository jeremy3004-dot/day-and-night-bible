# Phase 22: Gather Tab — Context

**Gathered:** 2026-03-23
**Status:** Ready for planning
**Source:** User screenshots + description (Waha app reference)

<domain>
## Phase Boundary

Replace the current "Harvest" tab entirely with a new "Gather" tab modeled after the Waha app. The current Harvest tab content (Four Fields courses, Harvest Studies, Reading Plans hub) is removed. The new Gather tab has two sub-tabs: Foundations and Topics (no Training tab). Each contains structured lesson sets with a meeting-format lesson viewer (Fellowship/Story/Application sections) and integrated audio Bible playback.

</domain>

<decisions>
## Implementation Decisions

### Tab Rename
- Rename "Harvest" tab label to "Gather" across all 4 language locales (en, es, ne, hi)
- Keep the tab icon or change to match Waha's group/people icon

### Screen Architecture
- **GatherScreen** (replaces CourseListScreen): Top sub-tab bar with "Foundations" and "Topics"
- **FoundationDetailScreen** (replaces FourFieldsJourney): Shows lessons in a foundation set
- **LessonDetailScreen** (replaces FourFieldsLessonView): Meeting format with Fellowship/Story/Application + audio

### Remove Old Content
- Remove or replace: CourseListScreen, CourseDetailScreen, LessonViewScreen, FourFieldsJourneyScreen, FieldOverviewScreen, FourFieldsLessonViewScreen content
- Remove: harvestStudies.ts data, fourFieldsCourses.ts data references from UI
- Keep GroupList, GroupDetail, GroupSession, PrayerWall screens (groups still needed)
- Keep ReadingPlanList, ReadingPlanDetail screens (but remove from Gather main — accessible from elsewhere)

### Foundations Data Structure
- 9 foundation sets, numbered sequentially
- Each set: title, description, icon identifier, lesson count
- Foundation sets:
  1. From Creation to the Birth of Jesus (14 lessons)
  2. The Life and Message of Jesus
  3. Invitation of Jesus
  4. Being Disciples
  5. Being a Jesus Community
  6. Being Leaders
  7. Growing as Disciples
  8. Growing as a Jesus Community
  9. Growing as Leaders
- Each lesson: number, title, Bible reference(s), fellowship questions, application questions
- Fellowship and Application questions are STANDARDIZED templates (same for every lesson)
- Story section pulls Bible text dynamically from BSB database by reference

### Fellowship Template (same for ALL foundation lessons)
1. Based on what has happened with you since the last time we met, what is something you are thankful for?
2. What has stressed you out this week, and what do you need for things to be better?
3. What are the needs of the people in your community, and how can we help each other meet the needs we've expressed?
4. Now, let's read today's story from God...

### Application Template (same for ALL foundation lessons)
1. Now, let's have someone retell this passage in their own words, as though they were telling a friend who has never heard it. Let's help them if they leave anything out or add anything by mistake. If that happens we can ask, "Where do you find that in the story?"
2. What does this story teach us about God, his character, and what he does?
3. What do we learn about people, including ourselves, from this story?
4. How will you apply God's truth from this story in your life this week? What is a specific action or thing you will do?
5. Who will you share a truth from this story with before we meet again? Do you know others who would also like to discover God's word in this app like we are?
6. As our meeting comes to a close, let's decide when we will meet again and who will facilitate our next meeting.
7. We encourage you to make note of what you said you will do, and to re-read this story in the days before we meet again. The facilitator can share the story text or audio if anyone doesn't have it. As we go, let's ask the Lord to help us.

### Foundation 1 Lessons (From Creation to the Birth of Jesus)
1. Creation — Genesis 1:1-25
2. Creation of Humans — Genesis 1:26-27, 2:7-9, 2:15-25
3. Humans Disobey God — Genesis 3:1-24
4. God Destroys an Evil Humanity — Genesis 6:5-6, 6:9-22, 7:17-24
5. Tower of Babel — Genesis 11:1-9
6. Abraham Trusted God — Genesis 12:1-7, 15:1-6
7. Abraham Obeyed God — Genesis 22:1-19
8. God's Call to Moses — Exodus 2:23-3:14, 7:1-5
9. The Passover Sacrifice — Exodus 12:1-3, 12:21-31, 12:40-42
10. The Ten Commandments and Sacrifice — Exodus 20:1-17, Leviticus 6:1-7
11. Cycle of Disobedience — Judges 2:10-23
12. The Suffering Servant of God — Isaiah 52:13-53:12
13. The Promised Saviour — Isaiah 9:1-7, Luke 1:26-38
14. The Birth of Jesus — Luke 2:1-20

### Topics Data Structure
- Topics organized by categories in a 2-column grid
- Categories: Truth, Challenge, Money, People, God (and possibly more)
- Each topic: icon, title, lesson count, progress
- Truth: Courage (8), Faith (9), Hope (8), Justice (8), Love (8), Obedience (8), + more
- Challenge: Anger (8), Crisis (7), Grief (7), Hurt (8), Reconciliation (8), Self Esteem (8), Stress (8)
- Money: Money and God (8), Money Advice (10), Giving (9), Marketplace (8)
- People: Marriage (8), Men (8), Parenting (8), Singles (8), Women (8), Youth (8)
- God: (additional topics visible in screenshots)
- Each topic's lessons follow the same Fellowship/Story/Application format

### Gather Screen UI (Foundations sub-tab)
- Language selector dropdown (top-left, uses existing i18n)
- Search icon (top-right)
- Dismissable info banner: "Help others start their journey of discovering God for themselves in the Bible."
- First card highlighted with salmon/accent background: "Get started with foundations"
- Cards in vertical list, each showing: number, title, progress (X/Y), icon (circular with salmon tint)

### Foundation Detail Screen UI
- Back arrow + title in header + download-all icon
- Large circular icon centered with progress below (X/Y)
- "Foundations N" label above title
- Title in large bold text
- Description with "Show More" expandable
- "Send an invitation" card: icon, "Send an invitation" title, description text, "Gather with others" button (opens share sheet)
- Numbered lesson list: number badge, title (bold), Bible reference (muted), download icon, three-dot menu
- "Up next" card at bottom showing next foundation set

### Lesson Detail Screen UI (Meeting Format)
- Back arrow + lesson title + share icon in header
- Large circular icon (same as parent foundation)
- Three section tabs: Fellowship | Story | Application (horizontally scrollable, with underline indicator)
- Fellowship section: numbered discussion questions (1-4) in styled cards
- Story section: Bible reference header, full Bible text from BSB database
- Application section: numbered discussion/action questions (1-7)
- Audio player fixed at bottom: progress bar, time display (00:00 / 05:55), play/pause button (large, salmon), rewind button, forward button, overflow menu (...)
- Audio plays the Bible passage for the Story section

### Three-dot Menu on Lesson (bottom sheet)
- Header: icon + lesson title + Bible reference
- Share Lesson Audio (speaker icon)
- Share Lesson Text (document icon)
- Share Lesson Link (link icon)
- Download / Remove Download (with size, e.g., "1MB")
- Mark as Complete (checkmark icon)
- Manage Bookmarks (bookmark icon)
- Close button at bottom

### Share / "Gather with others"
- Opens native share sheet with invitation message including app store links

### Claude's Discretion
- Exact color values for the salmon/accent tint on icons (use existing app accent or match Waha screenshots)
- How to source Bible text for Story section (query existing BSB SQLite database by book/chapter/verse)
- Audio playback integration (reuse existing audio service to play chapter audio for the referenced passages)
- Topics lesson content (user only provided screenshots of topic categories, not individual topic lessons — use same Fellowship/Application templates, need to define which Bible passages map to which topics)
- Foundation sets 2-9 lesson content (only Foundation 1 lessons are fully visible in screenshots — need to source or create lesson lists for remaining 8 foundations)
- Progress tracking persistence (extend existing fourFieldsStore or create new gatherStore)
- Download functionality for lessons (audio download using existing audio download service)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Navigation & Tab Structure
- `src/navigation/TabNavigator.tsx` — Current tab configuration, "Learn" tab mapped to "Harvest"
- `src/navigation/tabManifest.ts` — Tab definitions including icons and labels
- `src/navigation/LearnStack.tsx` — Current LearnStack screens to be modified
- `src/navigation/types.ts` — Navigation param types

### Current Harvest/Learn Screens (to remove/replace)
- `src/screens/learn/CourseListScreen.tsx` — Current Harvest hub (REPLACE)
- `src/screens/learn/harvestStudies.ts` — Current harvest study data (REMOVE)
- `src/data/fourFieldsCourses.ts` — Four Fields course data (REMOVE from UI)
- `src/screens/learn/FourFieldsJourneyScreen.tsx` — Four Fields overview (REPLACE)
- `src/screens/learn/FourFieldsLessonViewScreen.tsx` — Lesson viewer (REPLACE)

### Existing Services to Reuse
- `src/services/audio/audioService.ts` — Audio playback service
- `src/services/audio/audioRemote.ts` — Audio URL resolution
- `src/services/bible/bibleDatabase.ts` — BSB SQLite database queries
- `src/stores/fourFieldsStore.ts` — Progress tracking (extend or replace)

### Theming & Styling
- `src/contexts/ThemeContext.tsx` — Theme colors
- `src/constants/colors.ts` — Color palette

### i18n
- `src/i18n/locales/en.ts` — English translations (tab name, harvest keys)
- `src/i18n/locales/es.ts` — Spanish
- `src/i18n/locales/ne.ts` — Nepali
- `src/i18n/locales/hi.ts` — Hindi

</canonical_refs>

<specifics>
## Specific Ideas

- The Waha app screenshots serve as the pixel-perfect reference for layout, spacing, and visual hierarchy
- The salmon/coral accent color used in Waha icons matches EveryBible's existing accentGreen/accent color concept — adapt to match
- Foundation icons are circular with a tinted background, each foundation has a unique illustrated icon
- The meeting format (Fellowship → Story → Application) is a Discovery Bible Study (DBS) pattern
- Audio player should reuse the existing audio infrastructure to play BSB chapter audio for the passage reference

</specifics>

<deferred>
## Deferred Ideas

- Training sub-tab (user explicitly said "you don't need to add the training part in")
- Full topic lesson content sourcing (start with data structure, seed progressively)
- Offline lesson content caching beyond existing audio download
- Group-based lesson tracking (groups already have separate screens)
- Lesson bookmarks integration with Phase 17 bookmarks system

</deferred>

---

*Phase: 22-gather-tab-waha-style-foundations-topics-meeting-format*
*Context gathered: 2026-03-23 via user screenshots + description*
