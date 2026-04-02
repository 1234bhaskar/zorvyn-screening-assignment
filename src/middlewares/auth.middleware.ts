import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "../utils/errors/app.error.js";
import type { JwtUserPayload } from "../types/express.js";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            throw new UnauthorizedError("Unauthorized Access");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUserPayload;

        req.user = decodedToken;

        next();
    } catch (error: unknown) {
        return next(error);
    }
}

export const hasRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new UnauthorizedError("Authentication required");
        }
        const hasPermission = allowedRoles.includes(req.user.role);
        if (!hasPermission) {
            throw new ForbiddenError("You do not have permission to perform this action");
        }
        next();
    };
};
