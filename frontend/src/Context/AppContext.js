import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

let API_BASE = process.env.REACT_APP_API_BASE;
if (!API_BASE) {
  // local dev fallback only
  API_BASE = "http://localhost:4000";
}
export const apiFetch = (path, opts) => fetch(`${API_BASE}${path}`, opts);

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: auth headers
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // Helper: GET
  const getJSON = useCallback(
    async (path) => {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { ...authHeaders },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    [authHeaders]
  );

  // Helper: POST/PATCH/DELETE with JSON
  const sendJSON = useCallback(
    async (method, path, body) => {
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    [authHeaders]
  );

  // ---------- AUTH ----------
  const register = useCallback(
    async ({ email, password, name, surname, phone }) => {
      const data = await sendJSON("POST", "/auth/register", {
        email,
        password,
        name,
        surname,
        phone,
      });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return data.user;
    },
    [sendJSON]
  );

  const login = useCallback(
    async ({ email, password }) => {
      const data = await sendJSON("POST", "/auth/login", { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return data.user;
    },
    [sendJSON]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // ---------- EVENTS ----------
  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getJSON("/events");
      setEvents(list);
    } finally {
      setLoading(false);
    }
  }, [getJSON]);

  const createEvent = useCallback(
    async ({ sport, location, date, time, skillLevel, ageGroup }) => {
      const created = await sendJSON("POST", "/events", {
        sport,
        location,
        date,
        time,
        skillLevel,
        ageGroup,
      });
      setEvents((prev) => [created, ...prev]);
      return created;
    },
    [sendJSON]
  );

  const updateEvent = useCallback(
    async (id, patch) => {
      const updated = await sendJSON("PATCH", `/events/${id}`, patch);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    },
    [sendJSON]
  );

  const deleteEvent = useCallback(
    async (id) => {
      await sendJSON("DELETE", `/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    },
    [sendJSON]
  );

  const joinEvent = useCallback(
    async (id) => {
      const updated = await sendJSON("POST", `/events/${id}/join`);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    },
    [sendJSON]
  );

  const leaveEvent = useCallback(
    async (id) => {
      const updated = await sendJSON("POST", `/events/${id}/leave`);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    },
    [sendJSON]
  );

  // ---------- RATINGS ----------
  const addRating = useCallback(
    async ({ eventId, raterEmail, rateeEmail, score, comment }) => {
      // raterEmail isn't needed by backend (uses JWT), but we keep the signature
      await sendJSON("POST", "/ratings", {
        eventId,
        rateeEmail,
        score,
        comment,
      });
      // no local state change needed immediately
      return true;
    },
    [sendJSON]
  );

  const getAverageRating = useCallback(
    async (email) => {
      try {
        const data = await getJSON(
          `/users/${encodeURIComponent(email)}/ratings/avg`
        );
        return data.average; // number or null
      } catch {
        return null;
      }
    },
    [getJSON]
  );

  // On mount: load events once
  useEffect(() => {
    loadEvents().catch(() => {});
  }, [loadEvents]);

  const value = {
    API_BASE,
    user,
    token,
    loading,
    events,
    register,
    login,
    logout,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    addRating,
    getAverageRating,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
