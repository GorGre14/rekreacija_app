import { Router } from "express";
import { register, login } from "../controllers/authController.js";

export const authRoutes = Router();
authRoutes.post("/auth/register", register);
authRoutes.post("/auth/login", login);
