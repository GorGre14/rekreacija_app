import React, { useState } from "react";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && surname && email && password)
      onRegister({ name, surname, email });
  };

  return (
    <form onSubmit={handleSubmit} className="container py-3">
      <h2 className="text-light mb-3">Register</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Surname</label>
          <input
            className="form-control"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="col-12 d-grid">
          <button className="btn btn-primary">Register</button>
        </div>
      </div>
    </form>
  );
}
