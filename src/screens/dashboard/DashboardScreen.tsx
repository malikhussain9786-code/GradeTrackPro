import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../theme';
import { getSelectedUniversity, setSelectedUniversity, getSemesters, getSettings, updateSettings } from '../../storage';
import { getGradeScale } from '../../data';
import { UniversityId, Semester } from '../../types';
import { calculateCgpaFromSemesters } from '../../engine/cgpaCalculator';
import { getStandingInfo } from '../../engine/standingLabel';

import { UniversitySelector } from '../../components/UniversitySelector';
import { CgpaOverviewCard } from '../../components/CgpaOverviewCard';
import { SimpleLineChart } from '../../components/SimpleLineChart';
import { AchievementBanner } from '../../components/AchievementBanner';
import { PressableScale } from '../../components/PressableScale';
import { Button } from '../../components/Button';
import { LoadingView } from '../../components/LoadingView';
import { BackToHomeButton } from '../../components/BackToHomeButton';
import { RootStackParamList } from '../../navigation/types';

type ParentNav = NativeStackNavigationProp<RootStackParamList>;

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function DashboardScreen() {
  const { theme, type, spacing, radius, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const parentNav = navigation.getParent<ParentNav>() ?? (navigation as unknown as ParentNav);

  const [universityId, setUniversityId] = useState<UniversityId | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);

  const reload = useCallback(() => {
    getSelectedUniversity().then(async (id) => {
      const uid = id ?? 'foundation';
      setUniversityId(uid);
      const list = await getSemesters(uid);
      setSemesters([...list].sort((a, b) => a.semesterNumber - b.semesterNumber));
    });
    getSettings().then((s) => setDisplayName(s.displayName ?? ''));
  }, []);

  useFocusEffect(reload);

  if (!universityId) return <LoadingView />;

  const scale = getGradeScale(universityId);
  const cgpaResult = calculateCgpaFromSemesters(semesters);
  const standing = getStandingInfo(cgpaResult.cgpa);
  const latestSgpa = semesters.length > 0 ? semesters[semesters.length - 1].sgpa : null;

  const trendPoints = semesters.map((s, i) => ({
    label: `S${i + 1}`,
    value: s.sgpa,
  }));

  async function saveDisplayName() {
    await updateSettings({ displayName: displayName.trim() });
    setEditingName(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
          width: '100%',
          maxWidth: layoutSafety.maxContentWidth,
          alignSelf: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <BackToHomeButton />
          {editingName ? (
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              onBlur={saveDisplayName}
              onSubmitEditing={saveDisplayName}
              placeholder="Your name"
              placeholderTextColor={theme.textMuted}
              autoFocus
              style={[type.h1, { color: theme.textPrimary, flex: 1 }]}
            />
          ) : (
            <PressableScale onPress={() => setEditingName(true)} haptic="selection" style={{ flex: 1 }}>
              <Text style={[type.h1, { color: theme.textPrimary }]}>
                {greeting()}
                {displayName ? `, ${displayName}` : ''}
              </Text>
            </PressableScale>
          )}
        </View>
        <Text style={[type.body, { color: theme.textSecondary, marginTop: 4 }]}>
          Here's your academic overview.
        </Text>

        <View style={{ marginTop: spacing.md }}>
          <UniversitySelector
            value={universityId}
            onChange={(id) => {
              setUniversityId(id);
              setSelectedUniversity(id);
            }}
          />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <CgpaOverviewCard
            cgpa={cgpaResult.cgpa}
            maxGpa={scale.maxGpa}
            totalCreditHours={cgpaResult.totalCreditHours}
            semestersCompleted={semesters.length}
            standing={standing}
          />
        </View>

        {latestSgpa !== null && (
          <View
            style={[
              styles.latestSgpaCard,
              { backgroundColor: theme.accentSoft, borderRadius: radius.md, marginTop: spacing.sm },
            ]}
          >
            <Ionicons name="flash" size={16} color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={[type.bodyMedium, { color: theme.textPrimary }]}>
              Latest SGPA: <Text style={{ color: theme.accent, fontWeight: '700' }}>{latestSgpa.toFixed(2)}</Text>
            </Text>
          </View>
        )}

        <View style={[styles.chartCard, { backgroundColor: theme.surface, borderRadius: radius.lg, borderColor: theme.border, marginTop: spacing.lg }]}>
          <Text style={[type.h2, { color: theme.textPrimary, marginBottom: spacing.xs }]}>SGPA Trend</Text>
          <SimpleLineChart points={trendPoints} maxValue={scale.maxGpa} />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <AchievementBanner standing={standing} />
        </View>

        {/* Real-device feedback: this was previously only shown when
            there were zero saved semesters, so it vanished after the
            first save with no other way to add "Semester 2", "Semester
            3", etc. — now always visible. */}
        <View style={{ marginTop: spacing.lg, flexDirection: 'row' }}>
          <Button
            label={semesters.length === 0 ? 'Add Your First Semester' : 'Add Semester'}
            icon="add-circle-outline"
            variant="primary"
            onPress={() => parentNav.navigate('SgpaCourseEntry', { universityId })}
            style={{ flex: 1 }}
          />
          <View style={{ width: spacing.xs }} />
          <Button
            label="Calculate CGPA"
            icon="stats-chart-outline"
            variant="secondary"
            onPress={() => parentNav.navigate('CgpaEntry', { universityId })}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  latestSgpaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chartCard: {
    borderWidth: 1,
    padding: 16,
  },
});
