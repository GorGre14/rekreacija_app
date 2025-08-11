import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) onLogin(email);
  };

  return (
    <form onSubmit={handleSubmit} className="container py-3">
      <h2 className="text-light mb-3">Login</h2>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-primary">Login</button>
    </form>
  );
}
