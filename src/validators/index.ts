import type { NextFunction, Request, Response } from "express";
import { z, type ZodObject } from "zod";

export const validateRequestBody = (schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map(err => ({
                        path: err.path[0],
                        message: err.message
                    }))
                });
            }
            res.status(400).json({
                message: "Invalid request body",
                success: false,
                error: error
            });

        }
    }
}