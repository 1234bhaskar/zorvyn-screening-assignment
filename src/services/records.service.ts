import type { CreateNewRecordInput, FilterInput, UpdateRecordInput } from "../validators/records.validator.js";
import { createRecord, deleteRecord, getAllRecords, getFilteredRecords, getRecordById, updateRecord } from "../repositories/records.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { NotFoundError } from "../utils/errors/app.error.js";
import { buildFilterConditions } from "../utils/filters.js";
import { and } from "drizzle-orm";

export const addNewRecordService = async (data: CreateNewRecordInput, userId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const record = await createRecord(data, user.id);
    return record;
}

export const updateRecordService = async (id: number, data: UpdateRecordInput) => {
    const updatedRecord = await updateRecord(id, data);
    return updatedRecord;
}


export const deleteRecordService = async (id: number) => {
    const record = await getRecordById(id);
    if (!record) {
        throw new NotFoundError("Record not found");
    }
    const deletedRecord = await deleteRecord(id);
    return deletedRecord;
}

export const getAllRecordsService = async (filters: FilterInput) => {
    const record = await getFilteredRecords(filters);
    return record;
}