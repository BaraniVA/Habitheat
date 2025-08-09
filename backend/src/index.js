import dotenv from "dotenv";

// Load environment variables first, before importing other modules
dotenv.config();

import connectDB from "./db/connect.js";
import app from "./app.js";

// Connect to database once
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await connectDB();
    isConnected = true;
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// For Vercel serverless functions
export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}
