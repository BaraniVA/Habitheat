import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  auth:{
    type: String,
    enum: ["local", "google"],
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto:{
    type:String,
    default: "https://www.gravatar.com/avatar/?d=mp",
  },
  statistics:{
    currStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalHabitsCompleted: {
      type: Number,
      default: 0,
    }
  },
  settings:{
    timezone: {
      type: String,
      default: "UTC",
    },
    notificationPreferences:{
      type:Boolean,
      default: true,
    },
    themePreference:{
      type: String,
      enum: ["light", "dark"],
      default: "light",
    }
},
points: Number,
createdAt: {
    type: Date,
    default: Date.now,  
  },
  updatedAt: {
    type: Date,
    default: Date.now,  
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
