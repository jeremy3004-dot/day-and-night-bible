import test from 'node:test';
import assert from 'node:assert/strict';
import { rootTabManifest } from './tabManifest';

test('root tab manifest exposes Home, Bible, Meditate, Prayer, and More in order', () => {
  assert.deepEqual(
    rootTabManifest.map((tab) => tab.name),
    ['Home', 'Bible', 'Meditate', 'Prayer', 'More']
  );
});

test('meditate and prayer tabs use their own localization keys', () => {
  const meditateTab = rootTabManifest.find((tab) => tab.name === 'Meditate');
  const prayerTab = rootTabManifest.find((tab) => tab.name === 'Prayer');

  assert.ok(meditateTab);
  assert.ok(prayerTab);
  assert.equal(meditateTab.labelKey, 'tabs.meditate');
  assert.equal(prayerTab.labelKey, 'tabs.prayer');
});
