import { z } from "zod";

export const createNewRoleSchema = z.object({
    name: z.string()
        .min(3, "Role name must be at least 3 characters long")
        .max(30, "Role name must be at most 30 characters long")
        .regex(/^[a-zA-Z]+$/, "Role name can only contain letters"),
});

export type CreateNewRoleInput = z.infer<typeof createNewRoleSchema>;