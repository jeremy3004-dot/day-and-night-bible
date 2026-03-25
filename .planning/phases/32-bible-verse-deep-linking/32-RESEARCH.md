# Phase 32: Bible Verse Deep Linking - Research

**Researched:** 2026-03-25
**Domain:** React Navigation v7 deep linking, expo-linking, React Native Share API, book name slug parsing
**Confidence:** HIGH

## Summary

Phase 32 adds a custom URL scheme (`com.everybible.app://`) so users can share and open specific Bible verses from messages, web pages, and other apps. The project already has almost everything needed: the scheme is registered in app.json, expo-linking is installed as a transitive dependency, `bible-passage-reference-parser` is already in use for reference parsing, and the BibleReader navigation params (`bookId`, `chapter`, `focusVerse`) map cleanly to a deep link path. The existing `handleShareChapter` function in BibleReaderScreen shares only text — it needs to include the deep link URL.

The three concrete deliverables are: (1) a linking config on `NavigationContainer` that routes `com.everybible.app://bible/:bookSlug/:chapter/:verse?` into `Bible > BibleReader`; (2) a `deepLinkModel.ts` service that parses a book slug like `john` into the internal ID `JHN`; and (3) upgrading the share action to include the deep link URL via `Share.share({ url, message })`.

Universal links (HTTPS) are out of scope for this phase — they require a hosted `apple-app-site-association` file and Android `assetlinks.json`, which have no backend hosting yet.

**Primary recommendation:** Add a linking config to NavigationContainer, build a thin slug-to-bookId parser, and upgrade the share action. No new native dependencies required.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `expo-linking` | 8.0.11 (already installed via transitive dep) | Create URLs, listen for incoming links | Expo SDK 54 standard, wraps React Native Linking |
| `@react-navigation/native` | ^7.1.28 (already installed) | `linking` prop on `NavigationContainer` | Deep linking is a first-class feature of React Navigation v7 |
| `react-native` `Share` | built-in (already used) | Share chapter URL + text | Already imported in BibleReaderScreen |
| `bible-passage-reference-parser` | ^3.2.0 (already installed) | Optional: could aid slug→OSIS mapping | Already used in referenceParser.ts |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `react-native` `Linking` | built-in | Listen to URL events when app already open | Used inside linking config subscriber |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom slug→bookId map | `bible-passage-reference-parser` | Parser handles natural-language; slug map is simpler and faster for URL segment `john` → `JHN` |
| Custom URL scheme only | Universal links (HTTPS) | Universal links require hosted `apple-app-site-association` + `assetlinks.json`; no backend domain is set up; out of scope for this phase |

**Installation:** No new packages needed. `expo-linking` is already in node_modules (installed as a dependency of `expo-auth-session`).

---

## Architecture Patterns

### Current State (what exists)

1. **Scheme already registered** — `app.json` has `"scheme": "com.everybible.app"`. Deep link URLs will use `com.everybible.app://`.

2. **No linking config exists** — `RootNavigator.tsx` uses `NavigationContainer` without a `linking` prop. There is no `src/navigation/linkingConfig.ts`. This is the primary gap.

3. **BibleReader nav params already match deep link shape** — `BibleStackParamList.BibleReader` accepts `{ bookId: string; chapter: number; focusVerse?: number }`. The deep link path just needs to translate `john` → `JHN` and `3` → `3`.

4. **Share already works at chapter level** — `handleShareChapter` in `BibleReaderScreen` calls `Share.share({ message })` with book name + chapter. It needs a `url` field added.

5. **Tab navigator nesting** — BibleReader lives at `Bible > BibleBrowser > (push) BibleReader`. The React Navigation linking config must express this nesting so the tab switches to Bible and pushes BibleReader.

### Recommended Project Structure

```
src/
├── navigation/
│   ├── linkingConfig.ts       # NEW: linking config object + URL builder
│   └── RootNavigator.tsx      # MODIFY: pass linkingConfig as linking prop
├── services/bible/
│   ├── deepLinkParser.ts      # NEW: slug→bookId map + URL builder/parser
│   └── deepLinkParser.test.ts # NEW: unit tests
└── screens/bible/
    └── BibleReaderScreen.tsx  # MODIFY: upgrade share action to include URL
```

### Pattern 1: React Navigation v7 Linking Config

**What:** Pass a `linking` object to `NavigationContainer`. The config maps URL paths to screen names and extracts params.

**When to use:** Standard pattern whenever a React Navigation app needs to respond to custom URL schemes.

