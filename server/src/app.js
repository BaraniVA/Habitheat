import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import blogRoutes from './routes/blogsRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/blogs', blogRoutes); 

app.use(errorHandler);

export default app;
