import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';

interface StatItem {
  label: string;
  value: string;
  emphasize?: boolean;
}

interface StatsPreviewRowProps {
  items: StatItem[];
}

// Matches the mockup's "Total Marks 91/100 | Grade A- | Points 3.67"
// live preview row shown as soon as enough info is entered to compute.

export function StatsPreviewRow({ items }: StatsPreviewRowProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.accentSoft, borderRadius: radius.md, padding: spacing.sm },
      ]}
    >
      {items.map((item, idx) => (
        <View key={item.label} style={[styles.cell, idx !== items.length - 1 && styles.divider, { borderRightColor: theme.border }]}>
          <Text style={[type.caption, { color: theme.textMuted }]}>{item.label}</Text>
          <Text
            style={[
              item.emphasize ? type.h2 : type.bodySemibold,
              { color: item.emphasize ? theme.accent : theme.textPrimary, marginTop: 2 },
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    borderRightWidth: StyleSheet.hairlineWidth,
  },
});
