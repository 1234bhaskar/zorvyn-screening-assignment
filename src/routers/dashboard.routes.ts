import express from "express"
import { hasRole, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
    summary,
    categoryTotals,
    recentActivity,
    weeklyTrends
} from "../controllers/dashboard.controller.js";


const dashboardRouter = express.Router();


dashboardRouter.get('/summary',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    summary)

dashboardRouter.get('/category',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    categoryTotals)

dashboardRouter.get('/recent',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    recentActivity)

dashboardRouter.get('/weekly-trends',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    weeklyTrends)


export { dashboardRouter };