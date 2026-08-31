import React, { useEffect } from 'react';
import { View, Text, Modal, FlatList, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { PressableScale } from './PressableScale';

// GradeTrack Pro — SelectModal
// Generic bottom-sheet-style single-select list, matching the native
// Android radio-list pattern seen in the official grading screenshots
// (title bar + rows with a circular radio indicator). Reused for the
// University Selector (Step 9) and Grade Selector (Step 10) so both
// pickers feel identical and only need to be polished once.

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  leadingBadge?: string; // e.g. university initials, rendered as a small circle
}

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function SelectModal({ visible, title, options, selectedValue, onSelect, onClose }: SelectModalProps) {
  const { theme, type, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(400);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 22, stiffness: 220 });
      backdropOpacity.value = withTiming(1, { duration: 180 });
    } else {
      translateY.value = withTiming(400, { duration: 180, easing: Easing.in(Easing.quad) });
      backdropOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFillObject, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          sheetStyle,
          {
            backgroundColor: theme.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            paddingBottom: insets.bottom + spacing.md,
            maxHeight: '75%',
          },
        ]}
      >
        <View style={styles.grabber} />
        <View style={[styles.headerRow, { paddingHorizontal: spacing.md }]}>
          <Text style={[type.h1, { color: theme.textPrimary }]}>{title}</Text>
          <PressableScale onPress={onClose} haptic="selection" style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={theme.textSecondary} />
          </PressableScale>
        </View>

        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.xs }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.value === selectedValue;
            return (
              <PressableScale
                onPress={() => onSelect(item.value)}
                haptic="selection"
                scaleTo={0.98}
                style={[
                  styles.optionRow,
                  {
                    borderBottomColor: theme.border,
                    backgroundColor: isSelected ? theme.accentSoft : 'transparent',
                    borderRadius: radius.sm,
                  },
                ]}
              >
                {item.leadingBadge && (
                  <View style={[styles.miniBadge, { backgroundColor: theme.accent }]}>
                    <Text style={styles.miniBadgeText}>{item.leadingBadge}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodySemibold, { color: theme.textPrimary }]}>{item.label}</Text>
                  {item.sublabel && (
                    <Text style={[type.caption, { color: theme.textMuted, marginTop: 2 }]}>
                      {item.sublabel}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.radio,
                    { borderColor: isSelected ? theme.accent : theme.border },
                    isSelected && { backgroundColor: theme.accent },
                  ]}
                >
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </PressableScale>
            );
          }}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(10,17,40,0.5)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(150,150,150,0.4)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
  },
  miniBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  miniBadgeText: {
    color: '#1A1206',
    fontSize: 11,
    fontWeight: '800',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFFFFF',
  },
});
