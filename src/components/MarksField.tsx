import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { useAppTheme } from '../theme';

interface MarksFieldProps {
  label: string;
  obtained: string;
  total: string;
  onChangeObtained: (v: string) => void;
  onChangeTotal: (v: string) => void;
  error?: string;
}

// GradeTrack Pro — Marks Field
// Real-device feedback: the cramped single-row "obtained / total"
// layout felt "a bit off." Redesigned as two clearly-labeled, roomier
// boxes with a smooth animated focus border (instead of an abrupt
// color swap) and bigger numerals — reads like a proper premium
// calculator input, not a squeezed form field.

function NumberBox({
  miniLabel,
  value,
  onChangeText,
  placeholder,
  hasError,
}: {
  miniLabel: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  hasError?: boolean;
}) {
  const { theme, type, radius } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, { duration: 160 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: hasError
      ? theme.error
      : interpolateColor(progress.value, [0, 1], [theme.border, theme.accent]),
  }));

  return (
    <View style={{ flex: 1 }}>
      <Text style={[type.caption, { color: theme.textMuted, marginBottom: 5, textAlign: 'center' }]}>
        {miniLabel}
      </Text>
      <Animated.View
        style={[
          styles.box,
          animatedStyle,
          { backgroundColor: theme.surface, borderRadius: radius.md },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            { color: focused ? theme.accent : theme.textPrimary },
          ]}
        />
      </Animated.View>
    </View>
  );
}

export function MarksField({ label, obtained, total, onChangeObtained, onChangeTotal, error }: MarksFieldProps) {
  const { theme, type, spacing } = useAppTheme();

  return (
    <View style={{ flex: 1 }}>
      <Text style={[type.captionMedium, { color: theme.textSecondary, marginBottom: 8 }]}>{label}</Text>
      <View style={styles.row}>
        <NumberBox miniLabel="Marks Obtained" value={obtained} onChangeText={onChangeObtained} placeholder="0" hasError={!!error} />
        <View style={styles.ofWrap}>
          <Text style={[type.caption, { color: theme.textMuted }]}>of</Text>
        </View>
        <NumberBox miniLabel="Total Marks" value={total} onChangeText={onChangeTotal} placeholder="100" hasError={!!error} />
      </View>
      {error && <Text style={[type.caption, { color: theme.error, marginTop: 6 }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  box: {
    borderWidth: 1.5,
    minHeight: 56,
    justifyContent: 'center',
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 12,
  },
  ofWrap: {
    paddingHorizontal: 8,
    paddingBottom: 18,
  },
});
