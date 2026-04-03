import express from "express"
import { validateRequestBody } from "../validators/index.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/auth.middleware.js";
import { createNewRecordSchema, updateRecordSchema } from "../validators/records.validator.js";
import { all, create, update } from "../controllers/records.controller.js";
import { deleteRecord } from "../repositories/records.repository.js";

const recordRouter = express.Router();
recordRouter.post('/',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    validateRequestBody(createNewRecordSchema),
    create);

recordRouter.put('/:id',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    validateRequestBody(updateRecordSchema),
    update);

recordRouter.delete('/:id',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    deleteRecord);

recordRouter.get('/',
    isAuthenticated,
    hasRole("admin", "analyst", "viewer"),
    all);

export { recordRouter };