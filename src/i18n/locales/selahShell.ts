export const selahShell = {
  common: {
    clear: 'Clear',
  },
  journey: {
    stepProgress: 'Step {{current}} of {{count}}',
    openOverview: 'Overview',
    openBible: 'Open in Bible',
    swipeHint: 'Swipe or tap the sides to move between steps.',
    chooseVoice: 'Choose voice',
    chooseAmbient: 'Choose ambient',
    voice: 'Voice',
  },
  tabs: {
    meditate: 'Meditate',
    prayer: 'Prayer',
  },
  meditate: {
    homeTitle: 'Meditate',
    subtitle: 'Slow down with scripture and listen closely.',
    collectionsTitle: 'Meditation collections',
    collectionBody: 'Listen slowly through a passage shaped around {{name}}.',
    journey: {
      title: 'Meditation Journey',
      subtitle: 'Slow down with scripture, one step at a time.',
      steps: {
        settle: {
          title: 'Settle in',
          body: 'Breathe slowly and let the passage meet you.',
        },
        listen: {
          title: 'Listen closely',
          body: 'Hear the chapter without rushing to the next thing.',
        },
        receive: {
          title: 'Hold one line',
          body: 'Choose one phrase to carry with you.',
        },
        rest: {
          title: 'Rest and keep it',
          body: 'Sit with what you heard before you move on.',
        },
      },
    },
    scriptureListening: 'Scripture Listening',
    psalms: 'Psalms',
    gospels: 'Gospels',
    nightWatch: 'Night Watch',
    memoryVerses: 'Memory Verses',
  },
  prayer: {
    homeTitle: 'Prayer',
    subtitle: 'Start with free prayer or choose a guided collection.',
    freePrayer: 'Free Prayer',
    freePrayerPlaceholder: 'Write your prayer here.',
    guidedCollections: 'Guided prayer collections',
    collectionBody: 'Pray through a curated collection shaped around {{name}}.',
    journey: {
      title: 'Prayer Journey',
      subtitle: 'Move from honesty to trust in four slow steps.',
      steps: {
        open: {
          title: 'Open honestly',
          body: 'Come honestly with what is already on your heart.',
        },
        ask: {
          title: 'Name the need',
          body: 'Bring the people, worries, and hopes you are carrying.',
        },
        trust: {
          title: 'Trust the answer',
          body: 'Leave space for God to answer beyond your plan.',
        },
        rest: {
          title: 'Rest in God',
          body: 'Finish with gratitude and one concrete next step.',
        },
      },
    },
    biblicalPrayers: 'Biblical Prayers',
    jesusPrayers: 'The Prayers of Jesus',
    apostolicPrayers: 'Apostolic Prayers',
    biblicalFigures: 'Biblical Figures',
    martyrs: 'Martyrs',
    missionaries: 'Missionaries',
    puritans: 'Puritans',
    catholics: 'Catholics',
    mystics: 'Mystics',
    heroesOfTheFaith: 'Heroes of the Faith',
  },
} as const;
