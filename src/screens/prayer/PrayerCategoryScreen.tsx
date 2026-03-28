import type { ComponentProps } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { getTranslatedBookName } from '../../constants';
import { getPrayerCollection } from '../../data/prayerCollections';
import { prayerImages } from '../../data/prayerImages';
import { layout, radius, shellChrome, shadows, spacing, typography } from '../../design/system';
import type { PrayerCategoryScreenProps } from '../../navigation/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function PrayerCategoryScreen({ route, navigation }: PrayerCategoryScreenProps) {
  const { collectionId } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation();

  const collection = getPrayerCollection(collectionId);

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
  const image = prayerImages[collection.imageKey];

  const openReference = () => {
    navigation.navigate('PrayerJourney', {
      journeyId: 'prayer-journey',
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
        <View style={[styles.heroCard, { backgroundColor: colors.glassBackground, borderColor: colors.cardBorder }]}>
          <ImageBackground source={image} style={styles.heroImage} imageStyle={styles.imageRadius}>
            <LinearGradient
              colors={[`${colors.background}08`, `${colors.background}F5`]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroHeader}>
                <View style={[styles.heroIconWrap, { backgroundColor: colors.accentPrimary + '18' }]}>
                  <Ionicons name={collection.iconName as IconName} size={22} color={colors.accentPrimary} />
                </View>
                <Text style={[styles.heroEyebrow, { color: colors.accentPrimary }]}>
                  {t('prayer.homeTitle')}
                </Text>
              </View>
              <Text style={[styles.heroTitle, { color: colors.primaryText }]}>{collectionTitle}</Text>
              <Text style={[styles.heroBody, { color: colors.secondaryText }]}>
                {t('prayer.collectionBody', { name: collectionTitle })}
              </Text>
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
              <View style={styles.referenceTextColumn}>
                <Text style={[styles.referenceLabel, { color: colors.secondaryText }]}>
                  {t('common.continue')}
                </Text>
                <Text style={[styles.referenceTitle, { color: colors.primaryText }]}>
                  {`${getTranslatedBookName(reference.bookId, t)} ${reference.chapter}${
                    reference.verse ? `:${reference.verse}` : ''
                  }`}
                </Text>
              </View>
              <Ionicons name="book-outline" size={28} color={colors.accentPrimary} />
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
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.floating,
  },
  heroImage: {
    minHeight: 300,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: shellChrome.panelRadius,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
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
  heroContent: {
    padding: layout.cardPadding,
    gap: spacing.md,
  },
  referenceList: {
    gap: spacing.md,
  },
  referenceCard: {
    borderRadius: shellChrome.panelRadius,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    overflow: 'hidden',
    ...shadows.floating,
  },
  referenceTextColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  referenceLabel: {
    ...typography.eyebrow,
  },
  referenceTitle: {
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
