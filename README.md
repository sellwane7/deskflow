# DeskFlow — Internal IT Service Request Portal

A full-stack ticketing system for employees to report IT issues and admins to
manage resolutions. Built with React, Node.js/Express, and MongoDB (Mongoose).

## Stack

- **Frontend:** React (functional components + Hooks + Context API)
- **Backend:** Node.js + Express
- **Database:** MongoDB via Mongoose
- **Auth:** JWT (role: `Employee` | `Admin`)
- **Docs:** OpenAPI/Swagger UI (`/api-docs`) + Postman collection (`postman_collection.json`)

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB connection (local or MongoDB Atlas)

### Backend
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET
npm run seed                # creates demo Employee + Admin users
npm run dev                 # starts on http://localhost:5000
```
Swagger UI: **http://localhost:5000/api-docs**

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start                   # starts on http://localhost:3000
```

### Demo credentials

| Role     | Email                  | Password    |
|----------|--------------------------|-------------|
| Employee | employee@deskflow.com  | password123 |
| Admin    | admin@deskflow.com     | password123 |

## API summary

| Method | Route              | Access         | Description                              |
|--------|----------------------|----------------|--------------------------------------------|
| POST   | /api/auth/login     | Public         | Returns JWT + user role                   |
| POST   | /api/tickets        | Employee       | Create a ticket                           |
| GET    | /api/tickets        | Employee/Admin | Employees see own tickets, Admins see all |
| PUT    | /api/tickets/:id    | Admin          | Update ticket status                      |

## Testing the API

- **Swagger UI** at `/api-docs` — interactive, in-browser testing
- **Postman collection** (`postman_collection.json`) — import into Postman; includes
  a `baseUrl` variable and test scripts that auto-capture Employee/Admin JWTs and
  the last created ticket ID.