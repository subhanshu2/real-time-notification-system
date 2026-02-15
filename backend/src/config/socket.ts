import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      id: string;
      role: string;
    };
  };
}

export const initializeSocket = (io: Server) => {
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = verifyToken(token) as {
        id: string;
        role: string;
      };

      socket.data.user = decoded; // attach user
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const { id, role } = socket.data.user;

    socket.join(id);

    console.log("Authenticated user connected:", id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", id);
    });
  });
};