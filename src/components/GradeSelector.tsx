import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradeScale } from '../types';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';
import { SelectModal, SelectOption } from './SelectModal';

// GradeTrack Pro — Grade Selector
// Matches your official screenshots exactly: "Grade..." placeholder
// field that opens a radio-list of "A (4.00)", "A- (3.67)"... etc,
// built on the same SelectModal used for the University Selector.

interface GradeSelectorProps {
  label: string;
  scale: GradeScale;
  value?: string;
  onChange: (letter: string) => void;
  error?: string;
}

export function GradeSelector({ label, scale, value, onChange, error }: GradeSelectorProps) {
  const { theme, type, spacing, radius, touchTarget } = useAppTheme();
  const [open, setOpen] = useState(false);

  const options: SelectOption[] = scale.bands.map((b) => ({
    value: b.letter,
    label: `${b.letter} (${b.minPoints.toFixed(2)})`,
  }));

  const selectedLabel = value ? options.find((o) => o.value === value)?.label : undefined;

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={[type.captionMedium, { color: theme.textSecondary, marginBottom: 6 }]}>{label}</Text>
      <PressableScale
        onPress={() => setOpen(true)}
        haptic="selection"
        style={[
          styles.field,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.error : theme.border,
            borderRadius: radius.md,
            minHeight: touchTarget.min,
            paddingHorizontal: spacing.sm,
          },
        ]}
      >
        <Text
          style={[
            type.bodyMedium,
            { color: selectedLabel ? theme.textPrimary : theme.textMuted, flex: 1 },
          ]}
        >
          {selectedLabel ?? 'Grade...'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.textMuted} />
      </PressableScale>
      {error && <Text style={[type.caption, { color: theme.error, marginTop: 4 }]}>{error}</Text>}

      <SelectModal
        visible={open}
        title="Select Grade"
        options={options}
        selectedValue={value}
        onSelect={(v) => {
          onChange(v);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
