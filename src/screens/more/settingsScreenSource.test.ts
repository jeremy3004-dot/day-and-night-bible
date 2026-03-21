import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('SettingsScreen keeps the calculator disguise shortcut visible from More settings', () => {
  const source = readRelativeSource('./SettingsScreen.tsx');

  assert.equal(
    source.includes("navigation.navigate('PrivacyPreferences')"),
    true,
    'SettingsScreen should keep routing the disguise shortcut into PrivacyPreferences'
  );

  assert.equal(
    source.includes("name=\"calculator-outline\""),
    true,
    'SettingsScreen should use a calculator icon so the disguise setting is easy to spot'
  );

  assert.equal(
    source.includes("t('onboarding.discreetIconTitle')"),
    true,
    'SettingsScreen should mention the discreet calculator mode on the shortcut row'
  );

  assert.equal(
    source.includes("name=\"lock-closed-outline\""),
    false,
    'SettingsScreen should not hide the disguise shortcut behind a generic lock icon'
  );
});
