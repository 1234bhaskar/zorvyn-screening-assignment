export enum RecordCategory {
    SALARY = "salary",
    RENT = "rent",
    FOOD = "food",
    UTILITIES = "utilities",
    HEALTHCARE = "healthcare",
    TRANSPORTATION = "transportation",
    ENTERTAINMENT = "entertainment",
    BILLS = "bills",
    INVESTMENT = "investment",
    OTHER = "other"
}

export const RecordType = {
    INCOME: "income",
    EXPENSE: "expense"
} as const;

export type RecordType = typeof RecordType[keyof typeof RecordType];
