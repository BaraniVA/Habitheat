# 🔐 Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for the Habit Heat application.

## Prerequisites

- A Google account
- Access to the [Google Cloud Console](https://console.cloud.google.com/)
- Basic understanding of OAuth 2.0 flow

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Habit Heat OAuth")
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API" or "People API"
3. Click on "Google+ API" and then click "Enable"
4. Also enable "People API" for accessing user profile information

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Habit Heat
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **App domain** (optional): Your domain
   - **Privacy Policy URL** (optional): Link to your privacy policy
   - **Terms of Service URL** (optional): Link to your terms of service
5. Click "Save and Continue"
6. In the "Scopes" section, add the following scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
7. Click "Save and Continue"
8. Add test users (if in testing mode) or submit for verification (for production)

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Enter a name (e.g., "Habit Heat Web Client")
5. Add **Authorized JavaScript origins**:
   - For development: `http://localhost:5173`
   - For production: `https://yourdomain.com`
6. Add **Authorized redirect URIs**:
   - For development: `http://localhost:5000/api/auth/google/callback`
   - For production: `https://your-backend-domain.com/api/auth/google/callback`
7. Click "Create"
8. Copy the **Client ID** and **Client Secret** (you'll need these for your environment variables)

## Step 5: Configure Environment Variables

### For Development (`.env` in backend folder):

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
```

### For Production (`.env.production` in backend folder):

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback

# Frontend URL for redirects
FRONTEND_URL=https://your-frontend-domain.com
```

### For Frontend Production (`.env.production` in frontend folder):

```env
# Production environment variables
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Step 6: Test the Integration

### Development Testing:

1. Start your backend server: `npm run dev` (in backend folder)
2. Start your frontend server: `npm run dev` (in frontend folder)
3. Navigate to `http://localhost:5173`
4. Click "Sign in with Google" on the login page

### Expected Flow:

1. **Frontend**: User clicks "Sign in with Google"
2. **Frontend**: User is redirected to Google OAuth URL
3. **Google**: User authenticates with Google
4. **Backend**: Google redirects to `/api/auth/google/callback`
5. **Backend**: User data is processed and JWT token is created
6. **Frontend**: User is redirected back with token and user data in URL params
7. **Frontend**: Token and user data are stored in localStorage
8. **Frontend**: User is automatically logged in

### Implementation Details:

#### Backend Files Added/Modified:

- ✅ `src/config/passport.js` - Passport Google OAuth strategy configuration
- ✅ `src/controllers/authController.js` - Added Google OAuth handlers
- ✅ `src/routes/auth.js` - Added Google OAuth routes
- ✅ `src/app.js` - Added Passport initialization and session middleware
- ✅ `src/models/User.js` - Updated to support OAuth fields

#### Frontend Files Added/Modified:

- ✅ `src/utils/auth.ts` - OAuth utility functions
- ✅ `src/components/Login.tsx` - Updated with Google OAuth functionality
- ✅ `src/components/Signup.tsx` - Updated with Google OAuth functionality
- ✅ `src/App.tsx` - Updated to handle OAuth callbacks

#### New OAuth Endpoints:

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles Google OAuth callback
- `GET /api/auth/google/failure` - Handles OAuth failures

### User Database Schema:

Users can now have the following authentication providers:

- **Local**: Traditional email/password authentication
- **Google**: Google OAuth authentication

The User model supports:

```javascript
{
  username: String,
  email: String,
  password: String (optional for OAuth users),
  googleId: String (for Google OAuth users),
  profilePicture: String (from Google profile),
  authProvider: 'local' | 'google'
}
```

### Security Features:

- JWT tokens for stateless authentication
- Session-based OAuth flow with Passport.js
- Account linking (if user exists with same email)
- Secure password-less authentication for OAuth users

5. Complete the OAuth flow

### Production Testing:

1. Deploy your backend and frontend
2. Update the OAuth credentials with production URLs
3. Test the complete flow on your production domain

## Step 7: Domain Verification (For Production)

For production applications, you may need to verify domain ownership:

1. Go to "APIs & Services" > "Domain verification"
2. Add your domain and follow the verification process
3. Update your OAuth consent screen with the verified domain

## Common Issues and Troubleshooting

### Error: `redirect_uri_mismatch`

- Ensure the redirect URI in your Google Cloud Console exactly matches the one in your application
- Check for trailing slashes, http vs https, and port numbers

### Error: `invalid_client`

- Verify your Client ID and Client Secret are correct
- Check that you're using the right environment variables

### Error: `access_denied`

- User canceled the OAuth flow
- Check OAuth consent screen configuration

### Error: `unauthorized_client`

- Ensure your application type is set to "Web application"
- Verify authorized origins and redirect URIs are correct

## Security Best Practices

1. **Never commit credentials**: Keep your `.env` files in `.gitignore`
2. **Use HTTPS in production**: Always use HTTPS for production OAuth flows
3. **Rotate secrets regularly**: Update your client secret periodically
4. **Limit scope**: Only request the minimum required permissions
5. **Validate tokens**: Always validate OAuth tokens on your backend

## OAuth Flow Diagram

```
User → Frontend → Google OAuth → Backend → Database
  ↓        ↓           ↓           ↓         ↓
Login → Redirect → Authorize → Callback → Store User
```

## Environment Variables Reference

| Variable               | Description                                       | Example                                               |
| ---------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | OAuth 2.0 Client ID from Google Cloud Console     | `123456789-abc.apps.googleusercontent.com`            |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console | `GOCSPX-abcdef123456`                                 |
| `GOOGLE_CALLBACK_URL`  | Backend callback URL for OAuth flow               | `https://api.yourdomain.com/api/auth/google/callback` |
| `FRONTEND_URL`         | Frontend URL for redirects after authentication   | `https://yourdomain.com`                              |

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Passport.js Google Strategy Documentation](https://www.passportjs.org/packages/passport-google-oauth20/)

## Support

If you encounter issues with Google OAuth setup, please:

1. Check the troubleshooting section above
2. Verify all environment variables are correctly set
3. Ensure your Google Cloud Console configuration matches your application URLs
4. Check the browser developer console for detailed error messages

For additional help, create an issue in the repository with:

- Error messages
- Your OAuth configuration (without sensitive credentials)
- Steps to reproduce the issue
