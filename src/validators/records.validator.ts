import { z } from "zod";
import { RecordCategory } from "../constant/records.js";

export const createNewRecordSchema = z.object({
    amount: z.number().min(0, "Amount must be at least 0").max(1000000000, "Amount must be at most 1000000000"),
    type: z.enum(["income", "expense"], "Type must be income or expense"),
    category: z.enum(RecordCategory, {
        message: "Category must be one of the following: " + Object.values(RecordCategory).join(", ")
    }),
    date: z.coerce.date({
        message: "Please provide a valid date"
    }),
    notes: z.string().max(255).optional(),
});

export const updateRecordSchema = z.object({
    amount: z.number().min(0, "Amount must be at least 0").max(1000000000, "Amount must be at most 1000000000").optional(),
    type: z.enum(["income", "expense"], "Type must be income or expense").optional(),
    category: z.enum(RecordCategory, {
        message: "Category must be one of the following: " + Object.values(RecordCategory).join(", ")
    }).optional(),
    notes: z.string().max(255).optional(),
});

export type CreateNewRecordInput = z.infer<typeof createNewRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;