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

// --- Finances (Gastos section) ---------------------------------------------

export type IncomeKind = 'fijo' | 'extra';

/** An income entry, tagged as a fixed salary or something extra. */
export type Income = {
  id: string;
  name: string;
  amount: number;
  kind: IncomeKind;
  /** Optional custom label for an `extra` income (e.g. "Freelance", "Venta").
   *  When empty, extras fall back to the generic "Extra" tag. */
  label?: string;
  createdAt: string;
};

/** A recorded expense, drawn from a given income (`sourceId`). */
export type Expense = {
  id: string;
  name: string;
  amount: number;
  date?: string; // optional "YYYY-MM-DD"
  sourceId: string; // Income.id it is drawn from
  createdAt: string;
};

/** A planned payment: which income it will come from and when it's due. */
export type PendingExpense = {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // "YYYY-MM-DD" — required
  sourceId: string; // Income.id it will be drawn from
  createdAt: string;
};

export type Finances = {
  incomes: Income[];
  expenses: Expense[];
  pending: PendingExpense[];
};

export const emptyFinances: Finances = {
  incomes: [],
  expenses: [],
  pending: [],
};

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
