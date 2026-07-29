// Add-forms for the Gastos section, shown as bottom-sheet modals: income,
// expense and pending payment. Shared field/sheet/source-picker pieces live here.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { Income, IncomeKind } from '../../src/types';
import { parseAmount, formatMoney, remainingForIncome } from '../../src/finance';
import type { Finances } from '../../src/types';
import { todayKey, dayKey, formatDateKey } from '../../src/dates';
import { useTheme } from '../../src/useTheme';
import { spacing, radius } from '../../src/theme';
import { BottomSheet } from '../BottomSheet';

// --- Shared sheet wrapper ---------------------------------------------------

function FormSheet({
  visible,
  title,
  onClose,
  onSave,
  saveLabel = 'Guardar',
  canSave,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  canSave: boolean;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <BottomSheet
      visible={visible}
      title={title}
      onClose={onClose}
      footer={
        <Pressable
          onPress={onSave}
          disabled={!canSave}
          style={[
            styles.save,
            { backgroundColor: canSave ? theme.accent : theme.cardAlt },
          ]}
        >
          <Text
            style={[
              styles.saveText,
              { color: canSave ? theme.accentText : theme.textFaint },
            ]}
          >
            {saveLabel}
          </Text>
        </Pressable>
      }
    >
      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </BottomSheet>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Text style={[styles.label, { color: theme.textMuted }]}>{children}</Text>
  );
}

function TextField({
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad';
}) {
  const theme = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textFaint}
      keyboardType={keyboardType ?? 'default'}
      style={[
        styles.input,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          color: theme.text,
        },
      ]}
    />
  );
}

