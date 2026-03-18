import '../global.css';
import '../src/i18n'; // initialize i18n before any component renders
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { setupNotifications, useHabitStore } from '../src/store/habitStore';
import i18n from '../src/i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HEADER = {
  headerStyle: { backgroundColor: '#09090b' },
  headerTintColor: '#ffffff',
  headerShadowVisible: false,
  contentStyle: { backgroundColor: '#09090b' },
} as const;

export default function RootLayout() {
  const language = useHabitStore((s) => s.language);

  useEffect(() => {
    setupNotifications();
    Notifications.requestPermissionsAsync();
  }, []);

  // Sync persisted language preference once the store hydrates
  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={HEADER}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="habit/new"
          options={{ title: 'New Habit', presentation: 'modal' }}
        />
        <Stack.Screen name="habit/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}
