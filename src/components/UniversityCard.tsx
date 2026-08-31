import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { University } from '../types';
import { useAppTheme } from '../theme';
import { Button } from './Button';
import { PressableScale } from './PressableScale';

// GradeTrack Pro — University Card
// Per the original spec: logo/image, name, short info, About button,
// official website button, Calculate SGPA button, Calculate CGPA button.
// Banner photo on top with a gradient scrim for text legibility, a
// circular initials badge as the "logo" (see Step 5 note on assets),
// then the info + action row below on a clean card surface.

interface UniversityCardProps {
  university: University;
  onPressAbout: () => void;
  onPressWebsite: () => void;
  onPressSgpa: () => void;
  onPressCgpa: () => void;
}

function initialsFor(shortName: string): string {
  const cleaned = shortName.replace(/[^A-Za-z ]/g, '');
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return cleaned.slice(0, 2).toUpperCase();
}

export function UniversityCard({
  university,
  onPressAbout,
  onPressWebsite,
  onPressSgpa,
  onPressCgpa,
}: UniversityCardProps) {
  const { theme, type, spacing, radius, elevation } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderRadius: radius.xl,
          shadowColor: theme.cardShadow,
          ...elevation.card,
        },
      ]}
    >
      <View style={styles.bannerWrap}>
        <Image source={university.banner} style={styles.banner} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(10,17,40,0.05)', 'rgba(10,17,40,0.55)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.badge, { backgroundColor: theme.accent }]}>
          <Text style={styles.badgeText}>{initialsFor(university.shortName)}</Text>
        </View>
        <Text style={styles.bannerTitle} numberOfLines={1}>
          {university.shortName}
        </Text>
      </View>

      <View style={{ padding: spacing.md }}>
        <Text style={[type.h2, { color: theme.textPrimary }]} numberOfLines={2}>
          {university.name}
        </Text>
        <Text style={[type.body, { color: theme.textSecondary, marginTop: 4 }]} numberOfLines={2}>
          {university.about}
        </Text>

        <View style={[styles.secondaryRow, { marginTop: spacing.md }]}>
          <PressableScale
            onPress={onPressAbout}
            haptic="selection"
            style={[styles.secondaryBtn, { borderColor: theme.border }]}
          >
            <Text style={[type.captionMedium, { color: theme.textSecondary }]}>About</Text>
          </PressableScale>
          <PressableScale
            onPress={onPressWebsite}
            haptic="selection"
            style={[styles.secondaryBtn, { borderColor: theme.border, marginLeft: spacing.xs }]}
          >
            <Text style={[type.captionMedium, { color: theme.textSecondary }]}>Website</Text>
          </PressableScale>
        </View>

        <View style={[styles.primaryRow, { marginTop: spacing.sm }]}>
          <Button label="Calculate SGPA" variant="primary" onPress={onPressSgpa} style={{ flex: 1 }} />
          <View style={{ width: spacing.xs }} />
          <Button label="Calculate CGPA" variant="secondary" onPress={onPressCgpa} style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}

const BANNER_HEIGHT = 120;

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  bannerWrap: {
    height: BANNER_HEIGHT,
    width: '100%',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  badgeText: {
    color: '#1A1206',
    fontWeight: '800',
    fontSize: 13,
  },
  bannerTitle: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryRow: {
    flexDirection: 'row',
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  primaryRow: {
    flexDirection: 'row',
  },
});
