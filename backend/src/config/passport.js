import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Ensure environment variables are loaded
dotenv.config();

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this Google ID
                let existingUser = await User.findOne({ googleId: profile.id });

                if (existingUser) {
                    return done(null, existingUser);
                }

                // Check if user exists with the same email
                existingUser = await User.findOne({ email: profile.emails[0].value });

                if (existingUser) {
                    // Link Google account to existing user
                    existingUser.googleId = profile.id;
                    existingUser.avatar = profile.photos[0]?.value || null; // <-- Use avatar
                    existingUser.authProvider = 'google';
                    await existingUser.save();
                    return done(null, existingUser);
                }

                const newUser = new User({
                    username: profile.displayName || profile.name.givenName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0]?.value, // <-- Use avatar
                    authProvider: 'google',
                });

                await newUser.save();
                done(null, newUser);
            } catch (error) {
                console.error('Error in Google Strategy:', error);
                done(error, null);
            }
        }
    )
);

export default passport;
