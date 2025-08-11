import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";

// If you have an AppContext, import it and call setUser on login
// import { AppContext } from "../Context/AppContext";

export default function LoginPage() {
  const navigate = useNavigate();
  // const { setLoggedInUser } = useContext(AppContext) || {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      // Expecting something like { token, user }
      if (data?.token) localStorage.setItem("rf_token", data.token);
      if (data?.user)
        localStorage.setItem("rf_user", JSON.stringify(data.user));
      // if (setLoggedInUser) setLoggedInUser(data.user);

      navigate("/");
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 30 }}>
      <h2>Login</h2>

      {err ? (
        <div className="alert alert-danger" role="alert">
          {err}
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            required
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
          {loading ? "Signing in..." : "Login"}
        </button>
        <span className="ms-2">
          No account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
}
