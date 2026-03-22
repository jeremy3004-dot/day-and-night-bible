import type { BibleBook, Testament } from '../../constants/books';

export type BibleBrowserRow =
  | {
      type: 'books';
      id: string;
      books: BibleBook[];
    }
  | {
      type: 'divider';
      id: string;
      testament: Testament;
    };

const flatBooks = (books: BibleBook[]): BibleBrowserRow[] =>
  books.map((book) => ({
    type: 'books',
    id: `book-${book.id}`,
    books: [book],
  }));

export const buildBibleBrowserRows = (books: BibleBook[]): BibleBrowserRow[] => {
  const oldTestamentBooks = books.filter((book) => book.testament === 'OT');
  const newTestamentBooks = books.filter((book) => book.testament === 'NT');

  return [
    ...flatBooks(oldTestamentBooks),
    {
      type: 'divider',
      id: 'divider-NT',
      testament: 'NT',
    },
    ...flatBooks(newTestamentBooks),
  ];
};
