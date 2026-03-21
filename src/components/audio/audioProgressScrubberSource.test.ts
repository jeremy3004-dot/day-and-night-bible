import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('audio progress uses a shared draggable scrubber component', () => {
  const scrubberSource = readRelativeSource('./AudioProgressScrubber.tsx');
  const playerBarSource = readRelativeSource('./AudioPlayerBar.tsx');
  const audioFirstSource = readRelativeSource('./AudioFirstChapterCard.tsx');

  assert.match(
    scrubberSource,
    /PanResponder\.create/,
    'AudioProgressScrubber should use a drag responder so listeners can scrub through the chapter'
  );

  assert.match(
    scrubberSource,
    /onPanResponderMove:/,
    'AudioProgressScrubber should update scrub position while the user drags'
  );

  assert.match(
    scrubberSource,
    /onPanResponderRelease:/,
    'AudioProgressScrubber should commit the seek when the drag ends'
  );

  assert.match(
    playerBarSource,
    /<AudioProgressScrubber[\s\S]*onSeek=\{handleSeek\}/,
    'AudioPlayerBar should render the shared draggable scrubber'
  );

  assert.match(
    audioFirstSource,
    /<AudioProgressScrubber[\s\S]*onSeek=\{handleSeek\}/,
    'AudioFirstChapterCard should render the shared draggable scrubber'
  );
});
