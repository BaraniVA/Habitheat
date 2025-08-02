import express from "express";
import passport from "../config/passport.js";
import { login, signup, googleAuthSuccess, googleAuthFailure, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const authRoutes = express.Router();

// Local authentication routes
authRoutes.post("/login", login);
authRoutes.post("/signup", signup);

// Google OAuth routes
authRoutes.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

authRoutes.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/api/auth/google/failure",
        session: false
    }),
    googleAuthSuccess
);

authRoutes.get("/google/failure", googleAuthFailure);

// Protected routes
authRoutes.get("/profile", authenticateToken, getProfile);

export default authRoutes;
