export interface TranslationSelectionState {
  isSelectable: boolean;
  reason: 'coming-soon' | 'audio-unavailable' | null;
}

interface TranslationSelectionOptions {
  isDownloaded: boolean;
  hasText: boolean;
  hasAudio: boolean;
  canPlayAudio: boolean;
}

export const isAudioOnlyTranslation = (translation: Pick<TranslationSelectionOptions, 'hasText' | 'hasAudio'>): boolean =>
  !translation.hasText && translation.hasAudio;

export const getTranslationSelectionState = ({
  isDownloaded,
  hasText,
  hasAudio,
  canPlayAudio,
}: TranslationSelectionOptions): TranslationSelectionState => {
  if (isDownloaded) {
    return { isSelectable: true, reason: null };
  }

  if (hasText) {
    return { isSelectable: false, reason: 'coming-soon' };
  }

  if (hasAudio) {
    return canPlayAudio
      ? { isSelectable: true, reason: null }
      : { isSelectable: false, reason: 'audio-unavailable' };
  }

  return { isSelectable: false, reason: 'coming-soon' };
};
