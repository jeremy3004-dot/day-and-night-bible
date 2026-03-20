import assert from 'node:assert/strict';
import test from 'node:test';
import { getCurrentRouteName } from './miniPlayerModel';

test('getCurrentRouteName returns null when navigation state is unavailable', () => {
  assert.equal(getCurrentRouteName(undefined), null);
});

test('getCurrentRouteName returns the leaf route name from nested navigation state', () => {
  assert.equal(
    getCurrentRouteName({
      index: 0,
      routes: [
        {
          name: 'Bible',
          state: {
            index: 1,
            routes: [{ name: 'BibleBrowser' }, { name: 'ChapterSelector' }],
          },
        },
      ],
    }),
    'ChapterSelector'
  );
});
