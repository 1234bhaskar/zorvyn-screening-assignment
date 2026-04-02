import express from 'express';
import { serverConfig } from './config/index.js';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware.js';
import { apiRouter } from './routers/index.routes.js';
const app = express();

app.use(express.json());
app.use("/api/v1", apiRouter);


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
});