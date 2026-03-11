export type HomePrimaryAction = 'continue-reading' | 'continue-journey' | 'play-daily-audio';
export type HomeMomentumMetric = 'streak' | 'week' | 'journey';

export function resolveHomePrimaryAction({
  chaptersToday,
  hasNextLesson,
  canPlayDailyAudio,
}: {
  chaptersToday: number;
  hasNextLesson: boolean;
  canPlayDailyAudio: boolean;
}): HomePrimaryAction {
  if (chaptersToday === 0 && hasNextLesson) {
    return 'continue-journey';
  }

  if (chaptersToday === 0 && canPlayDailyAudio) {
    return 'play-daily-audio';
  }

  return 'continue-reading';
}

export function resolveHomeMomentumMetric({
  streakDays,
  weekCount,
  completedLessons,
}: {
  streakDays: number;
  weekCount: number;
  completedLessons: number;
}): HomeMomentumMetric {
  if (streakDays > 0) {
    return 'streak';
  }

  if (weekCount > 0) {
    return 'week';
  }

  return completedLessons > 0 ? 'journey' : 'week';
}

export function getJourneyProgressPercent(completedLessons: number, totalLessons: number): number {
  if (totalLessons <= 0) {
    return 0;
  }

  const rawPercent = Math.round((completedLessons / totalLessons) * 100);
  return Math.max(0, Math.min(100, rawPercent));
}
