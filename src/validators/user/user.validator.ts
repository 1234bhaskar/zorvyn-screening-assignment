import { z } from "zod";
import { ROLES } from "../../constant/role.js";

export const createNewUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(100, "Name must be at most 100 characters long"),
    email: z.email("Invalid email address"),
    age: z.number().min(18, "Age must be at least 18 years old")
        .max(100, "Age must be at most 100 years old"),
    password: z.string().min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .max(20, "Password must be at most 20 characters long"),
    role: z.enum([ROLES.Analyst, ROLES.Viewer]).default(ROLES.Viewer)
});

export const loginUserSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .max(20, "Password must be at most 20 characters long"),
});

export type CreateNewUserInput = z.infer<typeof createNewUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const updateStatusSchema = z.object({
    status: z.enum(["active", "inactive"], "Status must be active or inactive")
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;