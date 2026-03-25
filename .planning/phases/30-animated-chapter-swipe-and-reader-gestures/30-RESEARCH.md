# Phase 30: Animated Chapter Swipe and Reader Gestures - Research

**Researched:** 2026-03-25
**Domain:** React Native Reanimated 3 + Gesture Handler v2, scroll-driven animations, swipe navigation
**Confidence:** HIGH

## Summary

Phase 30 adds swipe left/right chapter navigation and improved scroll-driven header collapse to the Bible reader, plus improved Follow Along modal transitions. Neither `react-native-reanimated` nor `react-native-gesture-handler` is currently installed in the project. Both must be installed before implementation.

The project runs with `newArchEnabled: false` (Old Architecture). This is the single most important constraint: **Reanimated 4.x requires New Architecture and cannot be used here**. Reanimated 3.x (latest: 3.19.5) supports Old Architecture and React Native 0.81. Expo SDK 54's bundled preference is Reanimated 4.1.x, but the project must pin to Reanimated 3.x to remain on Old Architecture.

The project has an existing scroll-driven header collapse system built on `Animated.Value` (the old RN `Animated` API). The premium read mode uses `Animated.ScrollView`, `Animated.event`, and `.interpolate()` to drive glass header opacity and translateY. The upgrade path replaces these with Reanimated 3's `useAnimatedScrollHandler` and `useAnimatedStyle`, which run on the UI thread and eliminate jank. The swipe gesture adds a horizontal `Gesture.Pan()` layer over the vertical scroll without conflicting with it.

**Primary recommendation:** Install `react-native-reanimated@~3.19.5` and `react-native-gesture-handler@~2.28.0` via `npx expo install`, add `GestureHandlerRootView` to `App.tsx`, replace the existing `Animated.event` scroll tracking with `useAnimatedScrollHandler`, and build the swipe gesture as a `Gesture.Pan()` that monitors horizontal offset and calls the existing `handlePreviousReadChapter` / `handleNextReadChapter` handlers via `runOnJS`.

---

## Project Constraints (from CLAUDE.md)

- TypeScript strict mode is enabled — all new code must be fully typed, no `any`
- Use Zustand stores for global state; do not add new React Context providers
- Theme context for all colors (`useTheme()`) — no hardcoded hex values
- Translation keys for ALL user-facing strings (`t('...')`)
- Use Expo's native modules only — no custom native modules
- Offline-first architecture
- StyleSheet.create() only, no inline styles
- Functional components with hooks only, no class components
- No direct Supabase calls in components
- Test on both iOS and Android
- Never use `eas build` cloud builds; use `npx expo run:ios` / `npx expo run:android` for local builds
- CRITICAL: `newArchEnabled: false` — Old Architecture only (see below)

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-reanimated | 3.19.5 | UI-thread animations, shared values, scroll handlers | Runs on UI thread for 60fps; v3 is the correct v for Old Arch |
| react-native-gesture-handler | ~2.28.0 | Pan/swipe gesture recognition | Expo SDK 54 bundled version; works with Old Arch |

### Supporting

No additional libraries needed. The existing `Animated.ScrollView` migration uses Reanimated's `Animated.ScrollView` replacement drop-in.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-native-reanimated 3.x | Reanimated 4.x | 4.x requires New Architecture — cannot use |
| react-native-reanimated 3.x | RN Animated API (current) | Current API works but runs on JS thread, causing frame drops during scroll-driven animations |
| Gesture.Pan() | PanResponder | PanResponder is JS-thread only and does not compose with RNGH gestures |

**Installation:**
```bash
npx expo install react-native-reanimated@~3.19.5 react-native-gesture-handler@~2.28.0
```

Then rebuild native:
```bash
npx expo run:ios
# or
npx expo run:android
```

