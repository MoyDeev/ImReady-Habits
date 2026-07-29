import React from 'react';
import { View } from 'react-native';
import { SectionPlaceholder } from '../components/SectionPlaceholder';
import { FloatingDock } from '../components/FloatingDock';
import { SwipeNavigator } from '../components/SwipeNavigator';
import { useTheme } from '../src/useTheme';

export default function NotesScreen() {
  const theme = useTheme();
  return (
    <SwipeNavigator prevRoute="/expenses">
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <SectionPlaceholder icon="create-outline" title="Notas" />
        <FloatingDock />
      </View>
    </SwipeNavigator>
  );
}
