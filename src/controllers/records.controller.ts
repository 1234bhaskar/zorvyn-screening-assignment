import type { NextFunction, Request, Response } from "express";
import { addNewRecordService, deleteRecordService, getAllRecordsService, updateRecordService } from "../services/records.service.js";

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const record = await addNewRecordService(req.body, userId!);
        res.status(201).json({
            success: true,
            message: "Record created successfully",
            data: record
        });
    } catch (error) {
        next(error)
    }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const record = await updateRecordService(Number(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: "Record updated successfully",
            data: record
        });
    } catch (error) {
        next(error)
    }
}

export const deleteRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const record = await deleteRecordService(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: "Record deleted successfully",
            data: record
        });
    } catch (error) {
        next(error)
    }
}

export const all = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const records = await getAllRecordsService(userId!);
        res.status(200).json({
            success: true,
            message: "Records fetched successfully",
            data: records
        });
    } catch (error) {
        next(error)
    }
}
