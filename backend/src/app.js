import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Rate limiting
app.use(globalRateLimit);

// API routes
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
