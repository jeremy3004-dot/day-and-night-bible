import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio, type AVPlaybackStatus } from 'expo-av';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../contexts/ThemeContext';
import type { LessonDetailScreenProps } from '../../navigation/types';
import { layout, radius, spacing, typography } from '../../design/system';
import {
  FELLOWSHIP_QUESTIONS,
  APPLICATION_QUESTIONS,
  gatherFoundations,
} from '../../data/gatherFoundations';
import { gatherTopicCategories } from '../../data/gatherTopics';
import {
  getPassageText,
  getPrimaryAudioReference,
  type PassageBlock,
} from '../../services/gather/gatherBibleService';
import { getChapterAudioUrl } from '../../services/audio/audioService';
import type { MeetingSectionType } from '../../types/gather';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LessonDetailScreen({ route, navigation }: LessonDetailScreenProps) {
  const { parentId, lessonId, parentType } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation();

  // -------------------------------------------------------------------------
  // Lesson resolution
  // -------------------------------------------------------------------------

  const parent =
    parentType === 'foundation'
      ? gatherFoundations.find((f) => f.id === parentId)
      : gatherTopicCategories.flatMap((c) => c.topics).find((topic) => topic.id === parentId);

  const lesson = parent?.lessons.find((l) => l.id === lessonId);

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  const [activeSection, setActiveSection] = useState<MeetingSectionType>('fellowship');
  const [passageBlocks, setPassageBlocks] = useState<PassageBlock[]>([]);
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  // Load Bible passage text
  useEffect(() => {
    if (!lesson) return;

    let cancelled = false;
    setIsLoadingPassage(true);
    setPassageBlocks([]);

    getPassageText(lesson.references)
      .then((blocks) => {
        if (!cancelled) {
          setPassageBlocks(blocks);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPassageBlocks([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingPassage(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lesson]);

  // Resolve audio URL
  useEffect(() => {
    if (!lesson) return;

    const primaryRef = getPrimaryAudioReference(lesson.references);
    if (!primaryRef) return;

    let cancelled = false;
    getChapterAudioUrl('bsb', primaryRef.bookId, primaryRef.chapter)
      .then((asset) => {
        if (!cancelled && asset) {
          setAudioUrl(asset.url);
        }
      })
      .catch(() => {
        // Audio URL resolution failure is non-fatal — controls stay disabled
      });

    return () => {
      cancelled = true;
    };
  }, [lesson]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => undefined);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Audio controls
  // -------------------------------------------------------------------------

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setAudioPosition(status.positionMillis);
    if (status.durationMillis) {
      setAudioDuration(status.durationMillis);
    }

    if (status.didJustFinish) {
      setIsAudioPlaying(false);
      setAudioPosition(0);
    } else {
      // Functional update bails out of re-render when value is unchanged,
      // preventing excessive re-renders during playback from making the
      // play/pause button unresponsive after switching tabs.
      setIsAudioPlaying((prev) => (prev !== status.isPlaying ? status.isPlaying : prev));
    }
  }, []);

  const playAudio = useCallback(async () => {
    if (!audioUrl) return;

    try {
      if (!soundRef.current) {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          handlePlaybackStatusUpdate
        );
        soundRef.current = sound;
      } else {
        await soundRef.current.playAsync();
      }
      setIsAudioPlaying(true);
    } catch {
      // Ignore playback errors silently — user can retry
    }
  }, [audioUrl, handlePlaybackStatusUpdate]);

  const pauseAudio = useCallback(async () => {
    try {
      await soundRef.current?.pauseAsync();
    } catch {
      // Ignore
    }
    setIsAudioPlaying(false);
  }, []);

  const seekBackward = useCallback(async () => {
    const newPosition = Math.max(0, audioPosition - 10000);
    try {
      await soundRef.current?.setPositionAsync(newPosition);
    } catch {
      // Ignore
    }
    setAudioPosition(newPosition);
  }, [audioPosition]);

  const seekForward = useCallback(async () => {
    const newPosition = Math.min(
      audioDuration > 0 ? audioDuration : audioPosition + 30000,
      audioPosition + 30000
    );
    try {
      await soundRef.current?.setPositionAsync(newPosition);
    } catch {
      // Ignore
    }
    setAudioPosition(newPosition);
  }, [audioPosition, audioDuration]);

  const togglePlayPause = useCallback(async () => {
    if (isAudioPlaying) {
      await pauseAudio();
    } else {
      await playAudio();
    }
  }, [isAudioPlaying, playAudio, pauseAudio]);

  // -------------------------------------------------------------------------
  // Share
  // -------------------------------------------------------------------------

  const handleShare = useCallback(() => {
    if (!lesson) return;
    Share.share({
      title: lesson.title,
      message: `${lesson.title} — ${lesson.referenceLabel}`,
    }).catch(() => undefined);
  }, [lesson]);

  // -------------------------------------------------------------------------
  // Lesson not found
  // -------------------------------------------------------------------------

  if (!lesson) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.notFoundContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
          </TouchableOpacity>
          <Text style={[styles.notFoundText, { color: colors.secondaryText }]}>
            Lesson not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------------------
  // Progress bar width
  // -------------------------------------------------------------------------

  const progressFraction = audioDuration > 0 ? audioPosition / audioDuration : 0;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const SECTIONS: { key: MeetingSectionType; label: string }[] = [
    { key: 'fellowship', label: t('gather.fellowship') },
    { key: 'story', label: t('gather.story') },
    { key: 'application', label: t('gather.application') },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: colors.primaryText }]}
          numberOfLines={1}
        >
          {lesson.title}
        </Text>

        <TouchableOpacity
          onPress={handleShare}
          style={styles.headerIconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="share-outline" size={22} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Hero icon */}
      <View style={styles.heroContainer}>
        <View
          style={[
            styles.heroIconCircle,
            { backgroundColor: colors.accentPrimary + '18' },
          ]}
        >
          <Ionicons name="book-outline" size={32} color={colors.accentPrimary} />
        </View>
      </View>

      {/* Section tab bar */}
      <View style={[styles.tabBar, { borderBottomColor: colors.cardBorder }]}>
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.key;
          return (
            <TouchableOpacity
              key={section.key}
              style={styles.tabItem}
              onPress={() => setActiveSection(section.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isActive
                    ? [styles.tabLabelActive, { color: colors.primaryText }]
                    : { color: colors.secondaryText },
                ]}
              >
                {section.label}
              </Text>
              {isActive && (
                <View
                  style={[styles.tabUnderline, { backgroundColor: colors.accentPrimary }]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Scrollable content area */}
      <ScrollView
        key={activeSection}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === 'fellowship' && (
          <FellowshipSection questions={FELLOWSHIP_QUESTIONS} colors={colors} />
        )}

        {activeSection === 'story' && (
          <StorySection
            isLoading={isLoadingPassage}
            passageBlocks={passageBlocks}
            colors={colors}
          />
        )}

        {activeSection === 'application' && (
          <ApplicationSection questions={APPLICATION_QUESTIONS} colors={colors} />
        )}
      </ScrollView>

      {/* Fixed audio player bar */}
      <View
        style={[
          styles.audioBar,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.cardBorder,
            opacity: audioUrl ? 1 : 0.4,
          },
        ]}
      >
        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: colors.cardBorder }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.accentPrimary,
                width: `${Math.min(100, progressFraction * 100)}%`,
              },
            ]}
          />
        </View>

        {/* Time display */}
        <View style={styles.timeRow}>
          <Text style={[styles.timeText, { color: colors.secondaryText }]}>
            {formatTime(audioPosition)}
          </Text>
          <Text style={[styles.timeText, { color: colors.secondaryText }]}>
            {formatTime(audioDuration)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={seekBackward}
            disabled={!audioUrl}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="play-back-outline" size={24} color={colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlayPause}
            disabled={!audioUrl}
            style={[
              styles.playButton,
              { backgroundColor: colors.accentPrimary },
            ]}
          >
            <Ionicons
              name={isAudioPlaying ? 'pause' : 'play'}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={seekForward}
            disabled={!audioUrl}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="play-forward-outline" size={24} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>

        {!audioUrl && (
          <Text style={[styles.audioLoadingLabel, { color: colors.secondaryText }]}>
            Loading audio...
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface QuestionCardProps {
  number: number;
  text: string;
  colors: ReturnType<typeof import('../../contexts/ThemeContext').useTheme>['colors'];
}

function QuestionCard({ number, text, colors }: QuestionCardProps) {
  return (
    <View
      style={[
        styles.questionCard,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View
        style={[
          styles.questionBadge,
          { backgroundColor: colors.accentPrimary + '18' },
        ]}
      >
        <Text style={[styles.questionBadgeText, { color: colors.accentPrimary }]}>
          {number}
        </Text>
      </View>
      <Text style={[styles.questionText, { color: colors.primaryText }]}>{text}</Text>
    </View>
  );
}

interface FellowshipSectionProps {
  questions: string[];
  colors: ReturnType<typeof import('../../contexts/ThemeContext').useTheme>['colors'];
}

function FellowshipSection({ questions, colors }: FellowshipSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      {questions.map((q, idx) => (
        <QuestionCard key={idx} number={idx + 1} text={q} colors={colors} />
      ))}
    </View>
  );
}

interface StorySectionProps {
  isLoading: boolean;
  passageBlocks: PassageBlock[];
  colors: ReturnType<typeof import('../../contexts/ThemeContext').useTheme>['colors'];
}

function StorySection({ isLoading, passageBlocks, colors }: StorySectionProps) {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.accentPrimary} />
      </View>
    );
  }

  if (passageBlocks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
          No passage text available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      {passageBlocks.map((block, blockIdx) => (
        <View key={blockIdx} style={blockIdx > 0 ? styles.passageBlockGap : undefined}>
          <Text style={[styles.passageLabel, { color: colors.primaryText }]}>
            {block.label}
          </Text>
          <Text style={[styles.versesParagraph, { color: colors.primaryText }]}>
            {block.verses.map((verse, verseIdx) => {
              const isFirst = verseIdx === 0;
              const hasHeading = Boolean(verse.heading);
              return (
                <React.Fragment key={verse.id}>
                  {hasHeading && (
                    <Text style={[styles.verseHeading, { color: colors.secondaryText }]}>
                      {'\n'}{verse.heading}{'\n'}
                    </Text>
                  )}
                  {!isFirst && !hasHeading && ' '}
                  <Text>
                    <Text style={[styles.verseNumber, { color: colors.accentPrimary }]}>
                      {verse.verse}{' '}
                    </Text>
                    <Text style={{ color: colors.primaryText }}>{verse.text}</Text>
                  </Text>
                </React.Fragment>
              );
            })}
          </Text>
        </View>
      ))}
    </View>
  );
}

interface ApplicationSectionProps {
  questions: string[];
  colors: ReturnType<typeof import('../../contexts/ThemeContext').useTheme>['colors'];
}

function ApplicationSection({ questions, colors }: ApplicationSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      {questions.map((q, idx) => (
        <QuestionCard key={idx} number={idx + 1} text={q} colors={colors} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    padding: layout.screenPadding,
    gap: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
    alignSelf: 'flex-start',
  },
  notFoundText: {
    ...typography.body,
  },

  // Header
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    gap: spacing.sm,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.bodyStrong,
    flex: 1,
    textAlign: 'center',
  },

  // Hero
  heroContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  tabLabel: {
    ...typography.body,
    textAlign: 'center',
  },
  tabLabelActive: {
    ...typography.bodyStrong,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
  },

  // Questions
  sectionContainer: {
    gap: spacing.md,
  },
  questionCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: layout.denseCardPadding,
    gap: spacing.sm,
  },
  questionBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  questionBadgeText: {
    ...typography.label,
  },
  questionText: {
    ...typography.body,
    lineHeight: 24,
  },

  // Story / Passage
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
  },
  passageBlockGap: {
    marginTop: spacing.xl,
  },
  passageLabel: {
    ...typography.cardTitle,
    marginBottom: spacing.sm,
  },
  versesParagraph: {
    ...typography.readingBody,
  },
  verseHeading: {
    ...typography.readingHeading,
  },
  verseNumber: {
    ...typography.readingVerseNumber,
    color: undefined, // color applied inline
  },

  // Audio bar
  audioBar: {
    borderTopWidth: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  progressTrack: {
    height: 3,
    borderRadius: radius.xs,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.xs,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  timeText: {
    ...typography.micro,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioLoadingLabel: {
    ...typography.micro,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
