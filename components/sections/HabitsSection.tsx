// Hábitos panel: progress header, today's list, and a faint "Hoy no toca"
// section. The FAB opens the new-habit bottom sheet (consistent add pattern).

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabits } from '../../src/HabitsContext';
import { appliesOn, todayKey } from '../../src/dates';
import { useTheme } from '../../src/useTheme';
import { spacing, radius } from '../../src/theme';
import { HabitRow } from '../HabitRow';
import { Fab } from '../Fab';
import { HabitModal } from '../HabitModal';

/** Clearance so list content never hides behind the dock / system nav. */
const BOTTOM_CLEARANCE = 120;

export function HabitsSection() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { hydrated, habits, completions, toggleCompletion } = useHabits();
  const today = todayKey();
  const [adding, setAdding] = useState(false);

  const { todays, notToday } = useMemo(() => {
    const t = habits.filter((h) => appliesOn(h, today));
    const n = habits.filter((h) => !appliesOn(h, today));
    return { todays: t, notToday: n };
  }, [habits, today]);

  const doneCount = todays.filter(
    (h) => completions[h.id]?.[today] === true,
  ).length;
  const progress = todays.length === 0 ? 0 : doneCount / todays.length;

  if (!hydrated) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + BOTTOM_CLEARANCE },
        ]}
      >
        {habits.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Sin hábitos todavía
            </Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Toca el botón + para crear tu primer hábito. Un nombre y una hora
              bastan.
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.progressCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.progressLabel, { color: theme.textMuted }]}>
                  Hoy
                </Text>
                <Text style={[styles.progressBig, { color: theme.text }]}>
                  {doneCount} / {todays.length}
                </Text>
              </View>
              <View
                style={[styles.progressTrack, { backgroundColor: theme.cardAlt }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.accent,
                      width: `${Math.round(progress * 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {todays.map((h) => (
              <HabitRow
                key={h.id}
                habit={h}
                completions={completions}
                onToggle={toggleCompletion}
              />
            ))}

            {notToday.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textFaint }]}>
                  Hoy no toca
                </Text>
                {notToday.map((h) => (
                  <HabitRow
                    key={h.id}
                    habit={h}
                    completions={completions}
                    onToggle={toggleCompletion}
                    muted
                  />
                ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>

      <Fab onPress={() => setAdding(true)} />
      <HabitModal visible={adding} onClose={() => setAdding(false)} />
    </View>
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
  },
  empty: {
    marginTop: spacing.xxl * 2,
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  progressLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  progressBig: {
    fontSize: 26,
    fontWeight: '800',
  },
  progressTrack: {
    flex: 1.4,
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
});