```typescript
// src/navigation/linkingConfig.ts
import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootTabParamList } from './types';
import { parseBibleDeepLink } from '../services/bible/deepLinkParser';

const prefix = Linking.createURL('/');

export const linkingConfig: LinkingOptions<RootTabParamList> = {
  prefixes: [prefix, 'com.everybible.app://'],
  config: {
    screens: {
      Bible: {
        screens: {
          BibleBrowser: 'bible',
          BibleReader: {
            path: 'bible/:bookSlug/:chapter/:verse?',
            parse: {
              // :bookSlug will be the raw string "john"
              // React Navigation passes the string params here before
              // constructing the screen props object — we transform in getStateFromPath
            },
          },
        },
      },
    },
  },
  getStateFromPath(path, options) {
    // Custom parser to handle bookSlug → bookId mapping
    // Falls back to default behavior for non-bible paths
    const match = parseBibleDeepLink(path);
    if (match) {
      return {
        routes: [
          {
            name: 'Bible',
            state: {
              routes: [
                { name: 'BibleBrowser' },
                {
                  name: 'BibleReader',
                  params: {
                    bookId: match.bookId,
                    chapter: match.chapter,
                    focusVerse: match.verse,
                  },
                },
              ],
            },
          },
        ],
      };
    }
    // Fall back to React Navigation default parsing
    const { getStateFromPath: defaultGetStateFromPath } = require('@react-navigation/native');
    return defaultGetStateFromPath(path, options);
  },
};
```

**Note on `getStateFromPath`:** Using a custom `getStateFromPath` is the cleanest way to handle the slug→ID conversion at the navigation layer. React Navigation's default path parser is purely string-based; it cannot convert `john` → `JHN` without a custom transform. This approach is documented as the recommended escape hatch.

### Pattern 2: Deep Link Parser Service

**What:** A pure function that parses a URL path or path segments into `{ bookId, chapter, verse? }`.

