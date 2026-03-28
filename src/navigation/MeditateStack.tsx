import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MeditateStackParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator<MeditateStackParamList>();

export function MeditateStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="MeditationJourney"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="MeditationJourney"
        getComponent={() =>
          require('../screens/meditate/MeditationJourneyScreen').MeditationJourneyScreen
        }
      />
      <Stack.Screen
        name="MeditateHome"
        getComponent={() => require('../screens/meditate/MeditateHomeScreen').MeditateHomeScreen}
      />
      <Stack.Screen
        name="MeditationDetail"
        getComponent={() =>
          require('../screens/meditate/MeditationDetailScreen').MeditationDetailScreen
        }
        />
    </Stack.Navigator>
  );
}
