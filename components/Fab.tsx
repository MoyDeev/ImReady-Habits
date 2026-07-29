// Shared floating action button (bottom-right). Sits above the phone's bottom
// safe area so it never hides behind the system navigation bar.

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/useTheme';
import { spacing } from '../src/theme';

export function Fab({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Agregar"
      style={[
        styles.fab,
        { backgroundColor: theme.accent, bottom: insets.bottom + spacing.lg },
      ]}
    >
      <Text style={styles.fabText}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
});
