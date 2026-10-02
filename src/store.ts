import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import type { Budget } from './budget';
import { budgetSchema, emptyBudget } from './validation';
// Construct after Amplify.configure has run in main.tsx.
const client = () => generateClient<Schema>({ authMode: 'userPool' });
function fail(errors?: readonly { message: string }[]) {
  if (errors?.length) throw new Error('Budget request failed. Check your connection and sign-in, then try again.');
}
export async function loadBudget(userId: string) {
  const result = await client().models.Budget.get({ id: userId });
  fail(result.errors);
  if (!result.data) return { budget: emptyBudget(), exists: false };
  const payload = result.data.payload;
  return { budget: budgetSchema.parse(typeof payload === 'string' ? JSON.parse(payload) : payload), exists: true };
}
export async function saveBudget(userId: string, budget: Budget, exists: boolean) {
  const payload = JSON.stringify(budgetSchema.parse(budget));
  const result = exists
    ? await client().models.Budget.update({ id: userId, payload })
    : await client().models.Budget.create({ id: userId, payload });
  fail(result.errors);
  if (!result.data) throw new Error('No save confirmation received. Your edits remain on screen.');
}
