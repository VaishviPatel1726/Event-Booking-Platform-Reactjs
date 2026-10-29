import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchEventBookings } from "../redux/bookingsSlice";
import { fetchEventById } from "../redux/eventsSlice";

function EventBookings() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.bookings);
  const { current: event } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(fetchEventBookings(id));
  }, [dispatch, id]);

  const confirmed = list.filter((b) => b.status === "confirmed");
  const totalTickets = confirmed.reduce((sum, b) => sum + b.numberOfTickets, 0);
  const totalRevenue = confirmed.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <>
      <div className="container py-4">
        <Link to="/organizer">← Back to dashboard</Link>
        <h2 className="mt-2">Bookings {event ? "- " + event.title : ""}</h2>
        <p>
          Tickets sold: <strong>{totalTickets}</strong> | Revenue: <strong>₹{totalRevenue}</strong>
        </p>

        {loading && <div className="spinner-border"></div>}

        {!loading && list.length === 0 ? (
          <p className="text-muted">No bookings for this event yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Tickets</th>
                  <th>Amount</th>
                  <th>Booked On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b, index) => (
                  <tr key={b.id}>
                    <td>{index + 1}</td>
                    <td>{b.user ? b.user.name : "-"}</td>
                    <td>{b.user ? b.user.email : "-"}</td>
                    <td>{b.numberOfTickets}</td>
                    <td>₹{b.totalAmount}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                    <td>
                      <span className={"badge " + (b.status === "confirmed" ? "bg-success" : "bg-secondary")}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default EventBookings;