import express from "express"
import { register } from "../controllers/auth.controller.js";
import { validateRequestBody } from "../validators/index.js";
import { createNewUserSchema, loginUserSchema } from "../validators/user/user.validator.js";
import { login } from "../controllers/auth.controller.js";

const authRouter = express.Router();
authRouter.post('/register', validateRequestBody(createNewUserSchema), register);
authRouter.post('/login', validateRequestBody(loginUserSchema), login);


export { authRouter };