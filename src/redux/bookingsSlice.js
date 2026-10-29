import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchUserBookings = createAsyncThunk("bookings/fetchUser", async (userId) => {
  const res = await api.get("/bookings", { params: { userId, _expand: "event" } });
  return res.data;
});

export const fetchEventBookings = createAsyncThunk("bookings/fetchEvent", async (eventId) => {
  const res = await api.get("/bookings", { params: { eventId, _expand: "user" } });
  return res.data;
});

export const bookEvent = createAsyncThunk("bookings/book", async ({ userId, eventId, numberOfTickets }, { rejectWithValue }) => {
  try {
    const eventRes = await api.get(`/events/${eventId}`);
    const event = eventRes.data;

    if (numberOfTickets > event.availableSeats) {
      return rejectWithValue("Only " + event.availableSeats + " seats are available");
    }

    const booking = {
      userId,
      eventId,
      numberOfTickets,
      totalAmount: numberOfTickets * event.price,
      status: "confirmed",
      bookingDate: new Date().toISOString(),
    };
    const res = await api.post("/bookings", booking);

    await api.patch(`/events/${eventId}`, {
      availableSeats: event.availableSeats - numberOfTickets,
    });
    return res.data;
  } catch (err) {
    return rejectWithValue("Booking failed. Please try again.");
  }
});

export const cancelBooking = createAsyncThunk("bookings/cancel", async (booking) => {
  await api.patch(`/bookings/${booking.id}`, { status: "cancelled" });

  const eventRes = await api.get(`/events/${booking.eventId}`);
  await api.patch(`/events/${booking.eventId}`, {
    availableSeats: eventRes.data.availableSeats + booking.numberOfTickets,
  });
  return booking.id;
});

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEventBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(bookEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookEvent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bookEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const b = state.list.find((item) => item.id === action.payload);
        if (b) b.status = "cancelled";
      });
  },
});

export const { clearBookingError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
