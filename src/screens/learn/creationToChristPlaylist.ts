export interface CreationToChristPlaylistEntry {
  bookId: string;
  chapter: number;
  title: string;
  summary: string;
}

export const creationToChristPlaylistId = 'creationToChrist' as const;

export const creationToChristPlaylist: CreationToChristPlaylistEntry[] = [
  {
    bookId: 'GEN',
    chapter: 1,
    title: 'Creation and Calling',
    summary: 'God creates a good world and calls humans to reflect His rule.',
  },
  {
    bookId: 'GEN',
    chapter: 3,
    title: 'Rebellion and Exile',
    summary: 'Sin fractures humanity’s relationship with God and creation.',
  },
  {
    bookId: 'GEN',
    chapter: 12,
    title: 'Promise for the Nations',
    summary: 'God begins His rescue plan through Abraham’s family.',
  },
  {
    bookId: 'GEN',
    chapter: 22,
    title: 'God Provides the Substitute',
    summary: 'A story of trust, sacrifice, and God’s gracious provision.',
  },
  {
    bookId: 'EXO',
    chapter: 12,
    title: 'Passover and Deliverance',
    summary: 'God redeems His people through the blood of the Passover lamb.',
  },
  {
    bookId: 'EXO',
    chapter: 19,
    title: 'A Covenant People',
    summary: 'Israel is called to be a holy nation representing God.',
  },
  {
    bookId: '2SA',
    chapter: 7,
    title: 'Promise of the Forever King',
    summary: 'God promises David an everlasting kingdom through his line.',
  },
  {
    bookId: 'ISA',
    chapter: 53,
    title: 'The Suffering Servant',
    summary: 'The coming Servant bears sin and brings healing.',
  },
  {
    bookId: 'LUK',
    chapter: 1,
    title: 'Promise Reawakened',
    summary: 'God’s long-awaited salvation story moves into fulfillment.',
  },
  {
    bookId: 'LUK',
    chapter: 2,
    title: 'The King Is Born',
    summary: 'Jesus is born as Savior, Christ, and Lord.',
  },
  {
    bookId: 'LUK',
    chapter: 22,
    title: 'The New Covenant Meal',
    summary: 'Jesus interprets His death as covenant redemption.',
  },
  {
    bookId: 'LUK',
    chapter: 23,
    title: 'The Crucified King',
    summary: 'Jesus gives His life for the world.',
  },
  {
    bookId: 'LUK',
    chapter: 24,
    title: 'The Risen Messiah',
    summary: 'The resurrection confirms hope and the mission.',
  },
];
