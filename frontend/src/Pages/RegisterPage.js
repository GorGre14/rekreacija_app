import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api("/auth/register", {
        method: "POST",
        body: { name, surname, phone, email, password },
      });
      // success → go to login
      navigate("/login");
    } catch (e) {
      setErr(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 30 }}>
      <h2>Create Account</h2>

      {err ? (
        <div className="alert alert-danger" role="alert">
          {err}
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Surname</label>
          <input
            className="form-control"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone (optional)</label>
          <input
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 040123456"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <span className="ms-2">
          Have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
}
