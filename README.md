# Playstack EMS

A premium employee management workspace engineered to streamline corporate administration, staff hierarchies, and live operational metrics.

## Core Capabilities

* Structured Access Control: View and action permissions adjust automatically depending on user roles like Super Admin, HR Manager, or Employee.
* Active Metrics Dashboard: Displays resource distribution data including staff counts, operational status tracking, and department breakdowns.
* Advanced Personnel Grid: A dense directory table supporting instant search, department sorting, role filtering, pagination, and toast notification alerts for profile updates.
* Hierarchical Reporting Tree: Interactive visualization of management report chains powered by custom styled tree nodes.
* Adaptive Visual Themes: Global application toggle allowing users to switch instantly between a premium dark console appearance and a clean corporate light theme.

## System Architecture

Frontend Stack:
1. React with TypeScript and Vite
2. Material UI and Ant Design Systems
3. Axios and React Router

Backend Stack:
1. Node js with Express framework
2. MongoDB database with Mongoose templates
3. JSON Web Tokens for identity verification

## Development Setup

### Backend Server Setup
Navigate to the server directory, install the packages, configure your environment variables, and launch the development server:
```bash
cd backend
npm install
npm run dev


 Backend Server Setup

```bash
cd ems-frontend
npm install
npm run dev
```

## 🔗 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Authenticate user credentials | Public |
| `GET` | `/api/dashboard/stats` | Retrieve dashboard metrics and system statistics | Admin, HR |
| `GET` | `/api/employees` | Fetch employees with filtering and pagination | Authenticated |
| `GET` | `/api/employees/organization/tree` | Retrieve organizational hierarchy for tree visualization | Authenticated |