import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../redux/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate(user.role === "organizer" ? "/organizer" : "/");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <>
      <div className="container py-5" style={{ maxWidth: "450px" }}>
        <div className="card card-body shadow-sm">
          <h3 className="mb-3 text-center">Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
          <p className="mt-3 mb-0 text-center">
            New user? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;