# Real-Time Notification System

Scalable real-time notification platform built with React, Node.js, PostgreSQL, Socket.io and Redux.

## Tech Stack
- React (Vite)
- Redux Toolkit
- Material UI
- Node.js + Express
- PostgreSQL (Prisma ORM)
- Socket.io
- JWT Authentication

## Project Structure
- backend/
- frontend/

Both backend and frontend must be running.

## Backend Setup

1. Go to backend folder  
   cd backend  

2. Install dependencies  
   npm install  

3. Setup PostgreSQL database  
   Create a database and prepare your DATABASE_URL  

4. Create .env file from .env.sample  
   Add the following values:
   - DATABASE_URL=
   - JWT_SECRET=
   - PORT=

5. Run database migrations  
   npx prisma migrate dev  

6. Start backend server  
   npm run dev  

Backend will run on `http://localhost:<PORT>`

## Frontend Setup

1. Go to frontend folder  
   cd frontend  

2. Install dependencies  
   npm install  

3. Create .env.development from .env.sample  
   Add the following values:
   - VITE_API_BASE_URL=
   - VITE_SOCKET_URL=

   Both should point to backend URL.

4. Start frontend  
   npm run dev  

Frontend will run on `http://localhost:5173`

## Authentication

- Register: /register  
- Login: /login  
- Dashboard (Protected): /  

Users can register with:
- Name
- Email
- Password
- Confirm Password

After successful registration, users are redirected to the login page.

## Features
- User registration
- JWT-based authentication
- Role-based access (Admin can broadcast notifications)
- Real-time notifications using Socket.io
- Persistent notification storage in PostgreSQL
- Retry mechanism for WebSocket delivery
- Unread notification count
- Infinite scroll
- Mark as read
- Delete notification

## How It Works

1. Register a new user via /register.
2. Login using Admin credentials in one browser window.
3. Open an incognito window and login as a normal user.
4. From the Admin dashboard, create a new notification.
5. The normal user will receive the notification instantly in the notification bell via real-time WebSocket connection.
6. The notification is also stored in the database and can be marked as read or deleted.