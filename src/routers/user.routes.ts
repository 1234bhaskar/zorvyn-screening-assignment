import express from "express"
import { hasRole, isAuthenticated } from "../middlewares/auth.middleware.js";
import { profile, updateStatus } from "../controllers/user.controller.js";
import { validateRequestBody } from "../validators/index.js";
import { updateStatusSchema } from "../validators/user/user.validator.js";

const userRouter = express.Router();


userRouter.get('/my-profile', isAuthenticated, profile)
userRouter.put('/:id/status',
    isAuthenticated,
    hasRole("admin"),
    validateRequestBody(updateStatusSchema),
    updateStatus)


export { userRouter };