import express from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
    summary,
    categoryTotals,
    recentActivity,
    weeklyTrends
} from "../controllers/dashboard.controller.js";


const dashboardRouter = express.Router();


dashboardRouter.get('/summary', isAuthenticated, summary)
dashboardRouter.get('/category', isAuthenticated, categoryTotals)
dashboardRouter.get('/recent', isAuthenticated, recentActivity)
dashboardRouter.get('/weekly-trends', weeklyTrends)


export { dashboardRouter };