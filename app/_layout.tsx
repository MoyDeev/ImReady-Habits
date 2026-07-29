import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as Notifications from 'expo-notifications';
import { HabitsProvider } from '../src/HabitsContext';
import { getTheme } from '../src/theme';

function NotificationTapListener() {
  const router = useRouter();
  useEffect(() => {
    // Open the habit when its reminder is tapped.
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const habitId =
          response.notification.request.content.data?.habitId;
        if (typeof habitId === 'string') {
          router.push(`/habit/${habitId}`);
        }
      },
    );
    // Handle a cold start from a tapped notification.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      const habitId = response?.notification.request.content.data?.habitId;
      if (typeof habitId === 'string') {
        router.push(`/habit/${habitId}`);
      }
    });
    return () => sub.remove();
  }, [router]);
  return null;
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = getTheme(scheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HabitsProvider>
          <NotificationTapListener />
          <StatusBar style={theme.dark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: theme.bg },
              headerTintColor: theme.text,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: theme.bg },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Im Ready' }} />
            <Stack.Screen
              name="habit/new"
              options={{ presentation: 'modal', title: 'Nuevo hábito' }}
            />
            <Stack.Screen name="habit/[id]" options={{ title: '' }} />
            <Stack.Screen
              name="habit/edit/[id]"
              options={{ presentation: 'modal', title: 'Editar hábito' }}
            />
          </Stack>
        </HabitsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
