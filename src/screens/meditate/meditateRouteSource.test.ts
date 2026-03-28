import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('Meditate surfaces route into the dedicated journey screen instead of BibleReader', () => {
  const homeSource = readRelativeSource('./MeditateHomeScreen.tsx');
  const detailSource = readRelativeSource('./MeditationDetailScreen.tsx');

  assert.match(homeSource, /MeditationJourney/, 'MeditateHomeScreen should open the journey screen');
  assert.match(
    detailSource,
    /MeditationJourney/,
    'MeditationDetailScreen should open the journey screen'
  );
  assert.equal(
    homeSource.includes('BibleReader'),
    false,
    'MeditateHomeScreen should not route the hero into BibleReader'
  );
  assert.equal(
    detailSource.includes('BibleReader'),
    false,
    'MeditationDetailScreen should not route collection taps into BibleReader'
  );
});
