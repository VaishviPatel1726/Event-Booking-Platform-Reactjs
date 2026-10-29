import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "../redux/eventsSlice";
import { bookEvent, clearBookingError } from "../redux/bookingsSlice";

function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current: event, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const bookings = useSelector((state) => state.bookings);

  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    dispatch(clearBookingError());
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  const handleBook = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(bookEvent({ userId: user.id, eventId: event.id, numberOfTickets: Number(tickets) }))
      .unwrap()
      .then(() => {
        alert("Tickets booked successfully!");
        navigate("/my-bookings");
      })
      .catch(() => { });
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!event) return null;

  return (
    <>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-7">
            <span className="badge bg-secondary mb-2">{event.category}</span>
            <h2>{event.title}</h2>
            <p className="text-muted">{event.description}</p>
            <p className="mb-1"><strong>📍 Location:</strong> {event.location}</p>
            <p className="mb-1"><strong>📅 Date:</strong> {event.date}</p>
            <p className="mb-1"><strong>⏰ Time:</strong> {event.time}</p>
            <p className="mb-1"><strong>💰 Price:</strong> ₹{event.price} per ticket</p>
            <p><strong>🎟️ Seats:</strong> {event.availableSeats} available out of {event.totalSeats}</p>
          </div>

          <div className="col-md-5">
            <div className="card card-body shadow-sm">
              <h5>Book Tickets</h5>
              {bookings.error && <div className="alert alert-danger">{bookings.error}</div>}

              {event.availableSeats === 0 ? (
                <div className="alert alert-danger mb-0">Sorry, this event is sold out.</div>
              ) : user && user.role === "organizer" ? (
                <div className="alert alert-info mb-0">Organizers cannot book tickets.</div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Number of tickets</label>
                    <select className="form-select" value={tickets} onChange={(e) => setTickets(e.target.value)}>
                      {Array.from({ length: Math.min(event.availableSeats, 10) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <h5>Total: ₹{tickets * event.price}</h5>
                  <button className="btn btn-primary w-100 mt-2" onClick={handleBook} disabled={bookings.loading}>
                    {user ? (bookings.loading ? "Booking..." : "Book Now") : "Login to Book"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetails;