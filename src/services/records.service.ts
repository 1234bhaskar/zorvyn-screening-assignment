import type { CreateNewRecordInput, UpdateRecordInput } from "../validators/records.validator.js";
import { createRecord, deleteRecord, getAllRecords, getRecordById, updateRecord } from "../repositories/records.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { NotFoundError } from "../utils/errors/app.error.js";

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
    const deletedRecord = await deleteRecord(id);
    return deletedRecord;
}

export const getAllRecordsService = async (userId: number) => {
    const record = await getAllRecords(userId);
    return record;
}