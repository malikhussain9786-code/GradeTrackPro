import React from 'react';
import { Text, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { useAppTheme } from '../theme';

// GradeTrack Pro — Button
// Two variants matching the mockups: solid gold (primary CTAs like
// "Calculate SGPA", "Add Course") and outlined/soft (secondary actions
// like "About", website links). Minimum 48pt touch height enforced.

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
  fullWidth,
}: ButtonProps) {
  const { theme, type, radius, spacing, touchTarget } = useAppTheme();

  const bg =
    variant === 'primary' ? theme.accent : variant === 'secondary' ? theme.surface : 'transparent';
  const borderColor = variant === 'secondary' ? theme.border : 'transparent';
  const textColor =
    variant === 'primary' ? '#1A1206' : variant === 'secondary' ? theme.textPrimary : theme.accent;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      haptic="light"
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderRadius: radius.md,
          minHeight: touchTarget.min,
          paddingHorizontal: spacing.lg,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: 8 }} />}
          <Text style={[type.button, { color: textColor }]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
