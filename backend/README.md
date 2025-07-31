# Habit Heat Server

## 🚀 Overview

Habit Heat Server is a comprehensive RESTful API for habit tracking and management. Built with Express.js and MongoDB, it provides secure user authentication, advanced habit management with statistics, bulk operations, and data export/import capabilities. The server features MongoDB aggregation pipelines, text search, rate limiting, and production-ready optimizations.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Processing**: Multer for file uploads, Papaparse for CSV processing
- **Security**: Helmet.js, CORS, Rate limiting
- **Development**: nodemon for hot reloading
- **Performance**: MongoDB indexing and aggregation pipelines

## 📁 Project Structure

```
habit-heat-server/
├── src/
│   ├── config/
│   │   └── database.js             # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js       # Authentication operations
│   │   ├── habitController.js      # Main habit CRUD operations
│   │   └── bulkController.js       # Bulk operations (import/export)
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication middleware
│   │   ├── validation.js           # Request validation middleware
│   │   ├── rateLimiting.js         # Rate limiting configuration
│   │   └── errorHandler.js         # Error handling middleware
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication routes
│   │   ├── habitRoutes.js          # Individual habit routes
│   │   └── bulkRoutes.js           # Bulk operation routes
│   ├── models/
│   │   ├── User.js                 # User schema and model
│   │   └── habitModel.js           # Habit schema and model
│   ├── utils/
│   │   ├── sanitizer.js            # Data sanitization utilities
│   │   └── fileHandler.js          # File upload configuration
│   └── app.js                      # Express app configuration
├── uploads/                        # Temporary file uploads
├── exports/                        # Generated export files
├── .env                           # Environment variables
├── package.json                    # Dependencies and scripts
└── server.js                       # Server entry point
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone and Navigate
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup Options

**Option A: Local MongoDB**
```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt install mongodb

# Start MongoDB
sudo service mongod start
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get connection string
4. Add to `.env` file

**Option C: Docker**
```bash
docker run --name habitheat-mongo -p 27017:27017 -d mongo:latest
```

### 4. Environment Configuration
Copy the environment template and configure your settings:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/habitheat
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habitheat

# Authentication
JWT_SECRET_KEY=your-super-secure-jwt-secret-key

# Database
DB_NAME=habitheat

# Optional: For production
# BCRYPT_ROUNDS=12
```

### 5. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

The server will start on `http://localhost:5000`

## 🗄️ Database Schema

### User Schema (MongoDB Collection: `users`)
```javascript
{
  _id: ObjectId("..."),
  username: "johndoe",           // String (required, min: 3 chars, unique)
  email: "john@example.com",     // String (required, unique, email format)
  password: "hashedPassword",    // String (required, min: 6 chars, bcrypt hashed)
  createdAt: ISODate("..."),     // Auto-generated
  updatedAt: ISODate("...")      // Auto-generated
}
```

### Habit Schema (MongoDB Collection: `habits`)
```javascript
{
  _id: ObjectId("..."),
  name: "Morning Exercise",                    // String (required, 1-100 chars)
  description: "30 minutes of cardio exercise", // String (optional, max 500 chars)
  category: "fitness",                         // Enum: health, productivity, learning, fitness, mindfulness, social, other
  frequency: "daily",                          // Enum: daily, weekly, monthly
  targetValue: 30,                            // Number (optional, 1-1000)
  unit: "minutes",                            // String (optional, max 20 chars)
  isActive: true,                             // Boolean (default: true)
  reminderTime: "07:00",                      // String (HH:MM format)
  tags: ["morning", "cardio", "health"],      // Array (max 10 tags, each max 30 chars)
  streak: 5,                                  // Number (auto-calculated)
  completedDates: [ISODate("..."), ...],     // Array of completion dates
  userId: ObjectId("..."),                    // Reference to User
  createdAt: ISODate("..."),                  // Auto-generated
  updatedAt: ISODate("..."),                  // Auto-generated
  
  // Virtual field (computed)
  completionRate: 85.5                        // Percentage based on frequency
}
```

### Database Indexes for Performance
```javascript
// Compound indexes for common queries
db.habits.createIndex({ userId: 1, category: 1 })
db.habits.createIndex({ userId: 1, isActive: 1 })
db.habits.createIndex({ userId: 1, createdAt: -1 })

// Text index for search functionality
db.habits.createIndex({ 
  name: "text", 
  description: "text", 
  tags: "text" 
})
```

## 🔐 API Endpoints

### Authentication Routes
Base URL: `/api/auth`

| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/signup` | Register new user | `{ username, email, password }` | `{ token, user }` |
| POST | `/login` | User login | `{ email, password }` | `{ token, user }` |

### Habit Management Routes
Base URL: `/api/habits` (Protected - requires JWT token)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all habits with pagination/filtering | ✅ |
| GET | `/:id` | Get single habit by ID | ✅ |
| POST | `/` | Create new habit | ✅ |
| PUT | `/:id` | Update existing habit | ✅ |
| DELETE | `/:id` | Delete habit | ✅ |
| POST | `/:id/complete` | Mark habit as completed | ✅ |
| GET | `/stats` | Get habit statistics | ✅ |

### Bulk Operations Routes
Base URL: `/api/habits/bulk` (Protected - rate limited)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/import` | Import habits from CSV/JSON | 10/15min |
| GET | `/export` | Export habits to CSV/JSON | 10/15min |
| DELETE | `/delete` | Bulk delete habits | 10/15min |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## 🔒 Authentication & Security

### JWT Authentication
All habit-related endpoints require JWT authentication:

```bash
# Include JWT token in Authorization header
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/habits
```

### Security Features
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Stateless authentication
- **Rate Limiting**: 
  - General endpoints: 100 requests/15 minutes
  - Bulk operations: 10 requests/15 minutes
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: Comprehensive server-side validation
- **Data Sanitization**: XSS protection
- **Helmet.js**: Security headers

## 📊 Advanced Features

### 1. Habit Statistics with MongoDB Aggregation
```javascript
// Example aggregation pipeline for statistics
const stats = await Habit.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  {
    $group: {
      _id: null,
      totalHabits: { $sum: 1 },
      activeHabits: {
        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
      },
      averageStreak: { $avg: '$streak' },
      categories: { $push: '$category' },
      frequencies: { $push: '$frequency' }
    }
  }
]);
```

### 2. Text Search Capabilities
```bash
# Search across habit name, description, and tags
GET /api/habits?search=exercise morning
```

### 3. Advanced Filtering
```bash
# Complex filtering example
GET /api/habits?category=fitness&isActive=true&page=2&limit=20
```

### 4. Bulk Operations
- **CSV Import/Export**: Full CSV processing with Papaparse
- **JSON Import/Export**: Native JSON support
- **Bulk Delete**: Multiple habit deletion with detailed response

### 5. Virtual Fields
- **Completion Rate**: Automatically calculated based on frequency and completion history
- **Streak Calculation**: Smart streak calculation considering habit frequency

## 📝 API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create Habit
```bash
curl -X POST http://localhost:5000/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Morning Exercise",
    "description": "30 minutes of cardio",
    "category": "fitness",
    "frequency": "daily",
    "targetValue": 30,
    "unit": "minutes",
    "reminderTime": "07:00",
    "tags": ["morning", "cardio"]
  }'
```

### Get Habits with Filtering
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:5000/api/habits?category=fitness&isActive=true&page=1&limit=10"
```

### Mark Habit Complete
```bash
curl -X POST http://localhost:5000/api/habits/HABIT_ID/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"date": "2025-01-01T00:00:00.000Z"}'
```

### Export Habits
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:5000/api/habits/bulk/export?format=csv"
```

### Import Habits
```bash
curl -X POST http://localhost:5000/api/habits/bulk/import \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@habits.csv"
```

## 🛡️ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // Detailed validation errors if applicable
}
```

### Error Types
- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be between 1 and 100 characters"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Rate Limit Error (429):**
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

## 📦 Dependencies

### Production Dependencies
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.0.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "helmet": "^7.0.0",
  "express-rate-limit": "^7.0.0",
  "multer": "^1.4.5",
  "papaparse": "^5.4.0",
  "express-validator": "^7.0.0"
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.0.0"
}
```

## 🚀 Production Deployment

### Environment Considerations
1. **Database**: Use MongoDB Atlas or properly secured MongoDB instance
2. **Environment Variables**: Secure JWT secret, proper MongoDB URI
3. **Rate Limiting**: Adjust limits based on expected traffic
4. **Logging**: Add structured logging (Winston/Bunyan)
5. **Monitoring**: Implement health checks and performance monitoring
6. **SSL/TLS**: Use HTTPS in production
7. **Process Management**: Use PM2 or similar for process management

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Performance Optimizations
- MongoDB connection pooling
- Database indexing strategy
- Response compression
- Caching strategies (Redis integration)
- Request/response optimization

## 🧪 Testing

### Test Database Setup
```javascript
// Use MongoDB Memory Server for testing
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

## 📈 Monitoring & Maintenance

### Health Check Endpoint
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Habit Heat API is running",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "database": "connected"
}
```

### Key Metrics to Monitor
- API response times
- Database query performance
- Authentication success/failure rates
- Rate limiting triggers
- Memory and CPU usage
- Active user sessions

## 📄 License

This project is licensed under the ISC License.

---

**Need Help?** Check the API documentation or contact the development team for support.