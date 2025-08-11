import { pool } from "../db/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { email, password, name, surname, phone } = req.body || {};
  if (!email || !password || !name || !surname) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (existing.length)
      return res.status(409).json({ error: "Email already used" });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password, name, surname, phone)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, email, name, surname`,
      [email, hash, name, surname, phone || null]
    );
    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "dev",
      { expiresIn: "7d" }
    );
    res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Register failed" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (!rows.length)
      return res.status(401).json({ error: "Invalid credentials" });
    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "dev",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Login failed" });
  }
}
