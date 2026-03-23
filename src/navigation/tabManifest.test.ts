import test from 'node:test';
import assert from 'node:assert/strict';
import { rootTabManifest } from './tabManifest';

test('root tab manifest exposes Learn through the live shell between Bible and More', () => {
  assert.deepEqual(
    rootTabManifest.map((tab) => tab.name),
    ['Home', 'Bible', 'Learn', 'More']
  );
});

test('learn tab uses the gather localization key', () => {
  const learnTab = rootTabManifest.find((tab) => tab.name === 'Learn');

  assert.ok(learnTab);
  assert.equal(learnTab.labelKey, 'tabs.gather');
});
