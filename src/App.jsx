import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import EventForm from "./pages/EventForm";
import EventBookings from "./pages/EventBookings";

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-bookings" element={<ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>} />
        <Route path="/organizer" element={<ProtectedRoute role="organizer"><OrganizerDashboard /></ProtectedRoute>} />
        <Route path="/organizer/create" element={<ProtectedRoute role="organizer"><EventForm /></ProtectedRoute>} />
        <Route path="/organizer/edit/:id" element={<ProtectedRoute role="organizer"><EventForm /></ProtectedRoute>} />
        <Route path="/organizer/bookings/:id" element={<ProtectedRoute role="organizer"><EventBookings /></ProtectedRoute>} />
        <Route path="*" element={<h3 className="text-center mt-5">404 - Page not found</h3>} />
      </Routes>
    </>
  );
}

export default App;