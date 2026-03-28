import { useMemo } from 'react';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { ImageSourcePropType } from 'react-native';
import { JourneySessionScaffold, JourneyTransportDock } from '../../components/journey';
import { prayerImages } from '../../data/prayerImages';
import { getPrayerJourneyById } from '../../data/prayerJourneys';
import { useGuidedJourneySession } from '../../hooks';
import { useBibleStore } from '../../stores';
import type { PrayerImageKey } from '../../data/prayerCollections';
import type {
  PrayerJourneyScreenProps,
  PrayerStackParamList,
  RootTabParamList,
} from '../../navigation/types';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<PrayerStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

export function PrayerJourneyScreen({ route }: PrayerJourneyScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const translationId = useBibleStore((state) => state.currentTranslation);
  const journey = useMemo(
    () => getPrayerJourneyById(route.params?.journeyId),
    [route.params?.journeyId]
  );
  const session = useGuidedJourneySession({
    journey,
    translationId,
    initialStepIndex: route.params?.initialStepIndex,
  });

  const imageSource = prayerImages[session.currentStep.imageKey as PrayerImageKey] as ImageSourcePropType;

  return (
    <JourneySessionScaffold
      journeyKind="prayer"
      journeyTitle={session.title}
      journeySubtitle={session.subtitle}
      imageSource={imageSource}
      stepId={session.stepId}
      stepIndex={session.stepIndex}
      stepCount={session.stepCount}
      stepTitle={t(session.currentStep.titleKey)}
      stepBody={t(session.currentStep.bodyKey)}
      stepReferenceLabel={session.stepReferenceLabel}
      transitionDirection={session.transitionDirection}
      onBack={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return;
        }

        navigation.navigate('Prayer', { screen: 'PrayerHome' });
      }}
      onBrowse={() => navigation.navigate('Prayer', { screen: 'PrayerHome' })}
      onPrevious={() => {
        void session.goPrevious();
      }}
      onNext={() => {
        void session.goNext();
      }}
    >
      <JourneyTransportDock
        journeyKind="prayer"
        status={session.displayStatus}
        hasPreviousStep={session.hasPreviousStep}
        hasNextStep={session.hasNextStep}
        canPlayAudio={session.canPlayAudio}
        ambientChoice={session.ambientChoice}
        ambientOptions={session.ambientOptions}
        voiceCatalog={session.voiceCatalog}
        selectedVoiceId={session.selectedVoiceId}
        onPrevious={() => {
          void session.goPrevious();
        }}
        onPlayPause={() => {
          void session.togglePlayback();
        }}
        onNext={() => {
          void session.goNext();
        }}
        onSelectAmbient={(choice) => {
          session.selectAmbient(choice);
        }}
        onSelectVoice={(voiceId) => {
          session.selectVoice(voiceId);
        }}
        onOpenBible={() => {
          navigation.navigate('Bible', {
            screen: 'BibleReader',
            params: {
              bookId: session.currentStep.scriptureReference.bookId,
              chapter: session.currentStep.scriptureReference.chapter,
              focusVerse: session.currentStep.scriptureReference.verse,
              autoplayAudio: false,
              preferredMode: 'read',
            },
          });
        }}
      />
    </JourneySessionScaffold>
  );
}
