import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import app from "./app.js";

dotenv.config();

// Connect to database once for serverless
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  
  try {
    await connectDB();
    cachedDb = true;
    console.log('Database connected');
    return cachedDb;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// For Vercel serverless functions
export default async function handler(req, res) {
  try {
    await connectToDatabase();
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
