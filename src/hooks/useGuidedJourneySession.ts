import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioPlayer } from './useAudioPlayer';
import { config } from '../constants/config';
import { useBibleStore, useJourneyAudioStore, useAudioStore } from '../stores';
import {
  backgroundMusicPlayer,
  getAudioAvailability,
  getJourneyAmbientOptions,
  isRemoteAudioAvailable,
} from '../services/audio';
import { getJourneyDefaultAmbient } from '../services/audio';
import {
  getJourneyInitialStepIndex,
  getJourneyNextStepIndex,
  getJourneyStepReferenceLabel,
} from '../components/journey';
import type { GuidedJourneyDefinition, GuidedJourneyStep } from '../types';

interface UseGuidedJourneySessionOptions {
  journey: GuidedJourneyDefinition;
  translationId: string;
  initialStepIndex?: number | null;
}

export function useGuidedJourneySession({
  journey,
  translationId,
  initialStepIndex,
}: UseGuidedJourneySessionOptions) {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(() =>
    getJourneyInitialStepIndex(journey, initialStepIndex ?? 0)
  );
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);

  const currentTranslationInfo = useBibleStore((state) =>
    state.translations.find((translation) => translation.id === translationId)
  );
  const selectedAudioVoiceByTranslationId = useAudioStore(
    (state) => state.selectedAudioVoiceByTranslationId
  );
  const setSelectedAudioVoice = useAudioStore((state) => state.setSelectedAudioVoice);
  const ambientChoiceByJourneyId = useJourneyAudioStore(
    (state) => state.ambientChoiceByJourneyId
  );
  const setAmbientChoiceForJourney = useJourneyAudioStore(
    (state) => state.setAmbientChoiceForJourney
  );

  const currentStep: GuidedJourneyStep = journey.steps[stepIndex] ?? journey.steps[0];
  const voiceCatalog = currentTranslationInfo?.catalog?.audio?.voiceCatalog ?? null;
  const selectedVoiceId =
    selectedAudioVoiceByTranslationId[translationId] ?? voiceCatalog?.defaultVoiceId ?? null;
  const ambientChoice =
    ambientChoiceByJourneyId[journey.id] ??
    currentStep.ambientDefault ??
    journey.defaultAmbient ??
    getJourneyDefaultAmbient(journey.kind);
  const ambientOptions = useMemo(() => getJourneyAmbientOptions(journey.kind), [journey.kind]);
  const audioAvailability = useMemo(
    () =>
      currentTranslationInfo
        ? getAudioAvailability({
            featureEnabled: config.features.audioEnabled,
            translationHasAudio: currentTranslationInfo.hasAudio,
            remoteAudioAvailable: isRemoteAudioAvailable(translationId),
            downloadedAudioBooks: currentTranslationInfo.downloadedAudioBooks,
            bookId: currentStep.scriptureReference.bookId,
          })
        : null,
    [currentStep.scriptureReference.bookId, currentTranslationInfo, translationId]
  );

  const {
    status,
    currentTranslationId,
    currentBookId,
    currentChapter,
    currentPosition,
    duration,
    error,
    playChapter,
    pause,
    resume,
    stop,
  } = useAudioPlayer(translationId, {
    autoAdvanceChapter: false,
    syncBackgroundMusic: false,
  });

  const isCurrentStepTrack =
    currentTranslationId === translationId &&
    currentBookId === currentStep.scriptureReference.bookId &&
    currentChapter === currentStep.scriptureReference.chapter;

  const displayStatus = isCurrentStepTrack ? status : 'idle';
  const canPlayAudio = audioAvailability?.canPlayAudio ?? false;
  const isPlaying = displayStatus === 'playing';
  const hasPreviousStep = stepIndex > 0;
  const hasNextStep = stepIndex < journey.steps.length - 1;
  const stepProgress = `${stepIndex + 1}/${journey.steps.length}`;
  const stepReferenceLabel = getJourneyStepReferenceLabel(currentStep.scriptureReference, t);

  const playCurrentStep = useCallback(
    async (step: GuidedJourneyStep = currentStep) => {
      if (!canPlayAudio) {
        return;
      }

      await playChapter(
        step.scriptureReference.bookId,
        step.scriptureReference.chapter,
        step.scriptureReference.verse
      );
    },
    [canPlayAudio, currentStep, playChapter]
  );

  const stopPlayback = useCallback(async () => {
    await stop();
    await backgroundMusicPlayer.stop();
  }, [stop]);

  const advanceStep = useCallback(
    async (direction: -1 | 1) => {
      const nextIndex = getJourneyNextStepIndex(stepIndex, direction, journey.steps.length);
      if (nextIndex === stepIndex) {
        return;
      }

      const shouldAutoplay = isCurrentStepTrack && (displayStatus === 'playing' || displayStatus === 'loading');
      const nextStep = journey.steps[nextIndex];

      setTransitionDirection(direction);
      setStepIndex(nextIndex);

      if (shouldAutoplay && nextStep) {
        await playCurrentStep(nextStep);
      }
    },
    [displayStatus, isCurrentStepTrack, journey.steps, playCurrentStep, stepIndex]
  );

  const goPrevious = useCallback(async () => {
    if (!hasPreviousStep) {
      return;
    }

    await advanceStep(-1);
  }, [advanceStep, hasPreviousStep]);

  const goNext = useCallback(async () => {
    if (!hasNextStep) {
      return;
    }

    await advanceStep(1);
  }, [advanceStep, hasNextStep]);

  const selectVoice = useCallback(
    (voiceId: string) => {
      setSelectedAudioVoice(translationId, voiceId);

      if (!isCurrentStepTrack || displayStatus !== 'playing') {
        return;
      }

      void playCurrentStep();
    },
    [displayStatus, isCurrentStepTrack, playCurrentStep, setSelectedAudioVoice, translationId]
  );

  const selectAmbient = useCallback(
    (choice: typeof ambientChoice) => {
      setAmbientChoiceForJourney(journey.id, choice);
    },
    [journey.id, setAmbientChoiceForJourney]
  );

  const togglePlayback = useCallback(async () => {
    if (!canPlayAudio) {
      return;
    }

    if (!isCurrentStepTrack) {
      await playCurrentStep();
      return;
    }

    if (displayStatus === 'paused') {
      await resume();
      return;
    }

    if (displayStatus === 'playing' || displayStatus === 'loading') {
      await pause();
      return;
    }

    await playCurrentStep();
  }, [canPlayAudio, displayStatus, isCurrentStepTrack, pause, playCurrentStep, resume]);

  useEffect(() => {
    setStepIndex(getJourneyInitialStepIndex(journey, initialStepIndex ?? 0));
    setTransitionDirection(1);
    void stopPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journey.id, initialStepIndex]);

  useEffect(() => {
    const shouldPlayAmbient = displayStatus === 'playing' || displayStatus === 'loading';
    void backgroundMusicPlayer.sync(ambientChoice, shouldPlayAmbient);
  }, [ambientChoice, displayStatus]);

  useEffect(() => {
    return () => {
      void backgroundMusicPlayer.stop();
    };
  }, []);

  return {
    stepIndex,
    stepCount: journey.steps.length,
    stepId: currentStep.id,
    currentStep,
    transitionDirection,
    displayStatus,
    canPlayAudio,
    isPlaying,
    hasPreviousStep,
    hasNextStep,
    stepProgress,
    stepReferenceLabel,
    voiceCatalog,
    selectedVoiceId,
    ambientChoice,
    ambientOptions,
    title: t(journey.titleKey),
    subtitle: t(journey.subtitleKey),
    isAudioAvailable: canPlayAudio,
    currentPosition,
    duration,
    error,
    playCurrentStep,
    togglePlayback,
    goPrevious,
    goNext,
    selectVoice,
    selectAmbient,
  };
}
