import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { serverConfig } from './config/index.js';
import { swaggerSpec } from './config/swagger.js';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware.js';
import { apiRouter } from './routers/index.routes.js';
const app = express();

app.use(express.json());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Zorvyn API Docs',
}));
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use("/api/v1", apiRouter);


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
});