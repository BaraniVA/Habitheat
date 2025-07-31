import express from "express";
import cors from "cors";
import fs from "fs";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import habitRoutes from './routes/habitRoutes.js';
import bulkRoutes from './routes/bulkRoutes.js';


import { globalRateLimit } from './middleware/ratelimiting.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Rate limiting
app.use(globalRateLimit);


// API routes
app.use("/api/auth", authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/habits/bulk', bulkRoutes);


// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Create necessary directories
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('exports')) {
  fs.mkdirSync('exports');
}

export default app;
