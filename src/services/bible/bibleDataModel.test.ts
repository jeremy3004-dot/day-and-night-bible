import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUNDLED_BIBLE_SCHEMA_VERSION,
  buildBibleSearchQuery,
  isBundledBibleDatabaseReady,
} from './bibleDataModel';

test('bundled bible database is only ready when count, schema version, and search index are present', () => {
  assert.equal(
    isBundledBibleDatabaseReady(
      {
        verseCount: 31086,
        schemaVersion: BUNDLED_BIBLE_SCHEMA_VERSION,
        hasSearchIndex: true,
      },
      20000
    ),
    true
  );

  assert.equal(
    isBundledBibleDatabaseReady(
      {
        verseCount: 100,
        schemaVersion: BUNDLED_BIBLE_SCHEMA_VERSION,
        hasSearchIndex: true,
      },
      20000
    ),
    false
  );

  assert.equal(
    isBundledBibleDatabaseReady(
      {
        verseCount: 31086,
        schemaVersion: BUNDLED_BIBLE_SCHEMA_VERSION - 1,
        hasSearchIndex: true,
      },
      20000
    ),
    false
  );

  assert.equal(
    isBundledBibleDatabaseReady(
      {
        verseCount: 31086,
        schemaVersion: BUNDLED_BIBLE_SCHEMA_VERSION,
        hasSearchIndex: false,
      },
      20000
    ),
    false
  );
});

test('buildBibleSearchQuery normalizes user input into an FTS prefix query', () => {
  assert.equal(buildBibleSearchQuery('  grace and peace  '), 'grace* and* peace*');
  assert.equal(buildBibleSearchQuery('John 3:16'), 'John* 3* 16*');
  assert.equal(buildBibleSearchQuery('faith,hope;love'), 'faith* hope* love*');
});

test('buildBibleSearchQuery returns null when no searchable tokens are present', () => {
  assert.equal(buildBibleSearchQuery('   '), null);
  assert.equal(buildBibleSearchQuery('!!!'), null);
});
