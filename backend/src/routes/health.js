import { Router } from "express";
import { pool } from "../db/client.js";

export const health = Router();

// simple process check
health.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// database connectivity check (Neon)
health.get("/db-check", async (_req, res) => {
  try {
    const { rows } = await pool.query("select now() as now");
    res.json({ db: true, now: rows[0].now });
  } catch (e) {
    res.status(500).json({ db: false, error: e.message });
  }
});
