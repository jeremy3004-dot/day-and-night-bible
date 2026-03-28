import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { TranslationKey } from '../i18n/types';
import type { ScriptureReference } from './scriptureReference';

type IconName = ComponentProps<typeof Ionicons>['name'];
export type PrayerImageKey =
  | 'freePrayer'
  | 'biblicalPrayers'
  | 'jesusPrayers'
  | 'apostolicPrayers'
  | 'biblicalFigures'
  | 'martyrs'
  | 'missionaries'
  | 'puritans'
  | 'catholics'
  | 'mystics'
  | 'heroesOfTheFaith';

export interface PrayerCollection {
  id: string;
  titleKey: TranslationKey;
  iconName: IconName;
  kind: 'free' | 'guided';
  imageKey: PrayerImageKey;
  references: ScriptureReference[];
}

export const prayerCollections: PrayerCollection[] = [
  {
    id: 'free-prayer',
    titleKey: 'prayer.freePrayer',
    iconName: 'create-outline',
    kind: 'free',
    imageKey: 'freePrayer',
    references: [],
  },
  {
    id: 'biblical-prayers',
    titleKey: 'prayer.biblicalPrayers',
    iconName: 'book-outline',
    kind: 'guided',
    imageKey: 'biblicalPrayers',
    references: [
      { bookId: '1KI', chapter: 8 },
      { bookId: 'DAN', chapter: 9 },
      { bookId: 'NEH', chapter: 1 },
    ],
  },
  {
    id: 'jesus-prayers',
    titleKey: 'prayer.jesusPrayers',
    iconName: 'heart-outline',
    kind: 'guided',
    imageKey: 'jesusPrayers',
    references: [
      { bookId: 'MAT', chapter: 6 },
      { bookId: 'JHN', chapter: 17 },
      { bookId: 'LUK', chapter: 22 },
    ],
  },
  {
    id: 'apostolic-prayers',
    titleKey: 'prayer.apostolicPrayers',
    iconName: 'send-outline',
    kind: 'guided',
    imageKey: 'apostolicPrayers',
    references: [
      { bookId: 'ACT', chapter: 4 },
      { bookId: 'EPH', chapter: 1 },
      { bookId: 'COL', chapter: 1 },
    ],
  },
  {
    id: 'biblical-figures',
    titleKey: 'prayer.biblicalFigures',
    iconName: 'person-outline',
    kind: 'guided',
    imageKey: 'biblicalFigures',
    references: [
      { bookId: 'GEN', chapter: 24 },
      { bookId: 'EXO', chapter: 33 },
      { bookId: 'LUK', chapter: 1 },
    ],
  },
  {
    id: 'martyrs',
    titleKey: 'prayer.martyrs',
    iconName: 'flame-outline',
    kind: 'guided',
    imageKey: 'martyrs',
    references: [
      { bookId: 'ACT', chapter: 7 },
      { bookId: 'REV', chapter: 6 },
      { bookId: 'HEB', chapter: 11 },
    ],
  },
  {
    id: 'missionaries',
    titleKey: 'prayer.missionaries',
    iconName: 'earth-outline',
    kind: 'guided',
    imageKey: 'missionaries',
    references: [
      { bookId: 'ACT', chapter: 13 },
      { bookId: 'ACT', chapter: 16 },
      { bookId: 'ROM', chapter: 15 },
    ],
  },
  {
    id: 'puritans',
    titleKey: 'prayer.puritans',
    iconName: 'leaf-outline',
    kind: 'guided',
    imageKey: 'puritans',
    references: [
      { bookId: 'PSA', chapter: 42 },
      { bookId: 'MAT', chapter: 11 },
      { bookId: '1PE', chapter: 1 },
    ],
  },
  {
    id: 'catholics',
    titleKey: 'prayer.catholics',
    iconName: 'star-outline',
    kind: 'guided',
    imageKey: 'catholics',
    references: [
      { bookId: 'LUK', chapter: 1 },
      { bookId: 'JHN', chapter: 2 },
      { bookId: 'REV', chapter: 12 },
    ],
  },
  {
    id: 'mystics',
    titleKey: 'prayer.mystics',
    iconName: 'moon-outline',
    kind: 'guided',
    imageKey: 'mystics',
    references: [
      { bookId: 'PSA', chapter: 63 },
      { bookId: 'ISA', chapter: 26 },
      { bookId: 'PHP', chapter: 4 },
    ],
  },
  {
    id: 'heroes-of-the-faith',
    titleKey: 'prayer.heroesOfTheFaith',
    iconName: 'trophy-outline',
    kind: 'guided',
    imageKey: 'heroesOfTheFaith',
    references: [
      { bookId: 'HEB', chapter: 12 },
      { bookId: 'JAS', chapter: 5 },
      { bookId: '2TI', chapter: 4 },
    ],
  },
];

export function getPrayerCollection(collectionId: string): PrayerCollection | undefined {
  return prayerCollections.find((collection) => collection.id === collectionId);
}
