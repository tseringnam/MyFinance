import { z } from 'zod';
const entry = z.object({
  id: z.string().uuid(), name: z.string().max(150),
  amount: z.number().finite().min(0).max(1_000_000_000_000),
});
export const budgetSchema = z.object({
  income: z.array(entry).max(300),
  expenses: z.array(entry).max(300),
  investment: z.array(entry).max(300),
});
export const emptyBudget = () => ({ income: [], expenses: [], investment: [] });
