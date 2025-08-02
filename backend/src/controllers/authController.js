import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

// Helper function to create user response
const createUserResponse = (user, token) => {
  return {
    message: "Authentication successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

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
      provider: 'local',
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

    // Check if user signed up with Google
    if (existingUser.provider === 'google') {
      return res.status(400).json({
        message: "Please login with Google. This account was created using Google OAuth."
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(existingUser._id);

    return res.status(200).json(createUserResponse(existingUser, token));
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

// Google OAuth Success Callback
export const googleAuthSuccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "Google authentication failed" });
    }

    const token = generateToken(req.user._id);
    const userResponse = createUserResponse(req.user, token);

    // Redirect to frontend with token in URL params
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userResponse.user))}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Google auth success:", error);
    next(error);
  }
};

// Google OAuth Failure Callback
export const googleAuthFailure = (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = `${frontendUrl}/auth/failure?error=google_auth_failed`;
  res.redirect(redirectUrl);
};

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    next(error);
  }
};
