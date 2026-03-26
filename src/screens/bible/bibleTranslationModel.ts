export interface TranslationSelectionState {
  isSelectable: boolean;
  reason: 'coming-soon' | 'audio-unavailable' | null;
}

interface TranslationSelectionOptions {
  isDownloaded: boolean;
  hasText: boolean;
  hasAudio: boolean;
  canPlayAudio: boolean;
  source?: 'bundled' | 'runtime';
  textPackLocalPath?: string | null;
}

export const isAudioOnlyTranslation = (translation: Pick<TranslationSelectionOptions, 'hasText' | 'hasAudio'>): boolean =>
  !translation.hasText && translation.hasAudio;

export const isTranslationReadableLocally = ({
  isDownloaded,
  hasText,
  source,
  textPackLocalPath,
}: Pick<TranslationSelectionOptions, 'isDownloaded' | 'hasText' | 'source' | 'textPackLocalPath'>): boolean => {
  if (isDownloaded) {
    return true;
  }

  if (!hasText) {
    return false;
  }

  return source !== 'runtime' || Boolean(textPackLocalPath);
};

export const getTranslationSelectionState = ({
  isDownloaded,
  hasText,
  hasAudio,
  canPlayAudio,
  source,
  textPackLocalPath,
}: TranslationSelectionOptions): TranslationSelectionState => {
  if (
    isTranslationReadableLocally({
      isDownloaded,
      hasText,
      source,
      textPackLocalPath,
    })
  ) {
    return { isSelectable: true, reason: null };
  }

  if (hasAudio) {
    return canPlayAudio
      ? { isSelectable: true, reason: null }
      : { isSelectable: false, reason: 'audio-unavailable' };
  }

  return { isSelectable: false, reason: 'coming-soon' };
};
