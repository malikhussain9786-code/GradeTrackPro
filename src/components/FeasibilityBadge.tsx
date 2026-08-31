import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlannerFeasibility } from '../types';
import { useAppTheme } from '../theme';

interface FeasibilityBadgeProps {
  feasibility: PlannerFeasibility;
}

const CONFIG: Record<PlannerFeasibility, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  achievable: { label: 'Achievable', icon: 'checkmark-circle' },
  difficult: { label: 'Difficult', icon: 'trending-up' },
  impossible: { label: 'Not Possible', icon: 'close-circle' },
};

export function FeasibilityBadge({ feasibility }: FeasibilityBadgeProps) {
  const { theme, type, radius } = useAppTheme();
  const config = CONFIG[feasibility];

  const color =
    feasibility === 'achievable' ? theme.success : feasibility === 'difficult' ? theme.warning : theme.error;
  const bg =
    feasibility === 'achievable' ? theme.successSoft : feasibility === 'difficult' ? theme.warningSoft : theme.errorSoft;

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderRadius: radius.pill }]}>
      <Ionicons name={config.icon} size={14} color={color} style={{ marginRight: 5 }} />
      <Text style={[type.captionMedium, { color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
