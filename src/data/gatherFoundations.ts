import type { GatherFoundation } from '../types/gather';

// Standardized fellowship questions — same for every foundation lesson (Discovery Bible Study pattern)
export const FELLOWSHIP_QUESTIONS: string[] = [
  'Based on what has happened with you since the last time we met, what is something you are thankful for?',
  'What has stressed you out this week, and what do you need for things to be better?',
  'What are the needs of the people in your community, and how can we help each other meet the needs we\'ve expressed?',
  'Now, let\'s read today\'s story from God...',
];

// Standardized application questions — same for every foundation lesson (Discovery Bible Study pattern)
export const APPLICATION_QUESTIONS: string[] = [
  'Now, let\'s have someone retell this passage in their own words, as though they were telling a friend who has never heard it. Let\'s help them if they leave anything out or add anything by mistake. If that happens we can ask, "Where do you find that in the story?"',
  'What does this story teach us about God, his character, and what he does?',
  'What do we learn about people, including ourselves, from this story?',
  'How will you apply God\'s truth from this story in your life this week? What is a specific action or thing you will do?',
  'Who will you share a truth from this story with before we meet again? Do you know others who would also like to discover God\'s word in this app like we are?',
  'As our meeting comes to a close, let\'s decide when we will meet again and who will facilitate our next meeting.',
  'We encourage you to make note of what you said you will do, and to re-read this story in the days before we meet again. The facilitator can share the story text or audio if anyone doesn\'t have it. As we go, let\'s ask the Lord to help us.',
];

