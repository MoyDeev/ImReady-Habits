// App state: habits + completions, persistence, and reminder scheduling.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AppState, Habit, TimeOfDay } from './types';
import { emptyState, loadState, saveState } from './storage';
import { ALL_DAYS, sortTimes } from './dates';
import {
  cancelHabit,
  notificationsAvailable,
  resyncReminders,
  scheduleHabit,
} from './notifications';

export type HabitInput = {
  name: string;
  times: TimeOfDay[];
  days: number[];
  color: string;
  reminderEnabled: boolean;
};

type HabitsContextValue = {
  hydrated: boolean;
  habits: Habit[];
  completions: AppState['completions'];
  notificationsAvailable: boolean;
  getHabit: (id: string) => Habit | undefined;
  addHabit: (input: HabitInput) => Promise<Habit>;
  updateHabit: (id: string, input: HabitInput) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, dayKey: string) => void;
};

const HabitsContext = createContext<HabitsContextValue | undefined>(undefined);

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function normaliseInput(input: HabitInput): {
  times: TimeOfDay[];
  days: number[];
} {
  const times = sortTimes(
    input.times.length > 0 ? input.times : [{ hour: 9, minute: 0 }],
  );
  const days =
    input.days.length > 0 ? [...input.days].sort((a, b) => a - b) : [...ALL_DAYS];
  return { times, days };
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  // A ref mirror so async actions read the freshest habit without doing side
  // effects inside a setState updater.
  const stateRef = useRef<AppState>(state);
  stateRef.current = state;

  // Hydrate once, then resync the OS schedule from what was persisted.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadState();
      if (cancelled) return;
      if (notificationsAvailable && loaded.habits.some((h) => h.reminderEnabled)) {
        try {
          const idMap = await resyncReminders(loaded.habits);
          for (const h of loaded.habits) {
            if (idMap[h.id]) h.notificationIds = idMap[h.id];
          }
        } catch (err) {
          console.warn('resync failed', err);
        }
      }
      if (cancelled) return;
      setState(loaded);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist after hydration. The guard stops the empty initial state from
  // clobbering what is still being read off disk.
  useEffect(() => {
    if (!hydrated) return;
    void saveState(state);
  }, [state, hydrated]);

  const getHabit = useCallback(
    (id: string) => stateRef.current.habits.find((h) => h.id === id),
    [],
  );

  const addHabit = useCallback(async (input: HabitInput) => {
    const { times, days } = normaliseInput(input);
    const habit: Habit = {
      id: makeId(),
      name: input.name.trim(),
      times,
      days,
      color: input.color,
      reminderEnabled: input.reminderEnabled,
      notificationIds: [],
      createdAt: new Date().toISOString(),
    };
    if (habit.reminderEnabled) {
      try {
        habit.notificationIds = await scheduleHabit(habit);
      } catch (err) {
        console.warn('schedule failed', err);
      }
    }
    setState((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
    return habit;
  }, []);

  const updateHabit = useCallback(async (id: string, input: HabitInput) => {
    const existing = stateRef.current.habits.find((h) => h.id === id);
    if (!existing) return;
    const { times, days } = normaliseInput(input);
    // Cancel the old schedule then build a fresh one.
    try {
      await cancelHabit(existing);
    } catch (err) {
      console.warn('cancel failed', err);
    }
    const updated: Habit = {
      ...existing,
      name: input.name.trim(),
      times,
      days,
      color: input.color,
      reminderEnabled: input.reminderEnabled,
      notificationIds: [],
    };
    if (updated.reminderEnabled) {
      try {
        updated.notificationIds = await scheduleHabit(updated);
      } catch (err) {
        console.warn('schedule failed', err);
      }
    }
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? updated : h)),
    }));
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    const existing = stateRef.current.habits.find((h) => h.id === id);
    if (existing) {
      try {
        await cancelHabit(existing);
      } catch (err) {
        console.warn('cancel failed', err);
      }
    }
    setState((prev) => {
      const completions = { ...prev.completions };
      delete completions[id];
      return {
        ...prev,
        habits: prev.habits.filter((h) => h.id !== id),
        completions,
      };
    });
  }, []);

  const toggleCompletion = useCallback((habitId: string, dayKey: string) => {
    setState((prev) => {
      const forHabit = { ...(prev.completions[habitId] ?? {}) };
      if (forHabit[dayKey]) {
        delete forHabit[dayKey];
      } else {
        forHabit[dayKey] = true;
      }
      return {
        ...prev,
        completions: { ...prev.completions, [habitId]: forHabit },
      };
    });
  }, []);

  const value = useMemo<HabitsContextValue>(
    () => ({
      hydrated,
      habits: state.habits,
      completions: state.completions,
      notificationsAvailable,
      getHabit,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleCompletion,
    }),
    [
      hydrated,
      state.habits,
      state.completions,
      getHabit,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleCompletion,
    ],
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}

export function useHabits(): HabitsContextValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider');
  return ctx;
}
