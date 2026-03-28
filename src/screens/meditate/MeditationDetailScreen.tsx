import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTranslatedBookName } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';
import { layout, shellChrome, shadows, spacing, typography } from '../../design/system';
import { getMeditationCollection } from '../../data/meditationCollections';
import { meditationImages } from '../../data/meditationVisuals';
import type { MeditationDetailScreenProps } from '../../navigation/types';

export function MeditationDetailScreen({ route, navigation }: MeditationDetailScreenProps) {
  const { collectionId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation();

  const collection = getMeditationCollection(collectionId);

  if (!collection) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.primaryText }]}>
            {t('common.error')}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.secondaryText }]}>
            {t('common.somethingWentWrong')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: colors.glassBackground,
                borderColor: colors.cardBorder,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Text style={[styles.backButtonText, { color: colors.primaryText }]}>
              {t('common.back')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const collectionTitle = t(collection.titleKey);
  const image = meditationImages[collection.imageKey];

  const openReference = () => {
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
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.glassBackground, borderColor: colors.cardBorder },
          ]}
        >
          <ImageBackground
            source={image}
            style={styles.heroImage}
            imageStyle={styles.imageRadius}
          >
            <LinearGradient
              colors={[`${colors.background}10`, `${colors.background}F6`]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, { color: colors.primaryText }]}>{collectionTitle}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.referenceList}>
          {collection.references.map((reference) => (
            <Pressable
              key={`${reference.bookId}-${reference.chapter}-${reference.verse ?? 'all'}`}
              accessibilityRole="button"
              onPress={openReference}
              style={({ pressed }) => [
                styles.referenceCard,
                {
                  backgroundColor: colors.glassBackground,
                  borderColor: colors.cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
            >
              <Text style={[styles.referenceText, { color: colors.primaryText }]}>
                {`${getTranslatedBookName(reference.bookId, t)} ${reference.chapter}${
                  reference.verse ? `:${reference.verse}` : ''
                }`}
              </Text>
            </Pressable>
          ))}
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
    gap: spacing.lg,
  },
  heroCard: {
    borderRadius: shellChrome.panelRadius,
    overflow: 'hidden',
    borderWidth: 1,
    ...shadows.floating,
  },
  heroImage: {
    minHeight: 300,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: shellChrome.panelRadius,
  },
  heroContent: {
    padding: layout.cardPadding,
    gap: 0,
  },
  heroTitle: {
    ...typography.pageTitle,
  },
  referenceList: {
    gap: spacing.md,
  },
  referenceCard: {
    borderRadius: shellChrome.panelRadius,
    borderWidth: 1,
    padding: layout.cardPadding,
    overflow: 'hidden',
    ...shadows.floating,
  },
  referenceText: {
    ...typography.cardTitle,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.sectionTitle,
  },
  emptyBody: {
    ...typography.body,
  },
  backButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: shellChrome.panelRadius,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
  },
  backButtonText: {
    ...typography.button,
  },
});
