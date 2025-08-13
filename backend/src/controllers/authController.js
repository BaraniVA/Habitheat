import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      authProvider: 'local',
    });

    await newUser.save();

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user registered with Google OAuth
    if (existingUser.authProvider === 'google' && !existingUser.password) {
      return res.status(400).json({
        message: "This account was created with Google. Please use Google Sign-In."
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(existingUser._id, res);


    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        username: existingUser.username,
        email: existingUser.email,
        profilePicture: existingUser.profilePicture,
        authProvider: existingUser.authProvider,
      },
    });
  } catch (error) {
    console.log("Error during login:", error);
    next(error);
  }
};
export const updateProfilePic = async (req, res) => {
  try {
    // console.log("Headers:", req.headers);
    // console.log(req.body);
    const { image, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const updatedUser = await User.findOneAndUpdate({ email }, { $set: { profilePic: imageUrl } }, { new: true });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error while updating profile-photo", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      username,
      password,
      currentPassword,
      startTime,
      reminderTime,
      startOfWeek,
      age,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.startTime = startTime || user.startTime;
    user.reminderTime = reminderTime || user.reminderTime;
    user.startOfWeek = startOfWeek || user.startOfWeek;
    user.age = age || user.age;

    if (password) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current Password is not valid" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const checkAuth = async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json(user);
}
// Google OAuth success handler
export const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      username: req.user.username,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
      authProvider: req.user.authProvider,
    }))}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Google auth success:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_error`);
  }
};

// Google OAuth failure handler
export const googleAuthFailure = (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
};

