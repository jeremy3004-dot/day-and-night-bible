import type { TFunction } from 'i18next';
import { getTranslatedBookName } from '../../constants/books';
import type { GuidedJourneyDefinition, GuidedJourneyStep } from '../../types/journey';

export const JOURNEY_SWIPE_THRESHOLD = 44;
export const JOURNEY_SWIPE_VELOCITY_MIN = 650;

export function getJourneyStepProgressLabel(
  stepIndex: number,
  stepCount: number,
  t: TFunction
): string {
  return t('journey.stepProgress', {
    current: stepIndex + 1,
    count: stepCount,
  });
}

export function getJourneyStepReferenceLabel(reference: GuidedJourneyStep['scriptureReference'], t: TFunction): string {
  return `${getTranslatedBookName(reference.bookId, t)} ${reference.chapter}${
    reference.verse ? `:${reference.verse}` : ''
  }`;
}

export function getJourneyNextStepIndex(
  currentIndex: number,
  direction: -1 | 1,
  stepCount: number
): number {
  if (stepCount <= 0) {
    return 0;
  }

  const nextIndex = currentIndex + direction;
  return Math.max(0, Math.min(nextIndex, stepCount - 1));
}

export function getJourneySwipeDirection(
  translationX: number,
  velocityX: number
): -1 | 1 | null {
  const isNext = translationX < -JOURNEY_SWIPE_THRESHOLD || velocityX < -JOURNEY_SWIPE_VELOCITY_MIN;
  const isPrevious =
    translationX > JOURNEY_SWIPE_THRESHOLD || velocityX > JOURNEY_SWIPE_VELOCITY_MIN;

  if (isNext) {
    return 1;
  }

  if (isPrevious) {
    return -1;
  }

  return null;
}

export function getJourneyInitialStepIndex(
  journey: GuidedJourneyDefinition,
  requestedStepIndex?: number | null
): number {
  if (typeof requestedStepIndex !== 'number' || Number.isNaN(requestedStepIndex)) {
    return 0;
  }

  return Math.max(0, Math.min(requestedStepIndex, Math.max(journey.steps.length - 1, 0)));
}