**Version verification (confirmed against npm registry 2026-03-25):**
- `react-native-reanimated`: latest 3.x is `3.19.5` (published 2025)
- `react-native-gesture-handler`: latest is `2.30.0`; Expo SDK 54 bundles `~2.28.0` — use the expo-pinned version
- Reanimated 4.x (latest: 4.2.3) is NOT usable — requires New Architecture

**Babel plugin:** For Expo managed/bare workflow, `babel-preset-expo` automatically applies the Reanimated Babel plugin. No manual `babel.config.js` entry is needed. Metro cache must be cleared after install:
```bash
npx expo start --clear
```

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. All new code lives in or alongside the existing files:

```
src/screens/bible/
├── BibleReaderScreen.tsx     # Primary modification target
├── bibleReaderModel.ts       # Add gesture threshold constants here
src/
└── App.tsx                   # Add GestureHandlerRootView wrapper here
```

### Pattern 1: GestureHandlerRootView in App.tsx

**What:** Wrap the entire app with `GestureHandlerRootView`. Required for any gesture recognition. **Only one instance needed for the whole app.**

**When to use:** Once, at the root, wrapping everything.

```typescript
// App.tsx — add GestureHandlerRootView as the outermost wrapper
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    // style={{ flex: 1 }} is required
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SafeAreaProvider>
            {/* existing app tree */}
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

**Rule:** Must be outermost (or at minimum outside `NavigationContainer`). Currently `SafeAreaProvider` is the outermost wrapper — `GestureHandlerRootView` replaces it at the top.

### Pattern 2: Replace Animated.event with useAnimatedScrollHandler

**What:** The current premium read mode uses `readerScrollY = useRef(new Animated.Value(0))` and `Animated.event` to track scroll position, then `.interpolate()` for header animations. Replace with Reanimated 3's `useAnimatedScrollHandler` + `useAnimatedStyle` for zero-jank UI-thread execution.

**When to use:** Premium read mode scroll-collapse animations (top bar, hero, bottom bar).

```typescript
// Source: skill rn-reanimated-gesture-handler section 10
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// Replace: const readerScrollY = useRef(new Animated.Value(0)).current;
const scrollY = useSharedValue(0);

// Replace: Animated.event([{ nativeEvent: { contentOffset: { y: readerScrollY } } }], { useNativeDriver: true })
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    'worklet';
    scrollY.value = event.contentOffset.y;
  },
  onBeginDrag: () => {
    'worklet';
    // dismiss font size / translation sheets via runOnJS
  },
});

// Replace: readerScrollY.interpolate({ inputRange, outputRange, extrapolate: 'clamp' })
const topChromeStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    scrollY.value,
    [0, READER_TOP_CHROME_DISMISS_DISTANCE * 0.7, READER_TOP_CHROME_DISMISS_DISTANCE],
    [1, 0.88, 0],
    Extrapolation.CLAMP
  ),
  transform: [
    {
      translateY: interpolate(
        scrollY.value,
        [0, READER_TOP_CHROME_DISMISS_DISTANCE],
        [0, -36],
        Extrapolation.CLAMP
      ),
    },
  ],
}));

// Use Animated.ScrollView from react-native-reanimated
<Animated.ScrollView
  ref={scrollViewRef}
  onScroll={scrollHandler}
  scrollEventThrottle={16}
  // ... rest of props
/>
```

### Pattern 3: Horizontal Swipe for Chapter Navigation

**What:** A `Gesture.Pan()` gesture monitors horizontal translation. When the user swipes past a threshold (or with sufficient velocity), call the existing navigation handlers via `runOnJS`.

**When to use:** In read mode, wrapping the `Animated.ScrollView` content area.

```typescript
// Source: skill rn-reanimated-gesture-handler section 8.2 + 14.1
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

const SWIPE_THRESHOLD = 80;      // px to commit chapter change
const SWIPE_VELOCITY_MIN = 600;  // px/s velocity fast-path

const swipeX = useSharedValue(0);

