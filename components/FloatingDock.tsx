// Floating dock: a centered pill acting as the bottom navigation between the
// app's sections. Drives the section pager by index (animated) and highlights the
// active one. Rendered once by the host, above the pager.

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/useTheme';
import { spacing, radius } from '../src/theme';
import { useSections } from '../src/SectionsContext';

type Item = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  index: number;
};

const ITEMS: Item[] = [
  { key: 'habits', icon: 'checkmark-circle-outline', label: 'Hábitos', index: 0 },
  { key: 'expenses', icon: 'cash-outline', label: 'Gastos', index: 1 },
  { key: 'notes', icon: 'create-outline', label: 'Notas', index: 2 },
  { key: 'todos', icon: 'list-outline', label: 'Pendientes', index: 3 },
];

export function FloatingDock() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { index, goTo } = useSections();

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
          const active = index === item.index;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
              onPress={() => goTo(item.index)}
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
    gap: spacing.xs,
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
