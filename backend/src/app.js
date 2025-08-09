import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import "./config/passport.js"; // Import passport configuration

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

// Session configuration (required for Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
import passport from 'passport';
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
