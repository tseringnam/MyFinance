export type Entry={id:string;name:string;amount:number};
export type Budget={income:Entry[];expenses:Entry[];investment:Entry[]};
export function totals(b:Budget){const sum=(r:Entry[])=>r.reduce((a,r)=>a+r.amount,0);const income=sum(b.income),expenses=sum(b.expenses);return {income,expenses,savings:income-expenses,investment:sum(b.investment)};}
