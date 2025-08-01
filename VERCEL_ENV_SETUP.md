# Vercel Environment Variables Setup Instructions

## CRITICAL: Set these environment variables in your Vercel dashboard

Go to your Vercel project dashboard → Settings → Environment Variables

Add the following variables:

### Required Variables:
1. **MONGODB_URI**
   - Value: Your MongoDB connection string
   - Example: mongodb+srv://username:password@cluster.mongodb.net/habitheat?retryWrites=true&w=majority

2. **JWT_SECRET_KEY**
   - Value: A secure random string (at least 32 characters)
   - Example: your-super-secure-jwt-secret-key-here-32chars-minimum

3. **NODE_ENV**
   - Value: production

4. **DB_NAME**
   - Value: Your database name (optional if included in MONGODB_URI)

### How to set them:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to select "Production", "Preview", and "Development" for each variable

### After setting variables:
1. Redeploy your application
2. Check the function logs in Vercel dashboard for any errors

## Common Issues:
- Make sure your MongoDB connection string is correct
- Ensure your MongoDB cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges
- JWT_SECRET_KEY should be the same as what you use locally
