import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { useAppTheme } from '../theme';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { CalculatorScreen } from '../screens/calculator/CalculatorScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { PlannerScreen } from '../screens/planner/PlannerScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { active: any; inactive: any }> = {
  Dashboard: { active: 'home', inactive: 'home-outline' },
  Calculate: { active: 'calculator', inactive: 'calculator-outline' },
  History: { active: 'time', inactive: 'time-outline' },
  Planner: { active: 'flag', inactive: 'flag-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

export function MainTabNavigator() {
  const { theme, tabBarHeight } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        // Height = base tab bar + bottom safe-area inset, so the bar
        // never overlaps the Android gesture pill / iOS home indicator.
        tabBarStyle: {
          height: tabBarHeight + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: StyleSheetHairline,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const set = ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? set.active : set.inactive} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Calculate" component={CalculatorScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const StyleSheetHairline = 0.5;
