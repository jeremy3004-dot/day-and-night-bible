import type { AudioPlaybackSequenceEntry } from '../types';

export function hasAudioPlaybackSequenceEntry(
  entries: AudioPlaybackSequenceEntry[],
  bookId: string,
  chapter: number
): boolean {
  return entries.some((entry) => entry.bookId === bookId && entry.chapter === chapter);
}

export function getAdjacentAudioPlaybackSequenceEntry(
  entries: AudioPlaybackSequenceEntry[],
  bookId: string,
  chapter: number,
  step: -1 | 1
): AudioPlaybackSequenceEntry | null {
  const currentIndex = entries.findIndex(
    (entry) => entry.bookId === bookId && entry.chapter === chapter
  );

  if (currentIndex < 0) {
    return null;
  }

  return entries[currentIndex + step] ?? null;
}
