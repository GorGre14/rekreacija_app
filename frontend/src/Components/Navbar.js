import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../Context/AppContext";

export default function Navbar() {
  const { user, logout } = useApp();
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <Link to="/home" className="navbar-brand">
        Rec Finder
      </Link>
      <div className="navbar-nav me-auto">
        <NavLink to="/home" className="nav-link">
          Home
        </NavLink>
        {user && (
          <NavLink to="/create" className="nav-link">
            Create
          </NavLink>
        )}
      </div>
      <div className="navbar-nav ms-auto">
        {!user ? (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile" className="nav-link">
              {user.email}
            </NavLink>
            <button
              className="btn btn-outline-light btn-sm ms-2"
              onClick={doLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
