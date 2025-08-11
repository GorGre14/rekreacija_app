import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../Context/AppContext";

function eventDateTime(e) {
  return new Date(`${e.date}T${e.time}:00`);
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const {
    events,
    user,
    joinEvent,
    leaveEvent,
    deleteEvent,
    addRating,
    getAverageRating,
  } = useApp();
  const nav = useNavigate();

  const event = events.find((e) => String(e.id) === String(id));
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  if (!event)
    return (
      <div className="container py-3">
        <div className="alert alert-danger">Event not found.</div>
      </div>
    );

  const attendees = Array.isArray(event.attendees) ? event.attendees : [];
  const joined = !!(user && attendees.includes(user.email));
  const isOwner = !!(user && user.email === event.createdBy);
  const isPast = eventDateTime(event) < new Date();

  const handleJoin = async () => {
    if (!user) return nav("/login", { state: { from: `/events/${event.id}` } });
    await joinEvent(event.id);
  };
  const handleLeave = async () => {
    if (!user) return;
    await leaveEvent(event.id);
  };
  const handleDelete = async () => {
    if (!isOwner) return;
    await deleteEvent(event.id);
    nav("/home");
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!user) return;
    await addRating({
      eventId: event.id,
      rateeEmail: event.createdBy,
      score: Number(score),
      comment: comment.trim(),
    });
    setComment("");
  };

  return (
    <div className="container py-3">
      <button className="btn btn-sm btn-secondary mb-2" onClick={() => nav(-1)}>
        ← Back
      </button>
      <h2 className="text-light">
        {event.sport} @ {event.location}
      </h2>
      <p>
        <b>Date:</b> {event.date} <b>Time:</b> {event.time}
      </p>
      <p>
        <b>Skill level:</b> {event.skillLevel} | <b>Age group:</b>{" "}
        {event.ageGroup}
      </p>
      <p>
        <b>Organizer:</b> {event.createdBy}
      </p>
      <p>
        <b>Attendees ({attendees.length}):</b>{" "}
        {attendees.join(", ") || "None yet"}
      </p>

      <div className="d-flex gap-2 mb-3">
        {joined ? (
          <button className="btn btn-outline-warning" onClick={handleLeave}>
            Leave
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleJoin}>
            Join
          </button>
        )}
        {isOwner && (
          <Link
            to={`/events/${event.id}/edit`}
            className="btn btn-outline-info"
          >
            Edit
          </Link>
        )}
        {isOwner && (
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      {isPast && user && user.email !== event.createdBy && (
        <form
          onSubmit={submitRating}
          className="border-top border-secondary pt-3"
        >
          <h4 className="text-light">Rate the organizer</h4>
          <label className="me-2">Score (1–5):</label>
          <select
            className="form-select w-auto d-inline-block"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <div className="mt-2">
            <textarea
              className="form-control"
              placeholder="Optional comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              style={{ maxWidth: 600 }}
            />
          </div>
          <button className="btn btn-success mt-2">Submit rating</button>
        </form>
      )}
    </div>
  );
}
