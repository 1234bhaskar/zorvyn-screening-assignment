import express from "express"
import { hasRole, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
    summary,
    categoryTotals,
    recentActivity,
    weeklyTrends
} from "../controllers/dashboard.controller.js";
import { ROLES } from "../constant/role.js";


const dashboardRouter = express.Router();


dashboardRouter.get('/summary',
    isAuthenticated,
    hasRole(ROLES.Admin, ROLES.Analyst, ROLES.Viewer),
    summary)

dashboardRouter.get('/category',
    isAuthenticated,
    hasRole(ROLES.Admin, ROLES.Analyst, ROLES.Viewer),
    categoryTotals)

dashboardRouter.get('/recent',
    isAuthenticated,
    hasRole(ROLES.Admin, ROLES.Analyst, ROLES.Viewer),
    recentActivity)

dashboardRouter.get('/weekly-trends',
    isAuthenticated,
    hasRole(ROLES.Admin, ROLES.Analyst, ROLES.Viewer),
    weeklyTrends)


export { dashboardRouter };