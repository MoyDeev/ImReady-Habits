// Pendientes panel (placeholder until implemented).

import React from 'react';
import { View } from 'react-native';
import { SectionPlaceholder } from '../SectionPlaceholder';
import { useTheme } from '../../src/useTheme';

export function TodosSection() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SectionPlaceholder icon="checkmark-circle-outline" title="Pendientes" />
    </View>
  );
}