const swipeGesture = Gesture.Pan()
  .activeOffsetX([-15, 15])      // Require 15px horizontal before activating
  .failOffsetY([-10, 10])        // Fail if vertical > 10px first (let scroll win)
  .onUpdate((event) => {
    'worklet';
    swipeX.value = event.translationX;
  })
  .onEnd((event) => {
    'worklet';
    const didSwipeLeft =
      event.translationX < -SWIPE_THRESHOLD || event.velocityX < -SWIPE_VELOCITY_MIN;
    const didSwipeRight =
      event.translationX > SWIPE_THRESHOLD || event.velocityX > SWIPE_VELOCITY_MIN;

    if (didSwipeLeft && hasNextChapter) {
      runOnJS(handleNextReadChapter)();
    } else if (didSwipeRight && hasPrevChapter) {
      runOnJS(handlePreviousReadChapter)();
    }
    swipeX.value = withSpring(0);
  });

const swipeStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: swipeX.value }],
}));

// Wrap reader content:
<GestureDetector gesture={swipeGesture}>
  <Animated.View style={[styles.premiumReaderLayout, swipeStyle]}>
    {/* existing content */}
  </Animated.View>
</GestureDetector>
```

**Key configuration:**
- `.activeOffsetX([-15, 15])`: Does not activate until 15px horizontal movement — allows normal vertical scroll to start first
- `.failOffsetY([-10, 10])`: Fails if vertical movement exceeds 10px — vertical scroll wins and the pan gesture never activates

### Pattern 4: Follow Along Modal — Slide Transition

**What:** The Follow Along `Modal` currently uses `animationType="slide"`. Replace with a Reanimated Layout Animation (`SlideInDown` entering, `SlideOutDown` exiting) to gain control over easing and duration. Or keep the RN Modal `animationType="slide"` and add a spring-based content enter animation inside the modal.

**When to use:** When `showFollowAlongText` toggles from false to true.

```typescript
// Source: skill rn-reanimated-gesture-handler section 12.1
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

