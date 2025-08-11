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

eventRoutes.get("/events", listEvents);
eventRoutes.get("/events/:id", getEvent);

eventRoutes.post("/events", authRequired, createEvent);
eventRoutes.patch("/events/:id", authRequired, updateEvent);
eventRoutes.delete("/events/:id", authRequired, deleteEvent);

eventRoutes.post("/events/:id/join", authRequired, joinEvent);
eventRoutes.post("/events/:id/leave", authRequired, leaveEvent);
