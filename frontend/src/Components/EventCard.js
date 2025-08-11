import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../Context/AppContext";

export default function EventCard({ event }) {
  const { user, joinEvent, leaveEvent, deleteEvent } = useApp();

  const attendees = Array.isArray(event.attendees) ? event.attendees : [];
  const joined = user && attendees.includes(user.email);
  const isOwner = user && user.email === event.createdBy;

  return (
    <div className="card bg-dark text-light mb-3 border-secondary">
      <div className="card-body">
        <h5 className="card-title">
          <Link
            to={`/events/${event.id}`}
            className="link-info text-decoration-none"
          >
            {event.sport} @ {event.location}
          </Link>
        </h5>
        <p className="card-text mb-1">
          <strong>Date:</strong> {event.date} <strong>Time:</strong>{" "}
          {event.time}
        </p>
        <p className="card-text mb-1">
          <strong>Skill:</strong> {event.skillLevel} &nbsp;{" "}
          <strong>Age:</strong> {event.ageGroup}
        </p>
        <p className="card-text mb-1">
          <strong>Created by:</strong> {event.createdBy}
        </p>
        <p className="card-text">
          <strong>Attendees:</strong> {attendees.length}
        </p>

        <div className="d-flex gap-2">
          {user ? (
            joined ? (
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => leaveEvent(event.id, user.email)}
              >
                Leave
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => joinEvent(event.id, user.email)}
              >
                Join
              </button>
            )
          ) : (
            <small className="text-secondary">Login to join</small>
          )}
          {isOwner && (
            <>
              <Link
                to={`/events/${event.id}/edit`}
                className="btn btn-outline-info btn-sm"
              >
                Edit
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => deleteEvent(event.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
