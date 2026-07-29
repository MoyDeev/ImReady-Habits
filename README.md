# Im Ready — Habits

> Part of the **Sistemas-Kalli** suite of applications.

A minimal, 100% local daily-habits app. No backend, no accounts, no ads, no
analytics. Create a habit → give it a name and a time → get a daily reminder at
that time → check it off on a GitHub-style calendar. Each habit has its own
independent calendar.

Two features are **optional** and never get in the way of the quick "name + one
time" flow:

- **Multiple times a day** — a discreet "+ Añadir otra hora" link under the time
  (up to 5 times per habit).
- **Specific days** — a "Todos los días · Cambiar" row that expands into seven
  `L M M J V S D` toggles.

## Stack

Expo SDK 57 · expo-router (file-based) · React Native 0.86 · TypeScript (strict) ·
AsyncStorage · expo-notifications. No UI library — just `View`/`Pressable` and a
small theme, light/dark aware.

## Project layout

```
app/                       screens (expo-router)
  _layout.tsx              Stack + HabitsProvider + notification-tap listener
  index.tsx                today's list: progress, quick check, 7-day strip, FAB
  habit/new.tsx            create (modal)
  habit/[id].tsx           detail: streaks, heatmap, settings
  habit/edit/[id].tsx      edit / delete (modal)
components/
  HabitRow.tsx             row with check circle + MiniWeek
  MiniWeek.tsx             compact 7-day strip
  HabitForm.tsx            shared create/edit form
  Heatmap.tsx              GitHub-style calendar, horizontal scroll
src/
  HabitsContext.tsx        state + persistence + reminder scheduling
  storage.ts               AsyncStorage (key `imready-habits/state/v1`) + migration
  notifications.ts         permissions, Android channel, schedule/cancel/resync
  dates.ts                 pure logic: day keys, streaks, heatmap, trigger specs, migration
  theme.ts / useTheme.ts   colors, spacing, light/dark
  types.ts                 domain types
```

## Run

```bash
npm install
npx expo start            # Metro; open in a dev build or Expo Go
```

> **Notifications on Android:** Expo Go dropped local notifications in SDK 53, so
> the reminder switch is disabled there and the app says so. To test reminders,
> use a development build (`npx expo run:android`) or the preview APK below.

## Build an APK

```bash
eas build -p android --profile preview
```

The `preview` profile in `eas.json` produces an installable APK. Reminders work
in that build (not in Expo Go on Android).

## Notes on correctness

All schedule/streak math lives in `src/dates.ts` and is free of native modules,
so it can be compiled and exercised under plain Node. Highlights:

- Times are stored as local `hour`/`minute` (never timestamps) so reminders don't
  drift when travelling or across DST.
- Date differences use `Date.UTC` per calendar day — never millisecond
  subtraction — because DST gives 23h/25h days.
- Streaks are counted only over *scheduled* days: non-scheduled days neither add
  nor break, a pending today doesn't break, and completion divides by scheduled
  days in the window (bounded to `createdAt`).
- The only `weekday = day + 1` conversion (expo's 1 = Sunday convention) lives in
  `dates.ts`/`notifications.ts`; everywhere else days use `Date.getDay()`.

Verified: `tsc --noEmit` clean under `strict`, `expo export --platform android`
bundles (~1730 modules), and 44 logic assertions pass in 5 timezones
(`America/Mexico_City`, `Pacific/Auckland`, `Europe/Madrid`, `UTC`,
`Asia/Kolkata`). On-device reminder delivery is validated by installing the APK.
