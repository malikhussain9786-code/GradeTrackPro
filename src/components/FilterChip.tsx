import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  const { theme, type, radius } = useAppTheme();

  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      scaleTo={0.95}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.accent : theme.surface,
          borderColor: active ? theme.accent : theme.border,
          borderRadius: radius.pill,
        },
      ]}
    >
      <Text style={[type.captionMedium, { color: active ? '#1A1206' : theme.textSecondary }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
  },
});