// Option A: Use Animated.View inside Modal for content transition
{showFollowAlongText && (
  <Modal visible={showFollowAlongText} transparent animationType="none" ...>
    <Animated.View
      entering={SlideInDown.springify().damping(20).stiffness(200)}
      exiting={SlideOutDown.duration(250)}
      style={styles.followAlongContainer}
    >
      {/* follow along content */}
    </Animated.View>
  </Modal>
)}
```

### Anti-Patterns to Avoid

- **Mixing old Animated API with Reanimated 3 on the same value:** Do not feed an `Animated.Value` into a `useAnimatedStyle`, and do not use `Animated.event` alongside `useAnimatedScrollHandler` on the same ScrollView.
- **Reading `.value` during render:** Never read `sharedValue.value` outside a worklet or `useAnimatedStyle`. Will cause undefined behavior.
- **Passing shared values as props:** Shared values are not serializable. Pass `useAnimatedStyle` results instead.
- **Animating layout props (width/height/top/left) in hot paths:** Always animate `transform` and `opacity` for 60fps. Never animate flexbox dimensions in `useAnimatedStyle` — it forces re-layout.
- **Forgetting `'worklet'` directive:** Any function passed to gesture callbacks or `useAnimatedScrollHandler` that reads/writes shared values must have `'worklet';` as the first statement, or be called via `runOnJS`.
- **Missing `scrollEventThrottle={16}` on ScrollView:** Without it, scroll events throttle to ~100ms, making animations feel laggy.
- **Wrapping the wrong element with GestureDetector:** The gesture detector must wrap an `Animated.View`, not a plain `View`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UI-thread animations | Custom Animated.Value interpolation | `useAnimatedStyle` + `useSharedValue` | Reanimated runs worklets on UI thread; RN Animated requires `useNativeDriver` workarounds |
| Swipe gesture recognition | PanResponder or touch event math | `Gesture.Pan()` from RNGH | RNGH handles multi-touch, velocity, threshold, and gesture composition natively |
| Gesture conflict resolution | Manual state machines for scroll vs swipe | `activeOffsetX` + `failOffsetY` on `Gesture.Pan()` | Built-in directional activation/failure rules handle scroll vs swipe disambiguation |
| Spring physics | Custom `requestAnimationFrame` loop | `withSpring()` | Accurate spring simulation running on UI thread |
| Layout enter/exit transitions | setTimeout + opacity state toggles | `entering={SlideInDown}` / `exiting={SlideOutDown}` | Declarative, runs on UI thread, handles interrupt cases |

**Key insight:** The failure mode of custom gesture/animation code in React Native is always the same: it runs on the JS thread and drops frames when the JS thread is busy loading chapter data. Reanimated 3 worklets and RNGH gesture callbacks run on the UI thread regardless of JS-thread load.

---

## Runtime State Inventory

Step 2.5 SKIPPED — this is not a rename/refactor/migration phase. No stored data, live service config, OS-registered state, or secrets reference the feature being built.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| node | Package install | ✓ | 25.8.1 | — |
| npx | expo install | ✓ | 11.11.0 | — |
| react-native-reanimated | Animation layer | ✗ | — | None (must install) |
| react-native-gesture-handler | Swipe gestures | ✗ | — | None (must install) |
| Xcode (local build) | iOS native rebuild | ✓ (per global CLAUDE.md) | 26.3 | — |

**Missing dependencies with no fallback:**
- `react-native-reanimated@~3.19.5` — must install before Wave 1 tasks; native rebuild required
- `react-native-gesture-handler@~2.28.0` — must install before Wave 1 tasks; native rebuild required

**Install and rebuild is Wave 0 Task 1.** No implementation tasks can run before this.

---

## Common Pitfalls

### Pitfall 1: Installing Reanimated 4 Instead of 3

**What goes wrong:** `npx expo install react-native-reanimated` without a version pin installs Expo SDK 54's bundled version, which is `~4.1.1`. Reanimated 4.x requires New Architecture. The app crashes on launch with a native module resolution error because `react-native-worklets` (required by Reanimated 4) is not installed and Old Architecture cannot satisfy it.

**Why it happens:** Expo SDK 54's `bundledNativeModules.json` specifies `~4.1.1`. `npx expo install` without a pin respects the bundled preference.

**How to avoid:** Always pin the version explicitly: `npx expo install react-native-reanimated@~3.19.5`

**Warning signs:** Build failure mentioning `react-native-worklets` not found, or "Reanimated 4 requires New Architecture" error on launch.

### Pitfall 2: Swipe Gesture Eating Vertical Scroll

**What goes wrong:** A `Gesture.Pan()` without directional constraints activates on any touch movement, preventing the `Animated.ScrollView` from scrolling vertically.

**Why it happens:** Without `activeOffsetX` and `failOffsetY`, the pan gesture activates as soon as any movement is detected and blocks the scroll view's touch handling.

**How to avoid:** Always configure `.activeOffsetX([-15, 15])` and `.failOffsetY([-10, 10])` on the swipe pan gesture. This makes horizontal swipes win when horizontal movement comes first, and lets the scroll view win when vertical movement comes first.

**Warning signs:** User cannot scroll the Bible text; every drag attempt triggers a chapter change.

### Pitfall 3: Forgetting GestureHandlerRootView

**What goes wrong:** RNGH gestures silently never fire. No errors in the console. The app appears to work but swipes do nothing.

**Why it happens:** RNGH requires the entire app (or at minimum the screen using gestures) to be wrapped in `GestureHandlerRootView`. Without it, gesture recognition is not initialized.

**How to avoid:** Add `GestureHandlerRootView style={{ flex: 1 }}` as the outermost element in `App.tsx`, wrapping `QueryClientProvider` and everything below.

**Warning signs:** Gesture callbacks (onUpdate, onEnd) never fire; no visual feedback on swipe.

### Pitfall 4: Breaking Audio Sync During Swipe Navigation

**What goes wrong:** The swipe handler calls `handleNextReadChapter` or `handlePreviousReadChapter` directly. These handlers check `shouldTransferActiveAudioOnChapterChange` and conditionally `playChapter`. If audio is playing and the gesture fires mid-chapter, the audio and reader get out of sync.

**Why it happens:** The swipe calls the same handlers as the button presses, which is correct. The risk is multiple rapid swipes queueing multiple `playChapter` calls before `syncReaderReference` completes.

**How to avoid:** Debounce the swipe navigation (100–200ms) so rapid swipes don't stack. Reanimated's `runOnJS` bridges to the JS thread asynchronously, so two swipes within one frame can both fire. Add a JS-thread flag (`swipeInFlight`) that resets after `syncReaderReference` completes.

**Warning signs:** Audio plays the wrong chapter after rapid swiping; `previousChapter`/`nextChapter` audio state diverges from reader state.

### Pitfall 5: Old Animated API Still Driving Scroll in Premium Mode

**What goes wrong:** The `readerScrollY` `Animated.Value` and the new `scrollY` `SharedValue` both exist simultaneously and both try to animate the same elements. Style conflicts cause no visible animation.

**Why it happens:** Partial migration — the `Animated.ScrollView` still has the old `onScroll={readerScrollHandler}` while the new `Animated.ScrollView` (from Reanimated) has `onScroll={scrollHandler}`.

**How to avoid:** The migration must be atomic per ScrollView. For the premium read layout, remove `readerScrollY`, `readerScrollHandler`, `topChromeOpacity`, `topChromeTranslateY`, `heroOpacity`, `heroTranslateY` entirely and replace with `useAnimatedStyle` equivalents. Do NOT leave both.

**Warning signs:** Header animations freeze or jump; `Animated.View` wrapper and `Animated.View` (Reanimated) props conflict.

### Pitfall 6: Babel Plugin Version Mismatch

**What goes wrong:** Metro compile error: "Mismatch between JavaScript code version and Reanimated Babel plugin version (3.19.x vs 4.x)."

**Why it happens:** Another package in the dependency tree has already installed a different Reanimated version (e.g., a library that depends on Reanimated 4), resulting in two versions of the Babel plugin in node_modules.

**How to avoid:** After install, run `npm ls react-native-reanimated` to verify only one version is installed. If another package requires Reanimated 4, add a `resolutions` field in package.json to force the version.

**Warning signs:** Babel errors at Metro startup referencing plugin version mismatch.

---

## Code Examples

Verified patterns from the project's own `rn-reanimated-gesture-handler` skill (sourced from Software Mansion official docs):

### Scroll-Driven Header Collapse (complete replacement for premium read mode)

```typescript
// Source: skill rn-reanimated-gesture-handler sections 3.1, 3.2, 10
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// In BibleReaderScreen component:
const scrollY = useSharedValue(0);

