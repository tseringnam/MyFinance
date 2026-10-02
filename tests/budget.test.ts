import assert from 'node:assert/strict';
import test from 'node:test';
import { totals } from '../src/budget.ts';
import { budgetSchema, emptyBudget } from '../src/validation.ts';
const row = (amount: number) => ({ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Test', amount });
test('new budgets are blank and independent', () => {
  const first = emptyBudget(), second = emptyBudget();
  assert.deepEqual(totals(first), { income: 0, expenses: 0, savings: 0, investment: 0 });
  assert.notEqual(first.income, second.income);
});
test('investment balances do not reduce monthly surplus', () => {
  const budget = { income: [row(4800)], expenses: [row(2500)], investment: [row(100000)] };
  assert.equal(totals(budget).savings, 2300);
  assert.equal(totals(budget).savings * 12, 27600);
  budget.expenses.push(row(100));
  assert.equal(totals(budget).savings, 2200);
  assert.equal(totals(budget).investment, 100000);
});
test('invalid budget amounts and excessive entries are rejected', () => {
  for (const amount of [-1, Infinity, NaN, 1e13]) {
    assert.equal(budgetSchema.safeParse({ ...emptyBudget(), income: [row(amount)] }).success, false);
  }
  assert.equal(budgetSchema.safeParse({ ...emptyBudget(), expenses: Array.from({ length: 301 }, () => row(1)) }).success, false);
});
