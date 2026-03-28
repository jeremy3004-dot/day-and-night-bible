import { useMemo } from 'react';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { ImageSourcePropType } from 'react-native';
import { JourneySessionScaffold, JourneyTransportDock } from '../../components/journey';
import { meditationImages } from '../../data/meditationVisuals';
import { getMeditationJourneyById } from '../../data/meditationJourneys';
import { useGuidedJourneySession } from '../../hooks';
import { useBibleStore } from '../../stores';
import type {
  MeditateStackParamList,
  MeditationJourneyScreenProps,
  RootTabParamList,
} from '../../navigation/types';
import type { MeditationImageKey } from '../../data/meditationCollections';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MeditateStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

export function MeditationJourneyScreen({ route }: MeditationJourneyScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const translationId = useBibleStore((state) => state.currentTranslation);
  const journey = useMemo(
    () => getMeditationJourneyById(route.params?.journeyId),
    [route.params?.journeyId]
  );
  const session = useGuidedJourneySession({
    journey,
    translationId,
    initialStepIndex: route.params?.initialStepIndex,
  });

  const imageSource = meditationImages[
    session.currentStep.imageKey as MeditationImageKey
  ] as ImageSourcePropType;

  return (
    <JourneySessionScaffold
      journeyKind="meditate"
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

        navigation.navigate('Meditate', { screen: 'MeditateHome' });
      }}
      onBrowse={() => navigation.navigate('Meditate', { screen: 'MeditateHome' })}
      onPrevious={() => {
        void session.goPrevious();
      }}
      onNext={() => {
        void session.goNext();
      }}
    >
      <JourneyTransportDock
        journeyKind="meditate"
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
              autoplayAudio: true,
              preferredMode: 'listen',
            },
          });
        }}
      />
    </JourneySessionScaffold>
  );
}
