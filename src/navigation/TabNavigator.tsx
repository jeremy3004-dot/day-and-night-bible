import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootTabParamList } from './types';
import { HomeStack } from './HomeStack';
import { BibleStack } from './BibleStack';
import { MeditateStack } from './MeditateStack';
import { PrayerStack } from './PrayerStack';
import { MoreStack } from './MoreStack';
import { useTheme } from '../contexts/ThemeContext';
import { rootTabManifest } from './tabManifest';
import { shouldHideTabBarOnNestedRoute } from './tabBarVisibility';
import { layout, shadows, shellChrome, spacing, typography } from '../design/system';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabBarGlassBackground() {
  const { isDark } = useTheme();

  return (
    <View pointerEvents="none" style={styles.glassDockBackground}>
      <BlurView
        tint={isDark ? 'dark' : 'light'}
        intensity={shellChrome.glassBlurIntensity}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        pointerEvents="none"
        colors={
          isDark
            ? ['rgba(255, 255, 255, 0.14)', 'rgba(255, 255, 255, 0.04)']
            : ['rgba(255, 255, 255, 0.86)', 'rgba(255, 255, 255, 0.34)']
        }
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        pointerEvents="none"
        style={[
          styles.glassDockStroke,
          {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(17, 19, 24, 0.10)',
          },
        ]}
      />
    </View>
  );
}

export function TabNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = layout.tabBarBaseHeight + insets.bottom;
  const defaultTabBarStyle = {
    position: 'absolute',
    left: shellChrome.floatingInset,
    right: shellChrome.floatingInset,
    bottom: insets.bottom > 0 ? insets.bottom + shellChrome.floatingGap : shellChrome.floatingGap,
    backgroundColor: colors.glassBackground,
    borderTopWidth: 0,
    borderWidth: 0,
    borderRadius: shellChrome.dockRadius,
    overflow: 'hidden',
    paddingTop: spacing.sm,
    paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
    height: tabBarHeight,
    ...shadows.floating,
  } as const;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarBackground: () => <TabBarGlassBackground />,
        tabBarStyle:
          shouldHideTabBarOnNestedRoute(getFocusedRouteNameFromRoute(route))
            ? { display: 'none' }
            : defaultTabBarStyle,
        tabBarLabelStyle: typography.tabLabel,
        tabBarItemStyle: {
          paddingVertical: spacing.xs,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const tab = rootTabManifest.find((entry) => entry.name === route.name);
          const iconName = focused ? tab?.focusedIcon : tab?.unfocusedIcon;

          if (!iconName) {
            return null;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="Bible" component={BibleStack} options={{ tabBarLabel: t('tabs.bible') }} />
      <Tab.Screen
        name="Meditate"
        component={MeditateStack}
        options={{ tabBarLabel: t('tabs.meditate') }}
      />
      <Tab.Screen
        name="Prayer"
        component={PrayerStack}
        options={{ tabBarLabel: t('tabs.prayer') }}
      />
      <Tab.Screen name="More" component={MoreStack} options={{ tabBarLabel: t('tabs.more') }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  glassDockBackground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  glassDockStroke: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: shellChrome.glassStrokeWidth,
    borderRadius: shellChrome.dockRadius,
  },
});
