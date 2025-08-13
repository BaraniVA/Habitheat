import express from "express";
import passport from 'passport';
import { login, signup, getProfile, updateProfile, googleAuthSuccess, googleAuthFailure } from "../controllers/authController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";


const authRoutes = express.Router();


authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.get("/profile", authenticateJWT, getProfile);
authRoutes.put("/profile", authenticateJWT, updateProfile);

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
