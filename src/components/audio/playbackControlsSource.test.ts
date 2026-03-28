import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('PlaybackControls supports a chapter-only transport variant without 10-second skip buttons', () => {
  const source = readRelativeSource('./PlaybackControls.tsx');

  assert.match(
    source,
    /variant\?: 'default' \| 'chapter-only'/,
    'PlaybackControls should expose a chapter-only variant for simplified Bible listen layouts'
  );

  assert.match(
    source,
    /const showSkipControls = variant === 'default';/,
    'PlaybackControls should derive skip-button visibility from the selected variant'
  );

  assert.match(
    source,
    /\{showSkipControls \? \(\s*<TouchableOpacity[\s\S]*styles\.skipButton/s,
    'PlaybackControls should only render the 10-second skip buttons when the default variant is active'
  );
});

test('PlaybackControls exposes a repeat utility button alongside playback speed controls', () => {
  const source = readRelativeSource('./PlaybackControls.tsx');

  assert.match(
    source,
    /repeatMode: RepeatMode;/,
    'PlaybackControls should accept repeat mode from the shared audio player state'
  );

  assert.match(
    source,
    /onCycleRepeatMode: \(\) => void;/,
    'PlaybackControls should let listen surfaces cycle the repeat mode from a shared utility button'
  );

  assert.match(
    source,
    /<TouchableOpacity[\s\S]*onPress=\{\(\) => onCycleRepeatMode\(\)\}[\s\S]*renderRepeatModeIcon/s,
    'PlaybackControls should render a repeat button in the utility row'
  );
});

test('PlaybackControls supports an inline text utility action for the chapter-only player', () => {
  const source = readRelativeSource('./PlaybackControls.tsx');

  assert.match(
    source,
    /onShowText\?: \(\) => void;/,
    'PlaybackControls should accept an inline show-text action for listen mode'
  );

  assert.match(
    source,
    /showTextLabel\?: string;/,
    'PlaybackControls should let the listen surface provide the show-text label'
  );

  assert.match(
    source,
    /const showTextUtility = typeof onShowText === 'function';/,
    'PlaybackControls should derive whether to render the inline text utility from the provided callback'
  );

  assert.match(
    source,
    /showTextUtility \? \([\s\S]*renderTextUtilityIcon\(\)[\s\S]*showTextLabel/s,
    'PlaybackControls should render the Dwell-inspired text utility inline with the other controls'
  );
});

test('PlaybackControls exposes a bundled background-music utility in the listen control row', () => {
  const source = readRelativeSource('./PlaybackControls.tsx');

  assert.match(
    source,
    /backgroundMusicChoice: BackgroundMusicChoice;/,
    'PlaybackControls should receive the currently selected bundled background-music choice'
  );

  assert.match(
    source,
    /onChangeBackgroundMusicChoice: \(choice: BackgroundMusicChoice\) => void;/,
    'PlaybackControls should let listen surfaces update the selected bundled background-music choice'
  );

  assert.match(
    source,
    /musical-notes(?:-outline)?/,
    'PlaybackControls should render a music-note affordance for bundled background music'
  );

  assert.match(
    source,
    /setShowBackgroundMusicModal\(true\)/,
    'PlaybackControls should open a bundled background-music picker from the utility row'
  );
});

test('PlaybackControls gives the chapter-only transport a stronger Dwell-inspired hierarchy', () => {
  const source = readRelativeSource('./PlaybackControls.tsx');

  assert.match(
    source,
    /const isChapterOnlyTransport = variant === 'chapter-only';/,
    'PlaybackControls should derive a dedicated transport treatment for the Bible listen player'
  );

  assert.match(
    source,
    /chapterOnlyTransportButton:\s*{[\s\S]*width:\s*52,[\s\S]*height:\s*52/s,
    'PlaybackControls should give chapter transport buttons a larger Dwell-inspired tap target'
  );

  assert.match(
    source,
    /chapterOnlyPlayButton:\s*{[\s\S]*width:\s*72,[\s\S]*height:\s*72/s,
    'PlaybackControls should make the main play button visually dominant in chapter-only mode'
  );
});

test('Bible listen surfaces opt into the listen transport and voice picker', () => {
  const audioFirstSource = readRelativeSource('./AudioFirstChapterCard.tsx');
  const readerSource = readRelativeSource('../../screens/bible/BibleReaderScreen.tsx');

  assert.match(
    audioFirstSource,
    /<PlaybackControls[\s\S]*variant="listen"/,
    'AudioFirstChapterCard should use the Dwell-style listen transport'
  );

  assert.match(
    readerSource,
    /<AudioFirstChapterCard[\s\S]*translationLabel=\{translationLabel\}[\s\S]*onShareChapter=\{handleShareChapter\}/s,
    'BibleReaderScreen listen mode should hand the listen surface to AudioFirstChapterCard with chapter actions'
  );

  assert.match(
    readerSource,
    /<AudioFirstChapterCard[\s\S]*onOpenChapterActions=\{\(\) => \{[\s\S]*setShowChapterActionsSheet\(true\)/s,
    'BibleReaderScreen listen mode should expose the chapter actions sheet from the listen card'
  );

  assert.match(
    audioFirstSource,
    /voiceCatalog=\{voiceCatalog\}[\s\S]*selectedVoiceId=\{selectedVoiceId\}[\s\S]*onSelectVoice=\{handleSelectVoice\}/s,
    'AudioFirstChapterCard should thread the BSB voice catalog into the listen transport'
  );
});
