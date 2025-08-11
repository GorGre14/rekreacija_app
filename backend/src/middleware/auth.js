import jwt from "jsonwebtoken";

// named export — not default
export function authRequired(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev");
    req.user = payload; // { id, email }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
