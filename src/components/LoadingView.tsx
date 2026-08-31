import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAppTheme } from '../theme';

export function LoadingView() {
  const { theme } = useAppTheme();
  return (
    <Animated.View entering={FadeIn.duration(200)} style={[styles.wrap, { backgroundColor: theme.background }]}>
      <ActivityIndicator color={theme.accent} size="large" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
