import express from "express";
import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";
import { roleRouter } from "./role.routes.js";
import { recordRouter } from "./records.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/role", roleRouter);
router.use("/record", recordRouter);

export { router as apiRouter };

