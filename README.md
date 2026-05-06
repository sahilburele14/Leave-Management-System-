# Leave Management System

A full-stack modern Leave Management System with Employee and Admin dashboards, building using the React + Express + Mongoose stack.

## Architecture Explanation

This application follows a standard **Model-View-Controller (MVC) Architecture** integrated with a **Single Page Application (SPA)** framework.

- **Frontend:** React, React Router, Tailwind CSS. Data fetching is handled over REST APIs using Axios. Context API provides global state management for the Authentication flow (`AuthContext.tsx`). The layout adapts a dynamic sidebar depending on the global user role.
- **Backend:** Node.js, Express, and Mongoose for MongoDB. Features Role-Based Access Control (RBAC) configured seamlessly using JWT tokens. 
- **Database:** MongoDB. For zero-config out-of-the-box local execution, this project uses `mongodb-memory-server` if an external Mongo URI is not provided.

## AI Usage Explanation

AI Studio was utilized to assist in accelerating boilerplate generation, architecting security middleware logic, translating REST protocols seamlessly over Vite and Express simultaneously, creating production-grade modern Tailwind UI schemas, and managing database state constraints (overlapping date validations, automated balance reductions).

## Branch & Git Strategy

To maintain a healthy commit history, it's recommended to follow standard Git flow:
- `main` branch: Stable production-ready code.
- `feature/*` branches: Dedicated branches for developing features (e.g., `feature/leave-approval`).

**Sample minimum commit history:**
1. `init: Project setup and boilerplate configuration`
2. `feat: Implement backend models, auth flow, and JWT middleware`
3. `feat: Build frontend context, Layout, and routing logic`
4. `feat: Add Employee Dashboard, Leave application forms, and history view`
5. `feat: Admin panels for metrics and leave request approvals`

## Environment Files (`.env`)

```ini
# Generate a secret using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
JWT_SECRET="super_secret_key"
PORT=3000
MONGODB_URI="mongodb+srv://..." # Optional. Will fallback to in-memory locally.
```

## Setup & Run Instructions

Zero-config setup. The backend automatically boots an in-memory database and seeds a default Admin and Employee.

1. Install dependencies
```bash
npm install
```

2. Start the dev server (Vite + Express)
```bash
npm run dev
```

**Demo Credentials**:
- **Admin:** `admin@example.com` / `admin123`
- **Employee:** `employee@example.com` / `emp123`

## Deployment Guidelines
- Make sure to configure the `.env` variables securely via the platform secrets vault.
- Using Cloud Run or Vercel edge/node functions to deploy `server.ts` seamlessly with ES modules.
- Ensure to define `process.env.NODE_ENV=production` within your deployment parameters so the frontend builds and serves static files globally.
