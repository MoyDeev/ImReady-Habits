// Gastos panel: incomes (fijo/extra), expenses drawn from an income, and pending
// payments, with a balance summary. Adding uses the shared pattern: a FAB opens a
// floating menu with the three add options, each opening its bottom sheet.

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Finances, Income, Expense, PendingExpense } from '../../src/types';
import { emptyFinances } from '../../src/types';
import { usePersistentState } from '../../src/usePersistentState';
import { formatMoney, remainingForIncome, incomeName } from '../../src/finance';
import { todayKey, formatDateKey } from '../../src/dates';
import { useTheme } from '../../src/useTheme';
import { spacing, radius } from '../../src/theme';
import { FinanceSummary } from '../finance/FinanceSummary';
import {
  IncomeModal,
  ExpenseModal,
  PendingModal,
} from '../finance/FinanceModals';
import { Fab } from '../Fab';
import { AddMenu, type AddOption } from '../AddMenu';

type Tab = 'incomes' | 'expenses' | 'pending';

/** Clearance so list content never hides behind the dock / system nav. */
const BOTTOM_CLEARANCE = 120;

const ADD_OPTIONS: AddOption[] = [
  { key: 'incomes', label: 'Ingreso', icon: 'trending-up-outline' },
  { key: 'expenses', label: 'Gasto', icon: 'trending-down-outline' },
  { key: 'pending', label: 'Pendiente a pagar', icon: 'time-outline' },
];

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ExpensesSection() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [finances, setFinances, hydrated] = usePersistentState<Finances>(
    'imready-habits/finances/v1',
    emptyFinances,
  );
  const [tab, setTab] = useState<Tab>('incomes');
  const [modal, setModal] = useState<Tab | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- mutations ---
  const addIncome = (d: Pick<Income, 'name' | 'amount' | 'kind' | 'label'>) =>
    setFinances((f) => ({
      ...f,
      incomes: [
        ...f.incomes,
        { ...d, id: makeId(), createdAt: new Date().toISOString() },
      ],
    }));

  const addExpense = (d: Omit<Expense, 'id' | 'createdAt'>) =>
    setFinances((f) => ({
      ...f,
      expenses: [
        ...f.expenses,
        { ...d, id: makeId(), createdAt: new Date().toISOString() },
      ],
    }));

  const addPending = (d: Omit<PendingExpense, 'id' | 'createdAt'>) =>
    setFinances((f) => ({
      ...f,
      pending: [
        ...f.pending,
        { ...d, id: makeId(), createdAt: new Date().toISOString() },
      ],
    }));

  const remove = (kind: Tab, id: string) =>
    setFinances((f) => ({
      ...f,
      incomes:
        kind === 'incomes' ? f.incomes.filter((x) => x.id !== id) : f.incomes,
      expenses:
        kind === 'expenses' ? f.expenses.filter((x) => x.id !== id) : f.expenses,
      pending:
        kind === 'pending' ? f.pending.filter((x) => x.id !== id) : f.pending,
    }));

  // Convert a pending payment into a real expense dated today.
  const payPending = (p: PendingExpense) =>
    setFinances((f) => ({
      ...f,
      pending: f.pending.filter((x) => x.id !== p.id),
      expenses: [
        ...f.expenses,
        {
          id: makeId(),
          name: p.name,
          amount: p.amount,
          date: todayKey(),
          sourceId: p.sourceId,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

  if (!hydrated) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'incomes', label: 'Ingresos' },
    { key: 'expenses', label: 'Gastos' },
    { key: 'pending', label: 'Pendientes' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + BOTTOM_CLEARANCE },
        ]}
      >
        <FinanceSummary finances={finances} />

        {/* Segmented control (view filter) */}
        <View style={[styles.tabs, { backgroundColor: theme.cardAlt }]}>
          {TABS.map((t) => {
            const on = tab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[styles.tab, on && { backgroundColor: theme.card }]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: on ? theme.text : theme.textMuted },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Lists */}
        {tab === 'incomes' &&
          (finances.incomes.length === 0 ? (
            <Empty text="Sin ingresos todavía." />
          ) : (
            finances.incomes.map((inc) => (
              <Row
                key={inc.id}
                title={inc.name}
                badge={inc.kind === 'fijo' ? 'Fijo' : inc.label?.trim() || 'Extra'}
                amount={inc.amount}
                sub={`Disponible ${formatMoney(remainingForIncome(finances, inc))}`}
                onDelete={() => remove('incomes', inc.id)}
              />
            ))
          ))}

        {tab === 'expenses' &&
          (finances.expenses.length === 0 ? (
            <Empty text="Sin gastos registrados." />
          ) : (
            finances.expenses.map((e) => (
              <Row
                key={e.id}
                title={e.name}
                amount={-e.amount}
                sub={`${incomeName(finances, e.sourceId)}${
                  e.date ? ` · ${formatDateKey(e.date)}` : ''
                }`}
                onDelete={() => remove('expenses', e.id)}
              />
            ))
          ))}

        {tab === 'pending' &&
          (finances.pending.length === 0 ? (
            <Empty text="Sin pagos pendientes." />
          ) : (
            finances.pending.map((p) => (
              <Row
                key={p.id}
                title={p.name}
                amount={-p.amount}
                sub={`${incomeName(finances, p.sourceId)} · vence ${formatDateKey(
                  p.dueDate,
                )}`}
                onDelete={() => remove('pending', p.id)}
                action={{ label: 'Pagar', onPress: () => payPending(p) }}
              />
            ))
          ))}
      </ScrollView>

      <Fab onPress={() => setMenuOpen(true)} />
      <AddMenu
        visible={menuOpen}
        options={ADD_OPTIONS}
        onSelect={(key) => setModal(key as Tab)}
        onClose={() => setMenuOpen(false)}
      />

      <IncomeModal
        visible={modal === 'incomes'}
        onClose={() => setModal(null)}
        onSubmit={(d) => {
          addIncome(d);
          setModal(null);
        }}
      />
      <ExpenseModal
        visible={modal === 'expenses'}
        finances={finances}
        onClose={() => setModal(null)}
        onSubmit={(d) => {
          addExpense(d);
          setModal(null);
        }}
      />
      <PendingModal
        visible={modal === 'pending'}
        finances={finances}
        onClose={() => setModal(null)}
        onSubmit={(d) => {
          addPending(d);
          setModal(null);
        }}
      />
    </View>
  );
}

function Empty({ text }: { text: string }) {
  const theme = useTheme();
  return <Text style={[styles.empty, { color: theme.textFaint }]}>{text}</Text>;
}

function Row({
  title,
  amount,
  sub,
  badge,
  onDelete,
  action,
}: {
  title: string;
  amount: number;
  sub?: string;
  badge?: string;
  onDelete: () => void;
  action?: { label: string; onPress: () => void };
}) {
  const theme = useTheme();
  return (
    <View
      style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={{ flex: 1, gap: 3 }}>
        <View style={styles.rowTitleLine}>
          <Text style={[styles.rowTitle, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: theme.cardAlt }]}>
              <Text style={[styles.badgeText, { color: theme.textMuted }]}>
                {badge}
              </Text>
            </View>
          ) : null}
        </View>
        {sub ? (
          <Text style={[styles.rowSub, { color: theme.textMuted }]}>{sub}</Text>
        ) : null}
      </View>

      <View style={styles.rowRight}>
        <Text
          style={[
            styles.rowAmount,
            { color: amount < 0 ? theme.danger : theme.text },
          ]}
        >
          {formatMoney(amount)}
        </Text>
        <View style={styles.rowActions}>
          {action ? (
            <Pressable onPress={action.onPress} hitSlop={6}>
              <Text style={[styles.actionText, { color: theme.accent }]}>
                {action.label}
              </Text>
            </Pressable>
          ) : null}
          <Pressable onPress={onDelete} hitSlop={6}>
            <Ionicons name="trash-outline" size={18} color={theme.textFaint} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rowSub: {
    fontSize: 13,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  rowAmount: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
