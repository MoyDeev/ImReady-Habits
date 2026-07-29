// Pure domain logic: day keys, streaks, completion, heatmap, trigger specs and
// the v1 -> v2 migration transform. Everything here is free of native modules so
// it can be compiled and exercised under plain Node in several timezones.
//
// All date math is done per *calendar day* through Date.UTC — never by
// subtracting millisecond timestamps — because DST gives 23h and 25h days and a
// millisecond subtraction would count those as fractional days and corrupt
// streaks.

import type {
  Habit,
  CompletionMap,
  AppState,
  AppStateV1,
  TimeOfDay,
} from './types';

export const CURRENT_VERSION = 2;

/** All weekdays, Date.getDay() convention: 0 = Sunday .. 6 = Saturday. */
export const ALL_DAYS: number[] = [0, 1, 2, 3, 4, 5, 6];

/** Weekday order used everywhere in the UI: Monday first, to match the
 *  Monday-top heatmap. */
export const WEEK_ORDER_MON_FIRST: number[] = [1, 2, 3, 4, 5, 6, 0];

export const WEEKDAY_LABELS: Record<number, string> = {
  0: 'D',
  1: 'L',
  2: 'M',
  3: 'M',
  4: 'J',
  5: 'V',
  6: 'S',
};

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Local wall-clock day key "YYYY-MM-DD". */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayKey(now: Date = new Date()): string {
  return dayKey(now);
}

export function keyToParts(key: string): { y: number; m: number; d: number } {
  const [y, m, d] = key.split('-').map((s) => parseInt(s, 10));
  return { y, m, d };
}

/** UTC-anchored midnight for a day key, used purely for calendar arithmetic. */
function keyToUTC(key: string): number {
  const { y, m, d } = keyToParts(key);
  return Date.UTC(y, m - 1, d);
}

/** Whole calendar days from `fromKey` to `toKey` (positive if `toKey` is later).
 *  DST-safe because both ends are UTC midnights of date-only values. */
export function diffInDays(fromKey: string, toKey: string): number {
  return Math.round((keyToUTC(toKey) - keyToUTC(fromKey)) / 86_400_000);
}

