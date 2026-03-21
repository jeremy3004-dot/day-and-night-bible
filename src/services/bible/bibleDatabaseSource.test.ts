import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('initDatabase revalidates an already-open bundled database before reusing it', () => {
  const source = readRelativeSource('./bibleDatabase.ts');

  assert.match(
    source,
    /if \(db\) \{[\s\S]*const existingStatus = await inspectOpenDatabase\(db\);[\s\S]*if \(isBundledBibleDatabaseReady\(existingStatus, minimumReadyVerseCount\)\) \{[\s\S]*return;[\s\S]*\}[\s\S]*\}/,
    'initDatabase should inspect any existing bundled database handle and only reuse it when the schema, verse count, and search index are still ready'
  );
});

test('bible database source resolver can route a translation to an installed SQLite directory', () => {
  const source = readRelativeSource('./bibleDatabase.ts');

  assert.match(
    source,
    /BibleDatabaseSourceResolver[\s\S]*setBibleDatabaseSourceResolver[\s\S]*resolveBibleDatabaseSource[\s\S]*bibleDatabaseSourceResolver\(translationId\) \?\? bundledBibleDatabaseSource/,
    'bibleDatabase.ts should expose a small injected resolver seam with bundled fallback'
  );
});

test('getDatabase opens the resolved SQLite source directory for translation-aware packs', () => {
  const source = readRelativeSource('./bibleDatabase.ts');

  assert.match(source, /export async function getDatabase\(/);
  assert.match(source, /const source = resolveBibleDatabaseSource\(translationId\)/);
  assert.match(source, /SQLite\.openDatabaseAsync\(source\.databaseName, undefined, source\.directory\)/);
});
