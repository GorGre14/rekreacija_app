import serverless from "serverless-http";
import { createApp } from "../src/app.js";

const app = createApp();

app.get("/health", (req, res) =>
  res.json({ ok: true, env: !!process.env.DATABASE_URL })
);

export default serverless(app);
