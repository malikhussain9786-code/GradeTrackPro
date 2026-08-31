import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useAppTheme } from '../theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  suffix?: string;
}

export function TextField({ label, error, suffix, style, ...rest }: TextFieldProps) {
  const { theme, type, spacing, radius, touchTarget } = useAppTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={[type.captionMedium, { color: theme.textSecondary, marginBottom: 6 }]}>{label}</Text>
      <View
        style={[
          styles.fieldRow,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.error : focused ? theme.accent : theme.border,
            borderRadius: radius.md,
            minHeight: touchTarget.min,
          },
        ]}
      >
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={theme.textMuted}
          style={[type.bodyMedium, { color: theme.textPrimary, flex: 1, paddingHorizontal: spacing.sm }, style]}
        />
        {suffix && (
          <Text style={[type.captionMedium, { color: theme.textMuted, paddingRight: spacing.sm }]}>
            {suffix}
          </Text>
        )}
      </View>
      {error && <Text style={[type.caption, { color: theme.error, marginTop: 4 }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
