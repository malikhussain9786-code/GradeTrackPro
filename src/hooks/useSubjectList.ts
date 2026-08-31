import { useState, useCallback, useMemo } from 'react';
import { Subject, University, GradeScale } from '../types';
import { calculateSubject } from '../engine/subjectCalculator';
import { calculateSgpa } from '../engine/sgpaCalculator';
import { generateId } from '../utils/id';

// GradeTrack Pro — Subject List Manager
// Centralizes add/edit/delete for a semester's course list, plus a
// live running SGPA total. Extracted as a hook (rather than left
// inline in the Course Entry screen) so any future screen that needs
// subject-level CRUD — editing a saved semester, a future "quick add"
// widget, etc. — reuses the exact same logic instead of a second copy
// that could drift out of sync with the calculation engine.

export interface SubjectInput {
  creditHours: number;
  hasLab: boolean;
  theoryMarks?: { obtained: number; total: number };
  practicalMarks?: { obtained: number; total: number };
  selectedGrade?: string;
}

export function useSubjectList(university: University, scale: GradeScale) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadSubjects = useCallback((initial: Subject[]) => {
    setSubjects(initial);
    setEditingId(null);
  }, []);

  const clearAll = useCallback(() => {
    setSubjects([]);
    setEditingId(null);
  }, []);

  const addOrUpdate = useCallback(
    (name: string, input: SubjectInput): { ok: true } | { ok: false; error: string } => {
      const result = calculateSubject(input, university, scale);
      if (!result.computedGrade || result.computedPoints === null || result.qualityPoints === null) {
        return { ok: false, error: 'Please enter valid marks.' };
      }

      const subject: Subject = {
        id: editingId ?? generateId('subj'),
        name: name.trim(),
        creditHours: input.creditHours,
        hasLab: input.hasLab,
        theoryMarks: input.theoryMarks,
        practicalMarks: input.practicalMarks,
        selectedGrade: input.selectedGrade,
        computedPercent: result.computedPercent ?? undefined,
        computedGrade: result.computedGrade,
        computedPoints: result.computedPoints,
        qualityPoints: result.qualityPoints,
      };

      setSubjects((prev) => {
        if (editingId) return prev.map((s) => (s.id === editingId ? subject : s));
        return [...prev, subject];
      });
      setEditingId(null);
      return { ok: true };
    },
    [university, scale, editingId]
  );

  const startEditing = useCallback((id: string) => setEditingId(id), []);
  const cancelEditing = useCallback(() => setEditingId(null), []);

  const deleteSubject = useCallback(
    (id: string) => {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setEditingId((current) => (current === id ? null : current));
    },
    []
  );

  const editingSubject = useMemo(
    () => (editingId ? subjects.find((s) => s.id === editingId) ?? null : null),
    [subjects, editingId]
  );

  // Live running total — updates on every add/edit/delete so the
  // student sees their SGPA trending in real time, not just after
  // tapping "Calculate SGPA" at the end.
  const runningTotal = useMemo(() => calculateSgpa(subjects), [subjects]);

  return {
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
  };
}
