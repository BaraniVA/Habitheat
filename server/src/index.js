import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
