import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    // Split URI to separate query params (if any)
    const uriParts = mongoUri.split('?');
    let baseUri = uriParts[0];
    const queryParams = uriParts.length > 1 ? `?${uriParts[1]}` : '';

    // Append DB name to URI
    if (baseUri.endsWith('/')) {
      baseUri = `${baseUri}${dbName}`;
    } else {
      baseUri = `${baseUri}/${dbName}`;
    }

    const finalUri = baseUri + queryParams;

    // Connect to MongoDB
    await mongoose.connect(finalUri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
