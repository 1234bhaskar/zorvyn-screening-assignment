import express from "express"

const userRouter = express.Router();
userRouter.use("/user", userRouter);



export { userRouter };