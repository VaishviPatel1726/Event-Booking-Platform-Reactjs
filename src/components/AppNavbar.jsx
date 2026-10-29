import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

function AppNavbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fs-3" to="/">EventBook</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="main-nav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link fs-4" to="/">Events</Link>
              </li>
              {user && user.role === "customer" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">My Bookings</Link>
                </li>
              )}
              {user && user.role === "organizer" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/organizer">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/organizer/create">Create Event</Link>
                  </li>
                </>
              )}
            </ul>

            <ul className="navbar-nav align-items-md-center">
              {user ? (
                <>
                  <li className="nav-item text-light me-3">Hi, {user.name}</li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link fs-5" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fs-5" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AppNavbar;