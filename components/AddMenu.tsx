// Floating "cloud" menu anchored above the FAB, listing the things that can be
// added in a section (used by Gastos: Ingreso · Gasto · Pendiente). Dismisses on
// backdrop tap and sits above the phone's bottom safe area.

import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/useTheme';
import { spacing, radius } from '../src/theme';

export type AddOption = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

/** Clearance from the bottom so the menu floats just above the FAB. */
const FAB_CLEARANCE = 88;

export function AddMenu({
  visible,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: AddOption[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.menu,
          { bottom: insets.bottom + FAB_CLEARANCE, right: spacing.lg },
        ]}
      >
        {options.map((opt) => (
          <Pressable
            key={opt.key}
            onPress={() => {
              onSelect(opt.key);
              onClose();
            }}
            style={({ pressed }) => [
              styles.item,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name={opt.icon} size={20} color={theme.accent} />
            <Text style={[styles.itemText, { color: theme.text }]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menu: {
    position: 'absolute',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
