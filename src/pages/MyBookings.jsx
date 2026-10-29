import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserBookings, cancelBooking } from "../redux/bookingsSlice";

function MyBookings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings(user.id));
  }, [dispatch, user.id]);

  const handleCancel = (booking) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(booking));
    }
  };

  return (
    <>
      <div className="container py-4">
        <h2 className="mb-3">My Bookings</h2>
        {loading && <div className="spinner-border"></div>}

        {!loading && list.length === 0 ? (
          <p className="text-muted">
            You have no bookings yet. <Link to="/">Browse events</Link>
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Tickets</th>
                  <th>Total</th>
                  <th>Booked On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b, index) => (
                  <tr key={b.id}>
                    <td>{index + 1}</td>
                    <td>{b.event ? b.event.title : "Event deleted"}</td>
                    <td>{b.event ? b.event.date : "-"}</td>
                    <td>{b.numberOfTickets}</td>
                    <td>₹{b.totalAmount}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                    <td>
                      <span className={"badge " + (b.status === "confirmed" ? "bg-success" : "bg-secondary")}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === "confirmed" && b.event && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b)}>Cancel</button>
                      )}
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

export default MyBookings;