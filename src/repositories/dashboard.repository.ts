import { RecordType } from "../constant/records.js";
import { db } from "../db/index.db.js";
import { Records } from "../db/schema.js";
import { and, count, desc, eq, isNull, sql, sum } from "drizzle-orm";
import type { IWeekEntry } from "../interface/dashboard.interface.js";

export const getSummary = async () => {
  const result = await db
    .select({
      type: Records.type,
      total: sum(Records.amount),
    })
    .from(Records)
    .where(isNull(Records.deletedAt))
    .groupBy(Records.type);

  const income = result.find((r) => r.type === RecordType.INCOME)?.total ?? 0;
  const expenses = result.find((r) => r.type === RecordType.EXPENSE)?.total ?? 0;

  const summary = {
    totalIncome: Number(income),
    totalExpenses: Number(expenses),
    netBalance: Number(income) - Number(expenses),
  };
  return summary;
};


export const getCategoryTotals = async (type: RecordType) => {
  const conditions = [isNull(Records.deletedAt)];
  if (type) conditions.push(eq(Records.type, type));

  const result = await db
    .select({
      category: Records.category,
      type: Records.type,
      total: sum(Records.amount),
      count: count(),
    })
    .from(Records)
    .where(and(...conditions))
    .groupBy(Records.category, Records.type)
    .orderBy(desc(sum(Records.amount)));

  return result.map((r) => ({
    category: r.category,
    type: r.type,
    total: Number(r.total),
    count: Number(r.count),
  }));
};


export const getRecentActivity = async (limitParam: number) => {
  return await db
    .select({
      id: Records.id,
      amount: Records.amount,
      type: Records.type,
      category: Records.category,
      date: Records.date,
      notes: Records.notes,
    })
    .from(Records)
    .where(isNull(Records.deletedAt))
    .orderBy(desc(Records.date))
    .limit(limitParam);
};

export const getWeeklyTrends = async (): Promise<IWeekEntry[]> => {
  const result = await db
    .select({
      week: sql<string>`DATE_TRUNC('week', ${Records.date})`.as("week"),
      type: Records.type,
      total: sum(Records.amount),
    })
    .from(Records)
    .where(
      and(
        isNull(Records.deletedAt),
        sql`${Records.date} >= NOW() - INTERVAL '12 weeks'`
      )
    )
    .groupBy(sql`DATE_TRUNC('week', ${Records.date})`, Records.type)
    .orderBy(sql`DATE_TRUNC('week', ${Records.date})`);

  return Object.values(
    result.reduce<Record<string, IWeekEntry>>((acc, row) => {
      const key = new Date(row.week).toISOString().slice(0, 10);

      if (!acc[key]) {
        acc[key] = { week: key, income: 0, expenses: 0, net: 0 };
      }

      if (row.type === RecordType.INCOME) acc[key].income = Number(row.total);
      else acc[key].expenses = Number(row.total);

      acc[key].net = acc[key].income - acc[key].expenses;

      return acc;
    }, {})
  );
};
