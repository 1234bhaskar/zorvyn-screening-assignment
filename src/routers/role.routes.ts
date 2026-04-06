import express from "express"
import { create } from "../controllers/role.controller.js";
import { validateRequestBody } from "../validators/index.js";
import { createNewRoleSchema } from "../validators/role.validator.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constant/role.js";

const roleRouter = express.Router();
roleRouter.post('/',
    isAuthenticated,
    hasRole(ROLES.Admin),
    validateRequestBody(createNewRoleSchema),
    create);


export { roleRouter };