import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Image } from 'react-native';
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
              animation: 'slide_from_right',
              headerShadowVisible: false,
              headerBackVisible: false,
              headerStyle: { backgroundColor: theme.bg },
              headerTintColor: theme.text,
              contentStyle: { backgroundColor: theme.bg },
              headerTitle: () => (
                <Image
                  source={require('../assets/ImReady__logo_OF.png')}
                  style={{ width: 28, height: 28 }}
                  resizeMode="contain"
                />
              ),
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="habit/[id]" options={{ headerTitle: '' }} />
            <Stack.Screen
              name="habit/edit/[id]"
              options={{
                presentation: 'modal',
                title: 'Editar hábito',
                headerTitle: 'Editar hábito',
              }}
            />
          </Stack>
        </HabitsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
