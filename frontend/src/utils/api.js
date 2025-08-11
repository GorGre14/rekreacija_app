// frontend/src/utils/api.js

const fromEnv = (process.env.REACT_APP_API_BASE || "").trim();
const prodBase = "https://recreation-finder-app.vercel.app";

export const API_BASE =
  fromEnv ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : prodBase);

async function apiImpl(path, { method = "GET", body, headers } = {}) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    credentials: "include",
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = data?.error || res.statusText || "Request failed";
    throw new Error(`${res.status} ${msg}`);
  }
  return data;
}

// ✅ Export both named and default to support any import style
export { apiImpl as api };
export default apiImpl;