function DateField({
  value,
  onChange,
  optional,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  optional?: boolean;
}) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  function onPick(event: DateTimePickerEvent, date?: Date) {
    setShow(false);
    if (event.type === 'set' && date) onChange(dayKey(date));
  }

  return (
    <View style={styles.dateRow}>
      <Pressable
        onPress={() => setShow(true)}
        style={[
          styles.dateChip,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={{ color: value ? theme.text : theme.textFaint, fontWeight: '600' }}>
          {value ? formatDateKey(value) : 'Elegir fecha'}
        </Text>
      </Pressable>
      {optional && value ? (
        <Pressable onPress={() => onChange(null)} hitSlop={8}>
          <Text style={[styles.clearDate, { color: theme.danger }]}>Quitar</Text>
        </Pressable>
      ) : null}
      {show ? (
        <DateTimePicker
          mode="date"
          value={value ? new Date(`${value}T00:00:00`) : new Date()}
          onChange={onPick}
        />
      ) : null}
    </View>
  );
}

function SourcePicker({
  finances,
  value,
  onChange,
}: {
  finances: Finances;
  value: string | null;
  onChange: (id: string) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.sourceWrap}>
      {finances.incomes.map((inc) => {
        const on = inc.id === value;
        return (
          <Pressable
            key={inc.id}
            onPress={() => onChange(inc.id)}
            style={[
              styles.sourceChip,
              {
                backgroundColor: on ? theme.accent : theme.card,
                borderColor: on ? theme.accent : theme.border,
              },
            ]}
          >
            <Text
              style={{
                color: on ? theme.accentText : theme.text,
                fontWeight: '600',
              }}
            >
              {inc.name}
            </Text>
            <Text
              style={{
                color: on ? theme.accentText : theme.textFaint,
                fontSize: 12,
              }}
            >
              {formatMoney(remainingForIncome(finances, inc))} disp.
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// --- Income -----------------------------------------------------------------

export function IncomeModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (d: {
    name: string;
    amount: number;
    kind: IncomeKind;
    label?: string;
  }) => void;
}) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [kind, setKind] = useState<IncomeKind>('fijo');
  const [label, setLabel] = useState('');

  function reset() {
    setName('');
    setAmount('');
    setKind('fijo');
    setLabel('');
  }
  function close() {
    reset();
    onClose();
  }
  const canSave = name.trim().length > 0 && parseAmount(amount) > 0;

  return (
    <FormSheet
      visible={visible}
      title="Nuevo ingreso"
      onClose={close}
      canSave={canSave}
      onSave={() => {
        onSubmit({
          name: name.trim(),
          amount: parseAmount(amount),
          kind,
          label: kind === 'extra' ? label.trim() || undefined : undefined,
        });
        reset();
      }}
    >
      <Label>Nombre</Label>
      <TextField value={name} onChangeText={setName} placeholder="Ej. Sueldo quincena" />
      <Label>Cantidad</Label>
      <TextField
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />
      <Label>Tipo</Label>
      <View style={styles.kindRow}>
        {(['fijo', 'extra'] as IncomeKind[]).map((k) => {
          const on = kind === k;
          return (
            <Pressable
              key={k}
              onPress={() => setKind(k)}
              style={[
                styles.kindChip,
                {
                  backgroundColor: on ? theme.accent : theme.card,
                  borderColor: on ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={{
                  color: on ? theme.accentText : theme.text,
                  fontWeight: '700',
                }}
              >
                {k === 'fijo' ? 'Sueldo fijo' : 'Extra'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {kind === 'extra' ? (
        <>
          <Label>Etiqueta (opcional)</Label>
          <TextField
            value={label}
            onChangeText={setLabel}
            placeholder="Ej. Freelance, Venta, Regalo"
          />
        </>
      ) : null}
    </FormSheet>
  );
}

// --- Expense ----------------------------------------------------------------

export function ExpenseModal({
  visible,
  onClose,
  finances,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  finances: Finances;
  onSubmit: (d: {
    name: string;
    amount: number;
    date?: string;
    sourceId: string;
  }) => void;
}) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState<string | null>(null);

  function reset() {
    setName('');
    setAmount('');
    setDate(null);
    setSourceId(null);
  }
  function close() {
    reset();
    onClose();
  }
  const canSave =
    name.trim().length > 0 && parseAmount(amount) > 0 && sourceId != null;

  return (
    <FormSheet
      visible={visible}
      title="Nuevo gasto"
      onClose={close}
      canSave={canSave}
      onSave={() => {
        if (!sourceId) return;
        onSubmit({
          name: name.trim(),
          amount: parseAmount(amount),
          date: date ?? undefined,
          sourceId,
        });
        reset();
      }}
    >
      <Label>Nombre</Label>
      <TextField value={name} onChangeText={setName} placeholder="Ej. Súper" />
      <Label>Cantidad</Label>
      <TextField
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />
      <Label>Fecha (opcional)</Label>
      <DateField value={date} onChange={setDate} optional />
      <Label>De qué ingreso</Label>
      {finances.incomes.length === 0 ? (
        <Text style={[styles.hint, { color: theme.textFaint }]}>
          Agrega un ingreso primero para poder ligar el gasto.
        </Text>
      ) : (
        <SourcePicker finances={finances} value={sourceId} onChange={setSourceId} />
      )}
    </FormSheet>
  );
}

// --- Pending ----------------------------------------------------------------

export function PendingModal({
  visible,
  onClose,
  finances,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  finances: Finances;
  onSubmit: (d: {
    name: string;
    amount: number;
    dueDate: string;
    sourceId: string;
  }) => void;
}) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState<string>(todayKey());
  const [sourceId, setSourceId] = useState<string | null>(null);

  function reset() {
    setName('');
    setAmount('');
    setDueDate(todayKey());
    setSourceId(null);
  }
  function close() {
    reset();
    onClose();
  }
  const canSave =
    name.trim().length > 0 && parseAmount(amount) > 0 && sourceId != null;

  return (
    <FormSheet
      visible={visible}
      title="Nuevo pendiente"
      onClose={close}
      canSave={canSave}
      onSave={() => {
        if (!sourceId) return;
        onSubmit({
          name: name.trim(),
          amount: parseAmount(amount),
          dueDate,
          sourceId,
        });
        reset();
      }}
    >
      <Label>Nombre</Label>
      <TextField value={name} onChangeText={setName} placeholder="Ej. Renta" />
      <Label>Cantidad</Label>
      <TextField
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />
      <Label>Fecha del pago</Label>
      <DateField value={dueDate} onChange={(v) => setDueDate(v ?? todayKey())} />
      <Label>De qué ingreso saldrá</Label>
      {finances.incomes.length === 0 ? (
        <Text style={[styles.hint, { color: theme.textFaint }]}>
          Agrega un ingreso primero para poder ligar el pendiente.
        </Text>
      ) : (
        <SourcePicker finances={finances} value={sourceId} onChange={setSourceId} />
      )}
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    flexShrink: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    marginTop: spacing.xs,
  },
  kindRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  kindChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  dateChip: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  clearDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  sourceWrap: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  sourceChip: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hint: {
    fontSize: 13,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  save: {
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '800',
  },
});
