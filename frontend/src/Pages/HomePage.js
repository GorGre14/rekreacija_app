import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
// Optional card component
// import EventCard from "../Components/EventCard";

function authHeader() {
  const t = localStorage.getItem("rf_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("rf_user") || "null");
    } catch {
      return null;
    }
  })();

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await api("/events"); // GET /events
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleJoin(id) {
    try {
      await api(`/events/${id}/join`, {
        method: "POST",
        headers: { ...authHeader() },
      });
      await load();
    } catch (e) {
      alert(e.message || "Join failed");
    }
  }

  async function handleLeave(id) {
    try {
      await api(`/events/${id}/leave`, {
        method: "POST",
        headers: { ...authHeader() },
      });
      await load();
    } catch (e) {
      alert(e.message || "Leave failed");
    }
  }

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Events</h2>
        <div>
          {user ? (
            <span className="text-muted">
              Logged in as <strong>{user.email}</strong>
            </span>
          ) : (
            <span className="text-muted">Not logged in</span>
          )}
        </div>
      </div>

      {err ? (
        <div className="alert alert-danger" role="alert">
          {err}
        </div>
      ) : null}

      {loading && <p>Loading...</p>}

      {!loading && events.length === 0 && <p>No events yet.</p>}

      <div className="row g-3">
        {events.map((ev) => {
          const youJoined = ev.attendees?.includes?.(user?.email);

          return (
            <div className="col-md-6 col-lg-4" key={ev.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    {ev.title || `${ev.sport} @ ${ev.location}`}
                  </h5>
                  <p className="card-text mb-1">
                    <strong>Sport:</strong> {ev.sport}
                  </p>
                  <p className="card-text mb-1">
                    <strong>When:</strong> {ev.date} {ev.time}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Skill:</strong> {ev.skillLevel}{" "}
                    <strong className="ms-2">Age:</strong> {ev.ageGroup}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Location:</strong> {ev.location}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Created by:</strong> {ev.createdBy}
                  </p>

                  {user ? (
                    youJoined ? (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleLeave(ev.id)}
                      >
                        Leave
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => handleJoin(ev.id)}
                      >
                        Join
                      </button>
                    )
                  ) : (
                    <span className="text-muted">Login to join</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
