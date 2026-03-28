import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { AudioPlaybackSequenceEntry } from '../types';

export type MeditationCollectionId = string;

export type PrayerCollectionId = string;

// Home Stack
export type HomeStackParamList = {
  HomeScreen: undefined;
};

// Bible Stack
export type BibleStackParamList = {
  BibleBrowser: undefined;
  BibleReader: {
    bookId: string;
    chapter: number;
    autoplayAudio?: boolean;
    preferredMode?: 'listen' | 'read';
    focusVerse?: number;
    playbackSequenceEntries?: AudioPlaybackSequenceEntry[];
  };
  ChapterSelector: {
    bookId: string;
  };
};

// Meditate Stack
export type MeditateStackParamList = {
  MeditationJourney:
    | {
        journeyId?: string;
        initialStepIndex?: number;
      }
    | undefined;
  MeditateHome: undefined;
  MeditationDetail: {
    collectionId: MeditationCollectionId;
  };
};

// Prayer Stack
export type PrayerStackParamList = {
  PrayerJourney:
    | {
        journeyId?: string;
        initialStepIndex?: number;
      }
    | undefined;
  PrayerHome: undefined;
  FreePrayer: undefined;
  PrayerCategory: {
    collectionId: Exclude<PrayerCollectionId, 'free-prayer'>;
  };
};

// Learn Stack
export type LearnStackParamList = {
  GatherHome: undefined;
  FoundationDetail: {
    foundationId: string;
  };
  LessonDetail: {
    parentId: string;
    lessonId: string;
    parentType: 'foundation' | 'topic';
  };
  GroupList: undefined;
  GroupDetail: {
    groupId: string;
  };
  GroupSession: {
    groupId: string;
  };
  PrayerWall: {
    groupId: string;
    groupName: string;
  };
  // Reading Plans screens
  ReadingPlanList: undefined;
  ReadingPlanDetail: {
    planId: string;
  };
};

// More Stack
export type MoreStackParamList = {
  MoreScreen: undefined;
  Settings: undefined;
  LocalePreferences: undefined;
  PrivacyPreferences: undefined;
  Profile: undefined;
  ReadingActivity: undefined;
  Annotations: undefined;
  TranslationBrowser: undefined;
  About: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
};

// Auth Stack
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// Root Tab Navigator
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Bible: NavigatorScreenParams<BibleStackParamList>;
  Meditate: NavigatorScreenParams<MeditateStackParamList>;
  Prayer: NavigatorScreenParams<PrayerStackParamList>;
  More: NavigatorScreenParams<MoreStackParamList>;
};

export type RootTabName = 'Home' | 'Bible' | 'Meditate' | 'Prayer' | 'More';

// Screen props helpers
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export type BibleBrowserScreenProps = NativeStackScreenProps<BibleStackParamList, 'BibleBrowser'>;
export type BibleReaderScreenProps = NativeStackScreenProps<BibleStackParamList, 'BibleReader'>;
export type ChapterSelectorScreenProps = NativeStackScreenProps<
  BibleStackParamList,
  'ChapterSelector'
>;

export type MeditateHomeScreenProps = NativeStackScreenProps<MeditateStackParamList, 'MeditateHome'>;
export type MeditationJourneyScreenProps = NativeStackScreenProps<
  MeditateStackParamList,
  'MeditationJourney'
>;
export type MeditationDetailScreenProps = NativeStackScreenProps<
  MeditateStackParamList,
  'MeditationDetail'
>;

export type PrayerHomeScreenProps = NativeStackScreenProps<PrayerStackParamList, 'PrayerHome'>;
export type PrayerJourneyScreenProps = NativeStackScreenProps<
  PrayerStackParamList,
  'PrayerJourney'
>;
export type FreePrayerScreenProps = NativeStackScreenProps<PrayerStackParamList, 'FreePrayer'>;
export type PrayerCategoryScreenProps = NativeStackScreenProps<
  PrayerStackParamList,
  'PrayerCategory'
>;

export type GatherHomeScreenProps = NativeStackScreenProps<LearnStackParamList, 'GatherHome'>;
export type FoundationDetailScreenProps = NativeStackScreenProps<
  LearnStackParamList,
  'FoundationDetail'
>;
export type LessonDetailScreenProps = NativeStackScreenProps<LearnStackParamList, 'LessonDetail'>;
export type GroupListScreenProps = NativeStackScreenProps<LearnStackParamList, 'GroupList'>;
export type GroupDetailScreenProps = NativeStackScreenProps<LearnStackParamList, 'GroupDetail'>;
export type GroupSessionScreenProps = NativeStackScreenProps<LearnStackParamList, 'GroupSession'>;
export type PrayerWallScreenProps = NativeStackScreenProps<LearnStackParamList, 'PrayerWall'>;
export type ReadingPlanListScreenProps = NativeStackScreenProps<LearnStackParamList, 'ReadingPlanList'>;
export type ReadingPlanDetailScreenProps = NativeStackScreenProps<LearnStackParamList, 'ReadingPlanDetail'>;

export type MoreScreenProps = NativeStackScreenProps<MoreStackParamList, 'MoreScreen'>;
export type SettingsScreenProps = NativeStackScreenProps<MoreStackParamList, 'Settings'>;
export type PrivacyPreferencesScreenProps = NativeStackScreenProps<
  MoreStackParamList,
  'PrivacyPreferences'
>;
export type ProfileScreenProps = NativeStackScreenProps<MoreStackParamList, 'Profile'>;
export type ReadingActivityScreenProps = NativeStackScreenProps<
  MoreStackParamList,
  'ReadingActivity'
>;
export type AnnotationsScreenProps = NativeStackScreenProps<MoreStackParamList, 'Annotations'>;
export type TranslationBrowserScreenProps = NativeStackScreenProps<MoreStackParamList, 'TranslationBrowser'>;
export type AboutScreenProps = NativeStackScreenProps<MoreStackParamList, 'About'>;

// Tab screen props
export type HomeTabProps = BottomTabScreenProps<RootTabParamList, 'Home'>;
export type BibleTabProps = BottomTabScreenProps<RootTabParamList, 'Bible'>;
export type MeditateTabProps = BottomTabScreenProps<RootTabParamList, 'Meditate'>;
export type PrayerTabProps = BottomTabScreenProps<RootTabParamList, 'Prayer'>;
export type MoreTabProps = BottomTabScreenProps<RootTabParamList, 'More'>;

// Global navigation type declaration
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootTabParamList {}
  }
}
