// A compact strip of the last 7 days (Mon-first) showing done / scheduled state.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Habit, CompletionMap } from '../src/types';
import {
  addDays,
  todayKey,
  weekdayOfKey,
  isScheduledDay,
  WEEKDAY_LABELS,
} from '../src/dates';
import { useTheme } from '../src/useTheme';
import { spacing } from '../src/theme';

type Props = {
  habit: Habit;
  completions: CompletionMap;
};

export function MiniWeek({ habit, completions }: Props) {
  const theme = useTheme();
  const today = todayKey();
  // Monday of the current week.
  const daysSinceMonday = (weekdayOfKey(today) + 6) % 7;
  const monday = addDays(today, -daysSinceMonday);
  const done = completions[habit.id] ?? {};

  const cells = [] as React.ReactNode[];
  for (let i = 0; i < 7; i++) {
    const key = addDays(monday, i);
    const isFuture = key > today;
    const scheduled = isScheduledDay(habit.days, key);
    const isDone = done[key] === true;
    const isToday = key === today;

    let bg = 'transparent';
    let borderColor = theme.border;
    if (isDone) {
      bg = habit.color;
      borderColor = habit.color;
    } else if (!scheduled) {
      borderColor = theme.border;
    }

    cells.push(
      <View key={key} style={styles.col}>
        <Text
          style={[
            styles.label,
            { color: isToday ? theme.text : theme.textFaint },
          ]}
        >
          {WEEKDAY_LABELS[weekdayOfKey(key)]}
        </Text>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: bg,
              borderColor,
              opacity: isFuture ? 0.35 : scheduled || isDone ? 1 : 0.4,
            },
          ]}
        />
      </View>,
    );
  }

  return <View style={styles.row}>{cells}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  col: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
});