const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    'worklet';
    scrollY.value = event.contentOffset.y;
  },
  onBeginDrag: () => {
    'worklet';
    // runOnJS(dismissSheets)();
  },
});

const topChromeAnimatedStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    scrollY.value,
    [0, READER_TOP_CHROME_DISMISS_DISTANCE * 0.7, READER_TOP_CHROME_DISMISS_DISTANCE],
    [1, 0.88, 0],
    Extrapolation.CLAMP
  ),
  transform: [{
    translateY: interpolate(
      scrollY.value,
      [0, READER_TOP_CHROME_DISMISS_DISTANCE],
      [0, -36],
      Extrapolation.CLAMP
    ),
  }],
}));

// Replace Animated.View from 'react-native' with Animated.View from 'react-native-reanimated'
// Replace Animated.ScrollView from 'react-native' with Animated.ScrollView from 'react-native-reanimated'
```

### Swipe Chapter Navigation

```typescript
// Source: skill rn-reanimated-gesture-handler sections 8.2, 9
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';

const swipeX = useSharedValue(0);
const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY = 600;

const swipeGesture = Gesture.Pan()
  .activeOffsetX([-15, 15])
  .failOffsetY([-10, 10])
  .onUpdate((event) => {
    'worklet';
    swipeX.value = event.translationX;
  })
  .onEnd((event) => {
    'worklet';
    const goNext =
      (event.translationX < -SWIPE_THRESHOLD || event.velocityX < -SWIPE_VELOCITY)
      && hasNextChapter;
    const goPrev =
      (event.translationX > SWIPE_THRESHOLD || event.velocityX > SWIPE_VELOCITY)
      && hasPrevChapter;

    if (goNext) runOnJS(handleNextReadChapter)();
    else if (goPrev) runOnJS(handlePreviousReadChapter)();

    swipeX.value = withSpring(0, { damping: 30, stiffness: 300 });
  });
