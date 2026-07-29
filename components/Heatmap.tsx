// GitHub-style calendar for a single habit: 26 weeks, Monday on top, horizontal
// scroll. Non-scheduled days render faint but stay tappable; future days blank.

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import type { Habit, CompletionMap } from '../src/types';
import { buildHeatmap, todayKey, WEEKDAY_LABELS } from '../src/dates';
import { useTheme } from '../src/useTheme';
import { spacing, radius } from '../src/theme';

type Props = {
  habit: Habit;
  completions: CompletionMap;
  onToggleDay: (habitId: string, dayKey: string) => void;
};

const CELL = 15;
const GAP = 3;
const ROW_LABELS = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun for the left gutter

export function Heatmap({ habit, completions, onToggleDay }: Props) {
  const theme = useTheme();
  const today = todayKey();
  const grid = buildHeatmap(habit, completions, today, 26);

  return (
    <View style={styles.wrap}>
      <View style={styles.gutterRow}>
        {/* Left day labels */}
        <View style={styles.gutter}>
          {ROW_LABELS.map((d, i) => (
            <Text
              key={i}
              style={[
                styles.gutterLabel,
                { color: theme.textFaint, height: CELL, lineHeight: CELL },
              ]}
            >
              {i % 2 === 0 ? WEEKDAY_LABELS[d] : ''}
            </Text>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        >
          {grid.map((week, col) => (
            <View key={col} style={styles.week}>
              {week.map((cell, row) => {
                if (cell === null) {
                  return <View key={row} style={styles.emptyCell} />;
                }
                const isToday = cell.key === today;
                let bg = habit.color;
                let opacity = 1;
                if (!cell.done) {
                  bg = theme.heat[0];
                  opacity = cell.scheduled ? 1 : 0.4;
                }
                return (
                  <Pressable
                    key={row}
                    onPress={() => onToggleDay(habit.id, cell.key)}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: bg,
                        opacity,
                        borderColor: isToday ? theme.text : 'transparent',
                        borderWidth: isToday ? 1.5 : 0,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: theme.textFaint }]}>
          Menos
        </Text>
        <View style={[styles.legendCell, { backgroundColor: theme.heat[0] }]} />
        <View
          style={[
            styles.legendCell,
            { backgroundColor: habit.color, opacity: 0.4 },
          ]}
        />
        <View
          style={[
            styles.legendCell,
            { backgroundColor: habit.color, opacity: 0.7 },
          ]}
        />
        <View style={[styles.legendCell, { backgroundColor: habit.color }]} />
        <Text style={[styles.legendText, { color: theme.textFaint }]}>Más</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  gutterRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  gutter: {
    gap: GAP,
    marginRight: 2,
  },
  gutterLabel: {
    fontSize: 9,
    width: 12,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    gap: GAP,
  },
  week: {
    gap: GAP,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 3,
  },
  emptyCell: {
    width: CELL,
    height: CELL,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  legendText: {
    fontSize: 10,
  },
  legendCell: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },
});
