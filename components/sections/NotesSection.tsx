// Notas panel (placeholder until implemented).

import React from 'react';
import { View } from 'react-native';
import { SectionPlaceholder } from '../SectionPlaceholder';
import { useTheme } from '../../src/useTheme';

export function NotesSection() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <SectionPlaceholder icon="create-outline" title="Notas" />
    </View>
  );
}
