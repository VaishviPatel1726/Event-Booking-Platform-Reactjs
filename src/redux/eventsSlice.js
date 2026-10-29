import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchEvents = createAsyncThunk("events/fetchAll", async () => {
  const res = await api.get("/events");
  return res.data;
});

export const fetchEventById = createAsyncThunk("events/fetchOne", async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
});

export const addEvent = createAsyncThunk("events/add", async (eventData) => {
  const res = await api.post("/events", eventData);
  return res.data;
});

export const updateEvent = createAsyncThunk("events/update", async ({ id, data }) => {
  const res = await api.patch(`/events/${id}`, data);
  return res.data;
});

export const deleteEvent = createAsyncThunk("events/delete", async (id) => {
  await api.delete(`/events/${id}`);
  return id;
});

const eventsSlice = createSlice({
  name: "events",
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false;
        state.error = "Could not load events. Is json-server running on port 5000?";
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.current = null;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchEventById.rejected, (state) => {
        state.loading = false;
        state.error = "Event not found";
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.list.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
        state.current = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
      });
  },
});

export default eventsSlice.reducer;