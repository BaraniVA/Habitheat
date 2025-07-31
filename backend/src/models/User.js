import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  startTime: { 
    type: String,
    default: "07:00" 
  },
  reminderTime: { 
    type: String,
    default: "07:00"
  },
  startOfWeek: {
    type: String, enum: ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], default: 'Monday' 
  },
  age: {
    type: Number,
    default: 20
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
