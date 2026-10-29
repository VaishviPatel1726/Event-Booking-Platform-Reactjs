import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

const savedUser = JSON.parse(localStorage.getItem("user"));

export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.get("/users", { params: { email, password } });
    if (res.data.length === 0) {
      return rejectWithValue("Invalid email or password");
    }
    return res.data[0];
  } catch (err) {
    return rejectWithValue("Server error. Is json-server running on port 5000?");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const check = await api.get("/users", { params: { email: formData.email } });
    if (check.data.length > 0) {
      return rejectWithValue("This email is already registered");
    }
    const res = await api.post("/users", formData);
    return res.data;
  } catch (err) {
    return rejectWithValue("Server error. Is json-server running on port 5000?");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: savedUser, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const fulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;