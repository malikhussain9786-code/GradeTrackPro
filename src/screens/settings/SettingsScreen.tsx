import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Switch, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import { useAppTheme } from '../../theme';
import { getSettings, updateSettings, clearAllAppData } from '../../storage';
import { buildBackupPayload, restoreFromBackupPayload } from '../../engine/backup';
import { AppSettings, ThemeModePreference } from '../../types';

import { SettingsRow } from '../../components/SettingsRow';
import { BackToHomeButton } from '../../components/BackToHomeButton';
import { PressableScale } from '../../components/PressableScale';

function SectionHeader({ title }: { title: string }) {
  const { theme, type, spacing, layoutSafety } = useAppTheme();
  return (
    <Text style={[type.captionMedium, { color: theme.textMuted, marginTop: spacing.lg, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 }]}>
      {title}
    </Text>
  );
}

const THEME_OPTIONS: { value: ThemeModePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function SettingsScreen() {
  const { theme, type, spacing, radius, mode, setMode, hapticsEnabled, setHapticsEnabled, layoutSafety } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    getSettings().then((s) => setNotificationsEnabled(s.notificationsEnabled));
  }, []);

  async function toggleNotifications(value: boolean) {
    setNotificationsEnabled(value);
    await updateSettings({ notificationsEnabled: value });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const payload = await buildBackupPayload();
      const fileName = `gradetrack-pro-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2));

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Save your GradeTrack Pro backup' });
      } else {
        Alert.alert('Backup saved', `Saved to ${fileUri}`);
      }
    } catch {
      Alert.alert('Backup failed', 'Something went wrong while creating your backup.');
    } finally {
      setExporting(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.[0]) {
        setImporting(false);
        return;
      }
      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const restoreResult = await restoreFromBackupPayload(content);
      if (restoreResult.ok) {
        Alert.alert('Restored', 'Your data has been restored. Restart the app to see all changes reflected everywhere.');
      } else {
        Alert.alert('Restore failed', restoreResult.error ?? 'Unknown error.');
      }
    } catch {
      Alert.alert('Restore failed', 'Something went wrong while reading that file.');
    } finally {
      setImporting(false);
    }
  }

  function confirmClearAllData() {
    Alert.alert(
      'Clear all data?',
      'This permanently deletes every saved semester, CGPA record, and history entry across all universities. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: () => {
            // Double confirmation for a fully destructive, app-wide wipe.
            Alert.alert('Are you absolutely sure?', 'This is your last chance to cancel.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete Everything',
                style: 'destructive',
                onPress: async () => {
                  await clearAllAppData();
                  Alert.alert('Done', 'All data has been cleared.');
                },
              },
            ]);
          },
        },
      ]
    );
  }

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + spacing.lg }]}>
      <View style={[styles.titleRow, { paddingHorizontal: spacing.md }]}>
        <BackToHomeButton />
        <Text style={[type.h1, { color: theme.textPrimary }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, width: '100%', maxWidth: layoutSafety.maxContentWidth, alignSelf: 'center' }}>
        <SectionHeader title="Appearance" />
        <View style={[styles.segmentRow, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.md }]}>
          {THEME_OPTIONS.map((opt) => (
            <PressableScale
              key={opt.value}
              onPress={() => setMode(opt.value)}
              haptic="selection"
              scaleTo={0.96}
              style={[
                styles.segment,
                { borderRadius: radius.sm, backgroundColor: mode === opt.value ? theme.accent : 'transparent' },
              ]}
            >
              <Text style={[type.bodyMedium, { color: mode === opt.value ? '#1A1206' : theme.textSecondary }]}>
                {opt.label}
              </Text>
            </PressableScale>
          ))}
        </View>

        <SectionHeader title="Preferences" />
        <SettingsRow
          icon="notifications-outline"
          label="Notifications"
          subtitle="Reminders and app alerts"
          trailing={
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <SettingsRow
          icon="phone-portrait-outline"
          label="Haptic Feedback"
          subtitle="Vibration on taps and actions"
          trailing={
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SectionHeader title="Data" />
        <SettingsRow
          icon="cloud-upload-outline"
          label="Backup Data"
          subtitle="Export everything to a file you can save or share"
          onPress={handleExport}
        />
        {exporting && <Text style={[type.caption, { color: theme.textMuted, marginBottom: 10 }]}>Preparing backup…</Text>}
        <SettingsRow
          icon="cloud-download-outline"
          label="Restore Data"
          subtitle="Import from a previously saved backup file"
          onPress={handleImport}
        />
        {importing && <Text style={[type.caption, { color: theme.textMuted, marginBottom: 10 }]}>Restoring…</Text>}
        <SettingsRow
          icon="trash-outline"
          label="Clear All Data"
          subtitle="Permanently delete everything saved in this app"
          onPress={confirmClearAllData}
          destructive
        />

        <SectionHeader title="About" />
        <View style={[styles.aboutCard, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: radius.md }]}>
          <Text style={[type.h2, { color: theme.textPrimary }]}>GradeTrack Pro</Text>
          <Text style={[type.caption, { color: theme.textMuted, marginTop: 2 }]}>Version {appVersion}</Text>
          <Text style={[type.body, { color: theme.textSecondary, marginTop: spacing.sm, lineHeight: 20 }]}>
            A premium SGPA/CGPA calculator built for Pakistani university students, supporting 10
            official grading systems with accurate, verified calculations.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentRow: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  aboutCard: {
    borderWidth: 1,
    padding: 16,
  },
});