/** Shift a day key by `delta` calendar days. */
export function addDays(key: string, delta: number): string {
  const t = keyToUTC(key) + delta * 86_400_000;
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(
    d.getUTCDate(),
  )}`;
}

/** Weekday of a day key in Date.getDay() convention (0 = Sunday). */
export function weekdayOfKey(key: string): number {
  return new Date(keyToUTC(key)).getUTCDay();
}

export function isEveryDay(days: number[]): boolean {
  return ALL_DAYS.every((d) => days.includes(d));
}

export function isScheduledDay(days: number[], key: string): boolean {
  return days.includes(weekdayOfKey(key));
}

/** Does the habit apply on the given day (today by default)? */
export function appliesOn(habit: Habit, key: string = todayKey()): boolean {
  return isScheduledDay(habit.days, key);
}

const MAX_LOOKBACK = 366 * 12;

/**
 * Current streak, counted only over *scheduled* days walked backwards from
 * today. Non-scheduled days are skipped (they neither add nor break). A
 * scheduled day that is still pending today does not break the streak — it is
 * simply not counted; only a past scheduled day left unmarked breaks it.
 */
export function currentStreak(
  habit: Habit,
  completions: CompletionMap,
  todayK: string = todayKey(),
): number {
  const done = completions[habit.id] ?? {};
  const createdK = dayKey(new Date(habit.createdAt));
  let streak = 0;
  let cursor = todayK;
  for (let i = 0; i < MAX_LOOKBACK; i++) {
    if (diffInDays(createdK, cursor) < 0) break; // before the habit existed
    if (isScheduledDay(habit.days, cursor)) {
      if (done[cursor]) {
        streak++;
      } else if (cursor !== todayK) {
        break; // a finished scheduled day left unmarked ends the streak
      }
      // else: today still pending — skip without breaking
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/**
 * Best streak: the longest run of consecutive *scheduled* days completed,
 * scanned from the creation day up to today. Off-schedule completions do not
 * extend it.
 */
export function bestStreak(
  habit: Habit,
  completions: CompletionMap,
  todayK: string = todayKey(),
): number {
  const done = completions[habit.id] ?? {};
  const createdK = dayKey(new Date(habit.createdAt));
  if (diffInDays(createdK, todayK) < 0) return 0;
  let best = 0;
  let run = 0;
  let cursor = createdK;
  for (let i = 0; i <= MAX_LOOKBACK; i++) {
    if (isScheduledDay(habit.days, cursor)) {
      if (done[cursor]) {
        run++;
        if (run > best) best = run;
      } else {
        run = 0;
      }
    }
    if (cursor === todayK) break;
    cursor = addDays(cursor, 1);
  }
  return best;
}

export type CompletionStats = {
  scheduled: number;
  done: number;
  /** done / scheduled, in [0, 1]; 0 when nothing was scheduled in the window. */
  rate: number;
};

/**
 * Completion over the last `windowDays` days: done divided by the number of
 * *scheduled* days in the window, clamped to the habit's creation day so a brand
 * new habit is not unfairly divided by the full window. Off-schedule marks count
 * in neither numerator nor denominator.
 */
export function completionStats(
  habit: Habit,
  completions: CompletionMap,
  windowDays = 30,
  todayK: string = todayKey(),
): CompletionStats {
  const done = completions[habit.id] ?? {};
  const createdK = dayKey(new Date(habit.createdAt));
  const windowStart = addDays(todayK, -(windowDays - 1));
  const start =
    diffInDays(createdK, windowStart) >= 0 ? windowStart : createdK;
  let scheduled = 0;
  let completed = 0;
  let cursor = start;
  if (diffInDays(cursor, todayK) < 0) return { scheduled: 0, done: 0, rate: 0 };
  for (let i = 0; i <= MAX_LOOKBACK; i++) {
    if (isScheduledDay(habit.days, cursor)) {
      scheduled++;
      if (done[cursor]) completed++;
    }
    if (cursor === todayK) break;
    cursor = addDays(cursor, 1);
  }
  return {
    scheduled,
    done: completed,
    rate: scheduled === 0 ? 0 : completed / scheduled,
  };
}

export type HeatCell = {
  key: string;
  done: boolean;
  scheduled: boolean;
} | null; // null = a future day, hidden

/**
 * A GitHub-style grid: `weeks` columns of 7 rows, Monday on top. The last column
 * holds the current week so today appears exactly once; future days are null so
 * they render blank.
 */
export function buildHeatmap(
  habit: Habit,
  completions: CompletionMap,
  todayK: string = todayKey(),
  weeks = 26,
): HeatCell[][] {
  const done = completions[habit.id] ?? {};
  // Monday of the current week (days since Monday, Mon-first).
  const daysSinceMonday = (weekdayOfKey(todayK) + 6) % 7;
  const mondayOfToday = addDays(todayK, -daysSinceMonday);
  const firstMonday = addDays(mondayOfToday, -(weeks - 1) * 7);
  const grid: HeatCell[][] = [];
  for (let col = 0; col < weeks; col++) {
    const monday = addDays(firstMonday, col * 7);
    const column: HeatCell[] = [];
    for (let row = 0; row < 7; row++) {
      const key = addDays(monday, row);
      if (diffInDays(key, todayK) < 0) {
        column.push(null); // future
      } else {
        column.push({
          key,
          done: done[key] === true,
          scheduled: isScheduledDay(habit.days, key),
        });
      }
    }
    grid.push(column);
  }
  return grid;
}

// --- Notification scheduling, pure form -------------------------------------
// The pure decision of *what* to schedule lives here so it can be tested without
// the native module. notifications.ts maps these specs onto expo trigger inputs
// (adding the enum type and channelId).

export type TriggerSpec =
  | { kind: 'daily'; hour: number; minute: number }
  | { kind: 'weekly'; weekday: number; hour: number; minute: number };

/**
 * If the habit runs every day -> one DAILY spec per time. Otherwise one WEEKLY
 * spec per (day x time). Weekday uses the expo convention weekday = day + 1
 * (1 = Sunday), the single place that conversion happens.
 */
export function buildTriggerSpecs(habit: Habit): TriggerSpec[] {
  if (isEveryDay(habit.days)) {
    return habit.times.map((t) => ({
      kind: 'daily' as const,
      hour: t.hour,
      minute: t.minute,
    }));
  }
  const specs: TriggerSpec[] = [];
  for (const day of [...habit.days].sort((a, b) => a - b)) {
    for (const t of habit.times) {
      specs.push({
        kind: 'weekly',
        weekday: day + 1,
        hour: t.hour,
        minute: t.minute,
      });
    }
  }
  return specs;
}

// --- Time helpers -----------------------------------------------------------

export function sortTimes(times: TimeOfDay[]): TimeOfDay[] {
  return [...times].sort((a, b) =>
    a.hour !== b.hour ? a.hour - b.hour : a.minute - b.minute,
  );
}

export function formatTime(t: TimeOfDay): string {
  return `${pad2(t.hour)}:${pad2(t.minute)}`;
}

/** "YYYY-MM-DD" -> "DD/MM/YYYY" for display. */
export function formatDateKey(key: string): string {
  const { y, m, d } = keyToParts(key);
  return `${pad2(d)}/${pad2(m)}/${y}`;
}

// --- Migration --------------------------------------------------------------
// Kept here (rather than storage.ts) so it stays a pure, node-testable
// transform; storage.ts imports it.

function isV2(raw: unknown): raw is AppState {
  return (
    typeof raw === 'object' &&
    raw !== null &&
    (raw as AppState).version === CURRENT_VERSION
  );
}

/** Normalise any persisted blob into the current AppState, migrating v1 -> v2. */
export function migrateState(raw: unknown): AppState {
  if (raw == null || typeof raw !== 'object') {
    return { version: CURRENT_VERSION, habits: [], completions: {} };
  }
  if (isV2(raw)) {
    const s = raw as AppState;
    return {
      version: CURRENT_VERSION,
      habits: Array.isArray(s.habits) ? s.habits : [],
      completions: s.completions ?? {},
    };
  }
  // Treat everything else as v1.
  const v1 = raw as AppStateV1;
  const habits: Habit[] = (v1.habits ?? []).map((h) => ({
    id: h.id,
    name: h.name,
    times: [{ hour: h.hour, minute: h.minute }],
    days: [...ALL_DAYS],
    color: h.color,
    reminderEnabled: h.reminderEnabled,
    notificationIds: h.notificationId ? [h.notificationId] : [],
    createdAt: h.createdAt,
  }));
  return {
    version: CURRENT_VERSION,
    habits,
    completions: v1.completions ?? {},
  };
}
