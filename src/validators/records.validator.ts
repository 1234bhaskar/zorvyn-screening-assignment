import { z } from "zod";
import { RecordCategory, RecordType } from "../constant/records.js";

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

export const filterSchema = z.object({
    type: z.enum(RecordType).optional(),
    category: z.enum(RecordCategory).optional(),
    from: z.coerce.date({ message: "from must be a valid date in YYYY-MM-DD format" }).optional(),
    to: z.coerce.date({ message: "to must be a valid date in YYYY-MM-DD format" }).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})
    .refine(
        (data) => {
            if (data.from && data.to) {
                return new Date(data.from) <= new Date(data.to);
            }
            return true;
        },
        { message: "from date must be before to date", path: ["from"] }
    );

export type FilterInput = z.infer<typeof filterSchema>;

export type CreateNewRecordInput = z.infer<typeof createNewRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;