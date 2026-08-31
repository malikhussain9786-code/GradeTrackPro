import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOutUp, Layout } from 'react-native-reanimated';

import { useAppTheme } from '../../theme';
import { setSelectedUniversity, getSemesters } from '../../storage';
import { getUniversityOrFallback, getGradeScale } from '../../data';
import { UniversityId, Subject } from '../../types';
import { calculateSubject } from '../../engine/subjectCalculator';
import { useSubjectList } from '../../hooks/useSubjectList';
import { validateCourseName, validateCreditHours, validateMarks, validateGradeSelection } from '../../engine/validators';

import { UniversitySelector } from '../../components/UniversitySelector';
import { TextField } from '../../components/TextField';
import { MarksField } from '../../components/MarksField';
import { GradeSelector } from '../../components/GradeSelector';
import { SegmentedControl } from '../../components/SegmentedControl';
import { StatsPreviewRow } from '../../components/StatsPreviewRow';
import { RunningTotalBar } from '../../components/RunningTotalBar';
import { CourseListItem } from '../../components/CourseListItem';
import { Button } from '../../components/Button';
import { PressableScale } from '../../components/PressableScale';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SgpaCourseEntry'>;

interface FormErrors {
  courseName?: string;
  creditHours?: string;
  marks?: string;
  grade?: string;
}

