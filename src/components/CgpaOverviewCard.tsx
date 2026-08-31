import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StandingInfo } from '../engine/standingLabel';
import { useAppTheme } from '../theme';

interface CgpaOverviewCardProps {
  cgpa: number;
  maxGpa: number;
  totalCreditHours: number;
  semestersCompleted: number;
  standing: StandingInfo;
}

const STANDARD_SEMESTER_COUNT = 8; // typical Pakistani BS program length

export function CgpaOverviewCard({ cgpa, maxGpa, totalCreditHours, semestersCompleted, standing }: CgpaOverviewCardProps) {
  const { theme, type, spacing, radius } = useAppTheme();

  const progressPct = Math.min(Math.round((semestersCompleted / STANDARD_SEMESTER_COUNT) * 100), 100);
  const color = standing.tier === 'probation' ? theme.error : standing.tier === 'satisfactory' ? theme.warning : theme.success;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderRadius: radius.lg, borderColor: theme.border }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[type.caption, { color: theme.textMuted }]}>Current CGPA</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 2 }}>
            <Text style={[type.heroNumber, { color: theme.textPrimary }]}>{cgpa.toFixed(2)}</Text>
            <Text style={[type.body, { color: theme.textMuted, marginBottom: 6, marginLeft: 4 }]}>
              / {maxGpa.toFixed(2)}
            </Text>
          </View>
          <View style={styles.standingPill}>
            <Ionicons name="checkmark-circle" size={14} color={color} style={{ marginRight: 4 }} />
            <Text style={[type.captionMedium, { color }]}>{standing.label}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[type.caption, { color: theme.textMuted }]}>Total Credits</Text>
          <Text style={[type.h1, { color: theme.textPrimary, marginTop: 2 }]}>{totalCreditHours}</Text>
          <Text style={[type.caption, { color: theme.textMuted, marginTop: 6 }]}>
            Sem {semestersCompleted} of {STANDARD_SEMESTER_COUNT} · {progressPct}%
          </Text>
        </View>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceAlt, borderRadius: radius.pill }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressPct}%`, backgroundColor: theme.accent, borderRadius: radius.pill },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  standingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressTrack: {
    height: 6,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
