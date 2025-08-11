import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../Context/AppContext";

export default function CreateEventPage() {
  const { user, createEvent } = useApp();
  const nav = useNavigate();
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [skillLevel, setSkillLevel] = useState("1");
  const [ageGroup, setAgeGroup] = useState("");

  if (!user)
    return (
      <div className="container py-3">
        <div className="alert alert-warning">Please login.</div>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    await createEvent({
      sport,
      location,
      date,
      time,
      skillLevel: Number(skillLevel),
      ageGroup,
    });
    nav("/home");
  };

  return (
    <div className="container py-3">
      <h2 className="text-light">Create Event</h2>
      <form className="row g-3" onSubmit={submit}>
        <div className="col-md-6">
          <label className="form-label">Sport</label>
          <input
            className="form-control"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Location</label>
          <input
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Time</label>
          <input
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Skill Level</label>
          <select
            className="form-select"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="1">1 - Casual</option>
            <option value="2">2 - Intermediate</option>
            <option value="3">3 - Competitive</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Age Group</label>
          <input
            className="form-control"
            placeholder="e.g. 20–30"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            required
          />
        </div>
        <div className="col-12 d-grid">
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
}
