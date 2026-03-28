import type { GuidedJourneyDefinition } from '../types';
import type { PrayerImageKey } from './prayerCollections';

type PrayerJourneyStepKey = PrayerImageKey;

export const prayerJourney: GuidedJourneyDefinition = {
  id: 'prayer-journey',
  kind: 'prayer',
  titleKey: 'prayer.journey.title',
  subtitleKey: 'prayer.journey.subtitle',
  coverImageKey: 'freePrayer',
  defaultAmbient: 'piano',
  steps: [
    {
      id: 'open',
      titleKey: 'prayer.journey.steps.open.title',
      bodyKey: 'prayer.journey.steps.open.body',
      imageKey: 'freePrayer' satisfies PrayerJourneyStepKey,
      scriptureReference: { bookId: 'MAT', chapter: 6, verse: 9 },
      ambientDefault: 'piano',
    },
    {
      id: 'ask',
      titleKey: 'prayer.journey.steps.ask.title',
      bodyKey: 'prayer.journey.steps.ask.body',
      imageKey: 'biblicalPrayers' satisfies PrayerJourneyStepKey,
      scriptureReference: { bookId: 'PHP', chapter: 4, verse: 6 },
      ambientDefault: 'ambient',
    },
    {
      id: 'trust',
      titleKey: 'prayer.journey.steps.trust.title',
      bodyKey: 'prayer.journey.steps.trust.body',
      imageKey: 'jesusPrayers' satisfies PrayerJourneyStepKey,
      scriptureReference: { bookId: 'EPH', chapter: 3, verse: 20 },
      ambientDefault: 'soft-guitar',
    },
    {
      id: 'rest',
      titleKey: 'prayer.journey.steps.rest.title',
      bodyKey: 'prayer.journey.steps.rest.body',
      imageKey: 'apostolicPrayers' satisfies PrayerJourneyStepKey,
      scriptureReference: { bookId: 'PSA', chapter: 63, verse: 1 },
      ambientDefault: 'sitar',
    },
  ],
};

export const prayerJourneys = [prayerJourney] as const;

export function getPrayerJourneyById(journeyId?: string | null): GuidedJourneyDefinition {
  return prayerJourneys.find((journey) => journey.id === journeyId) ?? prayerJourney;
}
