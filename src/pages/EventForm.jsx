import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addEvent, updateEvent } from "../redux/eventsSlice";
import api from "../api/api";
import { categories } from "../constants";

const emptyForm = { title: "", description: "", location: "", date: "", time: "", category: "Music", price: "", totalSeats: "", availableSeats: "", };

function EventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`)
        .then((res) => setFormData(res.data))
        .catch(() => setError("Could not load event"));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const price = Number(formData.price);
    const totalSeats = Number(formData.totalSeats);
    const availableSeats = isEdit ? Number(formData.availableSeats) : totalSeats;

    if (price < 0 || totalSeats <= 0) {
      setError("Please enter valid price and seats");
      return;
    }
    if (availableSeats > totalSeats || availableSeats < 0) {
      setError("Available seats cannot be more than total seats");
      return;
    }

    const eventData = { ...formData, price, totalSeats, availableSeats, createdBy: user.id };

    if (isEdit) {
      dispatch(updateEvent({ id, data: eventData })).then(() => navigate("/organizer"));
    } else {
      dispatch(addEvent(eventData)).then(() => navigate("/organizer"));
    }
  };

  return (
    <>
      <div className="container py-4" style={{ maxWidth: "700px" }}>
        <div className="card card-body shadow-sm">
          <h3 className="mb-3">{isEdit ? "Edit Event" : "Create Event"}</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" name="title" required value={formData.title} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" name="description" required value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input className="form-control" name="location" required value={formData.location} onChange={handleChange} />
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" name="date" required value={formData.date} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Time</label>
                <input type="time" className="form-control" name="time" required value={formData.time} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className={isEdit ? "col-md-4" : "col-md-6"}>
                <label className="form-label">Price (₹)</label>
                <input type="number" className="form-control" name="price" required value={formData.price} onChange={handleChange} />
              </div>
              <div className={isEdit ? "col-md-4" : "col-md-6"}>
                <label className="form-label">Total Seats</label>
                <input type="number" className="form-control" name="totalSeats" required value={formData.totalSeats} onChange={handleChange} />
              </div>
              {isEdit && (
                <div className="col-md-4">
                  <label className="form-label">Available Seats</label>
                  <input type="number" className="form-control" name="availableSeats" required value={formData.availableSeats} onChange={handleChange} />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary me-2">{isEdit ? "Update Event" : "Create Event"}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/organizer")}>Cancel</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EventForm;