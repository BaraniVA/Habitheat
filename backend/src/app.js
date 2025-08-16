import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import "./config/passport.js"; // Import passport configuration
import passport from 'passport';

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Rate limiting
app.use(globalRateLimit);
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

app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