```typescript
// src/services/bible/deepLinkParser.ts

/**
 * Maps lowercased URL slugs to the internal 3-letter book IDs used in bibleBooks[].
 * Based on common.name lowercased — not abbreviation, to keep URLs readable.
 */
const SLUG_TO_BOOK_ID: Record<string, string> = {
  genesis: 'GEN', exodus: 'EXO', leviticus: 'LEV', numbers: 'NUM',
  deuteronomy: 'DEU', joshua: 'JOS', judges: 'JDG', ruth: 'RUT',
  '1samuel': '1SA', '2samuel': '2SA', '1kings': '1KI', '2kings': '2KI',
  '1chronicles': '1CH', '2chronicles': '2CH', ezra: 'EZR', nehemiah: 'NEH',
  esther: 'EST', job: 'JOB', psalms: 'PSA', psalm: 'PSA', proverbs: 'PRO',
  ecclesiastes: 'ECC', 'songofsolomon': 'SNG', isaiah: 'ISA', jeremiah: 'JER',
  lamentations: 'LAM', ezekiel: 'EZK', daniel: 'DAN', hosea: 'HOS',
  joel: 'JOL', amos: 'AMO', obadiah: 'OBA', jonah: 'JON', micah: 'MIC',
  nahum: 'NAM', habakkuk: 'HAB', zephaniah: 'ZEP', haggai: 'HAG',
  zechariah: 'ZEC', malachi: 'MAL',
  matthew: 'MAT', mark: 'MRK', luke: 'LUK', john: 'JHN', acts: 'ACT',
  romans: 'ROM', '1corinthians': '1CO', '2corinthians': '2CO',
  galatians: 'GAL', ephesians: 'EPH', philippians: 'PHP', colossians: 'COL',
  '1thessalonians': '1TH', '2thessalonians': '2TH', '1timothy': '1TI',
  '2timothy': '2TI', titus: 'TIT', philemon: 'PHM', hebrews: 'HEB',
  james: 'JAS', '1peter': '1PE', '2peter': '2PE', '1john': '1JN',
  '2john': '2JN', '3john': '3JN', jude: 'JUD', revelation: 'REV',
};

export interface BibleDeepLinkTarget {
  bookId: string;
  chapter: number;
  verse?: number;
}

/**
 * Parses a path like "/bible/john/3/16" or "/bible/john/3".
 * Returns null if path doesn't match the bible pattern or book is unrecognized.
 */
export const parseBibleDeepLink = (path: string): BibleDeepLinkTarget | null => {
  const match = path.match(/^\/bible\/([^/]+)\/(\d+)(?:\/(\d+))?/);
  if (!match) return null;

  const [, bookSlug, chapterStr, verseStr] = match;
  const slug = (bookSlug ?? '').toLowerCase().replace(/\s/g, '');
  const bookId = SLUG_TO_BOOK_ID[slug];
  if (!bookId) return null;

  const chapter = parseInt(chapterStr ?? '0', 10);
  const verse = verseStr ? parseInt(verseStr, 10) : undefined;
  if (!Number.isInteger(chapter) || chapter < 1) return null;

  return { bookId, chapter, verse };
};

/**
 * Builds a shareable deep link URL for a verse.
 * e.g. "com.everybible.app://bible/john/3/16"
 */
export const buildBibleDeepLink = (bookId: string, chapter: number, verse?: number): string => {
  const { getBookById } = require('../../constants/books');
  const book = getBookById(bookId);
  if (!book) return '';
  const slug = book.name.toLowerCase().replace(/\s/g, '');
  const base = `com.everybible.app://bible/${slug}/${chapter}`;
  return verse ? `${base}/${verse}` : base;
};
```

**Slug design decision:** Use lowercase book name with spaces removed (`john`, `1corinthians`, `revelation`). This is human-readable in messages and handles multi-word books cleanly without hyphens or special chars.

### Pattern 3: Share Action Upgrade

**What:** Upgrade `handleShareChapter` to include a URL in addition to the text message.

```typescript
// In BibleReaderScreen.tsx — updated handleShareChapter
const handleShareChapter = async () => {
  setShowChapterActionsSheet(false);
  trackBibleExperienceEvent({
    name: 'library_action',
    bookId,
    chapter,
    source: 'reader-actions',
    detail: 'share',
  });
  const bookName = getTranslatedBookName(bookId, t);
  const url = buildBibleDeepLink(bookId, chapter);
  await Share.share({
    message: `${bookName} ${chapter}`,
    url, // iOS only — shows in share sheet; Android ignores url and uses message
  });
};
```

**Verse-level share:** The phase description says "share and open specific Bible verses." The plan should decide whether to share at verse level (when a verse is selected/highlighted) or always at chapter level. The existing share action is chapter-level. A verse-level variant should accept an optional `verse` param.

### Pattern 4: NavigationContainer Integration

**What:** Pass `linkingConfig` as the `linking` prop to `NavigationContainer` in `RootNavigator.tsx`.

```typescript
// RootNavigator.tsx — add linking prop
import { linkingConfig } from './linkingConfig';

export function RootNavigator() {
  // ...
  return (
    <NavigationContainer
      ref={rootNavigationRef}
      linking={linkingConfig}   // ADD THIS
      onReady={handleReady}
      // ...
    >
      <TabNavigator />
      <MiniPlayerHost currentRouteName={currentRouteName} />
    </NavigationContainer>
  );
}
```

### Anti-Patterns to Avoid

- **Parsing URLs in the component layer:** Do not add URL parsing logic inside BibleReaderScreen. The linking config and deepLinkParser service are the right layer.
- **Using `Linking.addEventListener` manually:** React Navigation handles this internally when `linking` prop is set. Adding a manual listener creates duplicate handling.
- **Hardcoding `everybible://`:** The registered scheme is `com.everybible.app`, not `everybible`. The phase description uses `everybible://bible/john/3/16` — this needs correction. The actual scheme from `app.json` is `com.everybible.app`.
- **Exposing `bookId` in the URL:** Using internal IDs like `JHN` makes URLs non-human-readable. Use slugs (`john`), which are more shareable and match what people expect.
- **Skipping `getStateFromPath`:** The default React Navigation path parser can map path segments to params but cannot transform `john` → `JHN`. Without `getStateFromPath`, the BibleReader would receive `bookId: 'john'` and fail to load.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Book name → internal ID mapping | Custom fuzzy matcher | Simple static slug lookup table | The domain is closed (66 books, fixed names), a lookup table is reliable and fast |
| URL parsing | Manual string splitting | `parseBibleDeepLink` + React Navigation's `getStateFromPath` hook | Edge cases (trailing slashes, URL encoding, query params) |
| Share sheet | Custom share modal | `React Native Share` API (already used) | Platform-native share sheet, already imported |
| URL creation | Manual string concatenation | `buildBibleDeepLink` pure function | Centralizes encoding logic and keeps the screen component thin |

---

## Runtime State Inventory

