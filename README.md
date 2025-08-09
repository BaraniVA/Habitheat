# 🔥 Habit Heat

A modern, feature-rich habit tracking application built with React and TypeScript. Track your daily habits, build streaks, earn achievements, and maintain consistency with powerful analytics and gamification features.

## ✨ Features

### 🎯 Core Habit Tracking

- **Create Custom Habits**: Add personalized habits with emojis, colors, and categories
- **Daily Completion**: Mark habits as complete with a simple, intuitive interface
- **Streak Tracking**: Monitor current and longest streaks for motivation
- **Visual Heatmap**: See your progress at a glance with GitHub-style heatmaps
- **Habit Archives**: Archive completed or outdated habits to keep your dashboard clean

### 📊 Analytics & Insights

- **Completion Statistics**: Track completion rates, total completions, and missed days
- **Weekly & Monthly Progress**: Monitor short and long-term trends
- **Best Performance Analysis**: Identify your best performing habits and optimal days
- **Consistency Scoring**: Measure how consistently you maintain habits
- **Smart Insights**: Get personalized recommendations based on your patterns

### 🏆 Gamification

- **Achievement System**: Unlock achievements for milestones and consistent performance
- **Challenge System**: Take on personalized challenges to push your limits
- **Progress Rewards**: Earn badges and rewards for maintaining streaks
- **Difficulty Levels**: Habits categorized by difficulty (easy, medium, hard)

### 🎨 User Experience

- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Habit Templates**: Quick-start with pre-made habit templates
- **Custom Categories**: Organize habits by Health, Learning, Mindfulness, etc.
- **Priority Levels**: Set habit priorities to focus on what matters most

### 🧠 Mood Tracking

- **Daily Mood Logging**: Track your emotional state with a 5-point scale
- **Energy & Stress Levels**: Monitor energy and stress alongside mood
- **Mood History**: Review past moods to identify patterns
- **Personal Notes**: Add reflections and thoughts to your daily mood entries

### � Authentication & Security

- **User Authentication**: Secure login and registration system
- **Google OAuth**: Sign in with your Google account for convenience
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Profile Management**: Manage your account and preferences
- **Data Privacy**: Your data is securely stored and protected

### �🔧 Advanced Features

- **Local Storage**: All data stored locally on your device
- **Quick Actions**: Rapidly complete today's habits from the dashboard
- **Habit Details**: Deep dive into individual habit statistics and history
- **Smart Filtering**: Filter habits by status, priority, or performance
- **Export Ready**: Data structured for easy backup and analysis

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/habit-heat.git
cd habit-heat
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start using Habit Heat!

### Backend Setup (Optional - for Authentication)

The application includes a Node.js backend for user authentication and data persistence:

1. **Navigate to backend folder**

```bash
cd backend
```

