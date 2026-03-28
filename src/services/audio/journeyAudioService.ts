import { BACKGROUND_MUSIC_OPTIONS, type BackgroundMusicOption } from './backgroundMusicCatalog';
import type { BackgroundMusicChoice, GuidedJourneyKind } from '../../types';

const MEDITATE_AMBIENT_CHOICES: BackgroundMusicChoice[] = [
  'ambient',
  'ocean-waves',
  'soft-guitar',
  'piano',
];

const PRAYER_AMBIENT_CHOICES: BackgroundMusicChoice[] = [
  'ambient',
  'piano',
  'soft-guitar',
  'sitar',
];

export function getJourneyAmbientChoices(kind: GuidedJourneyKind): BackgroundMusicChoice[] {
  return kind === 'meditate' ? MEDITATE_AMBIENT_CHOICES : PRAYER_AMBIENT_CHOICES;
}

export function getJourneyAmbientOptions(kind: GuidedJourneyKind): BackgroundMusicOption[] {
  const allowedChoices = new Set(getJourneyAmbientChoices(kind));
  return BACKGROUND_MUSIC_OPTIONS.filter((option) => allowedChoices.has(option.id));
}

export function getJourneyDefaultAmbient(kind: GuidedJourneyKind): BackgroundMusicChoice {
  return kind === 'meditate' ? 'ocean-waves' : 'piano';
}

export function getJourneyAmbientLabel(
  kind: GuidedJourneyKind,
  choice: BackgroundMusicChoice
): string {
  const option = getJourneyAmbientOptions(kind).find((entry) => entry.id === choice);
  return option?.label ?? 'Ambient';
}
