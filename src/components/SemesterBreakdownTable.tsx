import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SemesterSummary } from '../types';
import { useAppTheme } from '../theme';

interface SemesterBreakdownTableProps {
  semesters: SemesterSummary[];
}

export function SemesterBreakdownTable({ semesters }: SemesterBreakdownTableProps) {
  const { theme, type, radius } = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderRadius: radius.md, borderColor: theme.border }]}>
      <View style={[styles.row, styles.headerRow, { borderBottomColor: theme.border }]}>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 2.2 }]}>Semester</Text>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 1, textAlign: 'center' }]}>Cr.Hr</Text>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 1, textAlign: 'center' }]}>SGPA</Text>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 1, textAlign: 'right' }]}>QP</Text>
      </View>

      {semesters.map((s, idx) => (
        <View
          key={s.semesterId}
          style={[
            styles.row,
            idx !== semesters.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
          ]}
        >
          <Text style={[type.bodyMedium, { color: theme.textPrimary, flex: 2.2 }]} numberOfLines={1}>
            {s.label}
          </Text>
          <Text style={[type.body, { color: theme.textSecondary, flex: 1, textAlign: 'center' }]}>
            {s.creditHours}
          </Text>
          <Text style={[type.bodySemibold, { color: theme.accent, flex: 1, textAlign: 'center' }]}>
            {s.sgpa.toFixed(2)}
          </Text>
          <Text style={[type.bodyMedium, { color: theme.textPrimary, flex: 1, textAlign: 'right' }]}>
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
