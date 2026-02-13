import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;
    
    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const decoded = verifyToken(token) as {
        id: string;
        role: string;
      };


      socket.join(decoded.id);

      console.log("User connected:", decoded.id);
    } catch (err) {
      console.log("JWT verification failed:", err);
      socket.disconnect();
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};