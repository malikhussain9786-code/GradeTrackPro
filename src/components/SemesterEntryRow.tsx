import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

export interface ManualSemesterRowData {
  id: string;
  label: string;
  sgpa: string;
  creditHours: string;
}

interface SemesterEntryRowProps {
  data: ManualSemesterRowData;
  onChange: (next: ManualSemesterRowData) => void;
  onDelete: () => void;
  error?: string;
}

export function SemesterEntryRow({ data, onChange, onDelete, error }: SemesterEntryRowProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surface, borderColor: error ? theme.error : theme.border, borderRadius: radius.md },
      ]}
    >
      <View style={styles.topRow}>
        <TextInput
          value={data.label}
          onChangeText={(v) => onChange({ ...data, label: v })}
          placeholder="Semester label"
          placeholderTextColor={theme.textMuted}
          style={[type.bodySemibold, { color: theme.textPrimary, flex: 1 }]}
        />
        <PressableScale onPress={onDelete} haptic="medium" style={{ padding: 4 }}>
          <Ionicons name="trash-outline" size={18} color={theme.error} />
        </PressableScale>
      </View>

      <View style={[styles.bottomRow, { marginTop: spacing.sm }]}>
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: theme.textMuted, marginBottom: 4 }]}>SGPA</Text>
          <TextInput
            value={data.sgpa}
            onChangeText={(v) => onChange({ ...data, sgpa: v })}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.textMuted}
            style={[
              type.bodyMedium,
              {
                color: theme.textPrimary,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: radius.sm,
                paddingHorizontal: 10,
                paddingVertical: 8,
                textAlign: 'center',
              },
            ]}
          />
        </View>
        <View style={{ width: spacing.sm }} />
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: theme.textMuted, marginBottom: 4 }]}>Credit Hours</Text>
          <TextInput
            value={data.creditHours}
            onChangeText={(v) => onChange({ ...data, creditHours: v })}
            keyboardType="decimal-pad"
            placeholder="18"
            placeholderTextColor={theme.textMuted}
            style={[
              type.bodyMedium,
              {
                color: theme.textPrimary,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: radius.sm,
                paddingHorizontal: 10,
                paddingVertical: 8,
                textAlign: 'center',
              },
            ]}
          />
        </View>
      </View>

      {error && <Text style={[type.caption, { color: theme.error, marginTop: 6 }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
  },
});
