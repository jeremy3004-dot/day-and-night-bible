import type { ImageSourcePropType } from 'react-native';
import type { PrayerImageKey } from './prayerCollections';

export const prayerImages: Record<PrayerImageKey, ImageSourcePropType> = {
  freePrayer: require('../../output/imagegen/prayer-tabs/free-prayer-chair-window.jpg'),
  biblicalPrayers: require('../../output/imagegen/prayer-tabs/biblical-prayers-bible-candle.jpg'),
  jesusPrayers: require('../../output/imagegen/prayer-tabs/jesus-prayer-hill-dawn.jpg'),
  apostolicPrayers: require('../../output/imagegen/prayer-tabs/apostolic-prayer-group-church.jpg'),
  biblicalFigures: require('../../output/imagegen/prayer-tabs/biblical-figures-prayer-church.jpg'),
  martyrs: require('../../output/imagegen/prayer-tabs/biblical-figures-prayer-church.jpg'),
  missionaries: require('../../output/imagegen/prayer-tabs/apostolic-prayer-group-church.jpg'),
  puritans: require('../../output/imagegen/prayer-tabs/free-prayer-chair-window.jpg'),
  catholics: require('../../output/imagegen/prayer-tabs/biblical-prayers-bible-candle.jpg'),
  mystics: require('../../output/imagegen/prayer-tabs/free-prayer-chair-window.jpg'),
  heroesOfTheFaith: require('../../output/imagegen/prayer-tabs/apostolic-prayer-group-church.jpg'),
};
