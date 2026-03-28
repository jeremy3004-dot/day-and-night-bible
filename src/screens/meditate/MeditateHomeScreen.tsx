import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
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
import { useTheme } from '../../contexts/ThemeContext';
import { layout, shellChrome, shadows, spacing, typography } from '../../design/system';
import { meditationCollections } from '../../data/meditationCollections';
import { meditationImages } from '../../data/meditationVisuals';
import type { RootTabParamList, MeditateStackParamList } from '../../navigation/types';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MeditateStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

export function MeditateHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const sectionHeight = Math.max(152, Math.min(188, screenWidth * 0.38));
  const cardHeight = sectionHeight;

  const openJourney = () => {
    navigation.navigate('MeditationJourney', {
      journeyId: 'meditation-journey',
    });
  };

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
          accessibilityLabel={t('meditate.journey.title')}
          onPress={openJourney}
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
          <ImageBackground
            source={meditationImages.bible}
            style={styles.heroImage}
            imageStyle={styles.imageRadius}
          >
            <LinearGradient
              colors={[`${colors.background}08`, `${colors.background}F2`]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <Text style={[styles.heroEyebrow, { color: colors.accentSecondary }]}>
                {t('meditate.homeTitle')}
              </Text>
              <Text style={[styles.heroTitle, { color: colors.primaryText }]} numberOfLines={2}>
                {t('meditate.journey.title')}
              </Text>
              <Text style={[styles.heroBody, { color: colors.secondaryText }]} numberOfLines={2}>
                {t('meditate.journey.subtitle')}
              </Text>
            </View>
          </ImageBackground>
        </Pressable>

        <View style={styles.sectionStack}>
          {meditationCollections.map((collection) => {
            const title = t(collection.titleKey);
            const image = meditationImages[collection.imageKey];

            return (
              <Pressable
                key={collection.id}
                accessibilityRole="button"
                accessibilityLabel={title}
                onPress={() =>
                  navigation.navigate('MeditationDetail', {
                    collectionId: collection.id,
                  })
                }
                style={({ pressed }) => [
                  styles.sectionCard,
                  {
                    backgroundColor: colors.glassBackground,
                    borderColor: colors.cardBorder,
                    height: sectionHeight,
                    opacity: pressed ? 0.94 : 1,
                  },
                ]}
              >
                <ImageBackground
                  source={image}
                  style={styles.sectionImage}
                  imageStyle={styles.imageRadius}
                >
                  <LinearGradient
                    colors={[`${colors.background}10`, `${colors.background}F5`]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.sectionContent}>
                    <Text style={[styles.sectionCardTitle, { color: colors.primaryText }]} numberOfLines={2}>
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
    borderRadius: shellChrome.panelRadius,
    overflow: 'hidden',
    marginBottom: layout.sectionGap,
    borderWidth: 1,
    ...shadows.floating,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: shellChrome.panelRadius,
  },
  heroContent: {
    padding: layout.cardPadding,
    gap: spacing.xs,
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
  sectionStack: {
    gap: layout.sectionGap,
  },
  sectionCard: {
    borderRadius: shellChrome.panelRadius,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.floating,
  },
  sectionImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sectionContent: {
    padding: layout.cardPadding,
    flex: 1,
    justifyContent: 'flex-end',
  },
  sectionCardTitle: {
    ...typography.cardTitle,
  },
});
