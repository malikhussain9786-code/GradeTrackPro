import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradeScale } from '../types';
import { useAppTheme } from '../theme';

// GradeTrack Pro — Grade Scale Table
// Renders a university's official grading bands as a clean table.
// Used on the University Info screen (Step 8) and reusable later in
// the Calculator's "info" popover if needed. Marks-mode universities
// show a percentage column; grade-mode universities don't (since no
// percentage bands were officially provided for them).

interface GradeScaleTableProps {
  scale: GradeScale;
  showPercent: boolean;
}

export function GradeScaleTable({ scale, showPercent }: GradeScaleTableProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surfaceAlt, borderRadius: radius.md, borderColor: theme.border },
      ]}
    >
      <View style={[styles.row, styles.headerRow, { borderBottomColor: theme.border }]}>
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 1 }]}>Grade</Text>
        {showPercent && (
          <Text style={[type.captionMedium, { color: theme.textMuted, flex: 1.4, textAlign: 'center' }]}>
            Percentage
          </Text>
        )}
        <Text style={[type.captionMedium, { color: theme.textMuted, flex: 1, textAlign: 'right' }]}>
          Points
        </Text>
      </View>

      {scale.bands.map((band, idx) => (
        <View
          key={band.letter}
          style={[
            styles.row,
            idx !== scale.bands.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
          ]}
        >
          <Text style={[type.bodySemibold, { color: theme.textPrimary, flex: 1 }]}>{band.letter}</Text>
          {showPercent && (
            <Text style={[type.body, { color: theme.textSecondary, flex: 1.4, textAlign: 'center' }]}>
              {band.minPercent !== undefined && band.maxPercent !== undefined
                ? band.minPercent === band.maxPercent
                  ? `${band.minPercent}%`
                  : `${band.minPercent}\u2013${band.maxPercent}%`
                : '\u2014'}
            </Text>
          )}
          <Text style={[type.body, { color: theme.textSecondary, flex: 1, textAlign: 'right' }]}>
            {band.minPoints === band.maxPoints
              ? band.minPoints.toFixed(2)
              : `${band.minPoints.toFixed(2)}\u2013${band.maxPoints.toFixed(2)}`}
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
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  headerRow: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
});
