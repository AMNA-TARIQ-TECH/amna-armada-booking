# Booking System

This project is a full-stack booking management app that lets users manage services, create bookings, update booking status, and view dashboards from a clean React frontend connected to an Express + MongoDB backend.

## What the project does

The app is designed for service-based businesses and booking workflows. It supports:

- User sign-up and login
- JWT authentication
- Managing services (create, read, update, delete)
- Creating and editing bookings
- Updating booking status such as pending, confirmed, and cancelled
- Reminder settings for email/notification scheduling
- Dashboard-style views for service and booking management

## Tech stack

### Frontend

- React
- Vite
- TypeScript
- React Router

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- dotenv
- nodemon
- node-cron

## Project structure

```text
system-booking-app/
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── nodemon.json
│   └── README.md
├── frontend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+
- npm
- MongoDB running locally, or a MongoDB Atlas cluster
- A browser for the frontend app

## Database setup

This project uses MongoDB.

### Option 1: Local MongoDB

Start MongoDB locally:

```bash
mongod
```

Then use a connection string like:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/booking
```

### Option 2: MongoDB Atlas

Create a MongoDB Atlas cluster and set:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

## Environment setup

### Backend environment

Create a `.env` file inside the `backend` folder:

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000,http://localhost:3001
MONGODB_URI=mongodb://127.0.0.1:27017/booking
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### Frontend environment

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:4000/api
```

## Install dependencies

From the project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Seed demo data

This project includes a seed script to create a demo user and sample services/bookings.

Run:

```bash
cd backend
npm run seed
```

Demo login:

- Email: `amna@example.com`
- Password: `password123`

> There is no formal migration system in this project. The seed script is the way to initialize demo data.

## Run the app

### Start the backend

```bash
cd backend
npm run dev
```

Backend runs at:

```text
http://localhost:4000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```text
http://localhost:3001
```

## Main features to test

### 1. Register and login

- Open the frontend at `http://localhost:3001`
- Create a new account or log in with the seeded demo account
- Verify that the app redirects to the dashboard after authentication

### 2. Create and manage services

- Go to the services section
- Add a new service with name, duration, and description
- Edit or delete the service
- Confirm the service appears in the list

### 3. Create bookings

- Navigate to bookings
- Add a booking for a client
- Pick a date and service
- Save and confirm the booking is listed

### 4. update booking status

- Open a booking record
- Change status from pending to confirmed or cancelled
- Confirm the dashboard and list update correctly

### 5. Reminder settings

- Open settings
- Update reminder time preference
- Confirm the backend stores the value and the API responds properly

### 6. Health check

Call the backend endpoint:

```bash
curl http://localhost:4000/health
```

Expected result:

```json
{
  "success": true,
  "message": "OK"
}
```

## API overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Services

```http
GET /api/services
POST /api/services
GET /api/services/:id
PUT /api/services/:id
DELETE /api/services/:id
```

### Bookings

```http
GET /api/bookings
POST /api/bookings
GET /api/bookings/:id
PUT /api/bookings/:id
PATCH /api/bookings/:id/status
DELETE /api/bookings/:id
```

### Settings

```http
GET /api/settings/reminder
PUT /api/settings/reminder
```

## Live demo URLs

Use your deployed production URLs here once they are published:

- Live URL: https://amna-armada-booking-7wg37ps3v-minahs-projects-329ac757.vercel.app/

- `email`: amna@example.com
- `password`: password123

> Replace these placeholders with the actual deployed frontend and backend URLs from your hosting provider.

## Production notes

- Change `JWT_SECRET` to a strong value in production
- Use a real MongoDB connection string instead of a local development URI
- Set `FRONTEND_URL` to your deployed frontend domain in production
- If the frontend is deployed separately from the backend, set `VITE_API_URL` to the live backend URL

## License

This project is intended for internal or educational use unless otherwise specified by the project owner.
