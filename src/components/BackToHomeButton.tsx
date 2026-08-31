import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';
import { RootStackParamList } from '../navigation/types';

type ParentNav = NativeStackNavigationProp<RootStackParamList>;

// GradeTrack Pro — Back To Home Button
// Every tab screen (Dashboard, Calculate, History, Planner, Settings)
// can be reached directly from Home's quick-access icon row. Real
// device testing showed there was no obvious way back out — Android's
// back button gets intercepted by the tab navigator first (cycling
// through tab history before it ever pops back to Home), which reads
// as "stuck." This gives an explicit, always-visible, single-tap way
// back to the university list from anywhere in the tab bar.

export function BackToHomeButton() {
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const parentNav = navigation.getParent<ParentNav>() ?? (navigation as unknown as ParentNav);

  const handlePress = () => {
    if (parentNav.canGoBack()) {
      parentNav.goBack();
    } else {
      parentNav.navigate('Home');
    }
  };

  return (
    <PressableScale
      onPress={handlePress}
      haptic="selection"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ padding: 4, marginRight: 4 }}
    >
      <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
    </PressableScale>
  );
}
