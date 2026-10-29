import { Link } from "react-router-dom";

const colors = {
  Music: "primary",
  Comedy: "warning",
  Sports: "success",
  Workshop: "info",
  Technology: "dark",
  Theatre: "danger",
};

function EventCard({ event }) {
  return (
    <>
      <div className="card h-100 shadow-sm">
        <div className={"card-header text-white bg-" + (colors[event.category] || "secondary")}>
          {event.category}
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text mb-1">📍 {event.location}</p>
          <p className="card-text mb-1">📅 {event.date} | {event.time}</p>
          <p className="card-text fw-bold">₹{event.price}</p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            {event.availableSeats > 0 ? (
              <span className="badge bg-success">{event.availableSeats} seats left</span>
            ) : (
              <span className="badge bg-danger">Sold out</span>
            )}
            <Link to={"/events/" + event.id} className="btn btn-outline-dark btn-sm">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventCard;