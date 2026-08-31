import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HistoryEntry } from '../types';
import { getUniversityById } from '../data';
import { formatRelativeOrShortDate } from '../utils/date';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

interface HistoryListItemProps {
  entry: HistoryEntry;
  onPress: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onLongPress?: () => void;
  selectMode?: boolean;
  selected?: boolean;
}

export function HistoryListItem({
  entry,
  onPress,
  onEdit,
  onDelete,
  onLongPress,
  selectMode = false,
  selected = false,
}: HistoryListItemProps) {
  const { theme, type, spacing, radius } = useAppTheme();
  const university = getUniversityById(entry.universityId);

  const isSgpa = entry.type === 'sgpa';
  const icon = isSgpa ? 'calculator' : 'stats-chart';
  const typeLabel = isSgpa ? 'SGPA' : 'CGPA';

  return (
    <PressableScale
      onPress={onPress}
      onLongPress={onLongPress}
      haptic="selection"
      scaleTo={0.98}
      style={[
        styles.row,
        {
          backgroundColor: selected ? theme.accentSoft : theme.surface,
          borderColor: selected ? theme.accent : theme.border,
          borderRadius: radius.md,
        },
      ]}
    >
      {selectMode ? (
        <View
          style={[
            styles.checkbox,
            { borderColor: selected ? theme.accent : theme.border, backgroundColor: selected ? theme.accent : 'transparent' },
          ]}
        >
          {selected && <Ionicons name="checkmark" size={14} color="#1A1206" />}
        </View>
      ) : (
        <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name={icon} size={20} color={theme.accent} />
        </View>
      )}

      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <View style={styles.titleRow}>
          <Text style={[type.bodySemibold, { color: theme.textPrimary, flex: 1 }]} numberOfLines={1}>
            {entry.title}
          </Text>
          <Text style={[type.bodySemibold, { color: theme.accent }]}>{entry.resultValue.toFixed(2)}</Text>
        </View>
        <Text style={[type.caption, { color: theme.textMuted, marginTop: 2 }]} numberOfLines={1}>
          {typeLabel} · {university?.shortName ?? entry.universityId} · {entry.creditHours} cr ·{' '}
          {formatRelativeOrShortDate(entry.savedAt)}
        </Text>
      </View>

      {!selectMode && onEdit && (
        <PressableScale onPress={onEdit} haptic="selection" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.iconBtn}>
          <Ionicons name="pencil-outline" size={17} color={theme.textMuted} />
        </PressableScale>
      )}
      {!selectMode && (
        <PressableScale onPress={onDelete} haptic="medium" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={17} color={theme.error} />
        </PressableScale>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 2,
  },
});
