# Task Manager API

A simple, robust RESTful API for managing tasks, built with **Node.js**, **Express**, and **TypeScript**.  
This API allows users to create, read, update, and delete tasks, with support for filtering, pagination, and comprehensive error handling.  
All data is stored **in-memory** (no database required).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Task Endpoints](#task-endpoints)
  - [Other Endpoints](#other-endpoints)
- [Request & Response Format](#request--response-format)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Testing the API](#testing-the-api)

---

## Features

- CRUD operations for tasks (`create`, `read`, `update`, `delete`)
- Filter tasks by status (`pending`, `in-progress`, `completed`)
- Pagination support (`page`, `limit`)
- In-memory data storage (no database required)
- Centralized error handling with custom error classes
- Security and logging middleware (Helmet, CORS, Morgan, custom logger)
- Health check and API info endpoints
- TypeScript for type safety and maintainability

---

## Tech Stack

- **Node.js** (v18+ recommended)
- **Express** (v5+)
- **TypeScript**
- **uuid** (for unique task IDs)
- **Helmet** (security)
- **CORS** (cross-origin resource sharing)
- **Morgan** (HTTP request logging)
- **Winston** (custom logging)
- **dotenv** (environment variable management)
- **pnpm** (package manager, but npm/yarn also work)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd task_manager_api
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables)):

   ```
   NODE_ENV=development
   PORT=3300
   HOST=localhost
   CORS_ORIGIN=*
   ```

---

### Running the Server

- **Development mode (with auto-reload):**

  ```sh
  pnpm dev
  # or
  npm run dev
  # or
  yarn dev
  ```

- **Production build:**
  ```sh
  pnpm build
  node dist/server.js
  ```

The API will be available at:  
`http://localhost:3300/` (or your configured host/port)

---

## API Endpoints

### Task Endpoints

| Method | Endpoint     | Description                               |
| ------ | ------------ | ----------------------------------------- |
| GET    | `/tasks`     | List all tasks (with filter & pagination) |
| GET    | `/tasks/:id` | Get a specific task by ID                 |
| POST   | `/tasks`     | Create a new task                         |
| PUT    | `/tasks/:id` | Update a task                             |
| DELETE | `/tasks/:id` | Delete a task                             |

#### Query Parameters for `/tasks`

- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Task Object

```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string (optional)",
  "status": "pending | in-progress | completed",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

---

### Other Endpoints

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/`       | Root, API status |
| GET    | `/health` | Health check     |

---

## Request & Response Format

### Create Task

**POST** `/tasks`

**Request Body:**

```json
{
  "title": "My Task",
  "description": "Optional description",
  "status": "pending"
}
```

**Response:**

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "uuid",
    "title": "My Task",
    "description": "Optional description",
    "status": "pending",
    "createdAt": "2025-07-31T12:00:00.000Z",
    "updatedAt": "2025-07-31T12:00:00.000Z"
  }
}
```

### Error Response Example

```json
{
  "success": false,
  "status": 404,
  "message": "Task not found"
}
```

---

## Error Handling

- All errors are handled centrally and return a consistent JSON structure.
- Custom error classes for common HTTP errors (400, 401, 403, 404, 409, 503, etc.).
- 404 handler for unmatched routes.
- Example error response:
  ```json
  {
    "success": false,
    "status": 400,
    "message": "Title and status are required"
  }
  ```

---

## Environment Variables

| Variable    | Description                              | Default     |
| ----------- | ---------------------------------------- | ----------- |
| NODE_ENV    | Environment (`development`/`production`) | development |
| PORT        | Server port                              | 3300        |
| HOST        | Server host                              | localhost   |
| CORS_ORIGIN | Allowed CORS origins                     | \*          |

---

## Testing the API

### Using Postman

1. Import the provided `TaskManagerAPI.postman_collection.json` file into Postman.
2. Use the requests to test all endpoints.
3. For endpoints requiring a `taskId`, first create a task, then use its `id` in subsequent requests.
