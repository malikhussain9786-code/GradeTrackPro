import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../theme';
import { getSelectedUniversity, setSelectedUniversity } from '../../storage';
import { UniversityId } from '../../types';
import { UniversitySelector } from '../../components/UniversitySelector';
import { PressableScale } from '../../components/PressableScale';
import { LoadingView } from '../../components/LoadingView';
import { BackToHomeButton } from '../../components/BackToHomeButton';
import { RootStackParamList } from '../../navigation/types';

type ParentNav = NativeStackNavigationProp<RootStackParamList>;

// GradeTrack Pro — Calculate Tab (Hub)
// Lightweight landing screen: pick a university, then choose SGPA or
// CGPA. Both choices push to their own full screen (back-chevron
// header, matching the mockups) rather than living inline in the tab.

export function CalculatorScreen() {
  const { theme, type, spacing, radius, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const parentNav = navigation.getParent<ParentNav>() ?? (navigation as unknown as ParentNav);

  const [universityId, setUniversityId] = useState<UniversityId | null>(null);

  useEffect(() => {
    getSelectedUniversity().then((id) => setUniversityId(id ?? 'foundation'));
  }, []);

  if (!universityId) return <LoadingView />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + spacing.lg }]}>
      <View style={{ width: '100%', maxWidth: layoutSafety.maxContentWidth, alignSelf: 'center' }}>
      <View style={[styles.titleRow, { paddingHorizontal: spacing.md }]}>
        <BackToHomeButton />
        <Text style={[type.h1, { color: theme.textPrimary }]}>Calculate</Text>
      </View>
      <Text style={[type.body, { color: theme.textSecondary, paddingHorizontal: spacing.md, marginTop: 4 }]}>
        Choose a university, then pick what you'd like to calculate.
      </Text>

      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
        <UniversitySelector
          value={universityId}
          onChange={(id) => {
            setUniversityId(id);
            setSelectedUniversity(id);
          }}
        />
      </View>

      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
        <PressableScale
          onPress={() => parentNav.navigate('SgpaCourseEntry', { universityId })}
          haptic="light"
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.lg }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="calculator-outline" size={24} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.h2, { color: theme.textPrimary }]}>Calculate SGPA</Text>
            <Text style={[type.caption, { color: theme.textSecondary, marginTop: 2 }]}>
              Add this semester's courses and compute your GPA.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </PressableScale>

        <View style={{ height: spacing.sm }} />

        <PressableScale
          onPress={() => parentNav.navigate('CgpaEntry', { universityId })}
          haptic="light"
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.lg }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="stats-chart-outline" size={24} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.h2, { color: theme.textPrimary }]}>Calculate CGPA</Text>
            <Text style={[type.caption, { color: theme.textSecondary, marginTop: 2 }]}>
              Combine semesters into your cumulative GPA.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </PressableScale>
        <View style={{ height: spacing.sm }} />

        <PressableScale
          onPress={() => parentNav.navigate('SemesterList', { universityId })}
          haptic="light"
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.lg }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="folder-outline" size={24} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.h2, { color: theme.textPrimary }]}>My Semesters</Text>
            <Text style={[type.caption, { color: theme.textSecondary, marginTop: 2 }]}>
              View, edit, or delete your saved semesters.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </PressableScale>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
