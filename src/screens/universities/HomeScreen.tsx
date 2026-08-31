import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { UNIVERSITIES_SORTED } from '../../data';
import { University } from '../../types';
import { useAppTheme } from '../../theme';
import { UniversityCard } from '../../components/UniversityCard';
import { PressableScale } from '../../components/PressableScale';
import { setSelectedUniversity } from '../../storage';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// GradeTrack Pro — Home Screen
// Home lives outside the bottom tab bar (it's the university-picker
// landing screen, reached before a university context even exists).
// That previously meant Settings/History/Dashboard/Planner were only
// reachable AFTER picking a university — real device testing showed
// this reads as "no buttons, nothing findable." Fixed with a
// persistent quick-access icon row right here, plus a one-tap theme
// toggle directly on the main page (not buried in Settings only).

export function HomeScreen({ navigation }: Props) {
  const { theme, type, spacing, layoutSafety, isDark, setMode } = useAppTheme();
  const insets = useSafeAreaInsets();

  const goToUniversity = async (university: University, mode: 'sgpa' | 'cgpa') => {
    await setSelectedUniversity(university.id);
    if (mode === 'sgpa') {
      navigation.navigate('SgpaCourseEntry', { universityId: university.id });
    } else {
      navigation.navigate('CgpaEntry', { universityId: university.id });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={UNIVERSITIES_SORTED}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + layoutSafety.bottomContentPadding + spacing.xxl,
          paddingHorizontal: spacing.md,
          width: '100%',
          maxWidth: layoutSafety.maxContentWidth,
          alignSelf: 'center',
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.lg }}>
            <View style={styles.topRow}>
              <Text style={[type.wordmark, { color: theme.navyText, flex: 1 }]}>
                GradeTrack <Text style={{ color: theme.accent }}>Pro</Text>
              </Text>
              <View style={styles.quickIcons}>
                <PressableScale
                  onPress={() => setMode(isDark ? 'light' : 'dark')}
                  haptic="selection"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={19} color={theme.textPrimary} />
                </PressableScale>
                <PressableScale
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
                  haptic="selection"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <Ionicons name="home-outline" size={19} color={theme.textPrimary} />
                </PressableScale>
                <PressableScale
                  onPress={() => navigation.navigate('MainTabs', { screen: 'History' })}
                  haptic="selection"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <Ionicons name="time-outline" size={19} color={theme.textPrimary} />
                </PressableScale>
                <PressableScale
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Settings' })}
                  haptic="selection"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <Ionicons name="settings-outline" size={19} color={theme.textPrimary} />
                </PressableScale>
              </View>
            </View>
            <Text style={[type.body, { color: theme.textSecondary, marginTop: 10 }]}>
              Select your university to calculate SGPA, CGPA, and plan your academic future.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: spacing.md }}>
            <UniversityCard
              university={item}
              onPressAbout={() => navigation.navigate('UniversityInfo', { universityId: item.id })}
              onPressWebsite={() => WebBrowser.openBrowserAsync(item.websiteUrl)}
              onPressSgpa={() => goToUniversity(item, 'sgpa')}
              onPressCgpa={() => goToUniversity(item, 'cgpa')}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quickIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
