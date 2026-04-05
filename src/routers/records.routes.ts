import express from "express"
import { validateQueryParams, validateRequestBody } from "../validators/index.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/auth.middleware.js";
import { createNewRecordSchema, filterSchema, updateRecordSchema } from "../validators/records.validator.js";
import { all, create, update, deleteRecord } from "../controllers/records.controller.js";

const recordRouter = express.Router();
recordRouter.post('/',
    isAuthenticated,
    hasRole("admin"),
    validateRequestBody(createNewRecordSchema),
    create);

recordRouter.put('/:id',
    isAuthenticated,
    hasRole("admin"),
    validateRequestBody(updateRecordSchema),
    update);

recordRouter.delete('/:id',
    isAuthenticated,
    hasRole("admin"),
    deleteRecord);

recordRouter.get('/',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    validateQueryParams(filterSchema),
    all);

export { recordRouter };