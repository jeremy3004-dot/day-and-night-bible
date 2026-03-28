import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function readRelativeSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url).href), 'utf8');
}

test('initial locale setup can finish without country and language selections', () => {
  const source = readRelativeSource('./LocaleSetupFlow.tsx');

  assert.match(
    source,
    /if\s*\(\s*mode\s*===\s*'settings'\s*\)\s*\{\s*if\s*\(\s*!selectedCountry\s*\|\|\s*!selectedLanguage\s*\)\s*\{\s*return;/s,
    'LocaleSetupFlow should only require explicit country and content language selections in settings mode'
  );
});

test('initial locale setup applies fixed English defaults', () => {
  const source = readRelativeSource('./LocaleSetupFlow.tsx');

  assert.match(
    source,
    /getInitialEnglishOnboardingPreferences/,
    'LocaleSetupFlow should use the shared English onboarding defaults for the initial signup flow'
  );
});
