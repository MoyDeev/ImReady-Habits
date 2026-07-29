// Simple centered placeholder for the not-yet-built sections: big icon, title,
// and a faint "coming soon" line.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/useTheme';
import { spacing } from '../src/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
};

export function SectionPlaceholder({
  icon,
  title,
  subtitle = 'Próximamente',
}: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.card }]}>
        <Ionicons name={icon} size={44} color={theme.accent} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.textFaint }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
});
