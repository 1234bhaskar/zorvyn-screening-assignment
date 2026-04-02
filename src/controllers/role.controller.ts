import type { NextFunction, Request, Response } from "express";
import { addNewRoleService } from "../services/role.service.js";

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const role = await addNewRoleService(req.body);
        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role
        });
    } catch (error) {
        next(error)
    }
}
