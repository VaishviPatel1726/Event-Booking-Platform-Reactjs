import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchEvents, deleteEvent, updateEvent } from "../redux/eventsSlice";

function OrganizerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list, loading } = useSelector((state) => state.events);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [seats, setSeats] = useState(0);
  const [seatError, setSeatError] = useState("");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const myEvents = list.filter((e) => e.createdBy === user.id);

  const handleDelete = (id) => {
    if (window.confirm("Delete this event?")) {
      dispatch(deleteEvent(id));
    }
  };

  const openSeatsModal = (event) => {
    setSelected(event);
    setSeats(event.availableSeats);
    setSeatError("");
    setShowModal(true);
  };

  const saveSeats = () => {
    const value = Number(seats);
    if (value < 0 || value > selected.totalSeats) {
      setSeatError("Seats must be between 0 and " + selected.totalSeats);
      return;
    }
    dispatch(updateEvent({ id: selected.id, data: { availableSeats: value } }));
    setShowModal(false);
  };

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>My Events</h2>
          <Link to="/organizer/create" className="btn btn-primary">+ Create Event</Link>
        </div>

        {loading && <div className="spinner-border"></div>}

        {!loading && myEvents.length === 0 ? (
          <p className="text-muted">You have not created any events yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Seats (available / total)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myEvents.map((event, index) => (
                  <tr key={event.id}>
                    <td>{index + 1}</td>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.category}</td>
                    <td>₹{event.price}</td>
                    <td>{event.availableSeats} / {event.totalSeats}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={"/organizer/bookings/" + event.id} className="btn btn-info btn-sm">Bookings</Link>
                        <button className="btn btn-secondary btn-sm" onClick={() => openSeatsModal(event)}>Seats</button>
                        <Link to={"/organizer/edit/" + event.id} className="btn btn-warning btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <>
            <div className="modal d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Manage Available Seats</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    {seatError && <div className="alert alert-danger">{seatError}</div>}
                    <p>{selected.title} (Total seats: {selected.totalSeats})</p>
                    <input type="number" className="form-control" value={seats} onChange={(e) => setSeats(e.target.value)}/>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    <button className="btn btn-primary" onClick={saveSeats}>Save</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop show"></div>
          </>
        )}
      </div>
    </>
  );
}

export default OrganizerDashboard;