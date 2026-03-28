import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import type {
  AudioStatus,
  BackgroundMusicChoice,
  PlaybackRate,
  RepeatMode,
  SleepTimerOption,
  TranslationAudioVoiceCatalog,
} from '../../types';
import { PLAYBACK_RATES, SLEEP_TIMER_OPTIONS } from '../../types';
import { BACKGROUND_MUSIC_OPTIONS } from '../../services/audio';

interface PlaybackControlsProps {
  variant?: 'default' | 'chapter-only' | 'listen';
  status: AudioStatus;
  playbackRate: PlaybackRate;
  repeatMode: RepeatMode;
  sleepTimerRemaining: number | null;
  backgroundMusicChoice: BackgroundMusicChoice;
  hasPreviousChapter: boolean;
  hasNextChapter: boolean;
  onPlayPause: () => void;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onChangePlaybackRate: (rate: PlaybackRate) => void;
  onCycleRepeatMode: () => void;
  onSetSleepTimer: (minutes: SleepTimerOption) => void;
  onChangeBackgroundMusicChoice: (choice: BackgroundMusicChoice) => void;
  onShowText?: () => void;
  showTextLabel?: string;
  listenTranslationLabel?: string;
  voiceCatalog?: TranslationAudioVoiceCatalog | null;
  selectedVoiceId?: string | null;
  onSelectVoice?: (voiceId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  onOpenChapterActions?: () => void;
  onOpenFeedback?: () => void;
}

export function PlaybackControls({
  variant = 'default',
  status,
  playbackRate,
  repeatMode,
  sleepTimerRemaining,
  backgroundMusicChoice,
  hasPreviousChapter,
  hasNextChapter,
  onPlayPause,
  onPreviousChapter,
  onNextChapter,
  onSkipBackward,
  onSkipForward,
  onChangePlaybackRate,
  onCycleRepeatMode,
  onSetSleepTimer,
  onChangeBackgroundMusicChoice,
  onShowText,
  showTextLabel,
  listenTranslationLabel,
  voiceCatalog,
  selectedVoiceId,
  onSelectVoice,
  isFavorite,
  onToggleFavorite,
  onShare,
  onOpenChapterActions,
  onOpenFeedback,
}: PlaybackControlsProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showBackgroundMusicModal, setShowBackgroundMusicModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const isLoading = status === 'loading';
  const isPlaying = status === 'playing';
  const isChapterOnlyTransport = variant === 'chapter-only';
  const isListenVariant = variant === 'listen';
  const showSkipControls = variant === 'default';
  const showTextUtility = typeof onShowText === 'function';
  const isRepeatActive = repeatMode !== 'off';
  const isBackgroundMusicActive = backgroundMusicChoice !== 'off';
  const selectedBackgroundMusic =
    BACKGROUND_MUSIC_OPTIONS.find((option) => option.id === backgroundMusicChoice) ??
    BACKGROUND_MUSIC_OPTIONS[0];
  const selectedVoice =
    voiceCatalog?.voices.find((voice) => voice.id === selectedVoiceId) ??
    voiceCatalog?.voices.find((voice) => voice.id === voiceCatalog?.defaultVoiceId) ??
    voiceCatalog?.voices[0] ??
    null;
  const listenVoiceLabel = selectedVoice
    ? `${selectedVoice.label}${listenTranslationLabel ? ` • ${listenTranslationLabel}` : ''}`
    : listenTranslationLabel ?? 'Voice';
  const ambientChipLabel =
    backgroundMusicChoice === 'off' ? 'Ambient' : selectedBackgroundMusic.label;
  const repeatIconColor = isRepeatActive ? colors.bibleAccent : colors.bibleSecondaryText;
  const backgroundMusicIconColor = isBackgroundMusicActive
    ? colors.bibleAccent
    : colors.biblePrimaryText;
  const repeatAccessibilityLabel =
    repeatMode === 'chapter'
      ? t('audio.repeatChapter')
      : repeatMode === 'book'
        ? t('audio.repeatBook')
        : t('audio.repeatOff');

  const renderRepeatModeIcon = () => (
    <View style={styles.repeatIconWrapper}>
      <Ionicons
        name={repeatMode === 'off' ? 'repeat-outline' : 'repeat'}
        size={18}
        color={repeatIconColor}
      />
      {repeatMode === 'chapter' ? (
        <View style={[styles.repeatBadge, { backgroundColor: repeatIconColor }]}>
          <Text style={[styles.repeatBadgeText, { color: colors.bibleBackground }]}>1</Text>
        </View>
      ) : null}
    </View>
  );

  const renderTextUtilityIcon = () => (
    <View style={styles.textUtilityIcon}>
      <View
        style={[
          styles.textUtilityIconBubble,
          {
            borderColor: colors.biblePrimaryText,
          },
        ]}
      >
        <View
          style={[
            styles.textUtilityIconLineLong,
            { backgroundColor: colors.biblePrimaryText },
          ]}
        />
        <View
          style={[
            styles.textUtilityIconLineMedium,
            { backgroundColor: colors.biblePrimaryText },
          ]}
        />
        <View
          style={[
            styles.textUtilityIconLineShort,
            { backgroundColor: colors.biblePrimaryText },
          ]}
        />
      </View>
      <View
        style={[
          styles.textUtilityIconTail,
          {
            borderBottomColor: colors.biblePrimaryText,
          },
        ]}
      />
    </View>
  );

  if (isListenVariant) {
    const voiceOptions = voiceCatalog?.voices ?? [];

    return (
      <View style={styles.listenContainer}>
        <View style={styles.listenTransportRow}>
          <TouchableOpacity
            style={[
              styles.listenTransportButton,
              !hasPreviousChapter && styles.disabledButton,
            ]}
            onPress={onPreviousChapter}
            disabled={!hasPreviousChapter || isLoading}
          >
            <Ionicons
              name="play-skip-back"
              size={26}
              color={hasPreviousChapter ? colors.biblePrimaryText : colors.bibleSecondaryText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.listenPlayButton,
              { backgroundColor: colors.bibleControlBackground },
            ]}
            onPress={onPlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="hourglass" size={30} color={colors.bibleBackground} />
            ) : (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={34} color={colors.bibleBackground} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.listenTransportButton,
              !hasNextChapter && styles.disabledButton,
            ]}
            onPress={onNextChapter}
            disabled={!hasNextChapter || isLoading}
          >
            <Ionicons
              name="play-skip-forward"
              size={26}
              color={hasNextChapter ? colors.biblePrimaryText : colors.bibleSecondaryText}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.listenChipRow}>
          {voiceOptions.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.listenChip,
                {
                  backgroundColor: colors.bibleSurface,
                  borderColor: showVoiceModal ? colors.bibleAccent : colors.bibleDivider,
                },
              ]}
              onPress={() => setShowVoiceModal(true)}
              disabled={!onSelectVoice}
              accessibilityRole="button"
              accessibilityLabel={listenVoiceLabel}
            >
              <View
                style={[
                  styles.listenChipFlag,
                  {
                    backgroundColor: colors.bibleElevatedSurface,
                    borderColor: colors.bibleDivider,
                  },
                ]}
              >
                <Text style={[styles.listenChipFlagText, { color: colors.biblePrimaryText }]}>
                  {selectedVoice?.flag.emoji ?? '🎙'}
                </Text>
              </View>
              <Text
                style={[
                  styles.listenChipText,
                  {
                    color: colors.biblePrimaryText,
                  },
                ]}
                numberOfLines={1}
              >
                {listenVoiceLabel}
              </Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={colors.bibleSecondaryText}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[
              styles.listenChip,
              {
                backgroundColor:
                  backgroundMusicChoice === 'off'
                    ? colors.bibleSurface
                    : colors.bibleElevatedSurface,
                borderColor:
                  backgroundMusicChoice === 'off' ? colors.bibleDivider : colors.bibleAccent,
              },
            ]}
            onPress={() => setShowBackgroundMusicModal(true)}
            accessibilityRole="button"
            accessibilityLabel={`Background music: ${selectedBackgroundMusic.label}`}
            accessibilityHint="Opens the bundled background music picker"
          >
            <Ionicons
              name={backgroundMusicChoice === 'off' ? 'musical-notes-outline' : 'musical-notes'}
              size={16}
              color={
                backgroundMusicChoice === 'off' ? colors.biblePrimaryText : colors.bibleAccent
              }
            />
            <Text
              style={[
                styles.listenChipText,
                {
                  color:
                    backgroundMusicChoice === 'off'
                      ? colors.biblePrimaryText
                      : colors.bibleAccent,
                },
              ]}
              numberOfLines={1}
            >
              {ambientChipLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listenActionRow}>
          <TouchableOpacity
            style={styles.listenActionButton}
            onPress={onShare}
            disabled={!onShare}
            accessibilityRole="button"
            accessibilityLabel="Share chapter"
          >
            <Ionicons name="share-outline" size={22} color={colors.bibleSecondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listenActionButton}
            onPress={onToggleFavorite}
            disabled={!onToggleFavorite}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove favorite' : 'Save favorite'}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.bibleAccent : colors.bibleSecondaryText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listenActionButton}
            onPress={onOpenChapterActions}
            disabled={!onOpenChapterActions}
            accessibilityRole="button"
            accessibilityLabel="More chapter options"
          >
            <Ionicons name="options-outline" size={22} color={colors.bibleSecondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listenActionButton}
            onPress={onOpenFeedback}
            disabled={!onOpenFeedback}
            accessibilityRole="button"
            accessibilityLabel="Chapter feedback"
          >
            <Ionicons name="chatbubble-outline" size={22} color={colors.bibleSecondaryText} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showVoiceModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowVoiceModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowVoiceModal(false)}>
            <View
              style={[
                styles.modalContent,
                styles.voiceModalContent,
                { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.biblePrimaryText }]}>
                Choose voice
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.bibleSecondaryText }]}>
                Select a narration voice for this Bible.
              </Text>
              {voiceOptions.map((voice) => {
                const isSelected = voice.id === selectedVoice?.id;

                return (
                  <TouchableOpacity
                    key={voice.id}
                    style={[
                      styles.voiceOption,
                      {
                        backgroundColor: isSelected
                          ? colors.bibleElevatedSurface
                          : colors.bibleBackground,
                        borderColor: isSelected ? colors.bibleAccent : colors.bibleDivider,
                      },
                    ]}
                    onPress={() => {
                      onSelectVoice?.(voice.id);
                      setShowVoiceModal(false);
                    }}
                    disabled={!onSelectVoice}
                  >
                    <View style={styles.voiceOptionCopy}>
                      <View
                        style={[
                          styles.voiceOptionFlag,
                          { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
                        ]}
                      >
                        <Text style={styles.voiceOptionFlagText}>{voice.flag.emoji}</Text>
                      </View>
                      <View style={styles.voiceOptionTextBlock}>
                        <Text
                          style={[
                            styles.voiceOptionLabel,
                            { color: isSelected ? colors.bibleAccent : colors.biblePrimaryText },
                          ]}
                        >
                          {voice.label}
                        </Text>
                        <Text
                          style={[styles.voiceOptionMeta, { color: colors.bibleSecondaryText }]}
                        >
                          {voice.flag.countryCode}
                          {listenTranslationLabel ? ` • ${listenTranslationLabel}` : ''}
                        </Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={18} color={colors.bibleAccent} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Modal>

        <Modal
          visible={showBackgroundMusicModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowBackgroundMusicModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowBackgroundMusicModal(false)}>
            <View
              style={[
                styles.modalContent,
                styles.listenAmbientModal,
                { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.biblePrimaryText }]}>
                Music and sounds
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.bibleSecondaryText }]}>
                Choose a bundled background layer for offline scripture listening.
              </Text>
              {BACKGROUND_MUSIC_OPTIONS.map((option) => {
                const isSelected = option.id === backgroundMusicChoice;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.backgroundMusicOption,
                      {
                        backgroundColor: isSelected
                          ? colors.bibleElevatedSurface
                          : colors.bibleBackground,
                        borderColor: colors.bibleDivider,
                      },
                    ]}
                    onPress={() => {
                      onChangeBackgroundMusicChoice(option.id);
                      setShowBackgroundMusicModal(false);
                    }}
                  >
                    <View style={styles.backgroundMusicCopy}>
                      <Text
                        style={[
                          styles.backgroundMusicLabel,
                          {
                            color: isSelected ? colors.bibleAccent : colors.biblePrimaryText,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={[
                          styles.backgroundMusicDescription,
                          { color: colors.bibleSecondaryText },
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={20} color={colors.bibleAccent} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.transportRow, isChapterOnlyTransport ? styles.chapterOnlyTransportRow : null]}
      >
        <TouchableOpacity
          style={[
            styles.iconButton,
            isChapterOnlyTransport ? styles.chapterOnlyTransportButton : null,
            !hasPreviousChapter && styles.disabledButton,
          ]}
          onPress={onPreviousChapter}
          disabled={!hasPreviousChapter || isLoading}
        >
          <Ionicons
            name="play-skip-back"
            size={isChapterOnlyTransport ? 28 : 20}
            color={hasPreviousChapter ? colors.biblePrimaryText : colors.bibleSecondaryText}
          />
        </TouchableOpacity>

        {showSkipControls ? (
          <TouchableOpacity
            style={[
              styles.skipButton,
              { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
            ]}
            onPress={onSkipBackward}
            disabled={isLoading}
          >
            <Ionicons name="play-back" size={16} color={colors.biblePrimaryText} />
            <Text style={[styles.skipLabel, { color: colors.biblePrimaryText }]}>10</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[
            styles.playButton,
            isChapterOnlyTransport ? styles.chapterOnlyPlayButton : null,
            { backgroundColor: colors.bibleControlBackground },
          ]}
          onPress={onPlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons
              name="hourglass"
              size={isChapterOnlyTransport ? 32 : 26}
              color={colors.bibleBackground}
            />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={isChapterOnlyTransport ? 34 : 26}
              color={colors.bibleBackground}
            />
          )}
        </TouchableOpacity>

        {showSkipControls ? (
          <TouchableOpacity
            style={[
              styles.skipButton,
              { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
            ]}
            onPress={onSkipForward}
            disabled={isLoading}
          >
            <Text style={[styles.skipLabel, { color: colors.biblePrimaryText }]}>10</Text>
            <Ionicons name="play-forward" size={16} color={colors.biblePrimaryText} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[
            styles.iconButton,
            isChapterOnlyTransport ? styles.chapterOnlyTransportButton : null,
            !hasNextChapter && styles.disabledButton,
          ]}
          onPress={onNextChapter}
          disabled={!hasNextChapter || isLoading}
        >
          <Ionicons
            name="play-skip-forward"
            size={isChapterOnlyTransport ? 28 : 20}
            color={hasNextChapter ? colors.biblePrimaryText : colors.bibleSecondaryText}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.utilityRow, isChapterOnlyTransport ? styles.chapterOnlyUtilityRow : null]}>
        <TouchableOpacity
          style={[
            styles.utilityButton,
            { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
          ]}
          onPress={() => setShowTimerModal(true)}
        >
          <Ionicons
            name={sleepTimerRemaining ? 'timer' : 'timer-outline'}
            size={18}
            color={sleepTimerRemaining ? colors.bibleAccent : colors.biblePrimaryText}
          />
          <Text
            style={[
              styles.utilityText,
              {
                color: sleepTimerRemaining ? colors.bibleAccent : colors.biblePrimaryText,
              },
            ]}
          >
            {sleepTimerRemaining ? `${sleepTimerRemaining}m` : '...'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.utilityButton,
            styles.musicUtilityButton,
            { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
          ]}
          onPress={() => setShowBackgroundMusicModal(true)}
          accessibilityRole="button"
          accessibilityLabel={`Background music: ${selectedBackgroundMusic.label}`}
          accessibilityHint="Opens the bundled background music picker"
        >
          <Ionicons
            name={backgroundMusicChoice === 'off' ? 'musical-notes-outline' : 'musical-notes'}
            size={18}
            color={backgroundMusicIconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.utilityButton,
            styles.repeatUtilityButton,
            { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
          ]}
          onPress={() => onCycleRepeatMode()}
          accessibilityRole="button"
          accessibilityLabel={repeatAccessibilityLabel}
          accessibilityHint="Cycles repeat off, repeat chapter, and repeat book"
        >
          {renderRepeatModeIcon()}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.utilityButton,
            { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
          ]}
          onPress={() => setShowSpeedModal(true)}
        >
          <Text style={[styles.utilityText, { color: colors.biblePrimaryText }]}>
            {playbackRate}x
          </Text>
        </TouchableOpacity>

        {showTextUtility ? (
          <TouchableOpacity
            style={[
              styles.utilityButton,
              styles.textUtilityButton,
              isChapterOnlyTransport ? styles.chapterOnlyTextUtilityButton : null,
              { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
            ]}
            onPress={onShowText}
            accessibilityRole="button"
            accessibilityLabel={showTextLabel ?? 'Show text'}
            accessibilityHint="Opens the Bible text for the currently playing chapter"
          >
            {renderTextUtilityIcon()}
            <Text style={[styles.utilityText, { color: colors.biblePrimaryText }]}>
              {showTextLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal
        visible={showBackgroundMusicModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBackgroundMusicModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowBackgroundMusicModal(false)}>
          <View
            style={[
              styles.modalContent,
              styles.backgroundMusicModalContent,
              { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.biblePrimaryText }]}>
              Music and sounds
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.bibleSecondaryText }]}>
              Choose a bundled background layer for offline scripture listening.
            </Text>
            {BACKGROUND_MUSIC_OPTIONS.map((option) => {
              const isSelected = option.id === backgroundMusicChoice;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.backgroundMusicOption,
                    {
                      backgroundColor: isSelected
                        ? colors.bibleElevatedSurface
                        : colors.bibleBackground,
                      borderColor: colors.bibleDivider,
                    },
                  ]}
                  onPress={() => {
                    onChangeBackgroundMusicChoice(option.id);
                    setShowBackgroundMusicModal(false);
                  }}
                >
                  <View style={styles.backgroundMusicCopy}>
                    <Text
                      style={[
                        styles.backgroundMusicLabel,
                        {
                          color: isSelected ? colors.bibleAccent : colors.biblePrimaryText,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.backgroundMusicDescription,
                        { color: colors.bibleSecondaryText },
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark" size={20} color={colors.bibleAccent} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showSpeedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSpeedModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSpeedModal(false)}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.biblePrimaryText }]}>
              {t('audio.playbackSpeed')}
            </Text>
            {PLAYBACK_RATES.map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.modalOption,
                  rate === playbackRate && {
                    backgroundColor: colors.bibleElevatedSurface,
                  },
                ]}
                onPress={() => {
                  onChangePlaybackRate(rate);
                  setShowSpeedModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: rate === playbackRate ? colors.bibleAccent : colors.biblePrimaryText,
                    },
                  ]}
                >
                  {rate}x
                </Text>
                {rate === playbackRate ? (
                  <Ionicons name="checkmark" size={20} color={colors.bibleAccent} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showTimerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowTimerModal(false)}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.bibleSurface, borderColor: colors.bibleDivider },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.biblePrimaryText }]}>
              {t('audio.sleepTimer')}
            </Text>
            {SLEEP_TIMER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={styles.modalOption}
                onPress={() => {
                  onSetSleepTimer(option.value);
                  setShowTimerModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: colors.biblePrimaryText }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  chapterOnlyTransportRow: {
    gap: 18,
    marginTop: 6,
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  chapterOnlyUtilityRow: {
    gap: 10,
    marginTop: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterOnlyTransportButton: {
    width: 52,
    height: 52,
  },
  utilityButton: {
    minWidth: 64,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  utilityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  musicUtilityButton: {
    minWidth: 38,
    paddingHorizontal: 10,
  },
  repeatUtilityButton: {
    minWidth: 38,
    paddingHorizontal: 10,
  },
  textUtilityButton: {
    minWidth: 80,
  },
  chapterOnlyTextUtilityButton: {
    paddingHorizontal: 10,
  },
  repeatIconWrapper: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textUtilityIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textUtilityIconBubble: {
    width: 16,
    minHeight: 13,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 3,
    paddingVertical: 3,
    gap: 2,
  },
  textUtilityIconTail: {
    position: 'absolute',
    left: 4,
    bottom: 0,
    width: 5,
    height: 5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    transform: [{ rotate: '-45deg' }],
    backgroundColor: 'transparent',
  },
  textUtilityIconLineLong: {
    width: 8,
    height: 1.5,
    borderRadius: 999,
  },
  textUtilityIconLineMedium: {
    width: 7,
    height: 1.5,
    borderRadius: 999,
  },
  textUtilityIconLineShort: {
    width: 5,
    height: 1.5,
    borderRadius: 999,
  },
  repeatBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  repeatBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    lineHeight: 10,
  },
  disabledButton: {
    opacity: 0.45,
  },
  skipButton: {
    minWidth: 64,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  skipLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  chapterOnlyPlayButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginHorizontal: 10,
  },
  listenContainer: {
    gap: 18,
  },
  listenTransportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  listenTransportButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  listenPlayButton: {
    width: 74,
    height: 74,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  listenChip: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listenChipFlag: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  listenChipFlagText: {
    fontSize: 13,
  },
  listenChipText: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 168,
  },
  listenActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 2,
  },
  listenActionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    textAlign: 'center',
  },
  voiceModalContent: {
    gap: 10,
    maxWidth: 360,
  },
  listenAmbientModal: {
    gap: 10,
  },
  modalOption: {
    minHeight: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  backgroundMusicModalContent: {
    gap: 10,
  },
  backgroundMusicOption: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backgroundMusicCopy: {
    flex: 1,
    gap: 4,
  },
  backgroundMusicLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  backgroundMusicDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
  voiceOption: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  voiceOptionCopy: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voiceOptionFlag: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  voiceOptionFlagText: {
    fontSize: 18,
  },
  voiceOptionTextBlock: {
    flex: 1,
    gap: 2,
  },
  voiceOptionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  voiceOptionMeta: {
    fontSize: 12,
    lineHeight: 16,
  },
});