2. **Install backend dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Required: MongoDB URI, JWT Secret
# Optional: Google OAuth credentials (see Google OAuth Setup Guide)
```

4. **Start the backend server**

```bash
npm run dev
```

### Google OAuth Setup

For Google OAuth authentication, follow our comprehensive setup guide:

📖 **[Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md)**

This guide covers:

- Creating a Google Cloud Project
- Configuring OAuth consent screen
- Setting up OAuth 2.0 credentials
- Environment variable configuration
- Troubleshooting common issues

## 📱 Usage

### Creating Your First Habit

1. Click the "+" button or "Add Habit" on the dashboard
2. Choose from pre-made templates or create a custom habit
3. Set your habit name, emoji, color, and category
4. Configure target days and estimated time
5. Add motivational quotes or custom rewards (optional)

### Daily Tracking

- Use the dashboard to quickly mark today's habits as complete
- View your current streaks and completion rates
- Check the mini-heatmap to see recent progress patterns

### Viewing Progress

- Navigate to **Insights** for detailed analytics
- Check **Achievements** to see unlocked milestones
- Visit **Challenges** to take on new goals
- Use **Mood Tracker** to log emotional well-being

### Customization

- Toggle between light and dark themes
- Sort habits by various criteria (streak, completion rate, etc.)
- Filter habits by status or priority
- Archive habits you no longer need

## 🏗️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful, customizable icons

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware with Google OAuth
- **bcrypt** - Password hashing and security

### Build Tools

- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

### Features

- **Authentication System** - User registration and login with Google OAuth
- **Local Storage** - Client-side data persistence
- **Responsive Design** - Mobile-first approach
- **Theme System** - Dark/light mode support
- **Component Architecture** - Modular, reusable components

## 📁 Project Structure

### 🎯 Frontend Structure

```
project/                 # Frontend React application
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx           # Main dashboard view
│   │   ├── HabitCard.tsx          # Individual habit display
│   │   ├── HabitDetail.tsx        # Detailed habit view
│   │   ├── AddHabitModal.tsx      # Habit creation modal
│   │   ├── InsightsView.tsx       # Analytics and insights
│   │   ├── AchievementsView.tsx   # Achievement system
│   │   ├── ChallengesView.tsx     # Challenge system
│   │   ├── MoodTracker.tsx        # Mood logging
│   │   ├── HabitTemplatesView.tsx # Pre-made templates
│   │   ├── Login.tsx              # User authentication login
│   │   ├── Signup.tsx             # User registration
│   │   ├── Header.tsx             # Navigation header with logout
│   │   ├── Footer.tsx             # Application footer
│   │   ├── ProfilePage.tsx        # User profile management
│   │   ├── Heatmap.tsx            # Progress visualization
│   │   ├── MiniHeatmap.tsx        # Compact progress view
│   │   ├── HabitStats.tsx         # Habit statistics display
│   │   ├── QuickActions.tsx       # Quick habit completion
│   │   ├── SelfCareTip.tsx        # Wellness tips
│   │   ├── AchievementNotification.tsx # Achievement alerts
│   │   ├── WidgetSettingsModal.tsx # Widget configuration
│   │   └── widgets/               # Dashboard widgets
│   │       ├── CurrentStreakWidget.tsx      # Streak display
│   │       ├── DailyCompletionRateWidget.tsx # Daily progress
│   │       └── TotalHabitsCompletedWidget.tsx # Total completion stats
│   ├── hooks/              # Custom React hooks
│   │   ├── useHabits.ts           # Habit management logic
│   │   └── useTheme.ts            # Theme management
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx          # Main dashboard page
│   │   ├── InsightsView.tsx       # Analytics page
│   │   ├── AchievementsView.tsx   # Achievements page
│   │   ├── ChallengesView.tsx     # Challenges page
│   │   ├── HabitTemplatesView.tsx # Templates page
│   │   ├── MoodTracker.tsx        # Mood tracking page
│   │   ├── ProfilePage.tsx        # User profile page
│   │   └── NotFound.tsx           # 404 error page
│   ├── types/              # TypeScript definitions
│   │   └── index.ts               # All type definitions
│   ├── utils/              # Utility functions
│   │   ├── storage.ts             # Local storage helpers
│   │   ├── habitStats.ts          # Statistics calculations
│   │   ├── achievements.ts        # Achievement logic
│   │   ├── challenges.ts          # Challenge system
│   │   ├── insights.ts            # Analytics generation
│   │   ├── habitTemplates.ts      # Pre-made habit templates
│   │   ├── motivationalQuotes.ts  # Inspirational quotes
│   │   └── dateUtils.ts           # Date manipulation utilities
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/
│   └── fevicon.png             # Application favicon
├── .env.production             # Frontend prod environment variables
└── index.html                  # HTML entry point
```

### 🏗️ Backend Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Authentication business logic
│   │   ├── habitController.js     # Habit management logic
│   │   └── bulkController.js      # Bulk operations
│   ├── config/
│   │   └── passport.js            # Passport.js Google OAuth configuration
│   ├── db/
│   │   └── connect.js             # Database connection configuration
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication middleware
│   │   ├── errorHandler.js        # Global error handling middleware
│   │   ├── ratelimiting.js        # Rate limiting middleware
│   │   └── validation.js          # Input validation middleware
│   ├── models/
│   │   ├── User.js                # User schema and model (with Google OAuth)
│   │   └── habitModel.js          # Habit schema and model
│   ├── routes/
│   │   ├── auth.js                # Authentication routes (including Google OAuth)
│   │   ├── habitRoutes.js         # Habit management routes
│   │   └── bulkRoutes.js          # Bulk operation routes
│   ├── utils/
│   │   ├── fileHandler.js         # File upload handling
│   │   └── sanitizer.js           # Data sanitization utilities
│   ├── app.js                     # Express app configuration
│   └── index.js                   # Server entry point
├── uploads/                       # File upload directory
├── exports/                       # Data export directory
├── .env.example                   # Environment variables template
├── .env.production                # Production environment variables (with Google OAuth)
└── README.md                      # Server documentation
```

## 🎯 Key Components

### Habit Management

- **HabitCard**: Displays habit summary with mini-heatmap
- **HabitDetail**: Full habit view with detailed statistics
- **AddHabitModal**: Streamlined habit creation process

### Analytics

- **InsightsView**: Comprehensive analytics dashboard
- **HabitStats**: Advanced statistics calculations
- **Progress Tracking**: Visual progress indicators

### Gamification

- **AchievementsView**: Achievement gallery and progress
- **ChallengesView**: Active and available challenges
- **Achievement System**: Automated milestone detection

## 🔒 Data & Privacy

- **Secure Authentication**: JWT-based authentication with optional Google OAuth
- **Data Protection**: User data securely stored in MongoDB with proper encryption
- **Privacy First**: Minimal data collection, only essential information
- **User Control**: Full control over your account and data
- **No Tracking**: No unnecessary analytics or user tracking
- **HTTPS Security**: All production traffic encrypted and secure

## 🌟 Features in Detail

### Habit Templates

Pre-configured habits across categories:

- **Health & Fitness**: Exercise, water intake, healthy eating
- **Learning**: Reading, language practice, skill development
- **Mindfulness**: Meditation, gratitude journaling
- **Digital Wellness**: Screen time limits, no-phone mornings

### Achievement System

Unlock achievements for:

- Creating your first habit
- Maintaining streaks (7, 30, 100+ days)
- Achieving perfect completion rates
- Building multiple habits
- Consistency milestones

### Challenge System

- **Streak Challenges**: Build long-term consistency
- **Completion Challenges**: Hit specific targets
- **Multi-Habit Challenges**: Complete multiple habits daily
- **Consistency Challenges**: Maintain high completion rates

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our coding standards
4. **Test your changes** locally
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** using our PR template

### 📋 Pull Request Guidelines

- Fill out the PR template completely
- Include screenshots for UI changes
- Write clear commit messages
- Ensure all tests pass
- Update documentation if needed
- Follow TypeScript and React best practices

### 🏗️ Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/habit-heat.git
cd habit-heat

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Configure backend environment
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and optional Google OAuth credentials
cd ..

# Start backend server (in one terminal)
cd backend && npm run dev

# Start frontend development server (in another terminal)
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

For Google OAuth setup, see the [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by habit tracking methodologies and gamification principles

## 📧 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the TypeScript definitions in `/src/types`

---

**Start building better habits today with Habit Heat!** 🔥

_Turn your daily routines into powerful habits that stick._

<p align="center">
  <a href="#top">⬆️ Back to Top</a>
</p>
