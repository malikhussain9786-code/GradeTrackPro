import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

interface CourseListItemProps {
  name: string;
  creditHours: number;
  grade: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function CourseListItem({ name, creditHours, grade, onEdit, onDelete }: CourseListItemProps) {
  const { theme, type, spacing } = useAppTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Text style={[type.bodyMedium, { color: theme.textPrimary, flex: 1 }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[type.body, { color: theme.textSecondary, width: 44, textAlign: 'right' }]}>
        {creditHours} Cr
      </Text>
      <Text style={[type.bodySemibold, { color: theme.accent, width: 40, textAlign: 'right' }]}>
        {grade}
      </Text>
      <PressableScale onPress={onEdit} haptic="selection" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.iconBtn}>
        <Ionicons name="pencil-outline" size={17} color={theme.textMuted} />
      </PressableScale>
      <PressableScale onPress={onDelete} haptic="medium" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.iconBtn}>
        <Ionicons name="trash-outline" size={17} color={theme.error} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    padding: 8,
    marginLeft: 2,
  },
});
