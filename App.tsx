import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useInterFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  useFonts as usePlayfairFonts,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { ThemeProvider, useAppTheme } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ensureSchemaInitialized } from './src/storage';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { theme } = useAppTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </View>
  );
}

export default function App() {
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [playfairLoaded] = usePlayfairFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  const [ready, setReady] = useState(false);

  const onLayout = useCallback(async () => {
    if ((interLoaded || playfairLoaded) && !ready) {
      setReady(true);
      await ensureSchemaInitialized();
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [interLoaded, playfairLoaded, ready]);

  if (!interLoaded || !playfairLoaded) return null;

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <ThemeProvider>
        <NavigationContainer>
          <Shell />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
