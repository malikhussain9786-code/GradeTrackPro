import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { theme, type, radius, touchTarget } = useAppTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.md }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <PressableScale
            key={opt.value}
            onPress={() => onChange(opt.value)}
            haptic="selection"
            scaleTo={0.96}
            style={[
              styles.segment,
              { borderRadius: radius.sm, backgroundColor: active ? theme.accent : 'transparent', minHeight: touchTarget.min - 8 },
            ]}
          >
            <Text style={[type.bodyMedium, { color: active ? '#1A1206' : theme.textSecondary }]} numberOfLines={1}>
              {opt.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
