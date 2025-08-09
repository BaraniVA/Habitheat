import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

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
