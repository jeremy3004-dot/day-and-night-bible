import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrayerStackParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator<PrayerStackParamList>();

export function PrayerStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="PrayerJourney"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="PrayerJourney"
        getComponent={() => require('../screens/prayer/PrayerJourneyScreen').PrayerJourneyScreen}
      />
      <Stack.Screen
        name="PrayerHome"
        getComponent={() => require('../screens/prayer/PrayerHomeScreen').PrayerHomeScreen}
      />
      <Stack.Screen
        name="FreePrayer"
        getComponent={() => require('../screens/prayer/FreePrayerScreen').FreePrayerScreen}
      />
      <Stack.Screen
        name="PrayerCategory"
        getComponent={() => require('../screens/prayer/PrayerCategoryScreen').PrayerCategoryScreen}
      />
    </Stack.Navigator>
  );
}
