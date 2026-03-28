import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { bibleTranslations, getTranslatedBookName } from '../../constants';
import { config } from '../../constants/config';
import { useTheme } from '../../contexts/ThemeContext';
import { useProgressStore, useBibleStore } from '../../stores';
import { getDailyScripture } from '../../services/bible';
import { getAudioAvailability, isRemoteAudioAvailable } from '../../services/audio';
import { CardSkeleton } from '../../components';
import type { DailyScripture } from '../../types';
import type { RootTabParamList } from '../../navigation/types';
import { layout, radius, shadows, shellChrome, spacing, typography } from '../../design/system';

type NavigationProp = NativeStackNavigationProp<RootTabParamList>;

const quickActions = [
  {
    name: 'Bible',
    icon: 'book-outline',
    tabKey: 'bible',
  },
  {
    name: 'Meditate',
    icon: 'headset-outline',
    tabKey: 'meditate',
  },
  {
    name: 'Prayer',
    icon: 'heart-outline',
    tabKey: 'prayer',
  },
] as const;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [dailyScripture, setDailyScripture] = useState<DailyScripture | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(true);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentBook = useBibleStore((state) => state.currentBook);
  const currentChapter = useBibleStore((state) => state.currentChapter);
  const currentTranslation = useBibleStore((state) => state.currentTranslation);
  const translations = useBibleStore((state) =>
    Array.isArray(state.translations) ? state.translations : bibleTranslations
  );
  const currentTranslationInfo = translations.find(
    (translation) => translation.id === currentTranslation
  );
  const translationLabel = currentTranslationInfo?.abbreviation || currentTranslation;
  const remoteAudioAvailable =
    config.features.audioEnabled && isRemoteAudioAvailable(currentTranslation);
  const getTodayCount = useProgressStore((state) => state.getTodayCount);
  const getWeekCount = useProgressStore((state) => state.getWeekCount);
  const getMonthCount = useProgressStore((state) => state.getMonthCount);
  const getYearCount = useProgressStore((state) => state.getYearCount);

  const currentReadingLabel = `${getTranslatedBookName(currentBook, t)} ${currentChapter}`;

  const dailyAudioAvailability =
    dailyScripture && currentTranslationInfo
      ? getAudioAvailability({
          featureEnabled: config.features.audioEnabled,
          translationHasAudio: currentTranslationInfo.hasAudio,
          remoteAudioAvailable,
          downloadedAudioBooks: currentTranslationInfo.downloadedAudioBooks,
          bookId: dailyScripture.bookId,
        })
      : null;
  const shouldShowDailyAudio =
    dailyScripture != null &&
    dailyAudioAvailability?.canPlayAudio &&
    dailyScripture.kind !== 'verse-text';
  const dailyAudioKind =
    shouldShowDailyAudio && dailyScripture?.kind === 'empty'
      ? currentTranslationInfo?.audioGranularity === 'verse'
        ? 'verse-audio'
        : 'section-audio'
      : dailyScripture?.kind;

  const loadVerseOfDay = async ({
    allowInitialization = true,
    silent = false,
  }: {
    allowInitialization?: boolean;
    silent?: boolean;
  } = {}) => {
    if (!silent) {
      setIsLoadingVerse(true);
    }

    try {
      if (!currentTranslationInfo) {
        setDailyScripture(null);
        return;
      }

      const scripture = await getDailyScripture(currentTranslationInfo, remoteAudioAvailable, {
        allowInitialization,
      });
      setDailyScripture(scripture);
    } catch (error) {
      console.error('Error loading verse of the day:', error);
    } finally {
      if (!silent) {
        setIsLoadingVerse(false);
      }
    }
  };

  useEffect(() => {
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      void loadVerseOfDay({ allowInitialization: false });
    });

    retryTimerRef.current = setTimeout(() => {
      void loadVerseOfDay({ allowInitialization: false, silent: true });
    }, 2500);

    return () => {
      interactionHandle.cancel();

      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTranslation, remoteAudioAvailable]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVerseOfDay({ allowInitialization: true });
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 17) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  const openBibleReader = () => {
    navigation.navigate('Bible', {
      screen: 'BibleReader',
      params: {
        bookId: currentBook,
        chapter: currentChapter,
        autoplayAudio: Boolean(currentTranslationInfo?.hasAudio),
        preferredMode: currentTranslationInfo?.hasAudio ? 'listen' : 'read',
      },
    });
  };

  const openBibleBrowser = () => {
    navigation.navigate('Bible', { screen: 'BibleBrowser' });
  };

  const openMeditate = () => {
    navigation.navigate('Meditate', { screen: 'MeditationJourney' });
  };

  const openPrayer = () => {
    navigation.navigate('Prayer', { screen: 'PrayerJourney' });
  };

  const handlePlayDailyAudio = () => {
    if (!dailyScripture || !dailyAudioAvailability?.canPlayAudio) {
      return;
    }

    navigation.navigate('Bible', {
      screen: 'BibleReader',
      params: {
        bookId: dailyScripture.bookId,
        chapter: dailyScripture.chapter,
        autoplayAudio: true,
        focusVerse: dailyScripture.verse,
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View pointerEvents="none" style={styles.backgroundArt}>
        <LinearGradient
          colors={[colors.background, colors.background, colors.overlay]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.backgroundVeil}
        />
        <View
          style={[
            styles.backgroundOrbPrimary,
            {
              backgroundColor: colors.accentPrimary + '18',
            },
          ]}
        />
        <View
          style={[
            styles.backgroundOrbSecondary,
            {
              backgroundColor: colors.accentSecondary + '10',
            },
          ]}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentGreen}
          />
        }
      >
        <Animated.View entering={FadeInDown.duration(420)}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.glassBackground,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={openBibleReader}
          >
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <View style={styles.heroTopRow}>
              <View style={styles.heroBrandLockup}>
                <Text style={[styles.heroBrand, { color: colors.accentPrimary }]}>Day and Night Bible</Text>
                <Text style={[styles.heroGreeting, { color: colors.primaryText }]}>
                  {getGreeting()}
                </Text>
              </View>
              <View
                style={[
                  styles.heroTranslationPill,
                  {
                    backgroundColor: colors.overlay,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.heroTranslationLabel, { color: colors.secondaryText }]}>
                  {translationLabel}
                </Text>
              </View>
            </View>

            <View style={styles.heroBody}>
              <Text style={[styles.heroEyebrow, { color: colors.accentPrimary }]}>
                {dailyAudioKind === 'section-audio'
                  ? t('home.sectionOfTheDay')
                  : t('home.verseOfTheDay')}
              </Text>
              <Text style={[styles.heroScripture, { color: colors.primaryText }]}>
                {dailyScripture?.kind === 'verse-text'
                  ? `"${dailyScripture.text}"`
                  : shouldShowDailyAudio
                    ? dailyAudioKind === 'section-audio'
                      ? t('home.sectionOfTheDayBody')
                      : t('home.verseAudioBody')
                    : t('home.defaultVerse')}
              </Text>
              <View
                style={[
                  styles.heroReferencePill,
                  {
                    backgroundColor: colors.overlay,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.heroReference, { color: colors.accentPrimary }]}>
                  {dailyScripture
                    ? `${getTranslatedBookName(dailyScripture.bookId, t)} ${dailyScripture.chapter}${
                        dailyScripture.verse ? `:${dailyScripture.verse}` : ''
                      }`
                    : t('home.defaultReference')}
                </Text>
              </View>
            </View>

            <View style={styles.heroFooter}>
              <View
                style={[
                  styles.heroReadingPill,
                  {
                    backgroundColor: colors.overlay,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.heroReadingLabel, { color: colors.secondaryText }]}>
                  {t('home.continueReading')}
                </Text>
                <Text style={[styles.heroReadingTitle, { color: colors.primaryText }]}>
                  {currentReadingLabel}
                </Text>
              </View>

              {shouldShowDailyAudio ? (
                <TouchableOpacity
                  style={[
                    styles.audioAction,
                    {
                      backgroundColor: colors.bibleControlBackground,
                    },
                  ]}
                  onPress={handlePlayDailyAudio}
                  activeOpacity={0.9}
                >
                  <Ionicons name="play" size={18} color={colors.bibleBackground} />
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.heroArrowButton,
                    {
                      backgroundColor: colors.overlay,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <Ionicons name="arrow-forward" size={18} color={colors.primaryText} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={styles.quickActionRow} entering={FadeInDown.delay(70).duration(420)}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.name}
              activeOpacity={0.86}
              style={[
                styles.quickActionCard,
                {
                  backgroundColor: colors.glassBackground,
                  borderColor: colors.cardBorder,
                },
              ]}
              onPress={
                action.name === 'Bible'
                  ? openBibleBrowser
                  : action.name === 'Meditate'
                    ? openMeditate
                    : openPrayer
              }
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: colors.accentPrimary + '18' }]}>
                <Ionicons name={action.icon} size={20} color={colors.accentPrimary} />
              </View>
              <Text style={[styles.quickActionTitle, { color: colors.primaryText }]}>
                {t(`tabs.${action.tabKey}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {isLoadingVerse ? (
          <Animated.View style={styles.heroLoadingCard} entering={FadeInDown.delay(120).duration(420)}>
            <CardSkeleton lines={3} />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(120).duration(420)}>
            <View
              style={[
                styles.statsShell,
                {
                  borderTopColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.secondaryText }]}>
                {t('home.chaptersRead')}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                    {getTodayCount()}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                    {t('home.today')}
                  </Text>
                </View>
                <View
                  style={[styles.statDivider, { backgroundColor: colors.cardBorder }]}
                />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                    {getWeekCount()}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                    {t('home.week')}
                  </Text>
                </View>
                <View
                  style={[styles.statDivider, { backgroundColor: colors.cardBorder }]}
                />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                    {getMonthCount()}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                    {t('home.month')}
                  </Text>
                </View>
                <View
                  style={[styles.statDivider, { backgroundColor: colors.cardBorder }]}
                />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.primaryText }]}>
                    {getYearCount()}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                    {t('home.year')}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundArt: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundVeil: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOrbPrimary: {
    position: 'absolute',
    top: 56,
    right: -52,
    width: 220,
    height: 220,
    borderRadius: 220,
  },
  backgroundOrbSecondary: {
    position: 'absolute',
    top: 260,
    left: -84,
    width: 240,
    height: 240,
    borderRadius: 240,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: shellChrome.floatingInset + layout.tabBarBaseHeight + spacing.xxxl,
    gap: spacing.xl,
  },
  heroCard: {
    borderRadius: shellChrome.panelRadius,
    minHeight: 372,
    paddingHorizontal: layout.cardPadding,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...shadows.floating,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroBrandLockup: {
    gap: spacing.xs,
  },
  heroBrand: {
    ...typography.eyebrow,
  },
  heroTranslationPill: {
    minHeight: 34,
    minWidth: 56,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTranslationLabel: {
    ...typography.label,
  },
  heroGreeting: {
    ...typography.cardTitle,
  },
  heroBody: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  heroEyebrow: {
    ...typography.eyebrow,
    textAlign: 'center',
  },
  heroScripture: {
    ...typography.readingHeading,
    fontSize: 30,
    lineHeight: 42,
    fontWeight: '500',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  heroReferencePill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroReference: {
    ...typography.label,
    textAlign: 'center',
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  heroReadingPill: {
    flex: 1,
    borderRadius: shellChrome.panelRadius,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  heroReadingLabel: {
    ...typography.label,
  },
  heroReadingTitle: {
    ...typography.cardTitle,
  },
  heroArrowButton: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: shellChrome.panelRadius,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    ...shadows.floating,
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    ...typography.label,
  },
  heroLoadingCard: {
    minHeight: 120,
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.eyebrow,
  },
  audioAction: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsShell: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  statItem: {
    flex: 1,
    gap: spacing.xs,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.sectionTitle,
    fontSize: 28,
    lineHeight: 32,
  },
  statLabel: {
    ...typography.label,
  },
  statDivider: {
    width: 1,
  },
});
