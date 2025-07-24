# HabitHeat Backend

This is the backend component of HabitHeat

## 🛠️ Features

- ✅ User registration (`/api/auth/register`)
- ✅ User login (`/api/auth/login`)
- 🔐 Password hashing with bcrypt
- 🔐 JWT token generation for session-less auth
- ⚠️ Error handling (duplicate user, invalid credentials)
- 📦 MongoDB for user storage

---

## 📁 File Structure

backend/
├── controllers/
│ └── authController.js
├── models/
│ └── User.js
├── routes/
│ └── authRoutes.js
├── .env
├── server.js
├── package.json

---


---

## 🚀 Getting Started

### 1. Clone the repository

```bash
    git clone https://github.com/Habitheat.git
    cd server 
```

### 2. Install dependencies 

```bash
    npm install
```

### 3. Set Up Environment Variables

```bash
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
```

### 4. Run the server 

```bash
    node server.js
```