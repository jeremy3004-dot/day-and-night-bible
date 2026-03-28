import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { TranslationKey } from '../i18n/types';
import type { ScriptureReference } from './scriptureReference';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type MeditationImageKey = 'bible' | 'window' | 'candle' | 'candleAlt';

export interface MeditationCollection {
  id: string;
  titleKey: TranslationKey;
  iconName: IconName;
  imageKey: MeditationImageKey;
  references: ScriptureReference[];
}

export const meditationCollections: MeditationCollection[] = [
  {
    id: 'scripture-listening',
    titleKey: 'meditate.scriptureListening',
    iconName: 'headset-outline',
    imageKey: 'bible',
    references: [
      { bookId: 'PSA', chapter: 23 },
      { bookId: 'JHN', chapter: 15 },
      { bookId: 'ROM', chapter: 8 },
    ],
  },
  {
    id: 'psalms',
    titleKey: 'meditate.psalms',
    iconName: 'musical-notes-outline',
    imageKey: 'window',
    references: [
      { bookId: 'PSA', chapter: 1 },
      { bookId: 'PSA', chapter: 27 },
      { bookId: 'PSA', chapter: 46 },
    ],
  },
  {
    id: 'gospels',
    titleKey: 'meditate.gospels',
    iconName: 'book-outline',
    imageKey: 'candle',
    references: [
      { bookId: 'MAT', chapter: 5 },
      { bookId: 'LUK', chapter: 15 },
      { bookId: 'JHN', chapter: 17 },
    ],
  },
  {
    id: 'night-watch',
    titleKey: 'meditate.nightWatch',
    iconName: 'moon-outline',
    imageKey: 'candleAlt',
    references: [
      { bookId: 'PSA', chapter: 4 },
      { bookId: 'PSA', chapter: 91 },
      { bookId: 'MAT', chapter: 11 },
    ],
  },
  {
    id: 'memory-verses',
    titleKey: 'meditate.memoryVerses',
    iconName: 'bookmark-outline',
    imageKey: 'bible',
    references: [
      { bookId: 'PRO', chapter: 3 },
      { bookId: 'PHP', chapter: 4 },
      { bookId: 'EPH', chapter: 6 },
    ],
  },
];

export function getMeditationCollection(collectionId: string): MeditationCollection | undefined {
  return meditationCollections.find((collection) => collection.id === collectionId);
}
