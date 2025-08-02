import express from "express";
import cors from "cors";
import fs from "fs";
import helmet from "helmet";
import session from "express-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import habitRoutes from './routes/habitRoutes.js';
import bulkRoutes from './routes/bulkRoutes.js';

import { globalRateLimit } from './middleware/ratelimiting.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://habitheat.vercel.app' // Add your production frontend URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session configuration for passport
app.use(session({
  secret: process.env.JWT_SECRET_KEY || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
app.use(globalRateLimit);

// API routes
app.use("/api/auth", authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/habits/bulk', bulkRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'HabitHeat API is running',
    timestamp: new Date().toISOString()
  });
});

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