export const gatherFoundations: GatherFoundation[] = [
  {
    id: 'foundation-1',
    number: 1,
    title: 'From Creation to the Birth of Jesus',
    description:
      'Journey through the foundational stories of Scripture, from the creation of the world to the birth of Jesus Christ. These 14 stories trace God\'s plan of redemption through the Old Testament and into the New.',
    iconName: 'earth-outline',
    lessons: [
      {
        id: 'f1-01',
        number: 1,
        title: 'Creation',
        referenceLabel: 'Genesis 1:1-25',
        references: [{ bookId: 'GEN', chapter: 1, startVerse: 1, endVerse: 25 }],
      },
      {
        id: 'f1-02',
        number: 2,
        title: 'Creation of Humans',
        referenceLabel: 'Genesis 1:26-27, 2:7-9, 2:15-25',
        references: [
          { bookId: 'GEN', chapter: 1, startVerse: 26, endVerse: 27 },
          { bookId: 'GEN', chapter: 2, startVerse: 7, endVerse: 9 },
          { bookId: 'GEN', chapter: 2, startVerse: 15, endVerse: 25 },
        ],
      },
      {
        id: 'f1-03',
        number: 3,
        title: 'Humans Disobey God',
        referenceLabel: 'Genesis 3:1-24',
        references: [{ bookId: 'GEN', chapter: 3, startVerse: 1, endVerse: 24 }],
      },
      {
        id: 'f1-04',
        number: 4,
        title: 'God Destroys an Evil Humanity',
        referenceLabel: 'Genesis 6:5-6, 6:9-22, 7:17-24',
        references: [
          { bookId: 'GEN', chapter: 6, startVerse: 5, endVerse: 6 },
          { bookId: 'GEN', chapter: 6, startVerse: 9, endVerse: 22 },
          { bookId: 'GEN', chapter: 7, startVerse: 17, endVerse: 24 },
        ],
      },
      {
        id: 'f1-05',
        number: 5,
        title: 'Tower of Babel',
        referenceLabel: 'Genesis 11:1-9',
        references: [{ bookId: 'GEN', chapter: 11, startVerse: 1, endVerse: 9 }],
      },
      {
        id: 'f1-06',
        number: 6,
        title: 'Abraham Trusted God',
        referenceLabel: 'Genesis 12:1-7, 15:1-6',
        references: [
          { bookId: 'GEN', chapter: 12, startVerse: 1, endVerse: 7 },
          { bookId: 'GEN', chapter: 15, startVerse: 1, endVerse: 6 },
        ],
      },
      {
        id: 'f1-07',
        number: 7,
        title: 'Abraham Obeyed God',
        referenceLabel: 'Genesis 22:1-19',
        references: [{ bookId: 'GEN', chapter: 22, startVerse: 1, endVerse: 19 }],
      },
      {
        id: 'f1-08',
        number: 8,
        title: "God's Call to Moses",
        referenceLabel: 'Exodus 2:23-3:14, 7:1-5',
        references: [
          // Exodus 2:23-3:14 spans two chapters — split into two references
          { bookId: 'EXO', chapter: 2, startVerse: 23 },
          { bookId: 'EXO', chapter: 3, startVerse: 1, endVerse: 14 },
          { bookId: 'EXO', chapter: 7, startVerse: 1, endVerse: 5 },
        ],
      },
      {
        id: 'f1-09',
        number: 9,
        title: 'The Passover Sacrifice',
        referenceLabel: 'Exodus 12:1-3, 12:21-31, 12:40-42',
        references: [
          { bookId: 'EXO', chapter: 12, startVerse: 1, endVerse: 3 },
          { bookId: 'EXO', chapter: 12, startVerse: 21, endVerse: 31 },
          { bookId: 'EXO', chapter: 12, startVerse: 40, endVerse: 42 },
        ],
      },
      {
        id: 'f1-10',
        number: 10,
        title: 'The Ten Commandments and Sacrifice',
        referenceLabel: 'Exodus 20:1-17, Leviticus 6:1-7',
        references: [
          { bookId: 'EXO', chapter: 20, startVerse: 1, endVerse: 17 },
          { bookId: 'LEV', chapter: 6, startVerse: 1, endVerse: 7 },
        ],
      },
      {
        id: 'f1-11',
        number: 11,
        title: 'Cycle of Disobedience',
        referenceLabel: 'Judges 2:10-23',
        references: [{ bookId: 'JDG', chapter: 2, startVerse: 10, endVerse: 23 }],
      },
      {
        id: 'f1-12',
        number: 12,
        title: 'The Suffering Servant of God',
        referenceLabel: 'Isaiah 52:13-53:12',
        references: [
          // Isaiah 52:13-53:12 spans two chapters — split into two references
          { bookId: 'ISA', chapter: 52, startVerse: 13 },
          { bookId: 'ISA', chapter: 53, startVerse: 1, endVerse: 12 },
        ],
      },
      {
        id: 'f1-13',
        number: 13,
        title: 'The Promised Saviour',
        referenceLabel: 'Isaiah 9:1-7, Luke 1:26-38',
        references: [
          { bookId: 'ISA', chapter: 9, startVerse: 1, endVerse: 7 },
          { bookId: 'LUK', chapter: 1, startVerse: 26, endVerse: 38 },
        ],
      },
      {
        id: 'f1-14',
        number: 14,
        title: 'The Birth of Jesus',
        referenceLabel: 'Luke 2:1-20',
        references: [{ bookId: 'LUK', chapter: 2, startVerse: 1, endVerse: 20 }],
      },
    ],
  },
  {
    id: 'foundation-2',
    number: 2,
    title: 'The Life and Message of Jesus',
    description:
      'Explore the earthly ministry of Jesus — his teachings, miracles, and the message of the Kingdom of God.',
    iconName: 'person-outline',
    lessons: [],
  },
  {
    id: 'foundation-3',
    number: 3,
    title: 'Invitation of Jesus',
    description:
      'Discover how Jesus calls people to follow him and what it means to respond to his invitation.',
    iconName: 'hand-right-outline',
    lessons: [],
  },
  {
    id: 'foundation-4',
    number: 4,
    title: 'Being Disciples',
    description:
      'Learn what it means to be a disciple of Jesus — growing in faith, obedience, and relationship with God.',
    iconName: 'footsteps-outline',
    lessons: [],
  },
  {
    id: 'foundation-5',
    number: 5,
    title: 'Being a Jesus Community',
    description:
      'Understand how followers of Jesus live and grow together as a community centered on his teaching.',
    iconName: 'people-outline',
    lessons: [],
  },
  {
    id: 'foundation-6',
    number: 6,
    title: 'Being Leaders',
    description:
      'Explore the character and calling of servant leadership as modeled by Jesus and the early church.',
    iconName: 'flag-outline',
    lessons: [],
  },
  {
    id: 'foundation-7',
    number: 7,
    title: 'Growing as Disciples',
    description:
      'Go deeper in your journey of discipleship — spiritual disciplines, perseverance, and bearing fruit.',
    iconName: 'trending-up-outline',
    lessons: [],
  },
  {
    id: 'foundation-8',
    number: 8,
    title: 'Growing as a Jesus Community',
    description:
      'Discover how Jesus communities mature, multiply, and extend God\'s kingdom in their context.',
    iconName: 'heart-outline',
    lessons: [],
  },
  {
    id: 'foundation-9',
    number: 9,
    title: 'Growing as Leaders',
    description:
      'Equip and empower emerging leaders to multiply disciples and healthy Jesus communities.',
    iconName: 'star-outline',
    lessons: [],
  },
];
