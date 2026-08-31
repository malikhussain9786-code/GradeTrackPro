import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

interface SemesterListItemProps {
  label: string;
  sgpa: number;
  creditHours: number;
  courseCount: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SemesterListItem({
  label,
  sgpa,
  creditHours,
  courseCount,
  onPress,
  onEdit,
  onDelete,
}: SemesterListItemProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      scaleTo={0.98}
      style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.md }]}
    >
      <View style={[styles.sgpaBadge, { backgroundColor: theme.accentSoft }]}>
        <Text style={[type.bodySemibold, { color: theme.accent }]}>{sgpa.toFixed(2)}</Text>
      </View>

      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={[type.bodySemibold, { color: theme.textPrimary }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[type.caption, { color: theme.textMuted, marginTop: 2 }]}>
          {creditHours} credit hrs · {courseCount} courses
        </Text>
      </View>

      <PressableScale onPress={onEdit} haptic="selection" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.iconBtn}>
        <Ionicons name="pencil-outline" size={17} color={theme.textMuted} />
      </PressableScale>
      <PressableScale onPress={onDelete} haptic="medium" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.iconBtn}>
        <Ionicons name="trash-outline" size={17} color={theme.error} />
      </PressableScale>
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
  sgpaBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 2,
  },
});
