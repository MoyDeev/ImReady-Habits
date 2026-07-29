// "Add habit" as a bottom sheet, matching the Gastos add flow. Wraps the shared
// HabitForm and owns the create logic (permissions + persistence).

import React from 'react';
import { HabitForm } from './HabitForm';
import { BottomSheet } from './BottomSheet';
import { useHabits, type HabitInput } from '../src/HabitsContext';
import { requestPermissions } from '../src/notifications';

export function HabitModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { addHabit, notificationsAvailable } = useHabits();

  async function onSubmit(input: HabitInput) {
    if (input.reminderEnabled) {
      const granted = await requestPermissions();
      input = { ...input, reminderEnabled: granted };
    }
    await addHabit(input);
    onClose();
  }

  return (
    <BottomSheet visible={visible} title="Nuevo hábito" onClose={onClose}>
      <HabitForm
        submitLabel="Crear hábito"
        notificationsAvailable={notificationsAvailable}
        onSubmit={onSubmit}
        style={{ flexShrink: 1 }}
      />
    </BottomSheet>
  );
}
