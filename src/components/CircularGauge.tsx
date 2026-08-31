import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularGaugeProps {
  value: number; // e.g. 3.67
  max: number; // e.g. 4.0
  label: string; // "SGPA" / "CGPA"
  size?: number;
  strokeWidth?: number;
}

// GradeTrack Pro — Circular Gauge
// Matches the mockup's two-tone ring (navy track + gold progress arc)
// with the big serif number centered inside. Animates in on mount so
// the result feels alive rather than a static number dump.

export function CircularGauge({ value, max, label, size = 200, strokeWidth = 14 }: CircularGaugeProps) {
  const { theme, type } = useAppTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value / max, 0), 1);

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc, rotated so it starts at 12 o'clock */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[type.heroNumberLarge, { color: theme.textPrimary }]}>{value.toFixed(2)}</Text>
      <Text style={[type.h2, { color: theme.textSecondary, marginTop: -4 }]}>{label}</Text>
    </View>
  );
}
