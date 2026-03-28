import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { BACKGROUND_MUSIC_OPTIONS } from '../../services/audio';
import type { BackgroundMusicOption } from '../../services/audio/backgroundMusicCatalog';
import type {
  AudioStatus,
  TranslationAudioVoiceCatalog,
} from '../../types';
import type { BackgroundMusicChoice, GuidedJourneyKind } from '../../types';
import { spacing, radius, shadows } from '../../design/system';

interface JourneyTransportDockProps {
  journeyKind: GuidedJourneyKind;
  status: AudioStatus;
  hasPreviousStep: boolean;
  hasNextStep: boolean;
  canPlayAudio: boolean;
  ambientChoice: BackgroundMusicChoice;
  ambientOptions: BackgroundMusicOption[];
  voiceCatalog: TranslationAudioVoiceCatalog | null;
  selectedVoiceId: string | null;
  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onSelectAmbient: (choice: BackgroundMusicChoice) => void;
  onSelectVoice?: (voiceId: string) => void;
  onOpenBible?: () => void;
}

export function JourneyTransportDock({
  journeyKind,
  status,
  hasPreviousStep,
  hasNextStep,
  canPlayAudio,
  ambientChoice,
  ambientOptions,
  voiceCatalog,
  selectedVoiceId,
  onPrevious,
  onPlayPause,
  onNext,
  onSelectAmbient,
  onSelectVoice,
  onOpenBible,
}: JourneyTransportDockProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showAmbientModal, setShowAmbientModal] = useState(false);

  const selectedAmbient = useMemo(
    () => ambientOptions.find((option) => option.id === ambientChoice) ?? BACKGROUND_MUSIC_OPTIONS[0],
    [ambientChoice, ambientOptions]
  );
  const selectedVoice =
    voiceCatalog?.voices.find((voice) => voice.id === selectedVoiceId) ??
    voiceCatalog?.voices.find((voice) => voice.id === voiceCatalog?.defaultVoiceId) ??
    voiceCatalog?.voices[0] ??
    null;
  const journeyAccent = journeyKind === 'meditate' ? colors.accentSecondary : colors.accentPrimary;
  const journeySurface = journeyKind === 'meditate' ? colors.cardBackground : colors.glassBackground;

  return (
    <View style={styles.shell}>
      <View
        style={[
          styles.transportRow,
          {
            backgroundColor: journeySurface,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.transportButton, !hasPreviousStep && styles.disabledButton]}
          onPress={onPrevious}
          disabled={!hasPreviousStep || !canPlayAudio}
        >
          <Ionicons
            name="play-skip-back"
            size={26}
            color={hasPreviousStep ? colors.primaryText : colors.secondaryText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.playButton,
            {
              backgroundColor: journeyAccent,
            },
          ]}
          onPress={onPlayPause}
          disabled={!canPlayAudio}
        >
          <Ionicons
            name={status === 'playing' ? 'pause' : 'play'}
            size={32}
            color={colors.background}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.transportButton, !hasNextStep && styles.disabledButton]}
          onPress={onNext}
          disabled={!hasNextStep || !canPlayAudio}
        >
          <Ionicons
            name="play-skip-forward"
            size={26}
            color={hasNextStep ? colors.primaryText : colors.secondaryText}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.chipRow}>
        {voiceCatalog?.voices.length ? (
          <TouchableOpacity
            style={[
              styles.chip,
              {
                borderColor: showVoiceModal ? journeyAccent : colors.cardBorder,
                backgroundColor: colors.cardBackground,
              },
            ]}
            onPress={() => setShowVoiceModal(true)}
            disabled={!onSelectVoice}
          >
            <View
              style={[
                styles.flagBubble,
                {
                  borderColor: colors.cardBorder,
                  backgroundColor: colors.overlay,
                },
              ]}
            >
              <Text style={styles.flagText}>{selectedVoice?.flag.emoji ?? '🎙'}</Text>
            </View>
            <Text style={[styles.chipText, { color: colors.primaryText }]} numberOfLines={1}>
              {selectedVoice
                ? `${selectedVoice.label}`
                : t('journey.voice')}
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[
            styles.chip,
            {
              borderColor: showAmbientModal ? journeyAccent : colors.cardBorder,
              backgroundColor: colors.cardBackground,
            },
          ]}
          onPress={() => setShowAmbientModal(true)}
        >
          <Ionicons
            name={ambientChoice === 'off' ? 'musical-notes-outline' : 'musical-notes'}
            size={16}
            color={journeyAccent}
          />
          <Text style={[styles.chipText, { color: colors.primaryText }]} numberOfLines={1}>
            {selectedAmbient.label}
          </Text>
        </TouchableOpacity>

        {onOpenBible ? (
          <TouchableOpacity
            style={[
              styles.chip,
              {
                borderColor: colors.cardBorder,
                backgroundColor: colors.cardBackground,
              },
            ]}
            onPress={onOpenBible}
          >
            <Ionicons name="book-outline" size={16} color={colors.secondaryText} />
            <Text style={[styles.chipText, { color: colors.primaryText }]} numberOfLines={1}>
              {t('journey.openBible')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal
        visible={showVoiceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowVoiceModal(false)}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>
              {t('journey.chooseVoice')}
            </Text>
            {voiceCatalog?.voices.map((voice) => {
              const isSelected = voice.id === selectedVoiceId;

              return (
                <TouchableOpacity
                  key={voice.id}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: isSelected ? colors.overlay : colors.background,
                      borderColor: isSelected ? journeyAccent : colors.cardBorder,
                    },
                  ]}
                  onPress={() => {
                    onSelectVoice?.(voice.id);
                    setShowVoiceModal(false);
                  }}
                >
                  <View style={[styles.flagBubble, { borderColor: colors.cardBorder }]}>
                    <Text style={styles.flagText}>{voice.flag.emoji}</Text>
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={[styles.optionTitle, { color: colors.primaryText }]}>
                      {voice.label}
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.secondaryText }]}>
                      {voice.flag.countryCode}
                    </Text>
                  </View>
                  {isSelected ? <Ionicons name="checkmark" size={18} color={journeyAccent} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showAmbientModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAmbientModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowAmbientModal(false)}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>
              {t('journey.chooseAmbient')}
            </Text>
            {ambientOptions.map((option) => {
              const isSelected = option.id === ambientChoice;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor: isSelected ? colors.overlay : colors.background,
                      borderColor: isSelected ? journeyAccent : colors.cardBorder,
                    },
                  ]}
                  onPress={() => {
                    onSelectAmbient(option.id);
                    setShowAmbientModal(false);
                  }}
                >
                  <View style={styles.optionCopy}>
                    <Text style={[styles.optionTitle, { color: colors.primaryText }]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.secondaryText }]}>
                      {option.description}
                    </Text>
                  </View>
                  {isSelected ? <Ionicons name="checkmark" size={18} color={journeyAccent} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: spacing.sm,
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadows.floating,
  },
  transportButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 66,
    height: 66,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
    flexShrink: 1,
  },
  flagBubble: {
    width: 28,
    height: 28,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.42,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  modalSheet: {
    borderRadius: 28,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.md,
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
});
