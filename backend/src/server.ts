import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js"

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});