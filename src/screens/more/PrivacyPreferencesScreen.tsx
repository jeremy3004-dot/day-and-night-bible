import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme, type ThemeColors } from '../../contexts/ThemeContext';
import { usePrivacyStore } from '../../stores/privacyStore';
import { getPrivacySettingsSavePlan } from '../../services/privacy/privacyPreferences';
import type { PrivacyAppIconMode } from '../../types';
import type { MoreStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<MoreStackParamList, 'PrivacyPreferences'>;

export function PrivacyPreferencesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const currentMode = usePrivacyStore((state) => state.mode);
  const hasExistingPin = usePrivacyStore((state) => state.hasPin);
  const saveConfiguration = usePrivacyStore((state) => state.saveConfiguration);
  const [selectedMode, setSelectedMode] = useState<PrivacyAppIconMode>(currentMode);
  const [pinInput, setPinInput] = useState('');
  const [pinConfirmation, setPinConfirmation] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectMode = (nextMode: PrivacyAppIconMode) => {
    setSelectedMode(nextMode);
    setErrorKey(null);

    if (nextMode === 'standard') {
      setPinInput('');
      setPinConfirmation('');
    }
  };

  const handleSave = async () => {
    const savePlan = getPrivacySettingsSavePlan({
      currentMode,
      hasExistingPin,
      selectedMode,
      pinInput,
      pinConfirmation,
    });

    if (savePlan.type === 'error') {
      setErrorKey(savePlan.errorKey);
      return;
    }

    if (savePlan.type === 'noop') {
      navigation.goBack();
      return;
    }

    setIsSaving(true);
    setErrorKey(null);

    try {
      const result = await saveConfiguration(savePlan.input);

      if (!result.success) {
        setErrorKey(result.errorKey);
        return;
      }

      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  const discreetSelected = selectedMode === 'discreet';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('onboarding.privacyTitle')}</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => void handleSave()}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.accentPrimary} />
          ) : (
            <Text style={styles.headerAction}>{t('common.done')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoCard}>
            <View style={styles.infoIconShell}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.accentPrimary} />
            </View>
            <Text style={styles.infoTitle}>{t('onboarding.privacyTitle')}</Text>
            <Text style={styles.infoBody}>{t('onboarding.privacyBody')}</Text>
          </View>

          <View style={styles.optionGroup}>
            <PrivacyModeOption
              body={t('onboarding.standardIconBody')}
              colors={colors}
              icon="book-outline"
              isSelected={selectedMode === 'standard'}
              onPress={() => selectMode('standard')}
              title={t('onboarding.standardIconTitle')}
            />
            <PrivacyModeOption
              body={t('onboarding.discreetIconBody')}
              colors={colors}
              icon="calculator-outline"
              isSelected={selectedMode === 'discreet'}
              onPress={() => selectMode('discreet')}
              title={t('onboarding.discreetIconTitle')}
            />
          </View>

          {discreetSelected ? (
            <View style={styles.pinCard}>
              <Text style={styles.pinTitle}>{t('onboarding.pinTitle')}</Text>
              <Text style={styles.pinBody}>{t('onboarding.pinBody')}</Text>

              <TextInput
                value={pinInput}
                onChangeText={(value) => {
                  setPinInput(value);
                  setErrorKey(null);
                }}
                placeholder={t('onboarding.pinPlaceholder')}
                placeholderTextColor={colors.secondaryText}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                value={pinConfirmation}
                onChangeText={(value) => {
                  setPinConfirmation(value);
                  setErrorKey(null);
                }}
                placeholder={t('onboarding.pinConfirmPlaceholder')}
                placeholderTextColor={colors.secondaryText}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.pinLegend}>{t('onboarding.pinLegend')}</Text>

              {errorKey ? <Text style={styles.errorText}>{t(errorKey)}</Text> : null}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface PrivacyModeOptionProps {
  body: string;
  colors: ThemeColors;
  icon: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
  title: string;
}

function PrivacyModeOption({
  body,
  colors,
  icon,
  isSelected,
  onPress,
  title,
}: PrivacyModeOptionProps) {
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        isSelected && {
          borderColor: colors.accentPrimary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.optionIconShell}>
        <Ionicons name={icon} size={20} color={colors.accentPrimary} />
      </View>
      <View style={styles.optionCopy}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionBody}>{body}</Text>
      </View>
      {isSelected ? (
        <Ionicons name="checkmark-circle" size={22} color={colors.accentPrimary} />
      ) : null}
    </TouchableOpacity>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
    },
    headerButton: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: colors.primaryText,
      textAlign: 'center',
    },
    headerAction: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.accentPrimary,
    },
    scrollView: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: 20,
      paddingBottom: 32,
      gap: 20,
    },
    infoCard: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 20,
      padding: 20,
      gap: 12,
    },
    infoIconShell: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentPrimary + '12',
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primaryText,
    },
    infoBody: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.secondaryText,
    },
    optionGroup: {
      gap: 12,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 18,
      padding: 18,
    },
    optionIconShell: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentPrimary + '12',
    },
    optionCopy: {
      flex: 1,
      gap: 4,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primaryText,
    },
    optionBody: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.secondaryText,
    },
    pinCard: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 20,
      padding: 20,
      gap: 12,
    },
    pinTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primaryText,
    },
    pinBody: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.secondaryText,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.primaryText,
      fontSize: 16,
    },
    pinLegend: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.secondaryText,
    },
    errorText: {
      fontSize: 13,
      color: colors.error,
      fontWeight: '600',
    },
  });
