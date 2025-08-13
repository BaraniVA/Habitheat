import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import errorHandler from './middleware/errorHandler.js';
import "./config/passport.js"; // Import passport configuration
import passport from 'passport';

const app = express();



app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.options(/.*/, cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
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

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS test' });
});

app.use("/api/auth", authRoutes);

// Error handling

app.use(errorHandler);

export default app;
