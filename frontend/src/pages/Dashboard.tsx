import { useEffect, useState } from "react";
import { fetchMe, logout } from "../features/auth/authSlice";
import { connectSocket, disconnectSocket } from "../services/socket";
import NotificationBell from "../features/notifications/NotificationBell";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { fetchNotifications } from "../features/notifications/notificationSlice";
import { TextField, Paper } from "@mui/material";
import { createNotification } from "../features/notifications/notificationSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [sending, setSending] = useState(false);

  console.log(user)

  useEffect(() => {
    const init = async () => {
      await dispatch(fetchMe());
      await dispatch(fetchNotifications(1));
      connectSocket();
    };

    init();

    return () => disconnectSocket();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    disconnectSocket();
    window.location.href = "/login";
  };

  const handleSendNotification = async () => {
    if (!message.trim()) return;

    setSending(true);

    await dispatch(
      createNotification({
        message,
        userId: targetUserId || undefined,
      })
    );

    setMessage("");
    setTargetUserId("");
    setSending(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            Real-Time Notifications
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <NotificationBell />

            <Box>
              <Typography variant="body2">
                {user?.email}
              </Typography>
              <Typography variant="caption">
                {user?.role}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>

        {user?.role === "ADMIN" ? (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Create Notification
            </Typography>

            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Target User ID (Leave empty for broadcast)"
              fullWidth
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              onClick={handleSendNotification}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Notification"}
            </Button>
          </Paper>
        ) : (
          <Typography variant="h5">
            Welcome back
          </Typography>
        )}
      </Container>
    </>
  );
}