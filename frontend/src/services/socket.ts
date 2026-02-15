import { io, Socket } from "socket.io-client";
import { store } from "../app/store";
import { addNotification } from "../features/notifications/notificationSlice";
import toast from "react-hot-toast";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (socket) {
    console.log("Socket already exists");
    return;
  }

  const token = localStorage.getItem("token");

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("notification", (data: any, ack: Function) => {
    console.log("Notification received:", data);

    // Update redux
    store.dispatch(addNotification(data));

    // Toast
    toast.success("New notification received");

    // Send ACK back to backend
    if (ack) {
      ack({ status: "received" });
    }
  });

  socket.on("connect_error", (err: any) => {
    console.error("Socket connection error:", err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
