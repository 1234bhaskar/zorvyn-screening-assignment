import { db } from "../db/index.db.js";
import { Users, Roles, Records } from "../db/schema.js";
import { eq } from "drizzle-orm";
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
                date: data.date,
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


export async function getAllRecords(userId: number) {
    try {
        const [financialRecord] = await db
            .select()
            .from(Records)
            .where(eq(Records.userId, userId));
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
            .where(eq(Records.id, id));
        return financialRecord;
    } catch (error) {
        console.log("Error fetching record", error);
        throw error;
    }
}


export async function deleteRecord(id: number) {
    try {
        const [financialRecord] = await db
            .delete(Records)
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