import express from "express";
import { login, signup, updateProfilePic, checkAuth, editProfile, googleAuthSuccess, googleAuthFailure } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import passport from 'passport';
const authRoutes = express.Router();

// Regular auth routes
authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.post("/upload-pic", protectRoute, updateProfilePic);
authRoutes.get("/me",protectRoute,checkAuth);
authRoutes.put("/edit-profile",protectRoute,editProfile);

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
