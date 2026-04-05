import { eq, gte, lte, isNull, SQL } from "drizzle-orm";
import { Records } from "../db/schema.js";
import type { FilterInput } from "../validators/records.validator.js";

const toDateString = (d: Date): string => d.toISOString().slice(0, 10);

export const buildFilterConditions = (filters: FilterInput): SQL[] => {
    const conditions: SQL[] = [
        isNull(Records.deletedAt),
    ];

    if (filters.type) {
        conditions.push(eq(Records.type, filters.type));
    }

    if (filters.category) {
        conditions.push(eq(Records.category, filters.category));
    }

    if (filters.from) {
        conditions.push(gte(Records.date, toDateString(filters.from)));
    }

    if (filters.to) {
        conditions.push(lte(Records.date, toDateString(filters.to)));
    }

    return conditions;
};