import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('CourseListScreen keeps Harvest sections neutral instead of showing listened progress state', () => {
  const source = readRelativeSource('./CourseListScreen.tsx');

  assert.equal(
    source.includes("useProgressStore"),
    false,
    'CourseListScreen should not subscribe to progress state just to decorate Harvest rows'
  );

  assert.equal(
    source.includes("t('harvest.read'"),
    false,
    'CourseListScreen should not render Harvest read-count copy in the hero or section cards'
  );

  assert.equal(
    source.includes('styles.sectionProgress'),
    false,
    'CourseListScreen should remove the section progress label once Harvest counters are gone'
  );

  assert.equal(
    source.includes('checkmark-circle'),
    false,
    'CourseListScreen should not swap Harvest rows to a green completion check after listening'
  );
});
