---
type: quick-execute
autonomous: true
files_modified:
  - src/i18n/locales/en.ts
  - src/i18n/locales/es.ts
  - src/i18n/locales/ne.ts
  - src/i18n/locales/hi.ts
  - src/screens/bible/BibleReaderScreen.tsx
  - src/screens/bible/BibleBrowserScreen.tsx
  - src/screens/learn/GroupSessionScreen.tsx
  - src/screens/learn/GroupDetailScreen.tsx
  - src/screens/learn/FourFieldsLessonViewScreen.tsx
  - src/screens/learn/LessonViewScreen.tsx
  - src/screens/learn/CourseDetailScreen.tsx
  - src/screens/learn/CourseListScreen.tsx
  - src/screens/learn/LessonDetailScreen.tsx
  - src/screens/learn/PrayerWallScreen.tsx
  - src/screens/learn/FoundationDetailScreen.tsx
  - src/components/audio/MiniPlayer.tsx
  - src/components/audio/PlaybackControls.tsx
  - src/components/ErrorBoundary.tsx
  - src/data/gatherFoundations.ts
  - src/data/gatherTopics.ts
  - src/data/fourFieldsCourses.ts
---

<objective>
Comprehensive i18n audit and fix across the entire EveryBible app: close every translation gap between en/es/ne/hi locale files, replace every hardcoded user-facing string in screens and components with t() calls, and ensure all static data files use translation keys instead of raw English text.

Purpose: The app supports 4 languages (en, es, ne, hi) but has significant i18n gaps — entire sections of es/ne/hi still contain English fallback text, and dozens of screens render hardcoded English strings that bypass the translation system entirely.

Output: All four locale files at full parity, all screens using t() for user-facing text, data files using translation keys.
</objective>

<context>
@src/i18n/locales/en.ts
@src/i18n/locales/es.ts
@src/i18n/locales/ne.ts
@src/i18n/locales/hi.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Close locale file parity gaps — translate all English-fallback keys in es, ne, hi</name>
  <files>src/i18n/locales/en.ts, src/i18n/locales/es.ts, src/i18n/locales/ne.ts, src/i18n/locales/hi.ts</files>
  <action>
Systematically compare every key in en.ts against es.ts, ne.ts, and hi.ts. For every key where the non-English locale contains English text (identical to en.ts value), replace it with proper translation.

**Known gaps to fix (identified by audit):**

1. **`profile` section** — es/ne/hi have English for: readingActivity, readingActivitySubtitle, readingDays, chaptersRead, chapterRead, selectedDay, tapDayHint, noReadingActivityTitle, noReadingActivityBody, firstReadAt, lastReadAt.

2. **`readingPlans` section** — es/ne/hi have the ENTIRE section in English: title, browsePlans, myPlans, startPlan, enrolled, dayOf, markComplete, completed, progress, noPlans, noActivePlans, and all 8 plan sub-objects (bibleIn1Year, newTestament90, psalms30, gospels60, proverbs31, chronological, epistles30, sermonMount7) with title + description each.

3. **`annotations` section** — es/ne/hi have the ENTIRE section in English: title, bookmarks, highlights, notes, addNote, addBookmark, highlight, editNote, deleteAnnotation, noAnnotations, noBookmarks, noHighlights, noNotes, noteHint, saved, and colors sub-object (yellow, green, blue, pink, orange).

4. **`prayer` section** — es/ne/hi have the ENTIRE section in English: title, submitRequest, requestPlaceholder, prayed, encouraged, answered, markAnswered, noPrayers, beFirst, prayedCount, encouragedCount.

5. **`translations` section** — es/ne/hi have the ENTIRE section in English: title, primary, secondary, audioPreference, installed, available, bundled, download, publicDomain.

6. **`harvest` sub-keys** — es has English for: syncedGroupsTitle, syncedGroupsDescription, syncedGroupsSignin, noSyncedGroups, syncedLabel, loadingSyncedGroups, groupSyncLoadError, groupSyncPending. ne/hi have English for the same keys (except groupSyncSignin and groupSyncReady which are translated).

7. **`bible` sub-keys** — es/ne/hi have English for: manageAudio, audioDownloads, downloadBibleAudio, audioSavedOffline, audioDownloadFailed.

8. **`more.readingActivity`** — es/ne/hi have English.

