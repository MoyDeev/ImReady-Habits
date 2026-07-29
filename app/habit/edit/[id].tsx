import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabits, type HabitInput } from '../../../src/HabitsContext';
import { requestPermissions } from '../../../src/notifications';
import { HabitForm } from '../../../components/HabitForm';
import { useTheme } from '../../../src/useTheme';
import { spacing, radius } from '../../../src/theme';

export default function EditHabitScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, updateHabit, deleteHabit, notificationsAvailable } =
    useHabits();
  const habit = getHabit(id);

  if (!habit) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.textMuted }}>Hábito no encontrado.</Text>
      </View>
    );
  }

  const initial: HabitInput = {
    name: habit.name,
    times: habit.times,
    days: habit.days,
    color: habit.color,
    reminderEnabled: habit.reminderEnabled,
  };

  async function onSubmit(input: HabitInput) {
    if (input.reminderEnabled) {
      const granted = await requestPermissions();
      input = { ...input, reminderEnabled: granted };
    }
    await updateHabit(id, input);
    router.back();
  }

  function confirmDelete() {
    Alert.alert(
      'Eliminar hábito',
      `¿Seguro que quieres eliminar "${habit!.name}"? Se borrará su historial.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(id);
            // Back out of the modal, then out of the (now gone) detail screen.
            router.back();
            router.back();
          },
        },
      ],
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HabitForm
        initial={initial}
        submitLabel="Guardar cambios"
        notificationsAvailable={notificationsAvailable}
        onSubmit={onSubmit}
      />
      <View style={styles.deleteWrap}>
        <Pressable
          onPress={confirmDelete}
          style={[styles.deleteBtn, { borderColor: theme.danger }]}
        >
          <Text style={[styles.deleteText, { color: theme.danger }]}>
            Eliminar hábito
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
