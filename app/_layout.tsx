import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { WatchlistProvider } from '../src/context/WatchlistContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'Ionicons';
          src: url('https://unpkg.com/ionicons@7.4.0/dist/fonts/ionicons.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <WatchlistProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </WatchlistProvider>
  );
}
