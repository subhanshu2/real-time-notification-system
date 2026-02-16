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

## Features
- JWT-based authentication
- Role-based access (Admin can broadcast notifications)
- Real-time notifications using Socket.io
- Persistent notification storage in PostgreSQL
- Retry mechanism for WebSocket delivery
- Unread notification count
- Infinite scroll
- Mark as read
- Delete notification