// Habit detail: streaks, its own heatmap, and settings.

import React, { useLayoutEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
  useNavigation,
  Stack,
} from 'expo-router';
import { useHabits } from '../../src/HabitsContext';
import {
  currentStreak,
  bestStreak,
  completionStats,
  isEveryDay,
  formatTime,
  WEEK_ORDER_MON_FIRST,
  WEEKDAY_LABELS,
} from '../../src/dates';
import { useTheme } from '../../src/useTheme';
import { spacing, radius } from '../../src/theme';
import { Heatmap } from '../../components/Heatmap';

function Stat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

export default function HabitDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, completions, toggleCompletion } = useHabits();
  const habit = getHabit(id);

  useLayoutEffect(() => {
    navigation.setOptions({ title: habit?.name ?? '' });
  }, [navigation, habit?.name]);

  if (!habit) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.textMuted }}>Hábito no encontrado.</Text>
      </View>
    );
  }

  const current = currentStreak(habit, completions);
  const best = bestStreak(habit, completions);
  const stats = completionStats(habit, completions, 30);
  const pct = Math.round(stats.rate * 100);

  const daysText = isEveryDay(habit.days)
    ? 'Todos los días'
    : WEEK_ORDER_MON_FIRST.filter((d) => habit.days.includes(d))
        .map((d) => WEEKDAY_LABELS[d])
        .join(' · ');

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push(`/habit/edit/${habit.id}`)}
              hitSlop={10}
            >
              <Text style={{ color: theme.accent, fontWeight: '700' }}>
                Editar
              </Text>
            </Pressable>
          ),
        }}
      />

      {/* Times + days summary */}
      <View
        style={[
          styles.summary,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={[styles.colorDot, { backgroundColor: habit.color }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.summaryTimes, { color: theme.text }]}>
            {habit.times.map(formatTime).join('  ·  ')}
          </Text>
          <Text style={[styles.summaryDays, { color: theme.textMuted }]}>
            {daysText}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat value={`${current}`} label="Racha actual" color={habit.color} />
        <Stat value={`${best}`} label="Mejor racha" color={theme.text} />
        <Stat value={`${pct}%`} label="Últ. 30 días" color={theme.text} />
      </View>

      {/* Heatmap */}
      <Text style={[styles.heatTitle, { color: theme.textMuted }]}>
        Calendario
      </Text>
      <View
        style={[
          styles.heatCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Heatmap
          habit={habit}
          completions={completions}
          onToggleDay={toggleCompletion}
        />
      </View>
      <Text style={[styles.hint, { color: theme.textFaint }]}>
        Toca un día para marcarlo o desmarcarlo. Los días atenuados no estaban
        programados.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  summaryTimes: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  summaryDays: {
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  heatTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
  },
  heatCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
  },
});
