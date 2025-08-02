import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if user exists with same email but different provider
        existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
            // Link Google account to existing local account
            existingUser.googleId = profile.id;
            existingUser.avatar = profile.photos[0]?.value || existingUser.avatar;
            existingUser.isEmailVerified = true;
            await existingUser.save();
            return done(null, existingUser);
        }

        // Create new user
        const newUser = new User({
            googleId: profile.id,
            username: profile.displayName || profile.name.givenName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value,
            provider: 'google',
            isEmailVerified: true,
        });

        await newUser.save();
        return done(null, newUser);

    } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
