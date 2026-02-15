import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

interface Notification {
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
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  page: 1,
  hasMore: true,
};

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

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.items.push(...action.payload.notifications);
      state.unreadCount = action.payload.unreadCount;
      state.hasMore =
        state.items.length < action.payload.total;
      state.page += 1;
    });

    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount -= 1;
      }
    });

    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;