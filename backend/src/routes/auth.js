import express from "express";

import { login, signup, getProfile, updateProfile } from "../controllers/authController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";


const authRoutes = express.Router();


authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.get("/profile", authenticateJWT, getProfile);
authRoutes.put("/profile", authenticateJWT, updateProfile);

export default authRoutes;
