// A habit list row: check circle + name + times/days summary + mini week strip.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Habit, CompletionMap } from '../src/types';
import {
  todayKey,
  formatTime,
  isEveryDay,
  WEEK_ORDER_MON_FIRST,
  WEEKDAY_LABELS,
  currentStreak,
} from '../src/dates';
import { useTheme } from '../src/useTheme';
import { spacing, radius } from '../src/theme';
import { MiniWeek } from './MiniWeek';

type Props = {
  habit: Habit;
  completions: CompletionMap;
  onToggle: (habitId: string, dayKey: string) => void;
  /** Dimmed presentation for habits that don't apply today. */
  muted?: boolean;
};

function summarize(habit: Habit): string {
  const first = formatTime(habit.times[0]);
  const extra = habit.times.length > 1 ? ` +${habit.times.length - 1}` : '';
  if (isEveryDay(habit.days)) return `${first}${extra}`;
  const days = WEEK_ORDER_MON_FIRST.filter((d) => habit.days.includes(d))
    .map((d) => WEEKDAY_LABELS[d])
    .join(' ');
  return `${first}${extra} · ${days}`;
}

export function HabitRow({ habit, completions, onToggle, muted }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const today = todayKey();
  const done = completions[habit.id]?.[today] === true;
  const streak = currentStreak(habit, completions);

  return (
    <Pressable
      onPress={() => router.push(`/habit/${habit.id}`)}
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        muted && { opacity: 0.55 },
      ]}
    >
      <View style={styles.top}>
        <Pressable
          hitSlop={10}
          onPress={() => onToggle(habit.id, today)}
          style={[
            styles.check,
            {
              borderColor: habit.color,
              backgroundColor: done ? habit.color : 'transparent',
            },
          ]}
        >
          {done ? <Text style={styles.checkMark}>✓</Text> : null}
        </Pressable>

        <View style={styles.info}>
          <Text
            style={[styles.name, { color: theme.text }]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>
          <Text style={[styles.sub, { color: theme.textMuted }]}>
            {summarize(habit)}
          </Text>
        </View>

        {streak > 0 ? (
          <View style={styles.streak}>
            <Text style={[styles.streakNum, { color: habit.color }]}>
              {streak}
            </Text>
            <Text style={[styles.streakLabel, { color: theme.textFaint }]}>
              racha
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.week}>
        <MiniWeek habit={habit} completions={completions} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  check: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
  sub: {
    fontSize: 13,
  },
  streak: {
    alignItems: 'center',
    minWidth: 42,
  },
  streakNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  week: {
    alignSelf: 'flex-start',
  },
});
