import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { initializeSocket } from "./config/socket.js";


const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocket(io);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});