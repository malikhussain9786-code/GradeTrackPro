import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

interface InfoChipProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export function InfoChip({ icon, label }: InfoChipProps) {
  const { theme, type, radius } = useAppTheme();
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: theme.surfaceAlt, borderRadius: radius.pill, borderColor: theme.border },
      ]}
    >
      <Ionicons name={icon} size={13} color={theme.textSecondary} style={{ marginRight: 5 }} />
      <Text style={[type.captionMedium, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});
