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

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://habitheat.vercel.app', 'https://www.habitheat.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
