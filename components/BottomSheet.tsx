// Shared bottom-sheet shell for every "add" form. Slides up from the bottom,
// dims the rest, avoids the keyboard, and respects the phone's bottom safe area
// so nothing hides behind the system navigation bar.

import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/useTheme';
import { spacing, radius } from '../src/theme';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional pinned footer (e.g. a save button) shown below the body. */
  footer?: React.ReactNode;
  /** Sheet height cap as a fraction of the screen. */
  maxHeightPct?: number;
};

export function BottomSheet({
  visible,
  title,
  onClose,
  children,
  footer,
  maxHeightPct = 0.9,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.bg,
              borderColor: theme.border,
              maxHeight: Math.round(height * maxHeightPct),
              paddingBottom: insets.bottom + spacing.lg,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={[styles.cancel, { color: theme.textMuted }]}>
                Cancelar
              </Text>
            </Pressable>
          </View>
          {children}
          {footer}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  cancel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
