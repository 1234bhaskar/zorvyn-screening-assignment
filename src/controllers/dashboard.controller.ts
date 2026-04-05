import type { NextFunction, Request, Response } from "express";
import { getCategoryTotalsService, getRecentActivityService, getSummaryService, getWeeklyTrendsService } from "../services/dashboards.service.js";
import type { RecordType } from "../constant/records.js";

export const summary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const summary = await getSummaryService();
        res.status(200).json({
            success: true,
            message: "Summary fetched successfully",
            data: summary
        });
    } catch (error) {
        next(error)
    }
}

export const categoryTotals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const type = req.query.type as RecordType;
        const categoryTotals = await getCategoryTotalsService(type);
        res.status(200).json({
            success: true,
            message: "Category totals fetched successfully",
            data: categoryTotals
        });
    } catch (error) {
        next(error)
    }
}

export const recentActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const limit = Number(req.query.limit);
        const recentActivity = await getRecentActivityService(limit);
        res.status(200).json({
            success: true,
            message: "Recent activity fetched successfully",
            data: recentActivity
        });
    } catch (error) {
        next(error)
    }
}

export const weeklyTrends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const weeklyTrends = await getWeeklyTrendsService();
        res.status(200).json({
            success: true,
            message: "Weekly trends fetched successfully",
            data: weeklyTrends
        });
    } catch (error) {
        next(error)
    }
}