> Phase is greenfield code addition (no rename/refactor), so most runtime state is not relevant. Confirming key points:

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None — no stored deep link state | None |
| Live service config | None — no external service registers the URL scheme | None |
| OS-registered state | iOS: scheme `com.everybible.app` registered via `app.json` `scheme` field at build time | No rebuild needed — scheme already in `Info.plist` from prior builds |
| Secrets/env vars | None relevant | None |
| Build artifacts | Existing builds already have the scheme registered | No re-build needed for scheme registration; linking config is pure JS |

---

## Common Pitfalls

### Pitfall 1: Wrong URL Scheme in Share Text

**What goes wrong:** The phase description says `everybible://bible/john/3/16` but `app.json` has `"scheme": "com.everybible.app"`. If the share message uses the wrong scheme, the link won't open the app.

**Why it happens:** The scheme in the phase description was illustrative, not the actual registered value.

**How to avoid:** Always use `com.everybible.app://` as the scheme in production code. Use `Linking.createURL('/')` in the linking config — Expo derives it from `app.json` automatically.

**Warning signs:** On-device test where tapping the link opens a browser instead of the app.

### Pitfall 2: NavigationContainer Not Ready When Link Arrives

**What goes wrong:** A deep link arrives while the app is in the startup/onboarding phase (before `NavigationContainer` mounts). React Navigation queues the URL but if the navigator hasn't rendered, it may be lost.

**Why it happens:** App.tsx conditionally renders `RootNavigator` only after `isReady && preferences.onboardingCompleted && !isPrivacyLocked`. Deep links that arrive during the loading window are deferred by React Navigation internally.

**How to avoid:** React Navigation's `linking` prop handles cold-start link buffering automatically. The existing `rootNavigationRef.isReady()` pattern used in `openAuthFlow` is the model — the same pattern can be applied if manual link dispatch is ever needed.

**Warning signs:** Tapping a link on a fresh install drops to the home screen instead of the verse.

### Pitfall 3: `BibleBrowser` Not in Navigation State

**What goes wrong:** `getStateFromPath` builds a state with `BibleReader` but omits `BibleBrowser` in the route stack, so the back button has nowhere to go.

**Why it happens:** When building a custom nav state from a deep link, the intermediate stack screens must be included explicitly.

**How to avoid:** Always include `{ name: 'BibleBrowser' }` before `{ name: 'BibleReader', params }` in the Bible stack's routes array inside `getStateFromPath`.

**Warning signs:** Back button in BibleReader goes to a wrong screen or crashes after deep link navigation.

### Pitfall 4: Android `Share.share` url Field Ignored

**What goes wrong:** On Android, `Share.share({ url })` silently ignores the `url` field. Only `message` is used. The user sees a share sheet with just the book name, no link.

**Why it happens:** Android's share intent has no concept of a URL separate from text.

**How to avoid:** Combine the URL into `message` for cross-platform consistency: `message: \`${bookName} ${chapter} — ${url}\``. On iOS, `url` is still passed separately so the share sheet renders it with a preview. Use platform detection or always include the URL in `message`.

**Warning signs:** On Android, the share message doesn't contain the deep link.

### Pitfall 5: Slug Collision for Books with Shared Name Prefixes

**What goes wrong:** Some books share partial name prefixes: `john`, `1john`, `2john`, `3john`. URL segments like `1john` must be matched exactly, not via prefix.

**Why it happens:** URL path segment matching is exact by default, but a sloppy `startsWith` implementation would match `john` for `1john`.

**How to avoid:** The slug lookup table uses exact lowercase key matching. Test all number-prefixed books explicitly.

**Warning signs:** `com.everybible.app://bible/1john/3` opens the Gospel of John instead of 1 John.

### Pitfall 6: Onboarding Gate Blocks Deep Link

**What goes wrong:** A first-time user receives a shared verse link, taps it, and the app opens to onboarding instead of the verse. After completing onboarding they land on the home screen.

**Why it happens:** App.tsx shows `LocaleSetupFlow` before mounting `RootNavigator`. React Navigation can't route to BibleReader until after onboarding.

**How to avoid:** This is acceptable for v1 of the feature. Store the pending deep link target and navigate after onboarding completes — but this is scope creep for Phase 32. Document as a known limitation: deep links only work after onboarding is complete. The same pattern exists for auth (`pendingInitialAuthModeRef`).

---

## Code Examples

Verified patterns from the existing codebase:

### Existing: handleShareChapter (BibleReaderScreen.tsx line 768)

```typescript
const handleShareChapter = async () => {
  setShowChapterActionsSheet(false);
  trackBibleExperienceEvent({
    name: 'library_action', bookId, chapter, source: 'reader-actions', detail: 'share',
  });
  await Share.share({
    message: `${getTranslatedBookName(bookId, t)} ${chapter}`,
  });
};
```

This is the function to upgrade with URL inclusion.

### Existing: referenceParser.ts OSIS_TO_BOOK_ID mapping

The file at `src/services/bible/referenceParser.ts` already has a complete `OSIS_TO_BOOK_ID` map (OSIS abbreviation → internal ID). The deep link slug map is the inverse direction (full name lowercase → internal ID) and can be derived from the same `bibleBooks` array.

### Existing: BibleReader route params

```typescript
// From src/navigation/types.ts
BibleReader: {
  bookId: string;
  chapter: number;
  autoplayAudio?: boolean;
  preferredMode?: 'listen' | 'read';
  focusVerse?: number;
  playbackSequenceEntries?: AudioPlaybackSequenceEntry[];
};
```

Deep link → nav params mapping: `bookSlug` → `bookId`, `:chapter` → `chapter`, `:verse?` → `focusVerse`. All other params use defaults.

### Existing: rootNavigation.ts pattern for deferred navigation

```typescript
export const openAuthFlow = (mode: PendingAuthMode): void => {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.navigate('More', buildAuthRoute(mode));
    return;
  }
  queuedAuthMode = mode;
};
```

If the phase scope includes handling deep links before the navigator is ready (e.g., background-to-foreground), this pattern is the model.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `Linking.addEventListener` | `linking` prop on `NavigationContainer` | React Navigation v5+ | Nav handles buffering, cold-start, and route dispatch automatically |
| Imperative navigation after `Linking.getInitialURL()` | Declarative linking config | React Navigation v5+ | Less boilerplate, handles nested navigators correctly |
| `exp://` Expo Go prefix | `scheme://` custom prefix | Expo managed workflow | Production builds use the registered scheme; dev builds need both prefixes in `prefixes[]` |

**Deprecated/outdated:**

- `Linking.getInitialURL()` called manually in `useEffect`: Still works but is redundant when using the `linking` prop — React Navigation calls it internally.
- `expo-linking` `addEventListener`: Superseded by the `linking` prop pattern.

---

## Open Questions

1. **Verse-level vs. chapter-level sharing**
   - What we know: The existing share action shares at chapter level. The phase goal mentions "specific Bible verses."
   - What's unclear: Should sharing a verse produce `com.everybible.app://bible/john/3/16` (with verse) or `com.everybible.app://bible/john/3` (without)? The verse number is in `route.params.focusVerse` but only set when navigating from a search result.
   - Recommendation: Build share at chapter level first (`/bible/john/3`) — it's always available. Optionally pass `focusVerse` as the 4th segment if a verse is actively highlighted/selected.

2. **Does Phase 31 (push notifications) affect the linking config?**
   - What we know: Push notifications with deep link payloads use a separate handling path (notification response handler), not the URL linking system.
   - What's unclear: Phase 31 is unplanned. If push notifications include verse links, they would need a parallel `rootNavigation.navigate()` call, not the linking config.
   - Recommendation: Design Phase 32 so `parseBibleDeepLink` + `buildBibleDeepLink` are standalone services — Phase 31 can import them without coupling to the linking config.

3. **Development build scheme resolution**
   - What we know: In development builds, `Linking.createURL('/')` returns the Expo Go URL prefix (e.g., `exp://...`), not the custom scheme.
   - What's unclear: How the existing dev build is configured (there is a development EAS profile).
   - Recommendation: Include both `Linking.createURL('/')` AND the explicit `com.everybible.app://` string in the `prefixes` array so the linking config works in both Expo Go/dev-client and production builds.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `expo-linking` | URL prefix + link creation | Yes (transitive via expo-auth-session) | 8.0.11 | — |
| `com.everybible.app` scheme | URL scheme registration | Yes (in app.json) | — | — |
| `React Native Share` API | Share sheet | Yes (built-in, already used) | RN 0.81.5 | — |
| `@react-navigation/native` linking prop | Route dispatch from URLs | Yes (already installed) | ^7.1.28 | — |