9. **`gather` section** — ne/hi have ~20 keys in English (infoBanner, topicsBanner, getStarted, foundationLabel, lessonsProgress, showMore, showLess, sendInvitation, gatherWithOthers, invitationDescription, upNext, shareAudio, shareText, shareLink, download, removeDownload, markComplete, completed, markIncomplete, manageBookmarks, lessonComplete). es is fully translated for gather.

**Translation approach:**
- For Spanish (es): Use natural Latin American Spanish that matches the existing tone.
- For Nepali (ne): Use standard Nepali script consistent with existing translations.
- For Hindi (hi): Use standard Devanagari Hindi consistent with existing translations.
- Preserve all interpolation variables exactly: {{count}}, {{time}}, {{total}}, {{current}}, {{version}}, {{number}}, {{completed}}, {{name}}, {{book}}, {{chapter}}, {{translation}}, {{country}}, {{progress}}.
- Match the capitalization/formality register of surrounding keys in each locale.
- Do NOT modify en.ts key structure — only add/fix values in es/ne/hi.

**Important:** Also scan for any keys present in en.ts but entirely MISSING from es/ne/hi (not just English-valued). If a key exists in en but not in es/ne/hi at all, add it with proper translation.
  </action>
  <verify>
    <automated>cd /Users/dev/conductor/workspaces/EveryBible/columbus && npx tsc --noEmit --pretty 2>&1 | head -30</automated>
  </verify>
  <done>Every key in en.ts has a corresponding properly-translated (non-English) value in es.ts, ne.ts, and hi.ts. Zero English fallback text remains in non-English locale files. TypeScript compiles without error.</done>
</task>

<task type="auto">
  <name>Task 2: Replace hardcoded user-facing strings in screens and components with t() calls</name>
  <files>
    src/screens/bible/BibleReaderScreen.tsx,
    src/screens/bible/BibleBrowserScreen.tsx,
    src/screens/learn/GroupSessionScreen.tsx,
    src/screens/learn/GroupDetailScreen.tsx,
    src/screens/learn/FourFieldsLessonViewScreen.tsx,
    src/screens/learn/LessonViewScreen.tsx,
    src/screens/learn/CourseDetailScreen.tsx,
    src/screens/learn/CourseListScreen.tsx,
    src/screens/learn/LessonDetailScreen.tsx,
    src/screens/learn/PrayerWallScreen.tsx,
    src/components/audio/MiniPlayer.tsx,
    src/components/audio/PlaybackControls.tsx,
    src/components/ErrorBoundary.tsx,
    src/i18n/locales/en.ts,
    src/i18n/locales/es.ts,
    src/i18n/locales/ne.ts,
    src/i18n/locales/hi.ts
  </files>
  <action>
For each file, replace every hardcoded user-facing string with a t('namespace.key') call. Add corresponding keys to ALL FOUR locale files (en with the current English value, es/ne/hi with proper translations).

**Specific strings to fix per file:**

**BibleReaderScreen.tsx:**
- Line ~918: `'Verse'` / `'Verses'` -> t('bible.verseCount', { count }) or similar
- Line ~975: `showTextLabel="Text"` -> t('bible.text')
- Line ~1235/1466: `'Listen'` / `'Read'` -> t('bible.listen') / t('bible.read')
- Lines ~1683-1707: Overflow menu labels: 'Remove from favorites', 'Add to favorites', 'Add to saved playlist', 'Add to queue', 'Download book audio', 'Share chapter reference' -> new bible.* or reader.* keys

**BibleBrowserScreen.tsx:**
- Line ~405: `'Berean Standard Bible'` fallback -> t('about.bereanBible')  (key exists)
- Line ~822: `'Old Testament'` / `'New Testament'` -> t('bible.oldTestament') / t('bible.newTestament') (keys exist)

**GroupSessionScreen.tsx:**
- Lines ~39-41: Session phases 'Look Back', 'Look Up', 'Look Forward' and durations -> new groups.session.* keys
- Lines ~118/164: Error messages -> new groups.* error keys
- Lines ~213-238: Alert titles/messages for synced session unavailable -> new groups.syncSession.* keys
- Lines ~352/382/495/521: Instructional paragraphs (Look Back, Look Up, Look Forward content) -> new groups.session.* keys
- Lines ~569-572: 'Saving...', 'Save Synced Session', 'Complete Session' -> new groups.session.* keys

