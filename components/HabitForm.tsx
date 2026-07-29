// Shared create/edit form. The default view is deliberately identical to the
// simple case (Name · Time · Color · reminder switch); the extra features
// (multiple times, specific days) are revealed progressively.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { TimeOfDay } from '../src/types';
import type { HabitInput } from '../src/HabitsContext';
import {
  ALL_DAYS,
  isEveryDay,
  formatTime,
  sortTimes,
  WEEK_ORDER_MON_FIRST,
  WEEKDAY_LABELS,
} from '../src/dates';
import { useTheme } from '../src/useTheme';
import { spacing, radius, HABIT_COLORS } from '../src/theme';

const MAX_TIMES = 5;

type Props = {
  initial?: HabitInput;
  submitLabel: string;
  notificationsAvailable: boolean;
  onSubmit: (input: HabitInput) => void;
};

function toDate(t: TimeOfDay): Date {
  const d = new Date();
  d.setHours(t.hour, t.minute, 0, 0);
  return d;
}

export function HabitForm({
  initial,
  submitLabel,
  notificationsAvailable,
  onSubmit,
}: Props) {
  const theme = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [times, setTimes] = useState<TimeOfDay[]>(
    initial?.times ?? [{ hour: 9, minute: 0 }],
  );
  const [days, setDays] = useState<number[]>(initial?.days ?? [...ALL_DAYS]);
  const [color, setColor] = useState(initial?.color ?? HABIT_COLORS[0]);
  const [reminderEnabled, setReminderEnabled] = useState(
    initial?.reminderEnabled ?? notificationsAvailable,
  );
  const [daysExpanded, setDaysExpanded] = useState(
    initial ? !isEveryDay(initial.days) : false,
  );
  // Which time index the picker is editing, or 'new', or null (closed).
  const [pickerFor, setPickerFor] = useState<number | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const everyDay = isEveryDay(days);

  function onPickTime(event: DateTimePickerEvent, date?: Date) {
    const target = pickerFor;
    setPickerFor(null);
    if (event.type !== 'set' || !date) return;
    const picked: TimeOfDay = {
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
    setTimes((prev) => {
      let next: TimeOfDay[];
      if (target === 'new') {
        if (prev.length >= MAX_TIMES) return prev;
        next = [...prev, picked];
      } else if (typeof target === 'number') {
        next = prev.map((t, i) => (i === target ? picked : t));
      } else {
        next = prev;
      }
      // De-duplicate identical times, keep sorted.
      const seen = new Set<string>();
      return sortTimes(next).filter((t) => {
        const k = `${t.hour}:${t.minute}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    });
  }

  function removeTime(index: number) {
    setTimes((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  function toggleDay(day: number) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function handleSubmit() {
    if (!name.trim()) {
      setError('Ponle un nombre al hábito.');
      return;
    }
    if (times.length === 0) {
      setError('Añade al menos una hora.');
      return;
    }
    if (days.length === 0) {
      setError('Elige al menos un día.');
      return;
    }
    setError(null);
    onSubmit({
      name: name.trim(),
      times: sortTimes(times),
      days: [...days].sort((a, b) => a - b),
      color,
      reminderEnabled: reminderEnabled && notificationsAvailable,
    });
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Name */}
      <Text style={[styles.label, { color: theme.textMuted }]}>Nombre</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ej. Beber agua"
        placeholderTextColor={theme.textFaint}
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />

      {/* Times */}
      <Text style={[styles.label, { color: theme.textMuted }]}>Hora</Text>
      <View style={{ gap: spacing.sm }}>
        {sortTimes(times).map((t, i) => (
          <View key={`${t.hour}:${t.minute}`} style={styles.timeRow}>
            <Pressable
              onPress={() => setPickerFor(i)}
              style={[
                styles.timeChip,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.timeText, { color: theme.text }]}>
                {formatTime(t)}
              </Text>
            </Pressable>
            {times.length > 1 ? (
              <Pressable
                hitSlop={10}
                onPress={() => removeTime(i)}
                style={styles.removeBtn}
              >
                <Text style={[styles.removeText, { color: theme.danger }]}>
                  Quitar
                </Text>
              </Pressable>
            ) : null}
          </View>
        ))}
        {times.length < MAX_TIMES ? (
          <Pressable onPress={() => setPickerFor('new')} hitSlop={6}>
            <Text style={[styles.addLink, { color: theme.accent }]}>
              + Añadir otra hora
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Days */}
      <Text style={[styles.label, { color: theme.textMuted }]}>Días</Text>
      {!daysExpanded ? (
        <Pressable
          onPress={() => setDaysExpanded(true)}
          style={[
            styles.summaryRow,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.summaryText, { color: theme.text }]}>
            {everyDay
              ? 'Todos los días'
              : WEEK_ORDER_MON_FIRST.filter((d) => days.includes(d))
                  .map((d) => WEEKDAY_LABELS[d])
                  .join(' ')}
          </Text>
          <Text style={[styles.changeText, { color: theme.accent }]}>
            Cambiar
          </Text>
        </Pressable>
      ) : (
        <View style={styles.daysWrap}>
          {WEEK_ORDER_MON_FIRST.map((d) => {
            const on = days.includes(d);
            return (
              <Pressable
                key={d}
                onPress={() => toggleDay(d)}
                style={[
                  styles.dayToggle,
                  {
                    backgroundColor: on ? theme.accent : theme.card,
                    borderColor: on ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayToggleText,
                    { color: on ? theme.accentText : theme.textMuted },
                  ]}
                >
                  {WEEKDAY_LABELS[d]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Color */}
      <Text style={[styles.label, { color: theme.textMuted }]}>Color</Text>
      <View style={styles.colorsWrap}>
        {HABIT_COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.swatch,
              {
                backgroundColor: c,
                borderColor: color === c ? theme.text : 'transparent',
              },
            ]}
          />
        ))}
      </View>

      {/* Reminder */}
      <View
        style={[
          styles.reminderRow,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.reminderTitle, { color: theme.text }]}>
            Recordatorio diario
          </Text>
          {!notificationsAvailable ? (
            <Text style={[styles.reminderHint, { color: theme.textFaint }]}>
              Expo Go no admite avisos en Android. Usa un build de desarrollo o
              el APK.
            </Text>
          ) : null}
        </View>
        <Switch
          value={reminderEnabled && notificationsAvailable}
          disabled={!notificationsAvailable}
          onValueChange={setReminderEnabled}
          trackColor={{ true: theme.accent, false: theme.border }}
        />
      </View>

      {error ? (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        style={[styles.submit, { backgroundColor: theme.accent }]}
      >
        <Text style={[styles.submitText, { color: theme.accentText }]}>
          {submitLabel}
        </Text>
      </Pressable>

      {pickerFor !== null ? (
        <DateTimePicker
          mode="time"
          value={
            typeof pickerFor === 'number'
              ? toDate(sortTimes(times)[pickerFor])
              : toDate({ hour: 9, minute: 0 })
          }
          onChange={onPickTime}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timeChip: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  removeBtn: {
    paddingVertical: spacing.sm,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addLink: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  daysWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  dayToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToggleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  colorsWrap: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  reminderHint: {
    fontSize: 12,
    marginTop: 2,
  },
  error: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  submit: {
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '800',
  },
});