export function SgpaCourseEntryScreen({ route, navigation }: Props) {
  const { theme, type, spacing, radius, touchTarget, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [universityId, setUniversityId] = useState<UniversityId>(route.params.universityId);
  const [hasLab, setHasLab] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [theoryObtained, setTheoryObtained] = useState('');
  const [theoryTotal, setTheoryTotal] = useState('100');
  const [practicalObtained, setPracticalObtained] = useState('');
  const [practicalTotal, setPracticalTotal] = useState('50');
  const [marksObtained, setMarksObtained] = useState('');
  const [marksTotal, setMarksTotal] = useState('100');
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<FormErrors>({});
  const [infoVisible, setInfoVisible] = useState(false);
  const [semesterLabel, setSemesterLabel] = useState<string | undefined>(undefined);

  const editSemesterId = route.params.editSemesterId;
  const isEditMode = Boolean(editSemesterId);

  const university = getUniversityOrFallback(universityId);
  const scale = getGradeScale(universityId);

  // Step 19: subject CRUD (add/edit/delete) + live running SGPA total
  // now live in a shared hook rather than duplicated inline state —
  // this is the same logic Semester Management's "Edit" flow relies on.
  const {
    subjects,
    editingId,
    editingSubject,
    runningTotal,
    loadSubjects,
    clearAll,
    addOrUpdate,
    startEditing,
    cancelEditing,
    deleteSubject,
  } = useSubjectList(university, scale);

  function resetForm() {
    setCourseName('');
    setCreditHours('');
    setTheoryObtained('');
    setTheoryTotal('100');
    setPracticalObtained('');
    setPracticalTotal('50');
    setMarksObtained('');
    setMarksTotal('100');
    setSelectedGrade(undefined);
    setHasLab(false);
    setErrors({});
  }

  // Edit mode: load the existing saved semester's subjects instead of
  // starting blank. Runs once on mount.
  useEffect(() => {
    if (!editSemesterId) return;
    getSemesters(route.params.universityId).then((semesters) => {
      const existing = semesters.find((s) => s.id === editSemesterId);
      if (existing) {
        loadSubjects(existing.subjects);
        setSemesterLabel(existing.label);
      }
    });
  }, [editSemesterId]);

  // Reset subject-specific form fields whenever the university changes,
  // since a new university may use a completely different input mode.
  // Skipped on edit mode's initial mount so the loaded subjects survive.
  const [hasHydratedEdit, setHasHydratedEdit] = useState(!isEditMode);
  useEffect(() => {
    if (isEditMode && !hasHydratedEdit) {
      setHasHydratedEdit(true);
      return;
    }
    clearAll();
    resetForm();
  }, [universityId]);

  // When the user taps a course's edit icon, populate the form fields
  // from the subject the hook is now tracking as "being edited".
  useEffect(() => {
    if (!editingSubject) return;
    setCourseName(editingSubject.name);
    setCreditHours(String(editingSubject.creditHours));
    setHasLab(editingSubject.hasLab);
    if (editingSubject.hasLab) {
      setTheoryObtained(String(editingSubject.theoryMarks?.obtained ?? ''));
      setTheoryTotal(String(editingSubject.theoryMarks?.total ?? '100'));
      setPracticalObtained(String(editingSubject.practicalMarks?.obtained ?? ''));
      setPracticalTotal(String(editingSubject.practicalMarks?.total ?? '50'));
    } else if (editingSubject.theoryMarks) {
      setMarksObtained(String(editingSubject.theoryMarks.obtained ?? ''));
      setMarksTotal(String(editingSubject.theoryMarks.total ?? '100'));
    }
    setSelectedGrade(editingSubject.selectedGrade);
  }, [editingSubject]);

  const creditHoursNum = parseFloat(creditHours);

  const preview = useMemo(() => {
    if (!creditHoursNum || creditHoursNum <= 0) return null;

    const subjectInput = {
      creditHours: creditHoursNum,
      hasLab: university.supportsTheoryPracticalSplit && hasLab,
      theoryMarks:
        university.inputMode === 'marks'
          ? university.supportsTheoryPracticalSplit && hasLab
            ? { obtained: parseFloat(theoryObtained) || 0, total: parseFloat(theoryTotal) || 0 }
            : { obtained: parseFloat(marksObtained) || 0, total: parseFloat(marksTotal) || 0 }
          : undefined,
      practicalMarks:
        university.inputMode === 'marks' && university.supportsTheoryPracticalSplit && hasLab
          ? { obtained: parseFloat(practicalObtained) || 0, total: parseFloat(practicalTotal) || 0 }
          : undefined,
      selectedGrade: university.inputMode === 'grade' ? selectedGrade : undefined,
    };

    const result = calculateSubject(subjectInput, university, scale);
    if (result.computedGrade === null) return null;
    return result;
  }, [
    university,
    scale,
    creditHoursNum,
    hasLab,
    theoryObtained,
    theoryTotal,
    practicalObtained,
    practicalTotal,
    marksObtained,
    marksTotal,
    selectedGrade,
  ]);

  function validate(): boolean {
    const next: FormErrors = {};

    const nameError = validateCourseName(courseName);
    if (nameError) next.courseName = nameError.message;

    const creditError = validateCreditHours(creditHours);
    if (creditError) next.creditHours = creditError.message;

    if (university.inputMode === 'marks') {
      if (university.supportsTheoryPracticalSplit && hasLab) {
        const theoryError = validateMarks(theoryObtained, theoryTotal, 'theoryMarks');
        const practicalError = validateMarks(practicalObtained, practicalTotal, 'practicalMarks');
        if (theoryError || practicalError) next.marks = 'Please enter valid marks.';
      } else {
        const marksError = validateMarks(marksObtained, marksTotal, 'theoryMarks');
        if (marksError) next.marks = marksError.message;
      }
    } else if (university.inputMode === 'grade') {
      const gradeError = validateGradeSelection(selectedGrade);
      if (gradeError) next.grade = gradeError.message;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleAddCourse() {
    if (!validate()) return;

    const subjectInput = {
      creditHours: creditHoursNum,
      hasLab: university.supportsTheoryPracticalSplit && hasLab,
      theoryMarks:
        university.inputMode === 'marks'
          ? university.supportsTheoryPracticalSplit && hasLab
            ? { obtained: parseFloat(theoryObtained), total: parseFloat(theoryTotal) }
            : { obtained: parseFloat(marksObtained), total: parseFloat(marksTotal) }
          : undefined,
      practicalMarks:
        university.inputMode === 'marks' && university.supportsTheoryPracticalSplit && hasLab
          ? { obtained: parseFloat(practicalObtained), total: parseFloat(practicalTotal) }
          : undefined,
      selectedGrade: university.inputMode === 'grade' ? selectedGrade : undefined,
    };

    const outcome = addOrUpdate(courseName, subjectInput);
    if (!outcome.ok) {
      setErrors({ marks: outcome.error });
      return;
    }
    resetForm();
  }

  function handleCalculateSgpa() {
    if (subjects.length === 0) return;
    navigation.navigate('SgpaResult', {
      universityId,
      subjects,
      sgpa: runningTotal.sgpa,
      totalCreditHours: runningTotal.totalCreditHours,
      totalQualityPoints: runningTotal.totalQualityPoints,
      existingSemesterId: editSemesterId,
      semesterLabel,
    });
  }

  const showSplit = university.supportsTheoryPracticalSplit;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
        <PressableScale onPress={() => navigation.goBack()} haptic="selection" style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </PressableScale>
        <Text style={[type.h1, { color: theme.textPrimary }]}>{isEditMode ? 'Edit Semester' : 'Add Course'}</Text>
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

        {showSplit && (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[type.captionMedium, { color: theme.textSecondary, marginBottom: 8 }]}>
              This course includes
            </Text>
            <SegmentedControl
              options={[
                { value: 'theory', label: 'Theory Only' },
                { value: 'lab', label: 'Theory + Lab' },
              ]}
              value={hasLab ? 'lab' : 'theory'}
              onChange={(v) => setHasLab(v === 'lab')}
            />
          </View>
        )}

        <TextField
          label="Course Name"
          placeholder="e.g. Data Structures"
          value={courseName}
          onChangeText={setCourseName}
          error={errors.courseName}
        />

        <TextField
          label="Credit Hours"
          placeholder="e.g. 3"
          value={creditHours}
          onChangeText={setCreditHours}
          keyboardType="decimal-pad"
          error={errors.creditHours}
        />

        {university.inputMode === 'marks' && showSplit && hasLab && (
          <View style={{ flexDirection: 'row', marginBottom: spacing.xs }}>
            <MarksField
              label="Theory (70%)"
              obtained={theoryObtained}
              total={theoryTotal}
              onChangeObtained={setTheoryObtained}
              onChangeTotal={setTheoryTotal}
            />
            <View style={{ width: spacing.sm }} />
            <MarksField
              label="Practical (30%)"
              obtained={practicalObtained}
              total={practicalTotal}
              onChangeObtained={setPracticalObtained}
              onChangeTotal={setPracticalTotal}
            />
          </View>
        )}

        {university.inputMode === 'marks' && !(showSplit && hasLab) && (
          <MarksField
            label="Marks"
            obtained={marksObtained}
            total={marksTotal}
            onChangeObtained={setMarksObtained}
            onChangeTotal={setMarksTotal}
          />
        )}

        {errors.marks && (
          <Text style={[type.caption, { color: theme.error, marginTop: -8, marginBottom: spacing.sm }]}>
            {errors.marks}
          </Text>
        )}

        {university.inputMode === 'grade' && (
          <GradeSelector
            label="Grade"
            scale={scale}
            value={selectedGrade}
            onChange={setSelectedGrade}
            error={errors.grade}
          />
        )}

        {preview && preview.computedGrade && (
          <View style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
            <StatsPreviewRow
              items={[
                ...(preview.computedPercent !== null
                  ? [{ label: 'Percent', value: `${preview.computedPercent.toFixed(1)}%` }]
                  : []),
                { label: 'Grade', value: preview.computedGrade, emphasize: true },
                { label: 'Points', value: preview.computedPoints!.toFixed(2) },
              ]}
            />
          </View>
        )}

        <Button
          label={editingId ? 'Update Course' : 'Add Course'}
          icon="add-circle-outline"
          variant="primary"
          onPress={handleAddCourse}
          fullWidth
        />
        {editingId && (
          <View style={{ marginTop: spacing.xs }}>
            <Button
              label="Cancel Edit"
              variant="ghost"
              onPress={() => {
                cancelEditing();
                resetForm();
              }}
              fullWidth
            />
          </View>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[type.h2, { color: theme.textPrimary, marginBottom: spacing.xs }]}>
            Added Courses ({subjects.length})
          </Text>

          <RunningTotalBar
            sgpa={runningTotal.sgpa}
            totalCreditHours={runningTotal.totalCreditHours}
            subjectCount={subjects.length}
          />

          {subjects.length === 0 ? (
            <Text style={[type.body, { color: theme.textMuted, marginTop: spacing.xs }]}>
              No courses added yet.
            </Text>
          ) : (
            <View style={{ backgroundColor: theme.surface, borderRadius: radius.md, paddingHorizontal: spacing.sm }}>
              {subjects.map((s) => (
                <Animated.View key={s.id} entering={FadeIn.duration(220)} exiting={FadeOutUp.duration(180)} layout={Layout.springify()}>
                  <CourseListItem
                    name={s.name}
                    creditHours={s.creditHours}
                    grade={s.computedGrade}
                    onEdit={() => startEditing(s.id)}
                    onDelete={() => deleteSubject(s.id)}
                  />
                </Animated.View>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            label={isEditMode ? 'Review & Update' : 'Calculate SGPA'}
            icon="stats-chart-outline"
            variant="primary"
            onPress={handleCalculateSgpa}
            disabled={subjects.length === 0}
            fullWidth
          />
          {subjects.length > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              <Button
                label="Clear All"
                icon="trash-outline"
                variant="ghost"
                onPress={() => {
                  clearAll();
                  resetForm();
                }}
                fullWidth
              />
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={infoVisible} transparent animationType="fade" onRequestClose={() => setInfoVisible(false)}>
        <Pressable style={styles.infoBackdrop} onPress={() => setInfoVisible(false)}>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, borderRadius: radius.lg }]}>
            <Text style={[type.h2, { color: theme.textPrimary, marginBottom: 8 }]}>How SGPA works</Text>
            <Text style={[type.body, { color: theme.textSecondary, lineHeight: 20 }]}>
              Each course's grade points are multiplied by its credit hours to get quality points.
              SGPA = total quality points ÷ total credit hours, using {university.name}'s official
              grading scale.
            </Text>
          </View>
        </Pressable>
      </Modal>
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
  labRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 16,
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
