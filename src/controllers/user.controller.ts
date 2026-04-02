import type { NextFunction, Request, Response } from "express";
import { showUserProfile, updateStatusService } from "../services/user.service.js";

export const profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await showUserProfile(req.user!.id);
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user
        });
    } catch (error) {
        next(error)
    }
}


export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await updateStatusService(String(req.params.id), req.body.status);
        res.status(200).json({
            success: true,
            message: `User ${req.body.status} successfully`,
            data: result
        });
    } catch (error) {
        next(error)
    }
}

