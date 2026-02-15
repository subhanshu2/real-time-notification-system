import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from "./notificationSlice";
import { useEffect, useState } from "react";

import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationBell() {
  const dispatch = useDispatch<any>();
  const { items, unreadCount, page, hasMore } = useSelector(
    (state: any) => state.notifications
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open && items.length === 0) {
      dispatch(fetchNotifications(1));
    }
  }, [open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">
            Notifications
          </Typography>
        </Box>

        <Divider />

        {items.length === 0 && (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        )}

        {items.map((n: any) => (
          <MenuItem
            key={n.id}
            sx={{
              backgroundColor: n.isRead ? "white" : "#f0f7ff",
              display: "block",
            }}
          >
            <Typography
              variant="body2"
              onClick={() => dispatch(markAsRead(n.id))}
              sx={{ cursor: "pointer" }}
            >
              {n.message}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {new Date(n.createdAt).toLocaleString()}
            </Typography>

            <Button
              size="small"
              color="error"
              onClick={() => dispatch(deleteNotification(n.id))}
            >
              Delete
            </Button>
          </MenuItem>
        ))}

        {hasMore && (
          <MenuItem>
            <Button
              fullWidth
              onClick={() => dispatch(fetchNotifications(page))}
            >
              Load More
            </Button>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}