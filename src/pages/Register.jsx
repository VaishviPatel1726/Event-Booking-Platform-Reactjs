import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../redux/authSlice";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "customer" });
  const [formError, setFormError] = useState("");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    setFormError("");
    dispatch(registerUser(formData));
  };

  return (
    <>
      <div className="container py-5" style={{ maxWidth: "450px" }}>
        <div className="card card-body shadow-sm">
          <h3 className="mb-3 text-center">Register</h3>
          {(formError || error) && <div className="alert alert-danger">{formError || error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" required value={formData.password} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Register as</label>
              <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                <option value="customer">Customer</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Please wait..." : "Register"}
            </button>
          </form>
          <p className="mt-3 mb-0 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;