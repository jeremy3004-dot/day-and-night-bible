import type { TranslationKey } from '../i18n/types';
import type { BackgroundMusicChoice } from './audio';
import type { ScriptureReference } from '../data/scriptureReference';

export type GuidedJourneyKind = 'meditate' | 'prayer';

export interface GuidedJourneyStep {
  id: string;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  imageKey: string;
  scriptureReference: ScriptureReference;
  ambientDefault: BackgroundMusicChoice;
  scriptureLabelKey?: TranslationKey;
  ctaLabelKey?: TranslationKey;
}

export interface GuidedJourneyDefinition {
  id: string;
  kind: GuidedJourneyKind;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  coverImageKey: string;
  defaultAmbient: BackgroundMusicChoice;
  steps: GuidedJourneyStep[];
}
