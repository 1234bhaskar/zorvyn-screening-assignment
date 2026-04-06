import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Zorvyn Finance Tracker API',
            version: '1.0.0',
            description:
                'A Role-Based Financial Records Management API built with Express, Drizzle ORM, and PostgreSQL. ' +
                'Supports user authentication (JWT), RBAC (Admin, Analyst, Viewer), and CRUD operations on financial records with dashboard analytics.',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: '/api/v1',
                description: 'API v1',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token obtained from the /auth/login endpoint',
                },
            },
            schemas: {
                // ── Reusable enums ──
                RecordType: {
                    type: 'string',
                    enum: ['income', 'expense'],
                },
                RecordCategory: {
                    type: 'string',
                    enum: [
                        'salary',
                        'rent',
                        'food',
                        'utilities',
                        'healthcare',
                        'transportation',
                        'entertainment',
                        'bills',
                        'investment',
                        'other',
                    ],
                },
                RoleName: {
                    type: 'string',
                    enum: ['admin', 'analyst', 'viewer'],
                },

                // ── Request Bodies ──
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'age', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 100,
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                        },
                        age: {
                            type: 'integer',
                            minimum: 18,
                            maximum: 100,
                            example: 25,
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            maxLength: 20,
                            description:
                                'Must contain at least one uppercase, one lowercase, one digit, and one special character (@$!%*?&)',
                            example: 'Secret@123',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                        },
                        password: {
                            type: 'string',
                            example: 'Secret@123',
                        },
                    },
                },
                CreateRecordRequest: {
                    type: 'object',
                    required: ['amount', 'type', 'category', 'date'],
                    properties: {
                        amount: {
                            type: 'number',
                            minimum: 0,
                            maximum: 1000000000,
                            example: 5000,
                        },
                        type: { $ref: '#/components/schemas/RecordType' },
                        category: { $ref: '#/components/schemas/RecordCategory' },
                        date: {
                            type: 'string',
                            format: 'date',
                            example: '2026-04-01',
                        },
                        notes: {
                            type: 'string',
                            maxLength: 255,
                            example: 'Monthly salary',
                        },
                    },
                },
                UpdateRecordRequest: {
                    type: 'object',
                    properties: {
                        amount: {
                            type: 'number',
                            minimum: 0,
                            maximum: 1000000000,
                            example: 6000,
                        },
                        type: { $ref: '#/components/schemas/RecordType' },
                        category: { $ref: '#/components/schemas/RecordCategory' },
                        notes: {
                            type: 'string',
                            maxLength: 255,
                            example: 'Updated notes',
                        },
                    },
                },
                CreateRoleRequest: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 30,
                            pattern: '^[a-zA-Z]+$',
                            example: 'moderator',
                        },
                    },
                },
                AssignRoleRequest: {
                    type: 'object',
                    required: ['role'],
                    properties: {
                        role: { $ref: '#/components/schemas/RoleName' },
                    },
                },
                UpdateStatusRequest: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive'],
                            example: 'active',
                        },
                    },
                },

                // ── Response Bodies ──
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        error: { type: 'object' },
                    },
                },
                UserProfile: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        uuid: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        age: { type: 'integer', example: 25 },
                        role: { type: 'string', example: 'admin' },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Record: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        amount: { type: 'string', example: '5000.00' },
                        type: { type: 'string', example: 'income' },
                        category: { type: 'string', example: 'salary' },
                        date: { type: 'string', format: 'date', example: '2026-04-01' },
                        notes: { type: 'string', example: 'Monthly salary' },
                        userId: { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                PaginatedRecords: {
                    type: 'object',
                    properties: {
                        records: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Record' },
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer', example: 1 },
                                limit: { type: 'integer', example: 20 },
                                total: { type: 'integer', example: 100 },
                                totalPages: { type: 'integer', example: 5 },
                            },
                        },
                    },
                },
                DashboardSummary: {
                    type: 'object',
                    properties: {
                        totalIncome: { type: 'string', example: '50000.00' },
                        totalExpense: { type: 'string', example: '30000.00' },
                        netBalance: { type: 'string', example: '20000.00' },
                        totalRecords: { type: 'integer', example: 150 },
                    },
                },
                CategoryTotal: {
                    type: 'object',
                    properties: {
                        category: { type: 'string', example: 'salary' },
                        total: { type: 'string', example: '50000.00' },
                    },
                },
                WeeklyTrend: {
                    type: 'object',
                    properties: {
                        week: { type: 'string', example: '2026-W14' },
                        income: { type: 'string', example: '12000.00' },
                        expense: { type: 'string', example: '8000.00' },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: 'Missing or invalid authentication token',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Unauthorized Access',
                            },
                        },
                    },
                },
                ForbiddenError: {
                    description: 'Insufficient permissions',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'You do not have permission to perform this action',
                            },
                        },
                    },
                },
                ValidationError: {
                    description: 'Request validation failed',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Validation error',
                                error: [
                                    {
                                        field: 'email',
                                        message: 'Invalid email address',
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentication – register and login' },
            { name: 'Users', description: 'User profile, status, and role management' },
            { name: 'Roles', description: 'Role creation (Admin only)' },
            { name: 'Records', description: 'Financial record CRUD operations' },
            { name: 'Dashboard', description: 'Analytics and dashboard data' },
        ],
    },
    apis: ['./src/docs/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
