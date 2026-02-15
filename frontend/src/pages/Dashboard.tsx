import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

export default function Dashboard() {
  const dispatch = useDispatch<any>();
  const user = useSelector((state: any) => state.auth.user);

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
        <Typography variant="h5">
          Welcome back
        </Typography>
      </Container>
    </>
  );
}