**Missing dependencies with no fallback:** None — all required capabilities are available.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in test runner (`node:test`) |
| Config file | None — tests run via `node --test --import tsx` |
| Quick run command | `node --test --import tsx src/services/bible/deepLinkParser.test.ts` |
| Full suite command | `npm run test:release` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DEEP-01 | `parseBibleDeepLink('/bible/john/3/16')` → `{ bookId: 'JHN', chapter: 3, verse: 16 }` | unit | `node --test --import tsx src/services/bible/deepLinkParser.test.ts` | No — Wave 0 |
| DEEP-02 | `parseBibleDeepLink('/bible/1corinthians/13')` → `{ bookId: '1CO', chapter: 13 }` | unit | same | No — Wave 0 |
| DEEP-03 | `parseBibleDeepLink('/bible/unknown/3/16')` → `null` | unit | same | No — Wave 0 |
| DEEP-04 | `buildBibleDeepLink('JHN', 3, 16)` → `'com.everybible.app://bible/john/3/16'` | unit | same | No — Wave 0 |
| DEEP-05 | `buildBibleDeepLink('JHN', 3)` → `'com.everybible.app://bible/john/3'` (no verse) | unit | same | No — Wave 0 |
| DEEP-06 | slug collision: `john` ≠ `1john`, `2john`, `3john` | unit | same | No — Wave 0 |
| DEEP-07 | `linkingConfig.getStateFromPath('/bible/john/3/16')` returns valid nav state | unit | `node --test --import tsx src/navigation/linkingConfig.test.ts` | No — Wave 0 |

### Sampling Rate

- **Per task commit:** `node --test --import tsx src/services/bible/deepLinkParser.test.ts`
- **Per wave merge:** `npm run test:release`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/services/bible/deepLinkParser.test.ts` — covers DEEP-01 through DEEP-06
- [ ] `src/navigation/linkingConfig.test.ts` — covers DEEP-07 (getStateFromPath roundtrip)

---

## Project Constraints (from CLAUDE.md)

1. **TypeScript strict mode** — `deepLinkParser.ts` and `linkingConfig.ts` must compile with `tsc --noEmit` without errors.
2. **Barrel exports** — Export from `src/services/bible/index.ts` if making `deepLinkParser` public; export from `src/navigation/index.ts` if needed.
3. **Translation keys** — Any new user-facing string in the share action must use `t('key')`. The key `bible.shareChapterReference` already exists.
4. **Service layer** — `deepLinkParser.ts` belongs in `src/services/bible/`, not in the navigation layer or a component.
5. **No custom native modules** — No native code changes. The `scheme` is already registered via `app.json`; no `Info.plist` edits needed for scheme-only deep links.
6. **No Context API for state** — No new React contexts. If a pending deep link must be queued (pre-onboarding), use the `rootNavigation.ts` module-level variable pattern already used for `queuedAuthMode`.
7. **StyleSheet.create / theme colors** — Any new UI (e.g., a "Copy Link" action in the share sheet) must follow theme conventions.
8. **Lint before commit** — `npm run lint && npm run format:check` must pass.

---

## Sources

### Primary (HIGH confidence)

- Codebase: `app.json` — scheme field verified (`com.everybible.app`)
- Codebase: `src/navigation/types.ts` — BibleReader param list verified
- Codebase: `src/navigation/RootNavigator.tsx` — no existing linking prop confirmed
- Codebase: `package-lock.json` — expo-linking 8.0.11 confirmed installed
- Codebase: `src/services/bible/referenceParser.ts` — OSIS_TO_BOOK_ID map confirmed
- Codebase: `src/screens/bible/BibleReaderScreen.tsx` lines 768-780 — existing share action confirmed
- Codebase: `src/constants/books.ts` — complete bibleBooks array with .name and .id fields

### Secondary (MEDIUM confidence)

- React Navigation v7 `linking` prop API — trained on official docs, cross-referenced against installed version ^7.1.28; API has been stable since v5
- `expo-linking` `createURL()` function — in installed package 8.0.11; returns scheme-based URL in production builds, Expo Go URL in development

### Tertiary (LOW confidence)

- Universal links / Apple App Site Association behavior — not researched for this phase as it is out of scope

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all required packages are already installed and confirmed in package-lock.json
- Architecture: HIGH — existing navigation types, share action, and book data are well-understood from codebase inspection
- Pitfalls: HIGH — scheme mismatch, Android share behavior, and nav state construction are well-documented React Native patterns

**Research date:** 2026-03-25
**Valid until:** 2026-06-25 (React Navigation v7 linking API is stable; expo-linking API is stable at this version)
