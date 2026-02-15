import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

interface AuthState {
  token: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async () => {
    const res = await apiClient.get("/auth/me");
    return res.data.data;
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