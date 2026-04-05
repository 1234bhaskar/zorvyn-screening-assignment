import express from "express"
import { hasRole, isAuthenticated } from "../middlewares/auth.middleware.js";
import { assignRole, profile, updateStatus } from "../controllers/user.controller.js";
import { validateRequestBody } from "../validators/index.js";
import { updateStatusSchema } from "../validators/user/user.validator.js";
import { assignRoleSchema } from "../validators/role.validator.js";

const userRouter = express.Router();


userRouter.get('/my-profile', isAuthenticated, profile)

//activate or deactivate user
userRouter.put('/:id/status',
    isAuthenticated,
    hasRole("admin"),
    validateRequestBody(updateStatusSchema),
    updateStatus)

userRouter.put('/:uuid/role',
    isAuthenticated,
    hasRole("admin"),
    validateRequestBody(assignRoleSchema),
    assignRole)


export { userRouter };