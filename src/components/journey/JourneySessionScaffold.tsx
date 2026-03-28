import type { ReactNode } from 'react';
import { useMemo } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ColorValue,
  type ImageSourcePropType,
} from 'react-native';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { layout, radius, shellChrome, shadows, spacing, typography } from '../../design/system';
import type { GuidedJourneyKind } from '../../types';
import {
  getJourneyStepProgressLabel,
  getJourneySwipeDirection,
} from './journeyModel';

interface JourneySessionScaffoldProps {
  journeyKind: GuidedJourneyKind;
  journeyTitle: string;
  journeySubtitle: string;
  imageSource: ImageSourcePropType;
  stepId: string;
  stepIndex: number;
  stepCount: number;
  stepTitle: string;
  stepBody: string;
  stepReferenceLabel: string;
  transitionDirection: 1 | -1;
  onBack: () => void;
  onBrowse: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onOpenBible?: () => void;
  children: ReactNode;
}

export function JourneySessionScaffold({
  journeyKind,
  journeyTitle,
  journeySubtitle,
  imageSource,
  stepId,
  stepIndex,
  stepCount,
  stepTitle,
  stepBody,
  stepReferenceLabel,
  transitionDirection,
  onBack,
  onBrowse,
  onPrevious,
  onNext,
  onOpenBible,
  children,
}: JourneySessionScaffoldProps) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-15, 15])
        .failOffsetY([-10, 10])
        .onEnd((event) => {
          const direction = getJourneySwipeDirection(event.translationX, event.velocityX);

          if (direction === 1) {
            runOnJS(onNext)();
          } else if (direction === -1) {
            runOnJS(onPrevious)();
          }
        }),
    [onNext, onPrevious]
  );

  const progressLabel = getJourneyStepProgressLabel(stepIndex, stepCount, t);
  const accentColor = journeyKind === 'meditate' ? colors.accentSecondary : colors.accentPrimary;
  const overlayColors: [ColorValue, ColorValue, ColorValue] =
    journeyKind === 'meditate'
      ? [
          isDark ? 'rgba(4, 5, 8, 0.18)' : 'rgba(10, 12, 16, 0.08)',
          'rgba(10, 12, 16, 0.84)',
          'rgba(10, 12, 16, 0.96)',
        ]
      : [
          isDark ? 'rgba(9, 5, 4, 0.16)' : 'rgba(12, 8, 6, 0.06)',
          'rgba(12, 8, 6, 0.82)',
          'rgba(12, 8, 6, 0.96)',
        ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ImageBackground source={imageSource} resizeMode="cover" style={styles.backgroundImage}>
        <LinearGradient colors={overlayColors} style={StyleSheet.absoluteFillObject} />
      </ImageBackground>

      <GestureDetector gesture={swipeGesture}>
        <View style={styles.touchLayer}>
          <View style={[styles.topChrome, { paddingTop: insets.top + spacing.sm }]}>
            <TouchableIconButton
              icon="chevron-back"
              label={t('common.back')}
              onPress={onBack}
              colors={colors}
            />

            <View style={styles.topTitleBlock}>
              <Text style={[styles.topTitle, { color: colors.primaryText }]} numberOfLines={1}>
                {journeyTitle}
              </Text>
              <Text style={[styles.topSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>
                {journeySubtitle}
              </Text>
            </View>

            <TouchableIconButton
              icon="albums-outline"
              label={t('journey.openOverview')}
              onPress={onBrowse}
              colors={colors}
            />
          </View>

          <View style={styles.progressShell}>
            <View style={styles.progressTrack}>
              {Array.from({ length: stepCount }).map((_, index) => (
                <View
                  key={`${stepId}-${index}`}
                  style={[
                    styles.progressSegment,
                    {
                      backgroundColor: index <= stepIndex ? accentColor : colors.cardBorder,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.progressLabel, { color: colors.secondaryText }]}>
              {progressLabel}
            </Text>
          </View>

          <View style={styles.stepArea}>
            <Pressable
              style={[styles.tapZone, styles.leftTapZone]}
              onPress={onPrevious}
              accessibilityRole="button"
              accessibilityLabel={t('common.previous')}
            />
            <Pressable
              style={[styles.tapZone, styles.rightTapZone]}
              onPress={onNext}
              accessibilityRole="button"
              accessibilityLabel={t('common.next')}
            />

            <Animated.View
              key={stepId}
              pointerEvents="none"
              entering={
                transitionDirection >= 0
                  ? SlideInRight.duration(260)
                  : SlideInLeft.duration(260)
              }
              exiting={
                transitionDirection >= 0 ? SlideOutLeft.duration(220) : SlideOutRight.duration(220)
              }
              style={styles.stepCard}
            >
              <View style={[styles.stepCardChrome, { borderColor: colors.cardBorder }]}>
                <Text style={[styles.stepTitle, { color: colors.primaryText }]}>{stepTitle}</Text>
                <Text style={[styles.stepBody, { color: colors.secondaryText }]}>{stepBody}</Text>
                <View style={styles.referenceRow}>
                  <Ionicons name="book-outline" size={14} color={accentColor} />
                  <Text style={[styles.referenceLabel, { color: accentColor }]} numberOfLines={1}>
                    {stepReferenceLabel}
                  </Text>
                </View>
                <Text style={[styles.swipeHint, { color: colors.secondaryText }]}>
                  {t('journey.swipeHint')}
                </Text>
              </View>
            </Animated.View>
          </View>

          <View style={[styles.dockShell, { paddingBottom: insets.bottom + spacing.md }]}>
            {children}
          </View>

          {onOpenBible ? (
            <View style={[styles.bibleShortcut, { bottom: insets.bottom + shellChrome.floatingGap + 180 }]}>
              <Pressable
                style={[styles.bibleShortcutButton, { backgroundColor: colors.cardBackground }]}
                onPress={onOpenBible}
              >
                <Ionicons name="book-outline" size={16} color={accentColor} />
                <Text style={[styles.bibleShortcutText, { color: colors.primaryText }]}>
                  {t('journey.openBible')}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
}

function TouchableIconButton({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.headerButton,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.primaryText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  touchLayer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topChrome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
  },
  topTitleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  topTitle: {
    ...typography.cardTitle,
    textAlign: 'center',
  },
  topSubtitle: {
    ...typography.micro,
    textAlign: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressShell: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xs,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
  },
  progressLabel: {
    ...typography.micro,
    textAlign: 'center',
  },
  stepArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 20,
    paddingBottom: 18,
  },
  tapZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
  },
  leftTapZone: {
    left: 0,
  },
  rightTapZone: {
    right: 0,
  },
  stepCard: {
    width: '100%',
  },
  stepCardChrome: {
    borderRadius: 28,
    borderWidth: 1,
    backgroundColor: 'rgba(10, 12, 16, 0.40)',
    padding: layout.cardPadding,
    gap: spacing.sm,
    ...shadows.floating,
  },
  stepTitle: {
    ...typography.sectionTitle,
  },
  stepBody: {
    ...typography.body,
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referenceLabel: {
    ...typography.eyebrow,
  },
  swipeHint: {
    ...typography.micro,
  },
  dockShell: {
    paddingHorizontal: layout.screenPadding,
  },
  bibleShortcut: {
    position: 'absolute',
    right: layout.screenPadding,
  },
  bibleShortcutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bibleShortcutText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
