import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import errorHandler from './middleware/errorHandler.js';

const app = express();




app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.options(/.*/, cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
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
