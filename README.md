# TaskFlow — Modern Task Management Application

TaskFlow is a production-style, portfolio-ready full-stack task management web application. It features a robust RESTful API built with Node.js, Express, MongoDB, and Mongoose, coupled with a clean, responsive single-page application built with React and Vite.

The project is intentionally structured following clean architecture principles and container-readiness standards so that it can be effortlessly containerized with Docker and deployed to container orchestration platforms like AWS ECS Fargate.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture & Request Flow](#2-architecture--request-flow)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Prerequisites](#5-prerequisites)
6. [Getting Started & Installation](#6-getting-started--installation)
7. [Environment Variables](#7-environment-variables)
8. [MongoDB Setup](#8-mongodb-setup)
9. [API Documentation](#9-api-documentation)
10. [Authentication Flow](#10-authentication-flow)
11. [Running Tests](#11-running-tests)
12. [Docker & Cloud Readiness](#12-docker--cloud-readiness)
13. [Design Decisions](#13-design-decisions)

---

## 1. Overview

TaskFlow allows users to securely register, log in, organize their daily work, and track task progress through an intuitive dashboard.

Key capabilities include:
- **JWT-based Authentication**: Secure user registration, credential hashing with bcrypt (12 salt rounds), token expiration, and route protection.
- **Task Management CRUD**: Full lifecycle management with title, description, status (`pending`, `in-progress`, `completed`), priority (`low`, `medium`, `high`), and due dates.
- **Search & Filter Pipeline**: Case-insensitive search on task titles, multi-criteria filtering by status and priority, and server-side pagination.
- **Analytics & Aggregations**: Real-time dashboard statistics calculated via MongoDB aggregation pipelines (total, status breakdowns, priority counts, and overdue tasks).
- **Comprehensive Health Checks**: Specialized endpoints (`/health` and `/health/db`) verifying service availability and active database connectivity.

---

## 2. Architecture & Request Flow

TaskFlow adheres to a strict separation of concerns using a layered clean architecture pattern:

```
[ Client: React SPA ]
        │  HTTP (JSON + Bearer Token)
        ▼
[ Security & Middleware Pipeline ]
   ├── Helmet (Security Headers)
   ├── CORS Configuration
   ├── Express Rate Limiter (Brute-force protection)
   ├── Morgan Request Logger (Structured stdout logs)
   └── Express JSON & URL-Encoded Body Parsers
        │
        ▼
   [ Router Layer ] ──────────────► [ Authentication Middleware ]
   (src/routes/)                     (Verifies JWT & loads user)
        │
        ▼
   [ Controller Layer ] ──────────► [ Request Validator ]
   (src/controllers/)                (express-validator schemas)
        │
        ▼
   [ Service Layer ]
   (src/services/) ─── Pure business logic & orchestration
        │
        ▼
   [ Data Models Layer ]
   (src/models/) ───── Mongoose Schemas, Hooks & Indexes
        │
        ▼
   [ MongoDB Database ]
```

### Error Handling Flow
All asynchronous controllers utilize `try/catch` blocks forwarding errors to `next(error)`. The centralized error handling middleware (`src/middleware/errorHandler.js`) normalizes:
- Mongoose validation errors (`400 Bad Request`)
- Malformed MongoDB ObjectIDs (`400 Bad Request`)
- Duplicate key collisions (`409 Conflict`)
- JWT authentication/expiration errors (`401 Unauthorized`)
- Operational errors via custom `AppError`
- Uncaught server errors (`500 Internal Server Error`)

All error responses follow the standard format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## 3. Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v4.21+)
- **Database**: MongoDB (v6+) via Mongoose (v8.6+) ODM
- **Security**: Helmet, CORS, express-rate-limit, bcryptjs
- **Authentication**: JSON Web Tokens (jsonwebtoken)
- **Validation**: express-validator
- **Logging**: Morgan
- **Testing**: Jest, Supertest, mongodb-memory-server

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **Styling**: Modern responsive CSS using CSS Custom Properties (Variables), Flexbox, and CSS Grid (zero bloated external UI frameworks)
- **Icons & Theme**: Custom SaaS dashboard aesthetic with accessible contrast and responsive layouts

---

## 4. Project Structure

```
docker-ecs-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection handler
│   │   │   └── index.js             # Environment variables & runtime validation
│   │   ├── controllers/
│   │   │   ├── authController.js    # HTTP handlers for register, login, me
│   │   │   └── taskController.js    # HTTP handlers for task operations & stats
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification middleware
│   │   │   ├── errorHandler.js      # Centralized error & 404 middleware
│   │   │   └── validate.js          # express-validator result handler
│   │   ├── models/
│   │   │   ├── Task.js              # Task schema, indexes & enums
│   │   │   └── User.js              # User schema, password hashing & comparison
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoint definitions
│   │   │   ├── healthRoutes.js      # /health & /health/db endpoints
│   │   │   └── taskRoutes.js        # CRUD & stats task routes
│   │   ├── services/
│   │   │   ├── authService.js       # User creation, authentication logic
│   │   │   └── taskService.js       # Task queries, aggregations, mutations
│   │   ├── utils/
│   │   │   ├── AppError.js          # Custom operational error class
│   │   │   └── response.js          # Standardized response helper methods
│   │   ├── app.js                   # Express application setup & middleware stack
│   │   └── server.js                # Server entry point & graceful shutdown
│   ├── tests/
│   │   ├── auth.test.js             # Auth integration tests
│   │   ├── health.test.js           # Health endpoint integration tests
│   │   ├── setup.js                 # In-memory MongoDB test environment
│   │   └── tasks.test.js            # Task CRUD & stats integration tests
│   ├── .env.example
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js            # Fetch wrapper with auto-auth & error handling
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Responsive navbar, user menu & content container
│   │   │   └── ProtectedRoute.jsx   # Route guard redirecting unauthorized users
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # React context for auth state & actions
│   │   ├── pages/
│   │   │   ├── CreateTaskPage.jsx   # Form to create new tasks
│   │   │   ├── DashboardPage.jsx    # Analytics cards, search, filters & task list
│   │   │   ├── EditTaskPage.jsx     # Task edit page pre-filled with data
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   ├── NotFoundPage.jsx     # 404 error page
│   │   │   └── RegisterPage.jsx     # Registration page
│   │   ├── App.jsx                  # Main routing definition
│   │   ├── index.css                # Global responsive modern CSS stylesheet
│   │   └── main.jsx                 # Vite application entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js               # Dev server configuration & proxy settings
└── README.md
```

---

## 5. Prerequisites

Before running the application locally, ensure you have:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (or a cloud MongoDB Atlas URI)

---

## 6. Getting Started & Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd docker-ecs-app
```

### Step 2: Configure and Start the Backend
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start in development mode (hot-reload via nodemon)
npm run dev
```
The backend API starts on `http://localhost:3000` (binding to `0.0.0.0:3000`).

### Step 3: Configure and Start the Frontend
In a separate terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional in development; Vite proxies to localhost:3000 by default)
cp .env.example .env

# Start Vite development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 7. Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP port the Express server listens on |
| `NODE_ENV` | No | `development` | Environment mode (`development`, `production`, `test`) |
| `MONGO_URI` | Yes | `mongodb://localhost:27017/taskflow` | Connection string for MongoDB instance |
| `JWT_SECRET` | Yes (in prod) | *dev default* | Cryptographic secret key used to sign JWTs |
| `JWT_EXPIRES_IN` | No | `7d` | Token validity duration (`1d`, `7d`, `24h`) |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin URL (e.g. `http://localhost:5173`) |

### Frontend Configuration (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `TASKFLOW_API_URL` | No | `http://localhost:3000` | Backend API base URL. Used by Next.js server (Vercel) to proxy `/api/*` and `/health` requests to the actual backend URL. Set this to your backend's IP/domain (e.g., `http://16.113.163.105:3000`) for production deployment. |

---

## 8. MongoDB Setup

You can run MongoDB locally or use MongoDB Atlas.

### Option A: Local MongoDB Service
On Linux / macOS:
```bash
# Verify MongoDB service is running
sudo systemctl status mongod
# Or start the service
sudo systemctl start mongod
```
Your connection string in `backend/.env` will be:
```env
MONGO_URI=mongodb://localhost:27017/taskflow
```

### Option B: MongoDB Atlas (Cloud)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your IP in Network Access.
3. Obtain the connection string and paste it into `backend/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/taskflow?retryWrites=true&w=majority
```

---

## 9. API Documentation

### Response Standards

**Success Format:**
```json
{
  "success": true,
  "data": ...
}
```

**Error Format:**
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

### Health Checks

#### 1. System Health
- **Endpoint**: `GET /health`
- **Auth Required**: No
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "service": "taskflow-api",
  "timestamp": "2026-10-03T10:15:30.123Z",
  "uptime": 124.52
}
```

#### 2. Database Health
- **Endpoint**: `GET /health/db`
- **Auth Required**: No
- **Response (Connected)**: `200 OK`
```json
{
  "status": "healthy",
  "service": "taskflow-api",
  "database": "connected"
}
```
- **Response (Disconnected)**: `503 Service Unavailable`
```json
{
  "status": "unhealthy",
  "service": "taskflow-api",
  "database": "disconnected"
}
```

---

### Authentication Endpoints

#### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Auth Required**: No
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "67015a9994c6cd14309a0101",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-10-03T10:00:00.000Z",
      "updatedAt": "2026-10-03T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "67015a9994c6cd14309a0101",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-10-03T10:00:00.000Z",
      "updatedAt": "2026-10-03T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "67015a9994c6cd14309a0101",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-10-03T10:00:00.000Z",
    "updatedAt": "2026-10-03T10:00:00.000Z"
  }
}
```

---

### Task Management Endpoints

All task routes require the header: `Authorization: Bearer <token>`

#### 1. Create Task
- **Endpoint**: `POST /api/tasks`
- **Request Body**:
```json
{
  "title": "Design Database Schema",
  "description": "Establish collections, relations, and compound indexes",
  "priority": "high",
  "status": "in-progress",
  "dueDate": "2026-10-15T00:00:00.000Z"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "67015b1094c6cd14309a0102",
    "title": "Design Database Schema",
    "description": "Establish collections, relations, and compound indexes",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-10-15T00:00:00.000Z",
    "userId": "67015a9994c6cd14309a0101",
    "createdAt": "2026-10-03T10:05:00.000Z",
    "updatedAt": "2026-10-03T10:05:00.000Z"
  }
}
```

#### 2. Get All Tasks (with Filtering, Search & Pagination)
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `status`: `pending`, `in-progress`, `completed`
  - `priority`: `low`, `medium`, `high`
  - `search`: Filter task title (case-insensitive regex)
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `10`, max: `100`)
- **Example Request**: `GET /api/tasks?status=in-progress&priority=high&search=schema&page=1&limit=10`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "67015b1094c6cd14309a0102",
        "title": "Design Database Schema",
        "description": "Establish collections, relations, and compound indexes",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2026-10-15T00:00:00.000Z",
        "userId": "67015a9994c6cd14309a0101",
        "createdAt": "2026-10-03T10:05:00.000Z",
        "updatedAt": "2026-10-03T10:05:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 1,
      "limit": 10
    }
  }
}
```

#### 3. Get Single Task
- **Endpoint**: `GET /api/tasks/:id`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "67015b1094c6cd14309a0102",
    "title": "Design Database Schema",
    "description": "Establish collections, relations, and compound indexes",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-10-15T00:00:00.000Z",
    "userId": "67015a9994c6cd14309a0101",
    "createdAt": "2026-10-03T10:05:00.000Z",
    "updatedAt": "2026-10-03T10:05:00.000Z"
  }
}
```

#### 4. Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Request Body** (all fields optional):
```json
{
  "status": "completed"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "67015b1094c6cd14309a0102",
    "title": "Design Database Schema",
    "description": "Establish collections, relations, and compound indexes",
    "status": "completed",
    "priority": "high",
    "dueDate": "2026-10-15T00:00:00.000Z",
    "userId": "67015a9994c6cd14309a0101",
    "createdAt": "2026-10-03T10:05:00.000Z",
    "updatedAt": "2026-10-03T10:10:00.000Z"
  }
}
```

#### 5. Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```

#### 6. Dashboard Statistics
- **Endpoint**: `GET /api/tasks/stats`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 12,
    "pending": 4,
    "inProgress": 3,
    "completed": 5,
    "highPriority": 2,
    "byPriority": {
      "low": 4,
      "medium": 6,
      "high": 2
    },
    "overdue": 1
  }
}
```

---

## 10. Authentication Flow

1. **Registration/Login**: The user submits credentials to `POST /api/auth/register` or `POST /api/auth/login`.
2. **Token Generation**: The server verifies credentials (or hashes password with bcrypt on signup) and returns a signed JSON Web Token containing the user's ID as payload.
3. **Client Storage**: The frontend stores the token securely in browser `localStorage`.
4. **Subsequent Invocations**: The frontend API client automatically attaches the header `Authorization: Bearer <token>` to all protected requests.
5. **Server Verification**: The auth middleware (`src/middleware/auth.js`) intercepts the request, verifies the signature using `JWT_SECRET`, checks if the user still exists in MongoDB, and attaches `req.user` to the request object.
6. **Automatic Logout on Expiration**: If the API returns a `401 Unauthorized` status (e.g. expired token), the client client automatically purges `localStorage` and routes the user back to `/login`.

---

## 11. Running Tests

The test suite validates authentication, health endpoints, task CRUD, and statistics using an isolated, in-memory MongoDB server (`mongodb-memory-server`) to ensure fast, deterministic tests without touching your development database.

Execute all tests from the `backend/` directory:
```bash
cd backend
npm test
```

### Test Coverage Highlights:
- **Health Suite** (`tests/health.test.js`):
  - `GET /health` service availability status
  - `GET /health/db` database connection check
- **Auth Suite** (`tests/auth.test.js`):
  - User registration and JWT issuance
  - Duplicate email collision handling (`409 Conflict`)
  - Missing and invalid field validations
  - Login credential verification and incorrect password rejection
  - Protected route access verification via `GET /api/auth/me`
- **Task Suite** (`tests/tasks.test.js`):
  - Task creation and schema validation
  - Unauthenticated access denial
  - User-scoped task filtering by status and search by title
  - Retrieving and updating individual tasks
  - Deleting tasks and handling 404s for nonexistent/already-deleted tasks
  - Aggregation pipeline statistics calculation

---

## 12. Docker & Cloud Readiness

Although Dockerfiles and deployment manifests are intentionally decoupled from this repository, TaskFlow is pre-architected for containerization and AWS ECS Fargate deployment:

1. **`0.0.0.0` Host Binding**: In `src/server.js`, `app.listen(config.PORT, '0.0.0.0')` ensures the HTTP listener accepts inbound traffic from container bridges and AWS Application Load Balancers (ALBs).
2. **Environment Variable Ingestion**: All configuration parameters (ports, secrets, database connection URIs) are loaded strictly via `process.env`.
3. **Stateless Container Design**: No files, uploaded assets, or session state are stored on the container's local ephemeral filesystem.
4. **Container-Friendly Logging**: Structured HTTP and operational logs are streamed directly to `stdout` and `stderr` via Morgan, ensuring compatibility with AWS CloudWatch Logs and Docker log drivers.
5. **Graceful Shutdown**:
   - The application listens for `SIGTERM` (sent by ECS task stops or Docker stop) and `SIGINT`.
   - Incoming HTTP traffic is ceased immediately.
   - Active in-flight requests finish processing.
   - The Mongoose connection pool closes gracefully with `mongoose.connection.close()`.
   - The process exits cleanly with code `0`.
6. **Fail-Fast Initialization**: If MongoDB cannot be reached during application startup, the application exits immediately with code `1`, allowing orchestrators (ECS, Docker health monitors) to mark the container unhealthy and restart.

---

## 13. Design Decisions

- **Layered Architecture (Routes -> Controllers -> Services -> Models)**: Keeps controllers lightweight by isolating request/response marshaling from business logic. Services are independent functions that can be tested in isolation or reused across alternative interfaces (e.g. background workers or GraphQL).
- **Custom CSS over Heavy UI Libraries**: The frontend utilizes modern CSS custom properties and flexible layouts. This avoids heavy external design libraries, keeps the bundle under ~180 KB, and delivers blazing load times.
- **In-Memory MongoDB for Testing**: Avoids external dependencies during CI/CD or local test runs. Each test runs against clean, ephemeral database state.
- **Rate Limiting**: Protects against brute-force attacks and denial-of-service attempts by throttling requests per IP address over sliding time windows.
- **Compound Database Indexes**: Added compound index `{ userId: 1, status: 1 }` and sorted index `{ userId: 1, createdAt: -1 }` on the Task model to ensure fast pagination and query performance as dataset sizes scale.
# Docker-ECS-App
# Docker-ECS-App
