import type { RecordType } from "../constant/records.js";
import {
    getCategoryTotals,
    getRecentActivity,
    getSummary,
    getWeeklyTrends
} from "../repositories/dashboard.repository.js";

export const getSummaryService = async () => {
    const summary = await getSummary();
    return summary;
}

export const getCategoryTotalsService = async (type: RecordType) => {
    const categoryTotals = await getCategoryTotals(type);
    return categoryTotals;
}

export const getRecentActivityService = async (limit: number) => {
    const recentActivity = await getRecentActivity(limit);
    return recentActivity;
}

export const getWeeklyTrendsService = async () => {
    const weeklyTrends = await getWeeklyTrends();
    return weeklyTrends;
}