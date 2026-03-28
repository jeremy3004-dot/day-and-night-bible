import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('the app defines a shared professional design system module', () => {
  const designSystemPath = fileURLToPath(new URL('./system.ts', import.meta.url).href);

  assert.equal(existsSync(designSystemPath), true, 'src/design/system.ts should exist');

  const source = readFileSync(designSystemPath, 'utf8');

  assert.equal(source.includes('export const spacing'), true, 'design system should export spacing');
  assert.equal(source.includes('export const radius'), true, 'design system should export radius');
  assert.equal(source.includes('export const typography'), true, 'design system should export typography');
  assert.equal(source.includes('export const shadows'), true, 'design system should export shadows');
  assert.equal(
    source.includes('export const shellChrome'),
    true,
    'design system should export shared shell chrome constants'
  );
  assert.equal(
    source.includes('Lora-Regular'),
    true,
    'design system should use the bundled serif font family'
  );
});

test('high-traffic app surfaces consume the shared design system', () => {
  const files = [
    '../screens/home/HomeScreen.tsx',
    '../screens/bible/BibleBrowserScreen.tsx',
    '../screens/bible/ChapterSelectorScreen.tsx',
    '../screens/bible/BibleReaderScreen.tsx',
    '../screens/learn/CourseListScreen.tsx',
    '../screens/more/MoreScreen.tsx',
    '../screens/more/ProfileScreen.tsx',
    '../screens/more/ReadingActivityScreen.tsx',
    '../screens/more/SettingsScreen.tsx',
    '../screens/meditate/MeditateHomeScreen.tsx',
    '../screens/prayer/PrayerHomeScreen.tsx',
    '../screens/prayer/FreePrayerScreen.tsx',
    '../screens/prayer/PrayerCategoryScreen.tsx',
    '../components/audio/MiniPlayer.tsx',
    '../navigation/TabNavigator.tsx',
    '../navigation/RootNavigator.tsx',
  ];

  for (const relativePath of files) {
    const source = readRelativeSource(relativePath);

    assert.equal(
      /design\/system/.test(source),
      true,
      `${relativePath} should import the shared design system`
    );
  }
});
