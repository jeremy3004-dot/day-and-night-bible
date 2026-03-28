import type { GuidedJourneyDefinition } from '../types';
import type { MeditationImageKey } from './meditationCollections';

type MeditationJourneyStepKey = MeditationImageKey;

export const meditationJourney: GuidedJourneyDefinition = {
  id: 'meditation-journey',
  kind: 'meditate',
  titleKey: 'meditate.journey.title',
  subtitleKey: 'meditate.journey.subtitle',
  coverImageKey: 'bible',
  defaultAmbient: 'ocean-waves',
  steps: [
    {
      id: 'settle',
      titleKey: 'meditate.journey.steps.settle.title',
      bodyKey: 'meditate.journey.steps.settle.body',
      imageKey: 'window' satisfies MeditationJourneyStepKey,
      scriptureReference: { bookId: 'PSA', chapter: 46, verse: 10 },
      ambientDefault: 'ocean-waves',
    },
    {
      id: 'listen',
      titleKey: 'meditate.journey.steps.listen.title',
      bodyKey: 'meditate.journey.steps.listen.body',
      imageKey: 'bible' satisfies MeditationJourneyStepKey,
      scriptureReference: { bookId: 'JHN', chapter: 15, verse: 4 },
      ambientDefault: 'soft-guitar',
    },
    {
      id: 'receive',
      titleKey: 'meditate.journey.steps.receive.title',
      bodyKey: 'meditate.journey.steps.receive.body',
      imageKey: 'candle' satisfies MeditationJourneyStepKey,
      scriptureReference: { bookId: 'ROM', chapter: 8, verse: 38 },
      ambientDefault: 'ambient',
    },
    {
      id: 'rest',
      titleKey: 'meditate.journey.steps.rest.title',
      bodyKey: 'meditate.journey.steps.rest.body',
      imageKey: 'candleAlt' satisfies MeditationJourneyStepKey,
      scriptureReference: { bookId: 'PSA', chapter: 23, verse: 1 },
      ambientDefault: 'piano',
    },
  ],
};

export const meditationJourneys = [meditationJourney] as const;

export function getMeditationJourneyById(journeyId?: string | null): GuidedJourneyDefinition {
  return meditationJourneys.find((journey) => journey.id === journeyId) ?? meditationJourney;
}
