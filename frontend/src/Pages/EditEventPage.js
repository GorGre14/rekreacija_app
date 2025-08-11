import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../Context/AppContext";

export default function EditEventPage() {
  const { id } = useParams();
  const { user, events, updateEvent } = useApp();
  const nav = useNavigate();

  const event = useMemo(
    () => events.find((e) => String(e.id) === String(id)),
    [events, id]
  );

  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [skillLevel, setSkillLevel] = useState("1");
  const [ageGroup, setAgeGroup] = useState("");

  useEffect(() => {
    if (event) {
      setSport(event.sport || "");
      setLocation(event.location || "");
      setDate(event.date || "");
      setTime(event.time || "");
      setSkillLevel(String(event.skillLevel ?? "1"));
      setAgeGroup(event.ageGroup || "");
    }
  }, [event]);

  if (!event)
    return (
      <div className="container py-3">
        <div className="alert alert-danger">Event not found.</div>
      </div>
    );

  const isOwner = user && user.email === event.createdBy;
  if (!isOwner)
    return (
      <div className="container py-3">
        <div className="alert alert-warning">Not allowed.</div>
      </div>
    );

  const submit = async (e) => {
    e.preventDefault();
    await updateEvent(event.id, {
      sport,
      location,
      date,
      time,
      skillLevel: Number(skillLevel),
      ageGroup,
    });
    nav(`/events/${event.id}`);
  };

  return (
    <div className="container py-3">
      <h2 className="text-light">Edit Event</h2>
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
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            required
          />
        </div>
        <div className="col-12 d-grid">
          <button className="btn btn-primary">Save</button>
        </div>
      </form>
      <Link to={`/events/${event.id}`} className="btn btn-link mt-3">
        Back
      </Link>
    </div>
  );
}
