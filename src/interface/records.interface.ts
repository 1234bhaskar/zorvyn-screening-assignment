import type { Records } from "../db/schema.js";

export interface IPaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export type RecordRow = Pick<typeof Records.$inferSelect, "id" | "amount" | "type" | "category" | "date" | "notes" | "createdAt">;
