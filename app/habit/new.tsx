import React from 'react';
import { useRouter } from 'expo-router';
import { useHabits, type HabitInput } from '../../src/HabitsContext';
import { requestPermissions } from '../../src/notifications';
import { HabitForm } from '../../components/HabitForm';

export default function NewHabitScreen() {
  const router = useRouter();
  const { addHabit, notificationsAvailable } = useHabits();

  async function onSubmit(input: HabitInput) {
    if (input.reminderEnabled) {
      const granted = await requestPermissions();
      input = { ...input, reminderEnabled: granted };
    }
    await addHabit(input);
    router.back();
  }

  return (
    <HabitForm
      submitLabel="Crear hábito"
      notificationsAvailable={notificationsAvailable}
      onSubmit={onSubmit}
    />
  );
}
