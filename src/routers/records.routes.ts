import express from "express"
import { validateQueryParams, validateRequestBody } from "../validators/index.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/auth.middleware.js";
import { createNewRecordSchema, filterSchema, updateRecordSchema } from "../validators/records.validator.js";
import { all, create, update, deleteRecord } from "../controllers/records.controller.js";
import { ROLES } from "../constant/role.js";

const recordRouter = express.Router();
recordRouter.post('/',
    isAuthenticated,
    hasRole(ROLES.Admin),
    validateRequestBody(createNewRecordSchema),
    create);

recordRouter.put('/:id',
    isAuthenticated,
    hasRole(ROLES.Admin),
    validateRequestBody(updateRecordSchema),
    update);

recordRouter.delete('/:id',
    isAuthenticated,
    hasRole(ROLES.Admin),
    deleteRecord);

recordRouter.get('/',
    isAuthenticated,
    hasRole(ROLES.Admin, ROLES.Analyst),
    validateQueryParams(filterSchema),
    all);

export { recordRouter };