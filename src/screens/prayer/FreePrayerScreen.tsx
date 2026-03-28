import { useState } from 'react';
import {
  ImageBackground,
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
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { prayerImages } from '../../data/prayerImages';
import { layout, radius, shellChrome, shadows, spacing, typography } from '../../design/system';
import type { PrayerStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<PrayerStackParamList>;

export function FreePrayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [prayerText, setPrayerText] = useState('');
  const image = prayerImages.freePrayer;

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
              colors={[`${colors.background}08`, `${colors.background}F2`]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <Text style={[styles.heroEyebrow, { color: colors.accentPrimary }]}>
                {t('prayer.homeTitle')}
              </Text>
              <Text style={[styles.heroTitle, { color: colors.primaryText }]}>
                {t('prayer.freePrayer')}
              </Text>
              <Text style={[styles.heroBody, { color: colors.secondaryText }]}>
                {t('prayer.subtitle')}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View
          style={[
            styles.editorCard,
            { backgroundColor: colors.glassBackground, borderColor: colors.cardBorder },
          ]}
        >
          <TextInput
            multiline
            value={prayerText}
            onChangeText={setPrayerText}
            placeholder={t('prayer.freePrayerPlaceholder')}
            placeholderTextColor={colors.secondaryText}
            selectionColor={colors.accentPrimary}
            textAlignVertical="top"
            style={[styles.textInput, { color: colors.primaryText }]}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setPrayerText('')}
            style={[styles.secondaryButton, { borderColor: colors.cardBorder }]}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primaryText }]}>
              {t('common.clear')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.goBack()}
            style={[styles.primaryButton, { backgroundColor: colors.accentPrimary }]}
          >
            <Text style={[styles.primaryButtonText, { color: colors.bibleControlBackground }]}>
              {t('common.done')}
            </Text>
          </TouchableOpacity>
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
    minHeight: 210,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: shellChrome.panelRadius,
  },
  heroContent: {
    padding: layout.cardPadding,
    gap: spacing.sm,
  },
  heroEyebrow: {
    ...typography.eyebrow,
  },
  heroTitle: {
    ...typography.pageTitle,
  },
  heroBody: {
    ...typography.body,
  },
  editorCard: {
    borderRadius: shellChrome.panelRadius,
    borderWidth: 1,
    minHeight: 300,
    padding: layout.cardPadding,
    overflow: 'hidden',
    ...shadows.floating,
  },
  textInput: {
    ...typography.body,
    minHeight: 260,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    ...typography.button,
  },
  primaryButton: {
    flex: 1,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    ...typography.button,
  },
});
