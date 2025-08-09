import express from "express";
import passport from 'passport';
import { login, signup, googleAuthSuccess, googleAuthFailure } from "../controllers/authController.js";

const authRoutes = express.Router();

// Regular auth routes
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
        failureRedirect: "/auth/google/failure"
    }),
    googleAuthSuccess
);

authRoutes.get("/google/failure", googleAuthFailure);

export default authRoutes;
