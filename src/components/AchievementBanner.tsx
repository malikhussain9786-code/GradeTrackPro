import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StandingInfo } from '../engine/standingLabel';
import { useAppTheme } from '../theme';

interface AchievementBannerProps {
  standing: StandingInfo;
}

const ICON_BY_TIER = {
  excellent: 'trophy' as const,
  good: 'checkmark-circle' as const,
  satisfactory: 'information-circle' as const,
  probation: 'warning' as const,
};

export function AchievementBanner({ standing }: AchievementBannerProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  const color =
    standing.tier === 'probation' ? theme.error : standing.tier === 'satisfactory' ? theme.warning : theme.success;
  const bg =
    standing.tier === 'probation' ? theme.errorSoft : standing.tier === 'satisfactory' ? theme.warningSoft : theme.successSoft;

  return (
    <View style={[styles.wrap, { backgroundColor: bg, borderRadius: radius.md, padding: spacing.sm }]}>
      <Ionicons name={ICON_BY_TIER[standing.tier]} size={20} color={color} style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={[type.bodySemibold, { color }]}>{standing.label}</Text>
        <Text style={[type.caption, { color: theme.textSecondary, marginTop: 2 }]}>{standing.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
