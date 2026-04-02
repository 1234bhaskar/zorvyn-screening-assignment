import type { NextFunction, Request, Response } from "express";
import { registerationService, loginUserService } from "../services/auth.service.js";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await registerationService(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await loginUserService(req.body);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user
        });
    } catch (error) {
        next(error)
    }
}