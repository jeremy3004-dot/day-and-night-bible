import type { ImageSourcePropType } from 'react-native';
import type { MeditationImageKey } from './meditationCollections';

export const meditationImages: Record<MeditationImageKey, ImageSourcePropType> = {
  bible: require('../../assets/meditate/meditate-bible.png'),
  window: require('../../assets/meditate/meditate-window.png'),
  candle: require('../../assets/meditate/meditate-candle.png'),
  candleAlt: require('../../assets/meditate/meditate-candle-alt.png'),
};
