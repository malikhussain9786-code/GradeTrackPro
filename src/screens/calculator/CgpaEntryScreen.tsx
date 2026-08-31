import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOutUp, Layout } from 'react-native-reanimated';

import { useAppTheme } from '../../theme';
import { getUniversityOrFallback, getGradeScale } from '../../data';
import { setSelectedUniversity, getSemesters } from '../../storage';
import { UniversityId, Semester } from '../../types';
import { calculateCgpaFromManualEntries, ManualSemesterInput } from '../../engine/cgpaCalculator';
import { validateSemesterLabel, validateCgpaBoundedValue, validatePositiveCreditHours } from '../../engine/validators';
import { generateId } from '../../utils/id';

import { UniversitySelector } from '../../components/UniversitySelector';
import { SemesterEntryRow, ManualSemesterRowData } from '../../components/SemesterEntryRow';
import { Button } from '../../components/Button';
import { PressableScale } from '../../components/PressableScale';
import { SelectModal, SelectOption } from '../../components/SelectModal';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CgpaEntry'>;

function nextLabel(count: number): string {
  return `Semester ${count + 1}`;
}

export function CgpaEntryScreen({ route, navigation }: Props) {
  const { theme, type, spacing, radius, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [universityId, setUniversityId] = useState<UniversityId>(route.params.universityId);
  const [rows, setRows] = useState<ManualSemesterRowData[]>([
    { id: generateId('row'), label: nextLabel(0), sgpa: '', creditHours: '' },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [infoVisible, setInfoVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [savedSemesters, setSavedSemesters] = useState<Semester[]>([]);

  const university = getUniversityOrFallback(universityId);
  const scale = getGradeScale(universityId);

  useEffect(() => {
    // Fresh start whenever the university changes — a CGPA built from
    // one university's semesters shouldn't silently carry over to another.
    setRows([{ id: generateId('row'), label: nextLabel(0), sgpa: '', creditHours: '' }]);
    setErrors({});
  }, [universityId]);

  useEffect(() => {
    getSemesters(universityId).then(setSavedSemesters);
  }, [universityId]);

  function addRow() {
    setRows((prev) => [...prev, { id: generateId('row'), label: nextLabel(prev.length), sgpa: '', creditHours: '' }]);
  }

  function updateRow(next: ManualSemesterRowData) {
    setRows((prev) => prev.map((r) => (r.id === next.id ? next : r)));
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function importSemester(semesterId: string) {
    const semester = savedSemesters.find((s) => s.id === semesterId);
    if (!semester) return;
    setRows((prev) => [
      ...prev,
      {
        id: generateId('row'),
        label: semester.label,
        sgpa: String(semester.sgpa),
        creditHours: String(semester.totalCreditHours),
      },
    ]);
    setImportVisible(false);
  }

  const parsedEntries = useMemo(() => {
    const valid: ManualSemesterInput[] = [];
    const nextErrors: Record<string, string> = {};

    rows.forEach((row) => {
      if (row.sgpa === '' && row.creditHours === '') return; // blank row, ignore silently

      const labelError = validateSemesterLabel(row.label);
      const sgpaError = validateCgpaBoundedValue(row.sgpa, scale.maxGpa, 'currentCgpa');
      const creditError = validatePositiveCreditHours(row.creditHours, 'remainingCreditHours');

      if (labelError) {
        nextErrors[row.id] = labelError.message;
      } else if (sgpaError) {
        nextErrors[row.id] = sgpaError.message;
      } else if (creditError) {
        nextErrors[row.id] = creditError.message;
      } else {
        valid.push({ sgpa: parseFloat(row.sgpa), creditHours: parseFloat(row.creditHours), label: row.label.trim() });
      }
    });

    return { valid, nextErrors };
  }, [rows, scale.maxGpa]);

  const preview = parsedEntries.valid.length > 0 ? calculateCgpaFromManualEntries(parsedEntries.valid) : null;

  function handleCalculate() {
    setErrors(parsedEntries.nextErrors);
    if (Object.keys(parsedEntries.nextErrors).length > 0) return;
    if (parsedEntries.valid.length === 0) {
      setErrors({ general: 'Add at least one semester with a valid SGPA and credit hours.' });
      return;
    }

    const result = calculateCgpaFromManualEntries(parsedEntries.valid);
    navigation.navigate('CgpaResult', {
      universityId,
      semesterSummaries: result.semesterSummaries,
      cgpa: result.cgpa,
      totalCreditHours: result.totalCreditHours,
      totalQualityPoints: result.totalQualityPoints,
    });
  }

  const importOptions: SelectOption[] = savedSemesters.map((s) => ({
    value: s.id,
    label: s.label,
    sublabel: `SGPA ${s.sgpa.toFixed(2)} · ${s.totalCreditHours} credit hrs`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
        <PressableScale onPress={() => navigation.goBack()} haptic="selection" style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </PressableScale>
        <Text style={[type.h1, { color: theme.textPrimary }]}>Calculate CGPA</Text>
        <PressableScale onPress={() => setInfoVisible(true)} haptic="selection" style={{ padding: 4 }}>
          <Ionicons name="information-circle-outline" size={24} color={theme.textSecondary} />
        </PressableScale>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xxl, width: '100%', maxWidth: layoutSafety.maxContentWidth, alignSelf: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: spacing.md }}>
          <UniversitySelector
            value={universityId}
            onChange={(id) => {
              setUniversityId(id);
              setSelectedUniversity(id);
            }}
          />
        </View>

        <Text style={[type.h2, { color: theme.textPrimary, marginBottom: spacing.xs }]}>Semesters</Text>
        <Text style={[type.caption, { color: theme.textMuted, marginBottom: spacing.sm }]}>
          Enter each completed semester's SGPA and credit hours.
        </Text>

        {rows.map((row) => (
          <Animated.View key={row.id} entering={FadeIn.duration(220)} exiting={FadeOutUp.duration(180)} layout={Layout.springify()}>
            <SemesterEntryRow
              data={row}
              onChange={updateRow}
              onDelete={() => deleteRow(row.id)}
              error={errors[row.id]}
            />
          </Animated.View>
        ))}

        {errors.general && (
          <Text style={[type.caption, { color: theme.error, marginBottom: spacing.sm }]}>{errors.general}</Text>
        )}

        <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
          <Button label="Add Semester" icon="add-circle-outline" variant="secondary" onPress={addRow} style={{ flex: 1 }} />
          {savedSemesters.length > 0 && (
            <>
              <View style={{ width: spacing.xs }} />
              <Button
                label="Import Saved"
                icon="download-outline"
                variant="secondary"
                onPress={() => setImportVisible(true)}
                style={{ flex: 1 }}
              />
            </>
          )}
        </View>

        {preview && (
          <View
            style={[
              styles.previewCard,
              { backgroundColor: theme.accentSoft, borderRadius: radius.md, marginTop: spacing.lg },
            ]}
          >
            <Text style={[type.caption, { color: theme.textMuted }]}>Projected CGPA</Text>
            <Text style={[type.heroNumber, { color: theme.accent, marginTop: 2 }]}>{preview.cgpa.toFixed(2)}</Text>
            <Text style={[type.caption, { color: theme.textSecondary, marginTop: 4 }]}>
              {preview.totalCreditHours} credit hours · {preview.totalQualityPoints.toFixed(2)} quality points
            </Text>
          </View>
        )}

        <View style={{ marginTop: spacing.lg }}>
          <Button label="Calculate CGPA" icon="stats-chart-outline" variant="primary" onPress={handleCalculate} fullWidth />
        </View>
      </ScrollView>

      <Modal visible={infoVisible} transparent animationType="fade" onRequestClose={() => setInfoVisible(false)}>
        <Pressable style={styles.infoBackdrop} onPress={() => setInfoVisible(false)}>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, borderRadius: radius.lg }]}>
            <Text style={[type.h2, { color: theme.textPrimary, marginBottom: 8 }]}>How CGPA works</Text>
            <Text style={[type.body, { color: theme.textSecondary, lineHeight: 20 }]}>
              CGPA is cumulative: each semester's quality points (SGPA × credit hours) are summed
              across all semesters, then divided by the total credit hours. This is not a simple
              average of your SGPAs — semesters with more credit hours count for more.
            </Text>
          </View>
        </Pressable>
      </Modal>

      <SelectModal
        visible={importVisible}
        title="Import Saved Semester"
        options={importOptions}
        onSelect={importSemester}
        onClose={() => setImportVisible(false)}
      />
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
  previewCard: {
    padding: 16,
    alignItems: 'center',
  },
  infoBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,17,40,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  infoCard: {
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
});
