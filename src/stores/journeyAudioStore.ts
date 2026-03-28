import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BackgroundMusicChoice } from '../types';
import { BACKGROUND_MUSIC_CHOICES } from '../types/audio';
import { zustandStorage } from './mmkvStorage';

interface JourneyAudioState {
  ambientChoiceByJourneyId: Record<string, BackgroundMusicChoice>;
  setAmbientChoiceForJourney: (journeyId: string, choice: BackgroundMusicChoice) => void;
  clearAmbientChoiceForJourney: (journeyId: string) => void;
}

const validBackgroundMusicChoices = new Set<BackgroundMusicChoice>(BACKGROUND_MUSIC_CHOICES);

function sanitizeJourneyAudioState(
  value: unknown
): Pick<JourneyAudioState, 'ambientChoiceByJourneyId'> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { ambientChoiceByJourneyId: {} };
  }

  const record = value as Record<string, unknown>;
  const ambientChoiceByJourneyId: Record<string, BackgroundMusicChoice> = {};

  if (typeof record.ambientChoiceByJourneyId === 'object' && record.ambientChoiceByJourneyId !== null) {
    for (const [journeyId, choice] of Object.entries(record.ambientChoiceByJourneyId as Record<
      string,
      unknown
    >)) {
      if (
        typeof journeyId === 'string' &&
        journeyId.trim().length > 0 &&
        typeof choice === 'string' &&
        validBackgroundMusicChoices.has(choice as BackgroundMusicChoice)
      ) {
        ambientChoiceByJourneyId[journeyId] = choice as BackgroundMusicChoice;
      }
    }
  }

  return { ambientChoiceByJourneyId };
}

export const useJourneyAudioStore = create<JourneyAudioState>()(
  persist(
    (set) => ({
      ambientChoiceByJourneyId: {},
      setAmbientChoiceForJourney: (journeyId, choice) =>
        set((state) => ({
          ambientChoiceByJourneyId: {
            ...state.ambientChoiceByJourneyId,
            [journeyId]: choice,
          },
        })),
      clearAmbientChoiceForJourney: (journeyId) =>
        set((state) => {
          if (!state.ambientChoiceByJourneyId[journeyId]) {
            return state;
          }

          const nextAmbientChoiceByJourneyId = { ...state.ambientChoiceByJourneyId };
          delete nextAmbientChoiceByJourneyId[journeyId];

          return { ambientChoiceByJourneyId: nextAmbientChoiceByJourneyId };
        }),
    }),
    {
      name: 'journey-audio-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        ambientChoiceByJourneyId: state.ambientChoiceByJourneyId,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizeJourneyAudioState(persistedState),
      }),
    }
  )
);