```

### runOnJS Bridge for State Setters

```typescript
// Source: skill rn-reanimated-gesture-handler section 5
import { runOnJS } from 'react-native-reanimated';

// Inside a worklet (onScroll, onEnd, etc.):
const dismissSheets = () => {
  setShowFontSizeSheet(false);
  setShowTranslationSheet(false);
};

// In scroll handler:
const scrollHandler = useAnimatedScrollHandler({
  onBeginDrag: () => {
    'worklet';
    runOnJS(dismissSheets)();
  },
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PanGestureHandler (legacy RNGH component) | Gesture.Pan() + GestureDetector (RNGH v2) | RNGH v2 (2022) | Composable gesture system, no nested component tree |
| Animated.event + useNativeDriver | useAnimatedScrollHandler (Reanimated 3) | Reanimated 3 (2023) | True UI thread; no bridge overhead even for complex interpolations |
| Reanimated 3.x for all projects | Reanimated 4 for New Arch projects | SDK 54 / Reanimated 4 (2025) | 4.x splits worklets into react-native-worklets; NOT usable here |

**Deprecated/outdated:**
- `PanGestureHandler` component from RNGH v1/legacy API: replaced by `Gesture.Pan()` + `GestureDetector`. The old component API still works but is not composable.
- `Animated.event` with `useNativeDriver: true`: still functional but runs through the native animation driver, not Reanimated's UI thread worklet runner. Less flexible for complex interpolations.
- `react-native-reanimated` Babel plugin in `babel.config.js` for Expo: Not needed — `babel-preset-expo` handles it automatically.

---

## Open Questions

1. **Should the swipe gesture apply in legacy mode too (listen mode / audio-first)?**
   - What we know: The swipe gesture pattern calls `handleNextReadChapter` / `handlePreviousReadChapter`, which call `handleReadChapterNavigation`. Listen mode uses separate handlers (`handleNextListenChapter` / `handlePreviousListenChapter`).
   - What's unclear: Whether users expect swipe navigation in listen mode as well.
   - Recommendation: Limit swipe to read mode (`showPremiumReadMode === true`) for Phase 30. Listen mode already has button transport controls.

2. **Does the Follow Along modal need a full Reanimated-powered dismissal?**
   - What we know: The modal currently uses `animationType="slide"`. The existing RN modal animation is acceptable for MVP.
   - Recommendation: Use Reanimated layout animations (`SlideInDown`/`SlideOutDown`) on the content inside the modal for a spring-physics feel, rather than replacing the Modal primitive entirely. Lower risk than a full custom modal.

3. **How does the swipe interact with multi-step rapid chapter navigation?**
   - What we know: Audio sync logic in `shouldTransferActiveAudioOnChapterChange` checks `isCurrentAudioChapter`. Rapid swipes could trigger multiple `playChapter` calls.
   - Recommendation: Add a 150ms JS-thread debounce flag on the swipe navigation handler to prevent stacking.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest (via `npm test`) + `npm run test:release` regression suite |
| Config file | `package.json` scripts `test`, `test:release` |
| Quick run command | `npm run test:release` |
| Full suite command | `npm run lint && npm run typecheck && npm run test:release` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SWIPE-01 | Swipe right navigates to previous chapter | unit (model) | `npm run test:release` | ❌ Wave 0 |
| SWIPE-02 | Swipe left navigates to next chapter | unit (model) | `npm run test:release` | ❌ Wave 0 |
| SWIPE-03 | Swipe does not fire when no adjacent chapter exists | unit (model) | `npm run test:release` | ❌ Wave 0 |
| SCROLL-01 | Header chrome opacity/translateY responds to scroll position | manual-only | device QA | — |
| MODAL-01 | Follow Along modal opens/closes with spring transition | manual-only | device QA | — |
| AUDIO-01 | Chapter navigation during active audio preserves audio sync | manual-only | device QA | — |

### Sampling Rate

- **Per task commit:** `npm run lint && npm run typecheck`
- **Per wave merge:** `npm run release:verify`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] Install task: `npx expo install react-native-reanimated@~3.19.5 react-native-gesture-handler@~2.28.0` — must precede all other tasks
- [ ] `App.tsx` — add `GestureHandlerRootView` wrapper (no test file, but TypeScript typecheck covers it)
- [ ] Unit tests for swipe threshold logic — new file `src/screens/bible/__tests__/bibleReaderSwipe.test.ts`
- [ ] Clear Metro cache: `npx expo start --clear` after install

---

## Sources

### Primary (HIGH confidence)

- `rn-reanimated-gesture-handler` skill (Software Mansion official docs, sourced 2026-03) — installation, GestureHandlerRootView, useAnimatedScrollHandler, Gesture.Pan(), worklets, interpolate, runOnJS, common patterns
- npm registry `react-native-reanimated` version list (verified 2026-03-25) — latest 3.x is 3.19.5
- npm registry `react-native-gesture-handler` version (verified 2026-03-25) — latest is 2.30.0
- GitHub expo/expo `sdk-54/bundledNativeModules.json` (fetched 2026-03-25) — Expo SDK 54 bundles reanimated `~4.1.1` and gesture-handler `~2.28.0`
- Project `app.json` — confirmed `newArchEnabled: false`
- Project `package.json` — confirmed neither library is installed; Expo 54.0.33, RN 0.81.5
- Project `BibleReaderScreen.tsx` — confirmed `Animated.Value` scroll tracking, `Animated.ScrollView`, `Modal animationType="slide"` for Follow Along

### Secondary (MEDIUM confidence)

- Expo SDK 54 changelog (expo.dev/changelog/sdk-54) — SDK 54 is last to support Old Architecture; SDK 55 will require New Architecture
- GitHub expo/expo Discussion #39130 — Community confirmation that Reanimated 4.1.2 can work with old arch IF react-native-worklets is installed; however, simpler to use 3.x
- Software Mansion Reanimated compatibility table — Reanimated 4.x "works only with the React Native New Architecture"

### Tertiary (LOW confidence)

- Community reports from WebSearch — Reanimated 3.16-3.19 works with RN 0.81 and Old Architecture (not independently verified with official docs, but consistent across multiple sources)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry confirmed versions; Expo bundledNativeModules.json confirms gesture-handler ~2.28.0; Old Arch constraint confirmed from app.json
- Architecture: HIGH — patterns sourced directly from project skill file (Software Mansion official docs)
- Pitfalls: HIGH — GestureHandlerRootView and swipe-scroll conflict are documented pitfalls in official docs; version mismatch is confirmed from WebSearch community reports
- Audio sync concern: MEDIUM — based on reading BibleReaderScreen.tsx handler logic, not from test evidence

**Research date:** 2026-03-25
**Valid until:** 2026-06-25 (stable libraries; Expo SDK 55 migration will change version recommendations)
