export type FontSizeSheetAction =
  | 'toggleButton'
  | 'readerContentTap'
  | 'scrollStart'
  | 'chapterChange';

export type TranslationSheetAction = 'toggleChip' | 'selectTranslation' | 'dismiss';

export interface PlaylistChapterTarget {
  bookId: string;
  chapter: number;
}

export interface PlaylistNavigationTargets {
  hasPlaylistContext: boolean;
  previousTarget: PlaylistChapterTarget | null;
  nextTarget: PlaylistChapterTarget | null;
}

export const getNextFontSizeSheetVisibility = (
  isVisible: boolean,
  action: FontSizeSheetAction
): boolean => {
  if (action === 'toggleButton') {
    return !isVisible;
  }

  return false;
};

export const getNextTranslationSheetVisibility = (
  isVisible: boolean,
  canShowTranslationSheet: boolean,
  action: TranslationSheetAction
): boolean => {
  if (!canShowTranslationSheet) {
    return false;
  }

  if (action === 'toggleChip') {
    return !isVisible;
  }

  return false;
};

export const getPlaylistNavigationTargets = (
  playlist: PlaylistChapterTarget[] | null | undefined,
  currentBookId: string,
  currentChapter: number
): PlaylistNavigationTargets => {
  if (!playlist?.length) {
    return {
      hasPlaylistContext: false,
      previousTarget: null,
      nextTarget: null,
    };
  }

  const currentIndex = playlist.findIndex(
    (entry) => entry.bookId === currentBookId && entry.chapter === currentChapter
  );

  if (currentIndex < 0) {
    return {
      hasPlaylistContext: false,
      previousTarget: null,
      nextTarget: null,
    };
  }

  return {
    hasPlaylistContext: true,
    previousTarget: currentIndex > 0 ? playlist[currentIndex - 1] : null,
    nextTarget: currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null,
  };
};
