// Floating dock: a centered pill acting as the bottom navigation between the app's
// three areas — Hábitos (checkmark), Gastos (cash), Notas (pencil). Shown on those
// three screens; the active one is highlighted.

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/useTheme';
import { spacing, radius } from '../src/theme';

type Item = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
  label: string;
  match: string;
};

const ITEMS: Item[] = [
  { key: 'habits', icon: 'checkmark-circle-outline', href: '/', label: 'Hábitos', match: '/' },
  { key: 'expenses', icon: 'cash-outline', href: '/expenses', label: 'Gastos', match: '/expenses' },
  { key: 'notes', icon: 'create-outline', href: '/notes', label: 'Notas', match: '/notes' },
];

export function FloatingDock() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: insets.bottom + spacing.lg }]}
    >
      <View
        style={[
          styles.dock,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            shadowColor: '#000',
          },
        ]}
      >
        {ITEMS.map((item) => {
          const active = pathname === item.match;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
               onPress={() => router.navigate(item.href)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.btn,
                active && { backgroundColor: theme.cardAlt },
                pressed && { opacity: 0.6 },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={26}
                color={active ? theme.accent : theme.textMuted}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btn: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
