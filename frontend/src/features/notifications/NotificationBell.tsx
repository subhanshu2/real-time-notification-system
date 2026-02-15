import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from "./notificationSlice";
import { useEffect, useState, useRef } from "react";

import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import type { Notification } from "./notificationSlice";

export default function NotificationBell() {
  const dispatch = useAppDispatch();

  const { items, unreadCount, page, hasMore, loading } =
    useAppSelector((state) => state.notifications);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && items.length === 0) {
      dispatch(fetchNotifications(1));
    }
  }, [open]);

  // Infinite scroll handler
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !hasMore) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

    if (nearBottom && !loading) {
      dispatch(fetchNotifications(page));
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: { width: 350 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">
            Notifications
          </Typography>
        </Box>

        <Divider />

        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {items.length === 0 && (
            <MenuItem>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </MenuItem>
          )}

          {items.map((n: Notification) => (
            <MenuItem
              key={n.id}
              sx={{
                backgroundColor: n.isRead ? "white" : "#f0f7ff",
                display: "block",
                position: "relative",
                py: 1.5,
              }}
              onClick={() => {
                if (!n.isRead) {
                  dispatch(markAsRead(n.id));
                }
              }}
            >
              {!n.isRead && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                  }}
                />
              )}

              <Typography
                variant="body2"
                onClick={() => {
                  if (!n.isRead) {
                    dispatch(markAsRead(n.id));
                  }
                }}
                sx={{
                  cursor: "pointer",
                  pr: 3,
                }}
              >
                {n.message}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {new Date(n.createdAt).toLocaleString()}
                </Typography>

                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => dispatch(deleteNotification(n.id))}
                >
                  Delete
                </Typography>
              </Box>
            </MenuItem>
          ))}

          {!hasMore && items.length > 0 && (
            <Box sx={{ textAlign: "center", py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                End of list
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
}