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
  authProvider:{
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local';
    }
  },
   googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents without this field
  },
  profilePicture:{
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
    required: function () {
      return !this.googleId; // Password not required if user registered via Google
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents without this field
  },
  profilePicture: {
    type: String,
    default: null,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