**GroupDetailScreen.tsx:**
- Lines ~106/181: Error messages -> reuse or add groups.error.* keys
- Lines ~217-220: 'Leave Group' alert with leader/member variants -> new groups.leaveGroup.* keys
- Line ~287: Synced progress message -> new groups.syncedProgress key
- Line ~302: 'Start Group Session' / 'Save Synced Session' -> new groups.* keys
- Line ~349: 'Joined recently' -> new groups.joinedRecently key

**FourFieldsLessonViewScreen.tsx:**
- Line ~261: 'Complete & Continue' / 'Complete Lesson' -> new harvest.completeAndContinue / harvest.completeLesson keys

**LessonViewScreen.tsx:**
- Lines ~36/58/73: Hardcoded lesson content paragraphs. These are static educational content — add as lesson.* keys.

**CourseDetailScreen.tsx:**
- Lines ~15-22: Hardcoded lesson titles (placeholder data). Replace with t() calls or note that these are stubs.

**CourseListScreen.tsx:**
- Lines ~59/97: Description text -> new harvest.topicalDescription / harvest.chapterStudyNote keys
- Lines ~112/125/208/210: defaultValue fallbacks -> add proper keys (harvest.studies, harvest.chapters, harvest.nowReading, harvest.openAndPlay)

**LessonDetailScreen.tsx:**
- Line ~344/517: 'Check out EveryBible!' -> new common.shareMessage key

**PrayerWallScreen.tsx:**
- Line ~276: 'You' / 'Group member' -> new prayer.you / prayer.groupMember keys

**MiniPlayer.tsx:**
- Line ~87: 'Now playing' / 'Ready to resume' -> new audio.nowPlaying / audio.readyToResume keys

**PlaybackControls.tsx:**
- Lines ~81-84: 'Repeat chapter' / 'Repeat book' / 'Repeat off' -> new audio.repeatChapter / audio.repeatBook / audio.repeatOff keys
- Line ~310: 'Show text' -> new audio.showText or bible.showText key

**ErrorBoundary.tsx:**
- Line ~49: Error message -> new common.unexpectedError key

**Approach:**
- Ensure useTranslation() is imported in each file that doesn't already have it.
- Group new keys logically under existing namespaces (bible.*, audio.*, groups.*, harvest.*, common.*, prayer.*).
- Add ALL new keys to all four locale files simultaneously — en with the English value, es/ne/hi with proper translations.
- Do NOT remove navigation route strings (e.g., 'BibleReader', 'GroupDetail') — those are code identifiers, not user-facing text.
- Do NOT replace console.error strings — those are developer-facing.
- Do NOT replace accessibility hints that are purely technical.
  </action>
  <verify>
    <automated>cd /Users/dev/conductor/workspaces/EveryBible/columbus && npx tsc --noEmit --pretty 2>&1 | head -30</automated>
  </verify>
  <done>Every user-facing string in the listed screen and component files uses t() for localization. No hardcoded English text remains in JSX or Alert.alert() calls (except navigation route names, console logs, and code identifiers). All new translation keys exist in all four locale files with proper translations.</done>
</task>

<task type="auto">
  <name>Task 3: Add translation keys for static data files (gather foundations, topics, four fields courses)</name>
  <files>
    src/data/gatherFoundations.ts,
    src/data/gatherTopics.ts,
    src/data/fourFieldsCourses.ts,
    src/i18n/locales/en.ts,
    src/i18n/locales/es.ts,
    src/i18n/locales/ne.ts,
    src/i18n/locales/hi.ts
  </files>
  <action>
These data files contain hundreds of hardcoded English strings (foundation titles, topic names, lesson titles, course descriptions, fellowship/application questions). The approach for these must balance thoroughness with maintainability.

**Strategy: Use i18n keys as the data values, resolve at render time.**

For each data file, replace hardcoded title/description/name strings with translation key identifiers. Then add the corresponding keys to all four locale files.

**gatherFoundations.ts:**
- FELLOWSHIP_QUESTIONS array (~4 questions): Add keys gather.fellowship.q1 through gather.fellowship.q4
- APPLICATION_QUESTIONS array (~7 questions): Add keys gather.application.q1 through gather.application.q7
- Foundation titles (7 foundations): Add keys gather.foundation1.title through gather.foundation7.title, and gather.foundation1.description through gather.foundation7.description
- Lesson titles (~67 lessons across 7 foundations): Add keys like gather.f1.lesson1 through gather.f1.lessonN for each foundation
- Change the data to store translation key strings (e.g., `title: 'gather.foundation1.title'`) and update consumers to resolve via t()

