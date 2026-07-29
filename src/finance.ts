// Pure finance helpers for the Gastos section: money formatting and the totals /
// per-income balances. Free of native modules so it can be tested under Node.

import type { Finances, Income } from './types';

/** Format a number as MXN-style currency: "$1,234.56". Manual thousands grouping
 *  so it doesn't depend on Intl being present in the JS engine. */
export function formatMoney(n: number): string {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const fixed = abs.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${grouped}.${decPart}`;
}

/** Parse a user-typed amount ("1,234.5", "$20", "") into a number; NaN-safe. */
export function parseAmount(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function totalIncome(f: Finances): number {
  return sum(f.incomes.map((i) => i.amount));
}

export function totalExpense(f: Finances): number {
  return sum(f.expenses.map((e) => e.amount));
}

export function totalPending(f: Finances): number {
  return sum(f.pending.map((p) => p.amount));
}

/** Money left overall: all income minus all recorded expenses. */
export function balance(f: Finances): number {
  return totalIncome(f) - totalExpense(f);
}

/** Sum of expenses drawn from a given income. */
export function spentFromIncome(f: Finances, incomeId: string): number {
  return sum(
    f.expenses.filter((e) => e.sourceId === incomeId).map((e) => e.amount),
  );
}

/** How much of an income is left after the expenses drawn from it. */
export function remainingForIncome(f: Finances, income: Income): number {
  return income.amount - spentFromIncome(f, income.id);
}

/** Display name of an income by id (for showing an expense's source). */
export function incomeName(f: Finances, sourceId: string): string {
  return f.incomes.find((i) => i.id === sourceId)?.name ?? 'Sin origen';
}
