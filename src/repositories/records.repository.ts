import { db } from "../db/index.db.js";
import { Users, Roles, Records } from "../db/schema.js";
import { and, count, eq, isNull } from "drizzle-orm";
import type { CreateNewRecordInput, FilterInput, UpdateRecordInput } from "../validators/records.validator.js";
import { ConflictError, NotFoundError } from "../utils/errors/app.error.js";
import type { IPaginatedResult, RecordRow } from "../interface/records.interface.js";
import { buildFilterConditions } from "../utils/filters.js";

export async function createRecord(data: CreateNewRecordInput, userId: number) {
    try {
        const [financialRecord] = await db
            .insert(Records)
            .values({
                amount: data.amount.toString(),
                type: data.type,
                category: data.category,
                date: data.date.toString(),
                notes: data.notes,
                userId,
            })
            .returning();

        if (!financialRecord) {
            throw new ConflictError("Record not created");
        }

        return financialRecord;
    } catch (error) {
        console.log("Error creating record", error);
        throw error;
    }
}


export async function getAllRecords() {
    try {
        const financialRecord = await db
            .select()
            .from(Records)
            .where(isNull(Records.deletedAt));
        return financialRecord;
    } catch (error) {
        console.log("Error fetching records", error);
        throw error;
    }
}


export const getFilteredRecords = async (
    filters: FilterInput
): Promise<IPaginatedResult<RecordRow>> => {

    const conditions = buildFilterConditions(filters);
    const whereClause = and(...conditions);
    const offset = (filters.page - 1) * filters.limit;

    const [records, [{ total } = { total: 0 }]] = await Promise.all([
        db
            .select({
                id: Records.id,
                amount: Records.amount,
                type: Records.type,
                category: Records.category,
                date: Records.date,
                notes: Records.notes,
                createdAt: Records.createdAt,
            })
            .from(Records)
            .where(whereClause)
            .limit(filters.limit)
            .offset(offset),

        db
            .select({ total: count() })
            .from(Records)
            .where(whereClause),
    ]);

    const totalNum = Number(total);

    return {
        data: records,
        meta: {
            total: totalNum,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(totalNum / filters.limit),
        },
    };
};

export async function getRecordById(id: number) {
    try {
        const [financialRecord] = await db
            .select()
            .from(Records)
            .where(and(eq(Records.id, id), isNull(Records.deletedAt)));
        return financialRecord;
    } catch (error) {
        console.log("Error fetching record", error);
        throw error;
    }
}


export async function deleteRecord(id: number) {
    try {
        const [financialRecord] = await db
            .update(Records)
            .set({
                deletedAt: new Date(),
            })
            .where(eq(Records.id, id))
            .returning();

        if (!financialRecord) {
            throw new NotFoundError("Record not found");
        }
        return financialRecord;

    } catch (error) {
        console.log("Error deleting record", error);
        throw error;
    }
}

export async function updateRecord(id: number, data: UpdateRecordInput) {
    try {
        const [financialRecord] = await db
            .update(Records)
            .set({
                amount: data.amount?.toString(),
                type: data.type,
                category: data.category,
                notes: data.notes,
            })
            .where(eq(Records.id, id))
            .returning();

        if (!financialRecord) {
            throw new NotFoundError("Record not found");
        }
        return financialRecord;
    } catch (error) {
        console.log("Error updating record", error);
        throw error;
    }
}