import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController.js";

export const eventRoutes = Router();

eventRoutes.get("/", listEvents);
eventRoutes.get("/:id", getEvent);

eventRoutes.post("/", authRequired, createEvent);
eventRoutes.patch("/:id", authRequired, updateEvent);
eventRoutes.delete("/:id", authRequired, deleteEvent);

eventRoutes.post("/:id/join", authRequired, joinEvent);
eventRoutes.post("/:id/leave", authRequired, leaveEvent);
