import { db } from "../db/index.db.js";
import { Users, Roles, Records } from "../db/schema.js";
import { and, eq, isNull } from "drizzle-orm";
import type { CreateNewRecordInput, UpdateRecordInput } from "../validators/records.validator.js";
import { ConflictError, NotFoundError } from "../utils/errors/app.error.js";

export async function createRecord(data: CreateNewRecordInput, userId: number) {
    try {
        const [financialRecord] = await db
            .insert(Records)
            .values({
                amount: data.amount.toString(),
                type: data.type,
                category: data.category,
                date: data.date.toISOString(),
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