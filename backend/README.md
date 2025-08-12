# Habit Heat Server

## 🚀 Overview

This is the backend API server for Habit Heat, a habit tracking application. Built with Express.js, MongoDB, and JWT authentication, it provides secure user authentication and data management capabilities.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment**: dotenv for configuration
- **Development**: nodemon for hot reloading
- **CORS**: Enabled for cross-origin requests

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or cloud)
- npm or yarn package manager

### 1. Clone and Navigate
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the environment template and configure your settings:
```bash
cp .env.example .env
```
Edit `.env` file with your configuration


### 4. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 🔐 API Endpoints

### Authentication Routes
Base URL: `/api/auth`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/signup` | Register new user | `{ username, email, password }` |
| POST | `/login` | User login | `{ email, password }` |

### Example Requests

**User Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**User Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with JSON Web Tokens
- **CORS Protection**: Configured for cross-origin resource sharing
- **Input Validation**: Server-side validation for all endpoints
- **Error Handling**: Global error handling middleware

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `MONGODB_URI` | MongoDB connection string | `your-mongodb-atlas-uri` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | `your-secret-key` |
| `DB_NAME` | Database name | `habitheat` |

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling tool
- **bcrypt**: Password hashing library
- **jsonwebtoken**: JWT implementation
- **cors**: CORS middleware
- **dotenv**: Environment variable loader

### Development Dependencies
- **nodemon**: Development server with auto-restart

## 🔍 Database Schema

### User Model
```javascript
{
  username: String (required, min: 3 chars)
  email: String (required, unique, email)
  password: String (required, min: 6 chars, hashed)
}
```

## 🛡️ Error Handling

The server includes comprehensive error handling:
- **Validation Errors**: Invalid input data
- **Authentication Errors**: Invalid credentials
- **Database Errors**: Connection and query issues
- **Server Errors**: Internal server problems

## 📝 Development Guidelines

### Adding New Routes
1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Import and use in `src/app.js`
4. Update this README

## 📄 License

This project is licensed under the ISC License.

---


