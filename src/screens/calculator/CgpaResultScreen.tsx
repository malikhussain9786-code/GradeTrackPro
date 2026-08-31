import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Share, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../theme';
import { getUniversityById, getGradeScale } from '../../data';
import { getStandingInfo } from '../../engine/standingLabel';
import { buildCgpaRecord } from '../../engine/cgpaRecordBuilder';
import { saveCgpaRecord, addHistoryEntry } from '../../storage';
import { generateId, nowIso } from '../../utils/id';

import { CircularGauge } from '../../components/CircularGauge';
import { SemesterBreakdownTable } from '../../components/SemesterBreakdownTable';
import { AchievementBanner } from '../../components/AchievementBanner';
import { Button } from '../../components/Button';
import { PressableScale } from '../../components/PressableScale';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CgpaResult'>;

function defaultCgpaLabel(): string {
  const now = new Date();
  return `Cumulative as of ${now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
}

export function CgpaResultScreen({ route, navigation }: Props) {
  const { universityId, semesterSummaries, cgpa, totalCreditHours, totalQualityPoints } = route.params;
  const university = getUniversityById(universityId);
  const scale = getGradeScale(universityId);
  const { theme, type, spacing, radius, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [label, setLabel] = useState(defaultCgpaLabel());
  const [editingLabel, setEditingLabel] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!university) return null;

  const standing = getStandingInfo(cgpa);
  const maxPoints = totalCreditHours * scale.maxGpa;

  async function handleSave() {
    setSaving(true);
    try {
      const record = buildCgpaRecord(universityId, semesterSummaries, totalCreditHours, totalQualityPoints, cgpa);
      await saveCgpaRecord(universityId, record);
      await addHistoryEntry({
        id: generateId('hist'),
        type: 'cgpa',
        universityId,
        title: label,
        resultValue: cgpa,
        creditHours: totalCreditHours,
        qualityPoints: totalQualityPoints,
        savedAt: nowIso(),
        payload: record,
      });
      setSaved(true);
    } catch {
      Alert.alert('Save failed', 'Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    if (!university) return;
    const lines = [
      `${label} — ${university.name}`,
      `CGPA: ${cgpa.toFixed(2)} / ${scale.maxGpa.toFixed(2)}`,
      `Credit Hours: ${totalCreditHours} · Quality Points: ${totalQualityPoints.toFixed(2)}`,
      '',
      ...semesterSummaries.map((s) => `${s.label} — ${s.creditHours}cr — SGPA ${s.sgpa.toFixed(2)}`),
      '',
      'Calculated with GradeTrack Pro',
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      // user cancelled share sheet
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
        <PressableScale onPress={() => navigation.goBack()} haptic="selection" style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </PressableScale>
        <Text style={[type.h1, { color: theme.textPrimary }]}>CGPA Result</Text>
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
          <CircularGauge value={cgpa} max={scale.maxGpa} label="CGPA" />
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
            <Text style={[type.caption, { color: theme.textMuted }]}>Semesters</Text>
            <Text style={[type.h1, { color: theme.textPrimary, marginTop: 2 }]}>{semesterSummaries.length}</Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <SemesterBreakdownTable semesters={semesterSummaries} />
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
