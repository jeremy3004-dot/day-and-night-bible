import type { GatherTopicCategory } from '../types/gather';

// Topic categories organized by theme.
// Lessons are deferred per CONTEXT.md — each topic has a declared lessonCount but empty lessons array.
// Future plans will populate lesson content for each topic.
export const gatherTopicCategories: GatherTopicCategory[] = [
  {
    id: 'category-truth',
    name: 'Truth',
    topics: [
      { id: 'topic-courage', title: 'Courage', iconName: 'shield-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-faith', title: 'Faith', iconName: 'flame-outline', lessonCount: 9, lessons: [] },
      { id: 'topic-hope', title: 'Hope', iconName: 'sunny-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-justice', title: 'Justice', iconName: 'scales-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-love', title: 'Love', iconName: 'heart-outline', lessonCount: 8, lessons: [] },
      {
        id: 'topic-obedience',
        title: 'Obedience',
        iconName: 'checkmark-circle-outline',
        lessonCount: 8,
        lessons: [],
      },
    ],
  },
  {
    id: 'category-challenge',
    name: 'Challenge',
    topics: [
      { id: 'topic-anger', title: 'Anger', iconName: 'flash-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-crisis', title: 'Crisis', iconName: 'thunderstorm-outline', lessonCount: 7, lessons: [] },
      { id: 'topic-grief', title: 'Grief', iconName: 'sad-outline', lessonCount: 7, lessons: [] },
      { id: 'topic-hurt', title: 'Hurt', iconName: 'bandage-outline', lessonCount: 8, lessons: [] },
      {
        id: 'topic-reconciliation',
        title: 'Reconciliation',
        iconName: 'git-merge-outline',
        lessonCount: 8,
        lessons: [],
      },
      {
        id: 'topic-self-esteem',
        title: 'Self Esteem',
        iconName: 'happy-outline',
        lessonCount: 8,
        lessons: [],
      },
      { id: 'topic-stress', title: 'Stress', iconName: 'pulse-outline', lessonCount: 8, lessons: [] },
    ],
  },
  {
    id: 'category-money',
    name: 'Money',
    topics: [
      {
        id: 'topic-money-and-god',
        title: 'Money and God',
        iconName: 'cash-outline',
        lessonCount: 8,
        lessons: [],
      },
      {
        id: 'topic-money-advice',
        title: 'Money Advice',
        iconName: 'bulb-outline',
        lessonCount: 10,
        lessons: [],
      },
      { id: 'topic-giving', title: 'Giving', iconName: 'gift-outline', lessonCount: 9, lessons: [] },
      {
        id: 'topic-marketplace',
        title: 'Marketplace',
        iconName: 'storefront-outline',
        lessonCount: 8,
        lessons: [],
      },
    ],
  },
  {
    id: 'category-people',
    name: 'People',
    topics: [
      { id: 'topic-marriage', title: 'Marriage', iconName: 'ring-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-men', title: 'Men', iconName: 'man-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-parenting', title: 'Parenting', iconName: 'school-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-singles', title: 'Singles', iconName: 'person-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-women', title: 'Women', iconName: 'woman-outline', lessonCount: 8, lessons: [] },
      { id: 'topic-youth', title: 'Youth', iconName: 'fitness-outline', lessonCount: 8, lessons: [] },
    ],
  },
  {
    id: 'category-god',
    name: 'God',
    topics: [
      {
        id: 'topic-character-of-god',
        title: 'Character of God',
        iconName: 'ribbon-outline',
        lessonCount: 8,
        lessons: [],
      },
      {
        id: 'topic-promises-of-god',
        title: 'Promises of God',
        iconName: 'sparkles-outline',
        lessonCount: 8,
        lessons: [],
      },
      {
        id: 'topic-names-of-god',
        title: 'Names of God',
        iconName: 'bookmark-outline',
        lessonCount: 8,
        lessons: [],
      },
    ],
  },
];
