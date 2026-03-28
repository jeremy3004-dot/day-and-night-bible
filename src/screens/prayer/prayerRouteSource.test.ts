import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('Prayer surfaces route into the dedicated journey screen instead of BibleReader', () => {
  const homeSource = readRelativeSource('./PrayerHomeScreen.tsx');
  const categorySource = readRelativeSource('./PrayerCategoryScreen.tsx');

  assert.match(homeSource, /PrayerJourney/, 'PrayerHomeScreen should open the journey screen');
  assert.match(
    categorySource,
    /PrayerJourney/,
    'PrayerCategoryScreen should open the journey screen'
  );
  assert.equal(
    homeSource.includes('BibleReader'),
    false,
    'PrayerHomeScreen should not route the hero into BibleReader'
  );
  assert.equal(
    categorySource.includes('BibleReader'),
    false,
    'PrayerCategoryScreen should not route category taps into BibleReader'
  );
});
