import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { getUniversityById } from '../../data';
import { getGradeScale } from '../../data/gradeScales';
import { useAppTheme } from '../../theme';
import { Button } from '../../components/Button';
import { PressableScale } from '../../components/PressableScale';
import { InfoChip } from '../../components/InfoChip';
import { GradeScaleTable } from '../../components/GradeScaleTable';
import { setSelectedUniversity } from '../../storage';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UniversityInfo'>;

const HERO_HEIGHT = 200;

// GradeTrack Pro — University Info
// Real-device feedback: content previously sat directly on the
// screen background right below the hero photo, and read as
// low-contrast / cramped ("congested and too light to see"). Fixed
// with a proper solid card that overlaps the hero's bottom edge
// (the standard premium "bottom sheet reveal" pattern) — content now
// always sits on a guaranteed-opaque surface, never near the image,
// with darker text and more breathing room between sections.

export function UniversityInfoScreen({ route, navigation }: Props) {
  const { universityId } = route.params;
  const university = getUniversityById(universityId);
  const scale = getGradeScale(universityId);
  const { theme, type, spacing, radius, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  if (!university) return null;

  const goCalculate = async (mode: 'sgpa' | 'cgpa') => {
    await setSelectedUniversity(university.id);
    if (mode === 'sgpa') {
      navigation.navigate('SgpaCourseEntry', { universityId: university.id });
    } else {
      navigation.navigate('CgpaEntry', { universityId: university.id });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        {/* Hero banner */}
        <View style={{ height: HERO_HEIGHT }}>
          <Image source={university.banner} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(10,17,40,0.25)', 'rgba(10,17,40,0.55)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={{ position: 'absolute', top: insets.top + 8, left: spacing.md, zIndex: 10, elevation: 10 }}>
            <PressableScale
              onPress={() => navigation.goBack()}
              haptic="selection"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[styles.backBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </PressableScale>
          </View>
        </View>

        {/* Solid content card — overlaps the hero's bottom edge so text
            never sits near the photo, guaranteeing contrast/legibility */}
        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: theme.surface,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              marginTop: -28,
              width: '100%',
              maxWidth: layoutSafety.maxContentWidth,
              alignSelf: 'center',
            },
          ]}
        >
          <View style={styles.grabber} />
          <Text style={[type.captionMedium, { color: theme.accent }]}>{university.shortName}</Text>
          <Text style={[type.h1, { color: theme.textPrimary, marginTop: 2 }]} numberOfLines={2}>
            {university.name}
          </Text>

          {/* Quick facts */}
          <View style={[styles.chipRow, { marginTop: spacing.md }]}>
            <InfoChip icon="location-outline" label={university.city} />
            <InfoChip
              icon={university.inputMode === 'marks' ? 'create-outline' : 'list-outline'}
              label={university.inputMode === 'marks' ? 'Marks-based entry' : 'Grade selection'}
            />
            <InfoChip icon="ribbon-outline" label={`Max GPA ${scale.maxGpa.toFixed(1)}`} />
            {university.supportsTheoryPracticalSplit && (
              <InfoChip icon="layers-outline" label="Theory / Practical split" />
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border, marginTop: spacing.lg }]} />

          {/* About */}
          <Text style={[type.h1, { color: theme.textPrimary, marginTop: spacing.lg }]}>About</Text>
          <Text style={[type.body, { color: theme.textPrimary, marginTop: spacing.sm, lineHeight: 23 }]}>
            {university.about}
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.border, marginTop: spacing.lg }]} />

          {/* Calculation method */}
          <Text style={[type.h1, { color: theme.textPrimary, marginTop: spacing.lg }]}>
            Calculation Method
          </Text>
          <Text style={[type.body, { color: theme.textSecondary, marginTop: spacing.sm, marginBottom: spacing.md, lineHeight: 21 }]}>
            {university.gradeScaleNote}
          </Text>
          <GradeScaleTable scale={scale} showPercent={university.inputMode === 'marks'} />

          {/* Actions */}
          <View style={{ marginTop: spacing.xl }}>
            <Button
              label="Visit Official Website"
              icon="open-outline"
              variant="secondary"
              onPress={() => WebBrowser.openBrowserAsync(university.websiteUrl)}
              fullWidth
            />
            <View style={{ height: spacing.sm }} />
            <View style={{ flexDirection: 'row' }}>
              <Button
                label="Calculate SGPA"
                variant="primary"
                onPress={() => goCalculate('sgpa')}
                style={{ flex: 1 }}
              />
              <View style={{ width: spacing.xs }} />
              <Button
                label="Calculate CGPA"
                variant="secondary"
                onPress={() => goCalculate('cgpa')}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(150,150,150,0.35)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
