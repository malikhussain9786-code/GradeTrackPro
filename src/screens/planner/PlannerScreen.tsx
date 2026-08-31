import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import { getSelectedUniversity, setSelectedUniversity, getSemesters } from '../../storage';
import { getGradeScale } from '../../data';
import { UniversityId } from '../../types';
import { calculateCgpaFromSemesters } from '../../engine/cgpaCalculator';
import { calculateRequiredSgpa } from '../../engine/gpaPlanner';
import { validateCgpaBoundedValue, validatePositiveCreditHours } from '../../engine/validators';

import { UniversitySelector } from '../../components/UniversitySelector';
import { LoadingView } from '../../components/LoadingView';
import { BackToHomeButton } from '../../components/BackToHomeButton';
import { TextField } from '../../components/TextField';
import { FeasibilityBadge } from '../../components/FeasibilityBadge';

export function PlannerScreen() {
  const { theme, type, spacing, radius, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [universityId, setUniversityId] = useState<UniversityId | null>(null);
  const [currentCgpa, setCurrentCgpa] = useState('');
  const [completedCreditHours, setCompletedCreditHours] = useState('');
  const [remainingCreditHours, setRemainingCreditHours] = useState('');
  const [targetCgpa, setTargetCgpa] = useState('');
  const [autoFilled, setAutoFilled] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    getSelectedUniversity().then((id) => setUniversityId(id ?? 'foundation'));
  }, []);

  // Auto-fill Current CGPA + Completed Credit Hours from saved
  // semesters, so the student isn't forced to re-type numbers the
  // app already knows — same "don't repeat yourself" pattern as the
  // CGPA Entry screen's "Import Saved" feature.
  useEffect(() => {
    if (!universityId) return;
    getSemesters(universityId).then((semesters) => {
      if (semesters.length === 0) {
        setAutoFilled(false);
        return;
      }
      const result = calculateCgpaFromSemesters(semesters);
      setCurrentCgpa(String(result.cgpa));
      setCompletedCreditHours(String(result.totalCreditHours));
      setAutoFilled(true);
    });
  }, [universityId]);

  // Real-device bug fix: `useMemo` below was previously called AFTER
  // an early `if (!universityId) return <LoadingView />` — a Rules of
  // Hooks violation. React tracks hooks by call order per render; on
  // the first render (universityId still null) the component returned
  // before reaching useMemo, then on the next render it proceeded past
  // and called useMemo, giving React a different hook count between
  // renders and crashing with "Rendered more hooks than during the
  // previous render." Fix: every hook now runs unconditionally on
  // every render, using a safe fallback university id for the
  // calculations below; the actual loading guard moves to AFTER all
  // hooks, right before the JSX return.
  const effectiveUniversityId = universityId ?? 'foundation';
  const scale = getGradeScale(effectiveUniversityId);

  // Centralized validators (Step 25) — every field gets a specific,
  // clear message instead of the screen silently hiding the result
  // with no explanation, which was the previous behavior.
  const currentCgpaError = touched ? validateCgpaBoundedValue(currentCgpa, scale.maxGpa, 'currentCgpa') : null;
  const completedError = touched ? validatePositiveCreditHours(completedCreditHours, 'completedCreditHours') : null;
  const remainingError = touched ? validatePositiveCreditHours(remainingCreditHours, 'remainingCreditHours') : null;
  const targetError = touched ? validateCgpaBoundedValue(targetCgpa, scale.maxGpa, 'targetCgpa') : null;

  const currentCgpaNum = parseFloat(currentCgpa);
  const completedNum = parseFloat(completedCreditHours);
  const remainingNum = parseFloat(remainingCreditHours);
  const targetNum = parseFloat(targetCgpa);

  const inputsValid =
    !currentCgpaError &&
    !completedError &&
    !remainingError &&
    !targetError &&
    !isNaN(currentCgpaNum) &&
    !isNaN(completedNum) &&
    !isNaN(remainingNum) &&
    !isNaN(targetNum);

  const result = useMemo(() => {
    if (!inputsValid) return null;
    return calculateRequiredSgpa(
      {
        currentCgpa: currentCgpaNum,
        completedCreditHours: completedNum,
        remainingCreditHours: remainingNum,
        targetCgpa: targetNum,
      },
      scale.maxGpa
    );
  }, [inputsValid, currentCgpaNum, completedNum, remainingNum, targetNum, scale.maxGpa]);

  if (!universityId) return <LoadingView />;

  function markTouched() {
    if (!touched) setTouched(true);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + spacing.lg }]}>
      <View style={[styles.titleRow, { paddingHorizontal: spacing.md }]}>
        <BackToHomeButton />
        <Text style={[type.h1, { color: theme.textPrimary }]}>GPA Planner</Text>
      </View>
      <Text style={[type.body, { color: theme.textSecondary, paddingHorizontal: spacing.md, marginTop: 4 }]}>
        Plan your next semester and hit your target CGPA.
      </Text>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xxl, width: '100%', maxWidth: layoutSafety.maxContentWidth, alignSelf: 'center' }} keyboardShouldPersistTaps="handled">
        <UniversitySelector
          value={universityId}
          onChange={(id) => {
            setUniversityId(id);
            setSelectedUniversity(id);
          }}
        />

        <View style={{ marginTop: spacing.md }}>
          <TextField
            label="Target CGPA"
            placeholder="e.g. 3.60"
            value={targetCgpa}
            onChangeText={(v) => {
              setTargetCgpa(v);
              markTouched();
            }}
            keyboardType="decimal-pad"
            error={targetError?.message}
          />
        </View>

        <View
          style={[
            styles.statsRow,
            { backgroundColor: theme.surface, borderRadius: radius.md, borderColor: theme.border },
          ]}
        >
          <View style={styles.statCell}>
            <Text style={[type.caption, { color: theme.textMuted }]}>Current CGPA</Text>
            <TextField
              label=""
              value={currentCgpa}
              onChangeText={(v) => {
                setCurrentCgpa(v);
                setAutoFilled(false);
                markTouched();
              }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              style={{ textAlign: 'center' }}
              error={currentCgpaError?.message}
            />
          </View>
          <View style={[styles.statCell, { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: theme.border }]}>
            <Text style={[type.caption, { color: theme.textMuted }]}>Total Credits Earned</Text>
            <TextField
              label=""
              value={completedCreditHours}
              onChangeText={(v) => {
                setCompletedCreditHours(v);
                setAutoFilled(false);
                markTouched();
              }}
              keyboardType="decimal-pad"
              placeholder="0"
              style={{ textAlign: 'center' }}
              error={completedError?.message}
            />
          </View>
        </View>
        {autoFilled && (
          <Text style={[type.caption, { color: theme.textMuted, marginTop: -8, marginBottom: spacing.sm }]}>
            Auto-filled from your saved semesters — edit if needed.
          </Text>
        )}

        <TextField
          label="Remaining Credit Hours"
          placeholder="e.g. 18"
          value={remainingCreditHours}
          onChangeText={(v) => {
            setRemainingCreditHours(v);
            markTouched();
          }}
          keyboardType="decimal-pad"
          error={remainingError?.message}
        />

        {result && (
          <View
            style={[
              styles.resultCard,
              { backgroundColor: theme.surface, borderRadius: radius.lg, borderColor: theme.border, marginTop: spacing.md },
            ]}
          >
            <Text style={[type.caption, { color: theme.textMuted }]}>You need a SGPA of</Text>
            <Text style={[type.heroNumberLarge, { color: theme.accent, marginTop: 4 }]}>
              {result.requiredFutureSgpa.toFixed(2)}
            </Text>
            <Text style={[type.caption, { color: theme.textSecondary, marginTop: 2 }]}>
              in your next semester (assuming {remainingCreditHours} credit hours)
            </Text>

            <View style={{ marginTop: spacing.sm }}>
              <FeasibilityBadge feasibility={result.feasibility} />
            </View>

            <Text style={[type.body, { color: theme.textPrimary, marginTop: spacing.md, lineHeight: 20 }]}>
              {result.message}
            </Text>
          </View>
        )}

        {!result && (
          <Text style={[type.caption, { color: theme.textMuted, marginTop: spacing.lg, textAlign: 'center' }]}>
            {touched
              ? 'Please fix the highlighted fields above to see your required SGPA.'
              : 'Fill in all fields above to see your required SGPA.'}
          </Text>
        )}

        <View
          style={[
            styles.tipBox,
            { backgroundColor: theme.accentSoft, borderRadius: radius.md, marginTop: spacing.lg },
          ]}
        >
          <Text style={[type.caption, { color: theme.textSecondary, lineHeight: 18 }]}>
            Tip: CGPA is weighted by credit hours, so a heavier course load next semester has more
            influence on your final CGPA than a lighter one.
          </Text>
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
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    marginTop: 12,
  },
  statCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  resultCard: {
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  tipBox: {
    padding: 14,
  },
});
