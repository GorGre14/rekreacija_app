import { Link } from "react-router-dom";
import { useApp } from "../Context/AppContext";

function eventDateTime(e) {
  return new Date(`${e.date}T${e.time}:00`);
}

export default function ProfilePage() {
  const { user, events, deleteEvent, leaveEvent } = useApp();
  if (!user)
    return (
      <div className="container py-3">
        <div className="alert alert-warning">Please login.</div>
      </div>
    );

  const created = events.filter((e) => e.createdBy === user.email);
  const joined = events.filter(
    (e) =>
      Array.isArray(e.attendees) &&
      e.attendees.includes(user.email) &&
      e.createdBy !== user.email
  );

  return (
    <div className="container py-3">
      <h2 className="text-light">Profile</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>

      <h4 className="text-light mt-4">My Created Events ({created.length})</h4>
      {created.map((e) => (
        <div key={e.id} className="border border-secondary rounded p-2 mb-2">
          <b>{e.sport}</b> @ {e.location} — {e.date} {e.time}
          <div className="mt-2 d-flex gap-2">
            <Link
              to={`/events/${e.id}`}
              className="btn btn-sm btn-outline-info"
            >
              View
            </Link>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteEvent(e.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <h4 className="text-light mt-4">Events I Joined ({joined.length})</h4>
      {joined.map((e) => (
        <div key={e.id} className="border border-secondary rounded p-2 mb-2">
          <b>{e.sport}</b> @ {e.location} — {e.date} {e.time}
          <div className="mt-2 d-flex gap-2">
            <Link
              to={`/events/${e.id}`}
              className="btn btn-sm btn-outline-info"
            >
              View
            </Link>
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => leaveEvent(e.id)}
            >
              Leave
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
