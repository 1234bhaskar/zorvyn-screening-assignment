# Zorvyn Fintech — Financial Records Management API

A RESTful API for managing financial records (income & expenses) with role-based access control, built as a screening assignment for **Zorvyn**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Roles](#roles)
  - [Records](#records)
  - [Dashboard](#dashboard)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Request / Response Format](#request--response-format)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Assumptions](#assumptions)
- [Tradeoffs & Design Decisions](#tradeoffs--design-decisions)

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Runtime      | Node.js (ESM)                       |
| Language     | TypeScript 6                        |
| Framework    | Express 5                           |
| ORM          | Drizzle ORM                         |
| Database     | PostgreSQL (via Supabase)           |
| Auth         | JWT (`jsonwebtoken`) + bcrypt       |
| Validation   | Zod                                 |
| Dev tooling  | tsx (watch mode), drizzle-kit       |

---

## Project Architecture

The codebase follows a **layered architecture** pattern for clear separation of concerns:

```
src/
├── config/            # Environment & server configuration
├── constant/          # Enums & constant values (roles, record types/categories)
├── controllers/       # Request handlers — parse input, call services, send response
├── db/                # Database connection (postgres-js) & Drizzle schema
├── dto/               # Data Transfer Objects (shape data returned to clients)
├── interface/         # TypeScript interfaces (pagination, record rows, etc.)
├── middlewares/       # Auth (JWT verification, RBAC) & error-handling middleware
├── repositories/      # Data-access layer — all Drizzle queries live here
├── routers/           # Express route definitions, wired to middleware & controllers
├── services/          # Business logic — orchestrates repositories & utils
├── types/             # Express type augmentations (e.g. req.user)
├── utils/             # Helpers: JWT generation, password hashing, query filters
│   └── errors/        # Custom AppError classes (400, 401, 403, 404, 409, 500, 501)
└── validators/        # Zod schemas for request body & query-param validation
```

**Data flow:** `Router → Middleware → Controller → Service → Repository → Database`

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- A running **PostgreSQL** instance (or a Supabase project)

### Installation

```bash
git clone <repo-url>
cd zorvyn_assignment
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following keys:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
JWT_SECRET="<your-strong-secret>"
PORT=3001          # optional, defaults to 3001
```

> **Note:** Never commit real credentials to version control. The `.env` file is already in `.gitignore`.

### Database Setup

Drizzle Kit is used for schema management. Push the schema to your database:

```bash
# Generate migration files (optional, for migration-based workflow)
npm run db:generate

# Push schema directly to the database
npm run db:push

# Or run migrations
npm run db:migrate
```

#### Seed Roles

Before registering users, create the required roles by calling the **Create Role** endpoint (see [Roles API](#roles)) for each role: `admin`, `analyst`, `viewer`.

### Running the Server

```bash
# Development (hot-reload via tsx)
npm run dev

# Production
npm run build
npm start
```

The server starts at `http://localhost:3001` (or the `PORT` defined in `.env`).

---

## API Reference

**Base URL:** `/api/v1`

All endpoints return JSON. Protected endpoints require a `Bearer` token in the `Authorization` header.

---

### Authentication

| Method | Endpoint              | Auth | Description            |
| ------ | --------------------- | ---- | ---------------------- |
| POST   | `/api/v1/auth/register` | ✗    | Register a new user    |
| POST   | `/api/v1/auth/login`    | ✗    | Log in & receive a JWT |

#### POST `/api/v1/auth/register`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "password": "Secret@123"
}
```

- `name` — 3–100 characters
- `email` — valid email
- `age` — 18–100
- `password` — 6–20 characters; must include uppercase, lowercase, digit, and special character (`@$!%*?&`)

New users are assigned the **Viewer** role by default.

#### POST `/api/v1/auth/login`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "Secret@123"
}
```

> **Note:** If the user account has been deactivated by an admin, login will be rejected with a `403 Forbidden` error.

**Response** (200):

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "age": 25, "role": "viewer" },
    "token": "<jwt>"
  }
}
```

---

### Users

| Method | Endpoint                       | Auth | Role    | Description                     |
| ------ | ------------------------------ | ---- | ------- | ------------------------------- |
| GET    | `/api/v1/user/my-profile`      | ✓    | Any     | Get authenticated user's profile |
| PUT    | `/api/v1/user/:id/status`      | ✓    | Admin   | Activate / deactivate a user     |
| PUT    | `/api/v1/user/:uuid/role`      | ✓    | Admin   | Assign a role to a user          |

#### PUT `/api/v1/user/:id/status`

```json
{ "status": "active" }       // or "inactive"
```

#### PUT `/api/v1/user/:uuid/role`

```json
{ "role": "analyst" }         // "admin" | "analyst" | "viewer"
```

---

### Roles

| Method | Endpoint          | Auth | Role  | Description      |
| ------ | ----------------- | ---- | ----- | ---------------- |
| POST   | `/api/v1/role`    | ✓    | Admin | Create a new role |

**Body:**

```json
{ "name": "admin" }
```

---

### Records

| Method | Endpoint               | Auth | Role                    | Description                          |
| ------ | ---------------------- | ---- | ----------------------- | ------------------------------------ |
| POST   | `/api/v1/record`       | ✓    | Admin                   | Create a financial record            |
| PUT    | `/api/v1/record/:id`   | ✓    | Admin                   | Update a record                      |
| DELETE | `/api/v1/record/:id`   | ✓    | Admin                   | Soft-delete a record                 |
| GET    | `/api/v1/record`       | ✓    | Admin, Analyst          | List records (with filters & pagination) |

#### POST `/api/v1/record`

```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

- `type` — `"income"` | `"expense"`
- `category` — `salary`, `rent`, `food`, `utilities`, `healthcare`, `transportation`, `entertainment`, `bills`, `investment`, `other`
- `amount` — 0 – 1,000,000,000
- `notes` — optional, max 255 chars

#### PUT `/api/v1/record/:id`

All fields are optional (partial update):

```json
{
  "amount": 5500,
  "type": "income",
  "category": "salary",
  "notes": "Revised April salary"
}
```

#### DELETE `/api/v1/record/:id`

Performs a **soft delete** — sets `deletedAt` timestamp; the record is excluded from future queries.

#### GET `/api/v1/record`

**Query Parameters:**

| Param      | Type     | Default | Description                        |
| ---------- | -------- | ------- | ---------------------------------- |
| `type`     | string   | —       | Filter by `income` or `expense`    |
| `category` | string   | —       | Filter by category                 |
| `from`     | date     | —       | Start date (`YYYY-MM-DD`)          |
| `to`       | date     | —       | End date (`YYYY-MM-DD`)            |
| `page`     | integer  | 1       | Page number                        |
| `limit`    | integer  | 20      | Records per page (max 100)         |

**Response** includes pagination metadata:

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": {
    "data": [ /* records */ ],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### Dashboard

All dashboard endpoints require authentication and are accessible to **Admin**, **Analyst**, and **Viewer** roles.

| Method | Endpoint                           | Description                               |
| ------ | ---------------------------------- | ----------------------------------------- |
| GET    | `/api/v1/dashboard/summary`        | Total income, expenses, and net balance   |
| GET    | `/api/v1/dashboard/category`       | Totals grouped by category                |
| GET    | `/api/v1/dashboard/recent`         | Most recent records                       |
| GET    | `/api/v1/dashboard/weekly-trends`  | Weekly income vs. expense trends (12 weeks) |

#### GET `/api/v1/dashboard/category`

| Param  | Type   | Description                         |
| ------ | ------ | ----------------------------------- |
| `type` | string | Optional — filter by `income` or `expense` |

#### GET `/api/v1/dashboard/recent`

| Param   | Type    | Description                   |
| ------- | ------- | ----------------------------- |
| `limit` | integer | Number of recent records      |

---

## Role-Based Access Control (RBAC)

Three roles govern what a user can do:

| Role       | Permissions                                                    |
| ---------- | -------------------------------------------------------------- |
| **Admin**  | Full access — CRUD records, manage users/roles, view dashboard |
| **Analyst** | Read-only — view records and dashboard                        |
| **Viewer** | Read-only — view dashboard only (no access to raw records)     |

- New users are automatically assigned the **Viewer** role upon registration.
- Only **Admin** users can promote/demote roles or activate/deactivate accounts.
- Authorization is enforced via the `hasRole(...allowedRoles)` middleware which checks the role embedded in the JWT against the allowed list.
- Deactivated users are rejected at login with a `403 Forbidden` response.

---

## Request / Response Format

### Consistent Response Envelope

Every response follows a uniform shape:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { /* payload */ }
}
```

### Authentication Header

```
Authorization: Bearer <jwt-token>
```

---

## Validation

All incoming data is validated using **Zod** schemas before reaching the controller:

- **Request bodies** are validated via `validateRequestBody(schema)` middleware.
- **Query parameters** are validated via `validateQueryParams(schema)` middleware.
- Invalid input results in a detailed error response with field-level messages.

---

## Error Handling

Custom `AppError` classes map to standard HTTP status codes:

| Error Class            | Status Code | Use Case                        |
| ---------------------- | ----------- | ------------------------------- |
| `BadRequestError`      | 400         | Invalid input / validation fail |
| `UnauthorizedError`    | 401         | Missing or invalid JWT          |
| `ForbiddenError`       | 403         | Insufficient role permissions   |
| `NotFoundError`        | 404         | Resource not found              |
| `ConflictError`        | 409         | Duplicate / state conflict      |
| `InternalServerError`  | 500         | Unexpected server errors        |
| `NotImplementedError`  | 501         | Stub / unfinished feature       |

Two error-handling middlewares are registered at the end of the middleware chain:
1. **`appErrorHandler`** — catches known `AppError` instances and returns the appropriate status code + message.
2. **`genericErrorHandler`** — catches everything else and returns `500 Internal Server Error`.

---

## Assumptions

1. **Single-tenant system** — all records belong to a shared dataset; there is no per-user scoping of financial records. Any authenticated user with the right role can view all records.
2. **Role seeding** — the three roles (`admin`, `analyst`, `viewer`) must be created manually via the API before registering users, as the registration flow expects the `viewer` role to already exist.
3. **PostgreSQL** — the application is designed exclusively for PostgreSQL (uses `pgEnum`, `DATE_TRUNC`, `INTERVAL`, etc.).
4. **Soft deletes** — records are never physically removed; a `deletedAt` timestamp is set, and all queries filter out soft-deleted rows.
5. **JWT-only auth** — no refresh tokens or session management; the access token is the sole mechanism for authentication.
6. **Amount precision** — financial amounts are stored as `NUMERIC(12, 2)` to avoid floating-point issues, supporting values up to 9,999,999,999.99.
7. **Date handling** — record dates are stored as `DATE` (no timezone) and accepted as `YYYY-MM-DD` strings.
8. **Inactive accounts** — deactivated users are blocked at login time (not at the middleware level); an existing JWT remains valid until it expires even if the account is deactivated after issuance.

---

## Tradeoffs & Design Decisions

| Decision | Rationale | Tradeoff |
| -------- | --------- | -------- |
| **Drizzle ORM** over raw SQL | Type-safe queries, auto-completion, and schema-as-code reduce runtime bugs. | Slightly less flexibility for very complex SQL; some queries (weekly trends) still require `sql` template literals. |
| **Layered architecture** (Controller → Service → Repository) | Clear separation of concerns makes each layer independently testable and replaceable. | More files/boilerplate for simple CRUD ops compared to a flat handler approach. |
| **Zod validation at the middleware level** | Fail fast before business logic runs; schemas serve as living documentation. | Requires maintaining schemas in sync with the DB schema manually. |
| **Soft deletes** | Preserves audit trail and allows recovery of accidentally deleted records. | Increases query complexity (every query must filter `deletedAt IS NULL`); storage grows indefinitely. |
| **Role stored in JWT** | Avoids a DB lookup on every request for role checking. | If a user's role is changed, the old JWT still carries the previous role until it expires. |
| **Composite DB indexes** | `idx_records_type_date`, `idx_records_category_date`, and `idx_records_full_filter` accelerate common dashboard and filter queries. | Additional write overhead and storage for index maintenance. |

---

## npm Scripts

| Script           | Description                               |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start dev server with hot-reload (tsx)    |
| `npm run build`  | Compile TypeScript to `dist/`             |
| `npm start`      | Run the compiled production build         |
| `npm run db:generate` | Generate Drizzle migration files     |
| `npm run db:push`     | Push schema directly to the database |
| `npm run db:migrate`  | Run pending migrations               |


