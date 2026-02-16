import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export interface LoginResponse {
  success: boolean;
  token: string
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
};

export const login = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  }
);

export const register = createAsyncThunk<
  { success: boolean },
  { name: string; email: string; password: string },
  { rejectValue: string }
>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/register", data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const fetchMe = createAsyncThunk<User>(
  "auth/me",
  async () => {
    const res = await apiClient.get("/auth/me");
    return res.data.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    });

    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;