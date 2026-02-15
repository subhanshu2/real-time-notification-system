import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import toast from "react-hot-toast";

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  page: number;
  hasMore: boolean;
  loading: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  page: 1,
  hasMore: true,
  loading: false,
};

export interface CreateNotificationRequest {
   message: string,
   userId?: string,
}
export interface CreateNotifationResponse {
  data: { broadcastedTo: number }
  success: boolean
}

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (page: number) => {
    const res = await apiClient.get(
      `/notifications?page=${page}&limit=10`
    );
    return res.data;
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/read",
  async (id: string) => {
    await apiClient.patch(`/notifications/${id}/read`);
    return id;
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id: string) => {
    await apiClient.delete(`/notifications/${id}`);
    return id;
  }
);

export const createNotification = createAsyncThunk<CreateNotifationResponse, CreateNotificationRequest, { rejectValue: string }>(
  "notifications/create",
  async (data, { rejectWithValue }) => {
    try {
    const res = await apiClient.post("/notifications", data);
    if (!res.data.success) {
      return rejectWithValue(res.data.message);
    }
    return res.data;
    } catch(e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const exists = state.items.some(
        (n) => n.id === action.payload.id
      );

      if (!exists) {
        state.items.unshift(action.payload);
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false;
      if (action.meta.arg === 1) {
        state.items = action.payload.notifications;
      } else {
        state.items.push(...action.payload.notifications);
      }

      state.unreadCount = action.payload.unreadCount;
      state.hasMore = state.items.length < action.payload.total;
      state.page = action.meta.arg + 1;
    });

    builder.addCase(createNotification.rejected, (state, action) => {
      if (action.payload) {
        toast.error(action.payload);
      } else {
        toast.error("Failed to create notification");
      }
    });

    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount -= 1;
      }
    });

    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      const notif = state.items.find(n => n.id === action.payload);

      if (notif && !notif.isRead && state.unreadCount > 0) {
        state.unreadCount -= 1;
      }

      state.items = state.items.filter(n => n.id !== action.payload);
    });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;