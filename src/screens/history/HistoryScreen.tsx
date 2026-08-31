import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOutUp, Layout } from 'react-native-reanimated';

import { useAppTheme } from '../../theme';
import {
  getHistory,
  deleteHistoryEntry,
  deleteHistoryEntries,
  deleteSemester,
  deleteCgpaRecord,
  getSelectedUniversity,
} from '../../storage';
import { HistoryEntry, Semester, CgpaRecord } from '../../types';
import { HistoryListItem } from '../../components/HistoryListItem';
import { FilterChip } from '../../components/FilterChip';
import { Button } from '../../components/Button';
import { PressableScale } from '../../components/PressableScale';
import { BackToHomeButton } from '../../components/BackToHomeButton';
import { RootStackParamList } from '../../navigation/types';

type ParentNav = NativeStackNavigationProp<RootStackParamList>;
type FilterMode = 'all' | 'sgpa' | 'cgpa';

export function HistoryScreen() {
  const { theme, type, spacing, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const parentNav = navigation.getParent<ParentNav>() ?? (navigation as unknown as ParentNav);

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const reload = useCallback(() => {
    getHistory().then((list) => {
      setEntries(list);
      setLoaded(true);
    });
  }, []);

  useFocusEffect(reload);

  async function handleRefresh() {
    setRefreshing(true);
    await getHistory().then(setEntries);
    setRefreshing(false);
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((e) => e.type === filter);
  }, [entries, filter]);

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function enterSelectMode(id: string) {
    setSelectMode(true);
    setSelectedIds(new Set([id]));
  }

  async function cascadeDeleteEntry(entry: HistoryEntry) {
    if (entry.type === 'sgpa') {
      const semester = entry.payload as Semester;
      await deleteSemester(entry.universityId, semester.id);
    } else if (entry.type === 'cgpa') {
      const record = entry.payload as CgpaRecord;
      await deleteCgpaRecord(entry.universityId, record.id);
    }
  }

  function viewEntry(entry: HistoryEntry) {
    if (selectMode) {
      toggleSelected(entry.id);
      return;
    }
    if (entry.type === 'sgpa') {
      const semester = entry.payload as Semester;
      parentNav.navigate('SgpaResult', {
        universityId: entry.universityId,
        subjects: semester.subjects,
        sgpa: entry.resultValue,
        totalCreditHours: entry.creditHours,
        totalQualityPoints: entry.qualityPoints,
        semesterLabel: entry.title,
        existingSemesterId: semester.id,
        alreadySaved: true,
      });
    } else if (entry.type === 'cgpa') {
      const record = entry.payload as CgpaRecord;
      parentNav.navigate('CgpaResult', {
        universityId: entry.universityId,
        semesterSummaries: record.semesters,
        cgpa: entry.resultValue,
        totalCreditHours: entry.creditHours,
        totalQualityPoints: entry.qualityPoints,
      });
    }
  }

  function editEntry(entry: HistoryEntry) {
    if (entry.type !== 'sgpa') return;
    const semester = entry.payload as Semester;
    parentNav.navigate('SgpaCourseEntry', { universityId: entry.universityId, editSemesterId: semester.id });
  }

  function confirmDelete(entry: HistoryEntry) {
    Alert.alert('Delete this record?', `"${entry.title}" will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await cascadeDeleteEntry(entry);
          await deleteHistoryEntry(entry.id);
          reload();
        },
      },
    ]);
  }

  function confirmBulkDelete() {
    const count = selectedIds.size;
    if (count === 0) return;
    Alert.alert(
      `Delete ${count} ${count === 1 ? 'item' : 'items'}?`,
      'This will permanently remove the selected calculations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const toDelete = entries.filter((e) => selectedIds.has(e.id));
            await Promise.all(toDelete.map(cascadeDeleteEntry));
            await deleteHistoryEntries(Array.from(selectedIds));
            exitSelectMode();
            reload();
          },
        },
      ]
    );
  }

  function confirmClearAllHistory() {
    if (entries.length === 0) return;
    Alert.alert(
      'Clear all history?',
      `This will permanently delete all ${entries.length} saved calculations. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await Promise.all(entries.map(cascadeDeleteEntry));
            await deleteHistoryEntries(entries.map((e) => e.id));
            exitSelectMode();
            reload();
          },
        },
      ]
    );
  }

  async function startNewCalculation() {
    const universityId = (await getSelectedUniversity()) ?? 'foundation';
    parentNav.navigate('SgpaCourseEntry', { universityId });
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + spacing.lg }]}>
      <View style={[styles.headerRow, { paddingHorizontal: spacing.md }]}>
        {selectMode ? (
          <>
            <PressableScale onPress={exitSelectMode} haptic="selection" style={{ padding: 4 }}>
              <Text style={[type.bodyMedium, { color: theme.accent }]}>Cancel</Text>
            </PressableScale>
            <Text style={[type.h2, { color: theme.textPrimary }]}>{selectedIds.size} selected</Text>
            <View style={{ width: 50 }} />
          </>
        ) : (
          <>
            <View style={styles.leftGroup}>
              <BackToHomeButton />
              <Text style={[type.h1, { color: theme.textPrimary }]}>History</Text>
            </View>
            {entries.length > 0 && (
              <PressableScale onPress={confirmClearAllHistory} haptic="medium" style={{ padding: 4 }}>
                <Ionicons name="trash-bin-outline" size={20} color={theme.error} />
              </PressableScale>
            )}
          </>
        )}
      </View>

      {!selectMode && (
        <Text style={[type.body, { color: theme.textSecondary, paddingHorizontal: spacing.md, marginTop: 4 }]}>
          Every SGPA and CGPA you've saved, across all universities.
        </Text>
      )}

      <View style={{ flexDirection: 'row', paddingHorizontal: spacing.md, marginTop: spacing.md }}>
        <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterChip label="SGPA" active={filter === 'sgpa'} onPress={() => setFilter('sgpa')} />
        <FilterChip label="CGPA" active={filter === 'cgpa'} onPress={() => setFilter('cgpa')} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: insets.bottom + (selectMode ? 90 : spacing.xl),
          width: '100%',
          maxWidth: layoutSafety.maxContentWidth,
          alignSelf: 'center',
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.accent} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loaded ? (
            <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
              <Ionicons name="time-outline" size={40} color={theme.textMuted} />
              <Text style={[type.body, { color: theme.textMuted, marginTop: spacing.sm, textAlign: 'center' }]}>
                {filter === 'all'
                  ? 'No saved calculations yet.'
                  : `No saved ${filter.toUpperCase()} calculations yet.`}
              </Text>
              <View style={{ marginTop: spacing.lg, width: '100%' }}>
                <Button label="Calculate SGPA" icon="calculator-outline" variant="primary" onPress={startNewCalculation} fullWidth />
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Animated.View entering={FadeIn.duration(220)} exiting={FadeOutUp.duration(180)} layout={Layout.springify()}>
            <HistoryListItem
              entry={item}
              onPress={() => viewEntry(item)}
              onEdit={item.type === 'sgpa' && !selectMode ? () => editEntry(item) : undefined}
              onDelete={() => confirmDelete(item)}
              onLongPress={() => !selectMode && enterSelectMode(item.id)}
              selectMode={selectMode}
              selected={selectedIds.has(item.id)}
            />
          </Animated.View>
        )}
      />

      {selectMode && (
        <View
          style={[
            styles.bulkBar,
            { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: insets.bottom + spacing.sm },
          ]}
        >
          <Button
            label={`Delete ${selectedIds.size > 0 ? selectedIds.size : ''}`.trim()}
            icon="trash-outline"
            variant="primary"
            onPress={confirmBulkDelete}
            disabled={selectedIds.size === 0}
            fullWidth
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulkBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    padding: 12,
  },
});
