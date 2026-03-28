import test from 'node:test';
import assert from 'node:assert/strict';
import { getInitialEnglishOnboardingPreferences, getLocaleSetupSteps } from './localeSetupModel';

test('initial onboarding skips locale collection and keeps only account plus privacy setup', () => {
  assert.deepEqual(getLocaleSetupSteps('initial'), ['account', 'privacy']);
});

test('settings locale flow stays focused on nation and Bible language', () => {
  assert.deepEqual(getLocaleSetupSteps('settings'), ['country', 'contentLanguage']);
});

test('initial onboarding completes with fixed English defaults', () => {
  assert.deepEqual(getInitialEnglishOnboardingPreferences(), {
    language: 'en',
    countryCode: null,
    countryName: null,
    contentLanguageCode: 'en',
    contentLanguageName: 'English',
    contentLanguageNativeName: 'English',
    onboardingCompleted: true,
  });
});
