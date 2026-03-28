import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { layout, shellChrome, shadows, typography } from '../../design/system';
import { prayerCollections } from '../../data/prayerCollections';
import { prayerImages } from '../../data/prayerImages';
import type { PrayerStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<PrayerStackParamList>;

export function PrayerHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  const cardHeight = Math.max(152, Math.min(188, screenWidth * 0.38));
  const freePrayerCardHeight = Math.max(120, Math.min(148, screenWidth * 0.28));
  const guidedCollections = prayerCollections.filter((collection) => collection.kind === 'guided');
  const journeyHeroImage = prayerImages.biblicalPrayers;
  const freePrayerImage = prayerImages.freePrayer;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('PrayerJourney', {
              journeyId: 'prayer-journey',
            })
          }
          style={({ pressed }) => [
            styles.heroCard,
            {
              backgroundColor: colors.glassBackground,
              borderColor: colors.cardBorder,
              height: cardHeight,
              opacity: pressed ? 0.94 : 1,
            },
          ]}
        >
          <ImageBackground source={journeyHeroImage} style={styles.heroImage} imageStyle={styles.imageRadius}>
            <LinearGradient
              colors={[`${colors.background}06`, `${colors.background}F0`]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardContent}>
              <Text style={[styles.heroEyebrow, { color: colors.accentPrimary }]}>
                {t('prayer.homeTitle')}
              </Text>
              <Text style={[styles.heroTitle, { color: colors.primaryText }]} numberOfLines={2}>
                {t('prayer.journey.title')}
              </Text>
              <Text style={[styles.heroBody, { color: colors.secondaryText }]} numberOfLines={2}>
                {t('prayer.journey.subtitle')}
              </Text>
            </View>
          </ImageBackground>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('FreePrayer')}
          style={({ pressed }) => [
            styles.freePrayerCard,
            {
              backgroundColor: colors.glassBackground,
              borderColor: colors.cardBorder,
              height: freePrayerCardHeight,
              opacity: pressed ? 0.94 : 1,
            },
          ]}
        >
          <View style={styles.freePrayerCopy}>
            <Text style={[styles.freePrayerEyebrow, { color: colors.accentPrimary }]}>
              {t('prayer.freePrayer')}
            </Text>
            <Text style={[styles.freePrayerBody, { color: colors.secondaryText }]} numberOfLines={2}>
              {t('prayer.subtitle')}
            </Text>
          </View>
          <ImageBackground source={freePrayerImage} style={styles.freePrayerImage} imageStyle={styles.imageRadius}>
            <LinearGradient
              colors={[`${colors.background}12`, `${colors.background}D8`]}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
        </Pressable>

        <View style={styles.collectionStack}>
          {guidedCollections.map((collection) => {
            const title = t(collection.titleKey);
            const image = prayerImages[collection.imageKey];

            return (
              <Pressable
                key={collection.id}
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate('PrayerCategory', {
                    collectionId: collection.id,
                  })
                }
                style={({ pressed }) => [
                  styles.collectionCard,
                  {
                    backgroundColor: colors.glassBackground,
                    borderColor: colors.cardBorder,
                    height: cardHeight,
                    opacity: pressed ? 0.94 : 1,
                  },
                ]}
              >
                <ImageBackground source={image} style={styles.collectionImage} imageStyle={styles.imageRadius}>
                  <LinearGradient
                    colors={[`${colors.background}08`, `${colors.background}F2`]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.cardContent}>
                    <Text style={[styles.collectionEyebrow, { color: colors.accentPrimary }]}>
                      {t('prayer.homeTitle')}
                    </Text>
                    <Text style={[styles.collectionTitle, { color: colors.primaryText }]} numberOfLines={2}>
                      {title}
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
    gap: 0,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: shellChrome.panelRadius,
    overflow: 'hidden',
    ...shadows.floating,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  collectionImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: shellChrome.panelRadius,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: layout.cardPadding,
    gap: 6,
  },
  heroEyebrow: {
    ...typography.eyebrow,
  },
  heroTitle: {
    ...typography.sectionTitle,
  },
  heroBody: {
    ...typography.body,
  },
  freePrayerCard: {
    borderWidth: 1,
    borderRadius: shellChrome.panelRadius,
    overflow: 'hidden',
    ...shadows.floating,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: layout.sectionGap,
  },
  freePrayerCopy: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: layout.cardPadding,
    gap: 6,
  },
  freePrayerEyebrow: {
    ...typography.eyebrow,
  },
  freePrayerBody: {
    ...typography.body,
  },
  freePrayerImage: {
    width: 118,
    justifyContent: 'flex-end',
  },
  collectionStack: {
    gap: 0,
  },
  collectionCard: {
    borderWidth: 1,
    borderRadius: shellChrome.panelRadius,
    overflow: 'hidden',
    ...shadows.floating,
  },
  collectionEyebrow: {
    ...typography.eyebrow,
  },
  collectionTitle: {
    ...typography.cardTitle,
  },
});
