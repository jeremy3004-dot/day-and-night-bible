import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('AudioFirstChapterCard removes redundant watermark art and explanatory audio-only copy', () => {
  const source = readRelativeSource('./AudioFirstChapterCard.tsx');

  assert.equal(
    source.includes('heroWatermark'),
    false,
    'AudioFirstChapterCard should not render the duplicated background watermark artwork'
  );

  assert.equal(
    source.includes('heroPanel'),
    false,
    'AudioFirstChapterCard should remove the extra nested hero shell'
  );

  assert.equal(
    source.includes('iconShell'),
    false,
    'AudioFirstChapterCard should not wrap the book art in a second nested icon shell'
  );

  assert.equal(
    source.includes("t('bible.audioOnlyTitle')"),
    false,
    'AudioFirstChapterCard should remove the redundant audio-only headline copy'
  );

  assert.equal(
    source.includes("t('bible.audioOnlyBody'"),
    false,
    'AudioFirstChapterCard should remove the explanatory body copy for audio-only chapters'
  );
});

test('AudioFirstChapterCard threads the voice catalog and chapter actions into the listen transport', () => {
  const source = readRelativeSource('./AudioFirstChapterCard.tsx');

  assert.match(
    source,
    /<PlaybackControls[\s\S]*variant="listen"/s,
    'AudioFirstChapterCard should use the listen variant for the Dwell-style player surface'
  );

  assert.match(
    source,
    /listenTranslationLabel=\{translationLabel\}[\s\S]*voiceCatalog=\{voiceCatalog\}[\s\S]*selectedVoiceId=\{selectedVoiceId\}[\s\S]*onSelectVoice=\{handleSelectVoice\}/s,
    'AudioFirstChapterCard should thread voice selection metadata into the listen transport'
  );

  assert.match(
    source,
    /onShare=\{onShareChapter\}[\s\S]*onOpenChapterActions=\{onOpenChapterActions\}[\s\S]*onOpenFeedback=\{onOpenFeedback\}/s,
    'AudioFirstChapterCard should surface chapter actions and feedback from the listen controls'
  );
});
