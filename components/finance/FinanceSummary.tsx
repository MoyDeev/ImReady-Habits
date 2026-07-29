// Summary card for the Gastos section: income, spent, balance and pending totals.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Finances } from '../../src/types';
import {
  totalIncome,
  totalExpense,
  totalPending,
  balance,
  formatMoney,
} from '../../src/finance';
import { useTheme } from '../../src/useTheme';
import { spacing, radius } from '../../src/theme';

export function FinanceSummary({ finances }: { finances: Finances }) {
  const theme = useTheme();
  const bal = balance(finances);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.balanceRow}>
        <Text style={[styles.balanceLabel, { color: theme.textMuted }]}>
          Saldo
        </Text>
        <Text
          style={[
            styles.balanceValue,
            { color: bal < 0 ? theme.danger : theme.text },
          ]}
        >
          {formatMoney(bal)}
        </Text>
      </View>

      <View style={styles.grid}>
        <Cell label="Ingresos" value={totalIncome(finances)} color={theme.accent} />
        <Cell label="Gastos" value={totalExpense(finances)} color={theme.danger} />
        <Cell
          label="Pendiente"
          value={totalPending(finances)}
          color={theme.textMuted}
        />
      </View>
    </View>
  );
}

function Cell({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const theme = useTheme();
  return (
    <View style={styles.cell}>
      <Text style={[styles.cellValue, { color }]}>{formatMoney(value)}</Text>
      <Text style={[styles.cellLabel, { color: theme.textFaint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cell: {
    flex: 1,
    gap: 2,
  },
  cellValue: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  cellLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
