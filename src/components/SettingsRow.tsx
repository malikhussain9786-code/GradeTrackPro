import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

export function SettingsRow({ icon, label, subtitle, onPress, trailing, destructive }: SettingsRowProps) {
  const { theme, type, spacing, radius } = useAppTheme();
  const content = (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.md }]}>
      <View style={[styles.iconWrap, { backgroundColor: destructive ? theme.errorSoft : theme.accentSoft }]}>
        <Ionicons name={icon} size={18} color={destructive ? theme.error : theme.accent} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={[type.bodyMedium, { color: destructive ? theme.error : theme.textPrimary }]}>{label}</Text>
        {subtitle && <Text style={[type.caption, { color: theme.textMuted, marginTop: 2 }]}>{subtitle}</Text>}
      </View>
      {trailing ?? (onPress && <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />)}
    </View>
  );

  if (!onPress) return content;

  return (
    <PressableScale onPress={onPress} haptic="selection" scaleTo={0.98} style={{ marginBottom: 10 }}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
