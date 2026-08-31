import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Share, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../theme';
import { getUniversityById, getGradeScale } from '../../data';
import { getStandingInfo } from '../../engine/standingLabel';
import { buildSemesterFromSubjects } from '../../engine/semesterBuilder';
import { saveSemester, addHistoryEntry, updateHistoryEntry, findHistoryEntryByPayloadId, getSemesters } from '../../storage';
import { generateId, nowIso } from '../../utils/id';

import { CircularGauge } from '../../components/CircularGauge';
import { CourseBreakdownTable } from '../../components/CourseBreakdownTable';
import { AchievementBanner } from '../../components/AchievementBanner';
import { Button } from '../../components/Button';
import { PressableScale } from '../../components/PressableScale';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SgpaResult'>;

function defaultSemesterLabel(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  const season = month >= 7 || month === 0 ? 'Fall' : month >= 1 && month <= 4 ? 'Spring' : 'Summer';
  return `${season} ${year}`;
}

export function SgpaResultScreen({ route, navigation }: Props) {
  const { universityId, subjects, sgpa, totalCreditHours, totalQualityPoints, existingSemesterId } = route.params;
  const university = getUniversityById(universityId);
  const scale = getGradeScale(universityId);
  const { theme, type, spacing, radius, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [label, setLabel] = useState(route.params.semesterLabel ?? defaultSemesterLabel());
  const [editingLabel, setEditingLabel] = useState(false);
  const [saved, setSaved] = useState(Boolean(route.params.alreadySaved));
  const [saving, setSaving] = useState(false);

  if (!university) return null;

  const standing = getStandingInfo(sgpa);
  const maxPoints = subjects.reduce((sum, s) => sum + s.creditHours * scale.maxGpa, 0);

  async function handleSave() {
    if (!university) return;
    setSaving(true);
    try {
      // Compute the correct semesterNumber: preserve it when editing an
      // existing semester, otherwise place it after whatever's already
      // saved. (Previously hardcoded to 1 — fixed here since Dashboard's
      // chronological SGPA trend depends on this being accurate.)
      const existingSemesters = await getSemesters(universityId);
      const semesterNumber = existingSemesterId
        ? existingSemesters.find((s) => s.id === existingSemesterId)?.semesterNumber ?? existingSemesters.length + 1
        : existingSemesters.length + 1;

      const semester = buildSemesterFromSubjects(universityId, subjects, label, semesterNumber, existingSemesterId);
      await saveSemester(universityId, semester);

      const existingHistoryEntry = await findHistoryEntryByPayloadId(semester.id);
      if (existingHistoryEntry) {
        await updateHistoryEntry({
          ...existingHistoryEntry,
          title: label,
          resultValue: sgpa,
          creditHours: totalCreditHours,
          qualityPoints: totalQualityPoints,
          savedAt: nowIso(),
          payload: semester,
        });
      } else {
        await addHistoryEntry({
          id: generateId('hist'),
          type: 'sgpa',
          universityId,
          title: label,
          resultValue: sgpa,
          creditHours: totalCreditHours,
          qualityPoints: totalQualityPoints,
          savedAt: nowIso(),
          payload: semester,
        });
      }
      setSaved(true);
    } catch (err) {
      Alert.alert('Save failed', 'Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    if (!university) return;
    const lines = [
      `${label} — ${university.name}`,
      `SGPA: ${sgpa.toFixed(2)} / ${scale.maxGpa.toFixed(2)}`,
      `Credit Hours: ${totalCreditHours} · Quality Points: ${totalQualityPoints.toFixed(2)}`,
      '',
      ...subjects.map((s) => `${s.name} — ${s.creditHours}cr — ${s.computedGrade} (${s.computedPoints.toFixed(2)})`),
      '',
      'Calculated with GradeTrack Pro',
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      // user cancelled share sheet — nothing to do
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
        <PressableScale onPress={() => navigation.goBack()} haptic="selection" style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </PressableScale>
        <Text style={[type.h1, { color: theme.textPrimary }]}>SGPA Result</Text>
        <PressableScale onPress={handleShare} haptic="selection" style={{ padding: 4 }}>
          <Ionicons name="share-outline" size={22} color={theme.textPrimary} />
        </PressableScale>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, width: '100%', maxWidth: layoutSafety.maxContentWidth, alignSelf: 'center' }}>
        {editingLabel ? (
          <TextInput
            value={label}
            onChangeText={setLabel}
            onBlur={() => setEditingLabel(false)}
            autoFocus
            style={[type.bodyMedium, { color: theme.textPrimary, textAlign: 'center', marginBottom: spacing.sm }]}
          />
        ) : (
          <PressableScale onPress={() => setEditingLabel(true)} haptic="selection">
            <Text style={[type.bodyMedium, { color: theme.textSecondary, textAlign: 'center', marginBottom: spacing.sm }]}>
              {label} · {university.shortName}  ✎
            </Text>
          </PressableScale>
        )}

        <View style={{ alignItems: 'center', marginVertical: spacing.md }}>
          <CircularGauge value={sgpa} max={scale.maxGpa} label="SGPA" />
        </View>

        <View style={[styles.statsRow, { backgroundColor: theme.surface, borderRadius: radius.md, borderColor: theme.border }]}>
          <View style={styles.statCell}>
            <Text style={[type.caption, { color: theme.textMuted }]}>Total Credits</Text>
            <Text style={[type.h1, { color: theme.textPrimary, marginTop: 2 }]}>{totalCreditHours}</Text>
          </View>
          <View style={[styles.statCell, { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: theme.border }]}>
            <Text style={[type.caption, { color: theme.textMuted }]}>Quality Points</Text>
            <Text style={[type.h1, { color: theme.textPrimary, marginTop: 2 }]}>{totalQualityPoints.toFixed(2)}</Text>
          </View>
          <View style={[styles.statCell, { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: theme.border }]}>
            <Text style={[type.caption, { color: theme.textMuted }]}>Max Points</Text>
            <Text style={[type.h1, { color: theme.textPrimary, marginTop: 2 }]}>{maxPoints.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <CourseBreakdownTable subjects={subjects} />
        </View>

        <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
          <Button
            label={saved ? 'Saved ✓' : 'Save to History'}
            icon="bookmark-outline"
            variant="primary"
            onPress={handleSave}
            disabled={saved}
            loading={saving}
            style={{ flex: 1 }}
          />
          <View style={{ width: spacing.xs }} />
          <Button label="Share Result" icon="share-social-outline" variant="secondary" onPress={handleShare} style={{ flex: 1 }} />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <AchievementBanner standing={standing} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: 14,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
});
