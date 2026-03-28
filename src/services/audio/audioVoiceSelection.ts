const selectedAudioVoiceByTranslationId = new Map<string, string>();

function normalizeTranslationId(translationId: string): string {
  return translationId.trim().toLowerCase();
}

function normalizeVoiceId(voiceId: string): string {
  return voiceId.trim().toLowerCase();
}

export function syncSelectedAudioVoiceSelection(
  selection: Record<string, string> | null | undefined
): void {
  selectedAudioVoiceByTranslationId.clear();

  if (!selection) {
    return;
  }

  for (const [translationId, voiceId] of Object.entries(selection)) {
    const normalizedTranslationId = normalizeTranslationId(translationId);
    const normalizedVoiceId = normalizeVoiceId(voiceId);

    if (!normalizedTranslationId || !normalizedVoiceId) {
      continue;
    }

    selectedAudioVoiceByTranslationId.set(normalizedTranslationId, normalizedVoiceId);
  }
}

export function setSelectedAudioVoiceForTranslation(
  translationId: string,
  voiceId: string | null | undefined
): void {
  const normalizedTranslationId = normalizeTranslationId(translationId);
  if (!normalizedTranslationId) {
    return;
  }

  if (!voiceId) {
    selectedAudioVoiceByTranslationId.delete(normalizedTranslationId);
    return;
  }

  selectedAudioVoiceByTranslationId.set(normalizedTranslationId, normalizeVoiceId(voiceId));
}

export function getSelectedAudioVoiceId(translationId: string): string | undefined {
  return selectedAudioVoiceByTranslationId.get(normalizeTranslationId(translationId));
}

export function clearSelectedAudioVoiceSelection(): void {
  selectedAudioVoiceByTranslationId.clear();
}
