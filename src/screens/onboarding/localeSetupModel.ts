import type { UserPreferences } from '../../types';

export type SetupMode = 'initial' | 'settings';

export type SetupStep = 'interface' | 'account' | 'country' | 'contentLanguage' | 'privacy';

export function getLocaleSetupSteps(mode: SetupMode): SetupStep[] {
  if (mode === 'settings') {
    return ['country', 'contentLanguage'];
  }

  return ['account', 'privacy'];
}

export function getInitialEnglishOnboardingPreferences(): Pick<
  UserPreferences,
  | 'language'
  | 'countryCode'
  | 'countryName'
  | 'contentLanguageCode'
  | 'contentLanguageName'
  | 'contentLanguageNativeName'
  | 'onboardingCompleted'
> {
  return {
    language: 'en',
    countryCode: null,
    countryName: null,
    contentLanguageCode: 'en',
    contentLanguageName: 'English',
    contentLanguageNativeName: 'English',
    onboardingCompleted: true,
  };
}
