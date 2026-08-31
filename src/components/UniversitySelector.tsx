import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UNIVERSITIES_SORTED, getUniversityById } from '../data';
import { UniversityId } from '../types';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';
import { SelectModal, SelectOption } from './SelectModal';

// GradeTrack Pro — University Selector
// The collapsed field shown at the top of Course Entry / Calculator
// screens, matching the mockup's "COMSATS University Islamabad >"
// row exactly — logo circle + name + chevron, opens a bottom-sheet
// list of all 10 universities on tap.

interface UniversitySelectorProps {
  value: UniversityId;
  onChange: (id: UniversityId) => void;
}

function initialsFor(shortName: string): string {
  const cleaned = shortName.replace(/[^A-Za-z ]/g, '');
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return cleaned.slice(0, 2).toUpperCase();
}

export function UniversitySelector({ value, onChange }: UniversitySelectorProps) {
  const { theme, type, spacing, radius, touchTarget } = useAppTheme();
  const [open, setOpen] = useState(false);

  const selected = getUniversityById(value);

  const options: SelectOption[] = UNIVERSITIES_SORTED.map((u) => ({
    value: u.id,
    label: u.name,
    sublabel: u.city,
    leadingBadge: initialsFor(u.shortName),
  }));

  return (
    <>
      <PressableScale
        onPress={() => setOpen(true)}
        haptic="selection"
        style={[
          styles.field,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            borderRadius: radius.md,
            minHeight: touchTarget.min + 8,
            paddingHorizontal: spacing.sm,
          },
        ]}
      >
        {selected && (
          <>
            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
              <Text style={styles.badgeText}>{initialsFor(selected.shortName)}</Text>
            </View>
            <Text style={[type.bodySemibold, { color: theme.textPrimary, flex: 1 }]} numberOfLines={1}>
              {selected.name}
            </Text>
          </>
        )}
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </PressableScale>

      <SelectModal
        visible={open}
        title="Select University"
        options={options}
        selectedValue={value}
        onSelect={(id) => {
          onChange(id as UniversityId);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#1A1206',
    fontSize: 11,
    fontWeight: '800',
  },
});
