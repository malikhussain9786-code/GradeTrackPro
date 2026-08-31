import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme';

// GradeTrack Pro — PressableScale
// The single touch-feedback primitive used across every button, card,
// and tappable row in the app.
//
// Real-device feedback: taps felt sluggish/unresponsive. Two fixes:
//   1. Haptic now fires on PRESS-DOWN, not on release — the finger
//      feels the response the instant it touches, not after it lifts.
//   2. Scale animation switched from timing to spring physics — a
//      natural snap-back reads as more premium than a linear tween.
// Haptic feedback respects the user's Settings > Haptics toggle.

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: 'light' | 'medium' | 'selection' | 'none';
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  children,
  style,
  scaleTo = 0.94,
  haptic = 'light',
  disabled,
  onPressIn,
  onPressOut,
  onPress,
  hitSlop,
  ...rest
}: PressableScaleProps) {
  const { hapticsEnabled } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const triggerHaptic = () => {
    if (!hapticsEnabled) return;
    if (haptic === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (haptic === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (haptic === 'selection') Haptics.selectionAsync().catch(() => {});
  };

  return (
    <AnimatedPressable
      disabled={disabled}
      hitSlop={hitSlop ?? { top: 6, bottom: 6, left: 6, right: 6 }}
      style={[style, animatedStyle, disabled ? { opacity: 0.5 } : null]}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, { damping: 16, stiffness: 400, mass: 0.4 });
        triggerHaptic();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 12, stiffness: 300, mass: 0.4 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        onPress?.(e);
      }}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
