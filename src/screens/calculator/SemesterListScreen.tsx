import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOutUp, Layout } from 'react-native-reanimated';

import { useAppTheme } from '../../theme';
import { getUniversityOrFallback } from '../../data';
import { getSemesters, deleteSemester, deleteHistoryEntriesByPayloadId } from '../../storage';
import { Semester } from '../../types';

import { SemesterListItem } from '../../components/SemesterListItem';
import { PressableScale } from '../../components/PressableScale';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SemesterList'>;

// GradeTrack Pro — Semester Management
// View, edit, and delete every saved semester for a university.
// Editing reopens Course Entry pre-filled with that semester's
// subjects; the eventual "Save to History" there updates this same
// record in place rather than creating a duplicate (see SgpaResult's
// existingSemesterId handling).

export function SemesterListScreen({ route, navigation }: Props) {
  const { universityId } = route.params;
  const university = getUniversityOrFallback(universityId);
  const { theme, type, spacing, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(() => {
    getSemesters(universityId).then((list) => {
      setSemesters([...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)));
      setLoaded(true);
    });
  }, [universityId]);

  // Refresh whenever this screen regains focus — e.g. after returning
  // from an edit or a fresh save, the list must reflect the latest state.
  useFocusEffect(reload);

  function viewSemester(semester: Semester) {
    navigation.navigate('SgpaResult', {
      universityId,
      subjects: semester.subjects,
      sgpa: semester.sgpa,
      totalCreditHours: semester.totalCreditHours,
      totalQualityPoints: semester.totalQualityPoints,
      semesterLabel: semester.label,
      existingSemesterId: semester.id,
      alreadySaved: true,
    });
  }

  function editSemester(semester: Semester) {
    navigation.navigate('SgpaCourseEntry', { universityId, editSemesterId: semester.id });
  }

  function confirmDelete(semester: Semester) {
    Alert.alert('Delete semester?', `"${semester.label}" will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSemester(universityId, semester.id);
          await deleteHistoryEntriesByPayloadId(semester.id);
          reload();
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
        <PressableScale onPress={() => navigation.goBack()} haptic="selection" style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </PressableScale>
        <Text style={[type.h1, { color: theme.textPrimary }]}>My Semesters</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, width: '100%', maxWidth: layoutSafety.maxContentWidth, alignSelf: 'center' }}>
        <Text style={[type.caption, { color: theme.textMuted, marginBottom: spacing.md }]}>
          {university.shortName} · {semesters.length} saved
        </Text>

        {loaded && semesters.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
            <Ionicons name="folder-open-outline" size={40} color={theme.textMuted} />
            <Text style={[type.body, { color: theme.textMuted, marginTop: spacing.sm, textAlign: 'center' }]}>
              No saved semesters yet.{'\n'}Calculate an SGPA and save it to see it here.
            </Text>
            <View style={{ marginTop: spacing.lg, width: '100%' }}>
              <Button
                label="Calculate SGPA"
                icon="calculator-outline"
                variant="primary"
                onPress={() => navigation.navigate('SgpaCourseEntry', { universityId })}
                fullWidth
              />
            </View>
          </View>
        )}

        {semesters.map((s) => (
          <Animated.View key={s.id} entering={FadeIn.duration(220)} exiting={FadeOutUp.duration(180)} layout={Layout.springify()}>
            <SemesterListItem
              label={s.label}
              sgpa={s.sgpa}
              creditHours={s.totalCreditHours}
              courseCount={s.subjects.length}
              onPress={() => viewSemester(s)}
              onEdit={() => editSemester(s)}
              onDelete={() => confirmDelete(s)}
            />
          </Animated.View>
        ))}
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
});
