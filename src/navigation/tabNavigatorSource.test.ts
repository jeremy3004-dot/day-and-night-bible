import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('TabNavigator renders the bottom tab bar as a floating glass dock', () => {
  const source = readRelativeSource('./TabNavigator.tsx');

  assert.equal(
    source.includes('BlurView'),
    true,
    'TabNavigator should blur the shared bottom tab bar background'
  );

  assert.equal(
    source.includes('LinearGradient'),
    true,
    'TabNavigator should layer a glass highlight over the shared bottom tab bar'
  );

  assert.equal(
    source.includes('shellChrome.dockRadius'),
    true,
    'TabNavigator should use the shared dock radius token'
  );

  assert.equal(
    source.includes("position: 'absolute'"),
    true,
    'TabNavigator should float the shared bottom tab bar above the screen edge'
  );

  assert.equal(
    source.includes("backgroundColor: colors.glassBackground"),
    true,
    'TabNavigator should use the shared glass background token for the dock fallback'
  );
});
