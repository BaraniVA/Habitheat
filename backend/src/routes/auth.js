import express from "express";
import { login, signup, updateProfilePic, checkAuth, editProfile } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.post("/upload-pic", protectRoute, updateProfilePic);
authRoutes.get("/me",protectRoute,checkAuth);
authRoutes.put("/edit-profile",protectRoute,editProfile);

export default authRoutes;
