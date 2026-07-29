// Host screen: hosts the four sections in a horizontal swipe pager, with the
// FloatingDock rendered once on top. The topbar logo comes from the Stack.

import React from 'react';
import { View } from 'react-native';
import { SectionsProvider } from '../src/SectionsContext';
import { useTheme } from '../src/useTheme';
import { SectionPager } from '../components/SectionPager';
import { FloatingDock } from '../components/FloatingDock';
import { HabitsSection } from '../components/sections/HabitsSection';
import { ExpensesSection } from '../components/sections/ExpensesSection';
import { NotesSection } from '../components/sections/NotesSection';
import { TodosSection } from '../components/sections/TodosSection';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <SectionsProvider count={4}>
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <SectionPager>
          <HabitsSection />
          <ExpensesSection />
          <NotesSection />
          <TodosSection />
        </SectionPager>
        <FloatingDock />
      </View>
    </SectionsProvider>
  );
}
