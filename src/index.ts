import express from 'express';
import { serverConfig } from './config/index.js';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware.js';
import { userRouter } from './routers/user.routes.js';
import { roleRouter } from './routers/role.routes.js';
import { authRouter } from './routers/auth.routes.js';
const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/role", roleRouter);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
});