import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "../features/auth/authSlice";
import { connectSocket, disconnectSocket } from "../services/socket";
import NotificationBell from "../features/notifications/NotificationBell";

export default function Dashboard() {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(fetchMe());
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>
      <NotificationBell />
    </div>
  );
}