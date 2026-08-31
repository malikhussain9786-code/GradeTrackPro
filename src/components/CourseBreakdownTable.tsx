import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Subject } from '../types';
import { useAppTheme } from '../theme';

interface CourseBreakdownTableProps {
  subjects: Subject[];
}

export function CourseBreakdownTable({ subjects }: CourseBreakdownTableProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderRadius: radius.md, borderColor: theme.border }]}>
      <View style={[styles.row, styles.headerRow, { borderBottomColor: theme.border }]}>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 2.4 }]}>Course</Text>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 0.9, textAlign: 'center' }]}>Cr.Hr</Text>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 0.9, textAlign: 'center' }]}>Grade</Text>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 1, textAlign: 'center' }]}>Points</Text>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 0.9, textAlign: 'right' }]}>QP</Text>
      </View>

      {subjects.map((s, idx) => (
        <View
          key={s.id}
          style={[
            styles.row,
            idx !== subjects.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
          ]}
        >
          <Text style={[type.bodyMedium, { color: theme.textPrimary, flex: 2.4 }]} numberOfLines={1}>
            {s.name}
          </Text>
          <Text style={[type.body, { color: theme.textSecondary, flex: 0.9, textAlign: 'center' }]}>
            {s.creditHours}
          </Text>
          <Text style={[type.bodySemibold, { color: theme.accent, flex: 0.9, textAlign: 'center' }]}>
            {s.computedGrade}
          </Text>
          <Text style={[type.body, { color: theme.textSecondary, flex: 1, textAlign: 'center' }]}>
            {s.computedPoints.toFixed(2)}
          </Text>
          <Text style={[type.bodyMedium, { color: theme.textPrimary, flex: 0.9, textAlign: 'right' }]}>
            {s.qualityPoints.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  headerRow: {
    borderBottomWidth: 1,
    paddingVertical: 9,
  },
});
