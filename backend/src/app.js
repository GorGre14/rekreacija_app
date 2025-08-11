// backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Adjust the paths below if your files live elsewhere
import { pool } from "./db/client.js";
import { authRoutes } from "./routes/authRoutes.js";
import { eventRoutes } from "./routes/eventRoutes.js";

// Factory so we can use the same app for local (server.js) and Vercel (api/index.js)
export function createApp() {
  const app = express();

  // CORS
  const origins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: origins.length ? origins : true,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(morgan("tiny"));

  // -------- Health endpoints --------
  app.get("/health", (req, res) => {
    res.json({ ok: true, message: "Recreation Finder API running" });
  });

  app.get("/db-check", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ ok: true, db: "ok" });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });
  // ----------------------------------

  // API routes
  app.use("/auth", authRoutes);
  app.use("/events", eventRoutes);

  // Friendly root
  app.get("/", (req, res) => {
    res.json({ name: "Recreation Finder API", ok: true });
  });

  // 404 + error handlers
  app.use((req, res) => res.status(404).json({ error: "Not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
