import express from "express"
import { create } from "../controllers/role.controller.js";
import { validateRequestBody } from "../validators/index.js";
import { createNewRoleSchema } from "../validators/role.validator.js";

const roleRouter = express.Router();
roleRouter.post('/', validateRequestBody(createNewRoleSchema), create);


export { roleRouter };