// Domain types for Im Ready — Habits.

/** A local wall-clock time. Stored as hour/minute (never a timestamp) so the
 *  reminder does not drift when travelling or across daylight-saving changes. */
export type TimeOfDay = { hour: number; minute: number };

export type Habit = {
  id: string;
  name: string;
  /** One or more reminder times, kept sorted. Defaults to a single time. */
  times: TimeOfDay[];
  /** Scheduled weekdays, using Date.getDay() convention: 0 = Sunday .. 6 = Saturday.
   *  Defaults to all seven days. */
  days: number[];
  color: string;
  reminderEnabled: boolean;
  /** One id per scheduled notification, so each can be cancelled individually. */
  notificationIds: string[];
  createdAt: string;
};

/** habitId -> { "YYYY-MM-DD": true }. Absence of a key means "not done". */
export type CompletionMap = Record<string, Record<string, true>>;

/** Full persisted app state. */
export type AppState = {
  version: number;
  habits: Habit[];
  completions: CompletionMap;
};

// --- Legacy shapes, kept only for migration from v1 -> v2. ---

export type HabitV1 = {
  id: string;
  name: string;
  hour: number;
  minute: number;
  color: string;
  reminderEnabled: boolean;
  notificationId?: string | null;
  createdAt: string;
};

export type AppStateV1 = {
  version?: number;
  habits: HabitV1[];
  completions: CompletionMap;
};
