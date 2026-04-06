/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get financial summary
 *     description: |
 *       Returns total income, total expenses, net balance, and the total number
 *       of financial records. Accessible by all authenticated roles.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Summary fetched successfully
 *                     data:
 *                       $ref: '#/components/schemas/DashboardSummary'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /dashboard/category:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get totals by category
 *     description: |
 *       Returns the total amount for each category, optionally filtered by
 *       record type (`income` or `expense`). Accessible by all authenticated roles.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/RecordType'
 *         description: Filter by record type
 *     responses:
 *       200:
 *         description: Category totals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Category totals fetched successfully
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CategoryTotal'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /dashboard/recent:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent activity
 *     description: |
 *       Returns the most recent financial records, ordered by creation date.
 *       Accessible by all authenticated roles.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of recent records to return
 *     responses:
 *       200:
 *         description: Recent activity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Recent activity fetched successfully
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Record'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /dashboard/weekly-trends:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get weekly income & expense trends
 *     description: |
 *       Returns aggregated income and expense totals grouped by week.
 *       Useful for visualising spending trends. Accessible by all authenticated roles.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       example: Weekly trends fetched successfully
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WeeklyTrend'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