**gatherTopics.ts:**
- Category names (5 categories): Add keys gather.category.innerLife, etc.
- Topic titles (22 topics): Add keys like gather.topic.courage, gather.topic.faith, etc.
- Lesson titles (~176 lessons): Add keys like gather.topic.courage.lesson1, etc.
- Same approach: store key strings in data, resolve at render time

**fourFieldsCourses.ts:**
- Field titles/subtitles/descriptions (5 fields): Add keys harvest.field1.title, etc.
- Course titles/descriptions (5 courses): Add keys harvest.course1.title, etc.
- Lesson titles (~25 lessons): Add keys harvest.course1.lesson1, etc.
- Lesson content (keyVerse, practiceActivity, discussion questions, etc.) already renders via dedicated components that could resolve keys

**Implementation notes:**
- The data structures currently use `title: string` — keep that type but store translation keys
- At render sites (GatherScreen, FoundationDetailScreen, LessonDetailScreen, FieldOverviewScreen, FourFieldsLessonViewScreen), wrap the data title/description in t() when displaying
- referenceLabel values like 'Genesis 1' can stay as-is since they are Bible citation labels (not translatable user-facing content — the books are identified by ID already)
- Add all new keys to en.ts with the current English text, and to es/ne/hi with proper translations
- For the large volume of lesson titles, group under logical namespace prefixes to keep locale files organized

**IMPORTANT:** If the volume of new keys for lesson titles is extremely large (200+), consider an alternative approach: keep lesson titles in English in the data files and add a comment noting they are Bible story summary titles that may be understood cross-linguistically. Focus translation effort on category/foundation/topic-level titles and the fellowship/application questions that are conversational. Document this decision clearly.
  </action>
  <verify>
    <automated>cd /Users/dev/conductor/workspaces/EveryBible/columbus && npx tsc --noEmit --pretty 2>&1 | head -30</automated>
  </verify>
  <done>Static data files use translation keys for titles and descriptions. All structural-level names (foundation names, topic names, category names, course names, fellowship/application questions) have translated keys in all four locales. Render sites resolve keys via t(). TypeScript compiles without error.</done>
</task>

<task type="auto">
  <name>Task 4: Final parity verification and lint pass</name>
  <files>src/i18n/locales/en.ts, src/i18n/locales/es.ts, src/i18n/locales/ne.ts, src/i18n/locales/hi.ts</files>
  <action>
Run a final automated parity check across all four locale files:

1. Extract all leaf keys from en.ts and verify every key exists in es.ts, ne.ts, and hi.ts
2. For each non-English locale, verify no value is identical to the en.ts value (which would indicate an untranslated key) — exceptions: proper nouns like 'Apple', 'Google', brand names, email placeholders like 'you@example.com', and format strings like '{{completed}}/{{total}}'
3. Run ESLint and Prettier to ensure formatting is consistent
4. Run TypeScript compiler check

Write a brief report of any remaining gaps found and fix them.
  </action>
  <verify>
    <automated>cd /Users/dev/conductor/workspaces/EveryBible/columbus && npm run lint 2>&1 | tail -5 && npx tsc --noEmit --pretty 2>&1 | tail -5</automated>
  </verify>
  <done>All four locale files have full key parity. No untranslated English text remains in es/ne/hi (except justified proper nouns). Lint and typecheck pass clean.</done>
</task>

</tasks>

<verification>
1. TypeScript compiles: `npx tsc --noEmit` exits 0
2. Lint passes: `npm run lint` exits 0
3. Key parity: Every leaf key in en.ts exists in es.ts, ne.ts, and hi.ts
4. No hardcoded user-facing English strings remain in screen/component TSX files (grep for common patterns returns only navigation routes, console.log, and code identifiers)
</verification>

<success_criteria>
- All four locale files (en, es, ne, hi) have identical key structure with zero missing keys
- No non-English locale file contains untranslated English text (except justified proper nouns)
- Every screen and component file uses t() for all user-facing strings
- Static data files use translation key resolution for titles, descriptions, and instructional content
- TypeScript compiles without errors
- ESLint passes without errors
</success_criteria>
