import React, { useEffect, useState } from 'react';
import { 
  // User, 
  Edit3, 
  Camera, 
  Flame, 
  Trophy, 
  CheckCircle, 
  Star, 
  Award, 
  Calendar,
  Smile,
  // Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  completedDate: string;
}

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  date: string;
  note?: string;
}

interface ProfilePageProps {
  theme: Theme;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'mood'>('achievements');
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    currentStreak: 15,
    longestStreak: 42,
    habitsCompleted: 218,
    joinDate: "January 2024"
  });

  // Load user data from localStorage after login
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserProfile(prev => ({
            ...prev,
            name: userData.username || userData.name || "John Doe",
            email: userData.email || "john.doe@example.com"
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Tab title
  useEffect(() => {
    document.title = "Habit Heat - My Profile";
  }, []);

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "30-Day Champion",
      description: "Completed 30 consecutive days of habits",
      badge: "🏆",
      completedDate: "July 20, 2024"
    },
    {
      id: "2",
      title: "Early Bird",
      description: "Completed morning routine 50 times",
      badge: "🌅",
      completedDate: "July 15, 2024"
    },
    {
      id: "3",
      title: "Consistency King",
      description: "Maintained a 14-day streak",
      badge: "👑",
      completedDate: "July 10, 2024"
    },
    {
      id: "4",
      title: "Habit Master",
      description: "Completed 200+ habits total",
      badge: "⭐",
      completedDate: "July 5, 2024"
    }
  ];

  const moodHistory: MoodEntry[] = [
    {
      id: "1",
      mood: "Happy",
      emoji: "😊",
      date: "July 24, 2024",
      note: "Great workout session today!"
    },
    {
      id: "2",
      mood: "Motivated",
      emoji: "💪",
      date: "July 23, 2024",
      note: "Feeling energized and ready to tackle goals"
    },
    {
      id: "3",
      mood: "Calm",
      emoji: "😌",
      date: "July 22, 2024",
      note: "Peaceful meditation session"
    },
    {
      id: "4",
      mood: "Excited",
      emoji: "🎉",
      date: "July 21, 2024",
      note: "Hit a new personal record!"
    }
  ];

  // Animation: Main container entrance
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        {/* Animation: Header entrance */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your profile and track your progress</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            {/* Animation: Avatar card entrance */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-8 border border-gray-200 dark:border-gray-700"
            >
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <button className="mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2 mx-auto">
                  <Camera size={16} />
                  Change Picture
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{userProfile.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-1">{userProfile.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member since {userProfile.joinDate}</p>
              </div>

              {/* Edit Profile Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                <Edit3 size={18} />
                Edit Profile
              </button>
            </motion.div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Section */}
            {/* Animation: Stats card entrance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="text-blue-600 dark:text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Streak */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="text-orange-500 dark:text-orange-400" size={24} />
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userProfile.currentStreak}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Current Streak</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Days in a row</p>
                </div>

                {/* Longest Streak */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="text-yellow-500 dark:text-yellow-400" size={24} />
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{userProfile.longestStreak}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Longest Streak</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Personal best</p>
                </div>

                {/* Habits Completed */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="text-green-500 dark:text-green-400" size={24} />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{userProfile.habitsCompleted}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Habits Completed</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total count</p>
                </div>
              </div>
            </motion.div>

            {/* Activity Section */}
            {/* Animation: Activity card entrance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-blue-600 dark:text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity</h3>
              </div>

              {/* Tabs */}
              {/* Animation: Tab buttons interactive */}
              <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'achievements'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Award size={16} />
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('mood')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'mood'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Smile size={16} />
                  Mood History
                </button>
              </div>

              {/* Tab Content */}
              {/* Animation: Tab content transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="min-h-[300px]"
                >
                  {activeTab === 'achievements' && (
                    <div className="space-y-4">
                      {achievements.map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="text-2xl">{achievement.badge}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {achievement.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                              {achievement.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar size={12} />
                              {achievement.completedDate}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'mood' && (
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700/50 mb-6"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{moodHistory[0]?.emoji}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Last Mood: {moodHistory[0]?.mood}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{moodHistory[0]?.date}</p>
                          </div>
                        </div>
                      </motion.div>
                      {moodHistory.map((mood) => (
                        <motion.div
                          key={mood.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="text-2xl">{mood.emoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{mood.mood}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{mood.date}</span>
                            </div>
                            {mood.note && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm">{mood.note}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;