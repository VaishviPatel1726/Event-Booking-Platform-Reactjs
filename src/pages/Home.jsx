import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/eventsSlice";
import EventCard from "../components/EventCard";
import { categories } from "../constants";

function Home() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.events);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = list.filter((event) => {
    const text = search.toLowerCase();
    const matchSearch =
      event.title.toLowerCase().includes(text) || event.location.toLowerCase().includes(text);
    const matchCategory = category === "All" || event.category === category;
    const matchPrice = maxPrice === "" || event.price <= Number(maxPrice);
    const matchDate = date === "" || event.date === date;
    return matchSearch && matchCategory && matchPrice && matchDate;
  });

  return (
    <>
      <div className="container py-4">
        <h2 className="mb-3">Discover Events</h2>

        <div className="row g-2 mb-4">
          <div className="col-md-4">
            <input className="form-control" placeholder="Search by event name or location" value={search} onChange={(e) => setSearch(e.target.value)}/>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}/>
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {loading && <div className="text-center"><div className="spinner-border"></div></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredEvents.map((event) => (
            <div className="col" key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {!loading && !error && filteredEvents.length === 0 && (
          <p className="text-center text-muted mt-4">No events found.</p>
        )}
      </div>
    </>
  );
}

export default Home;