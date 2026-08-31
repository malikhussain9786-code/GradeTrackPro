import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';

interface RunningTotalBarProps {
  sgpa: number;
  totalCreditHours: number;
  subjectCount: number;
}

// Shown above "Added Courses" once at least one subject exists —
// gives real-time feedback on where the semester is trending, rather
// than making the student wait until "Calculate SGPA" to see anything.

export function RunningTotalBar({ sgpa, totalCreditHours, subjectCount }: RunningTotalBarProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  if (subjectCount === 0) return null;

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surfaceAlt, borderRadius: radius.md, borderColor: theme.border },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[type.caption, { color: theme.textMuted }]}>Running SGPA</Text>
        <Text style={[type.h2, { color: theme.accent, marginTop: 2 }]}>{sgpa.toFixed(2)}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[type.caption, { color: theme.textMuted }]}>Credit Hours</Text>
        <Text style={[type.h2, { color: theme.textPrimary, marginTop: 2 }]}>{totalCreditHours}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
});
