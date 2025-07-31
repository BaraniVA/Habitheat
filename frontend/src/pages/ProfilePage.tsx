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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header with fade-in animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-slide-down">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 animate-slide-down-delayed">Manage your profile and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info with slide-in animation */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ease-in-out">
              {/* Avatar Section with pulse animation on hover */}
              <div className="text-center mb-6">
                <div className="relative inline-block group">
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-12">
                    <Camera size={16} />
                  </button>
                </div>
                <button className="mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2 mx-auto">
                  <Camera size={16} />
                  Change Picture
                </button>
              </div>

              {/* User Info with staggered animation */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in-up">"{userProfile.name}"</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-1 animate-fade-in-up-delayed">{userProfile.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up-delayed-2">Member since {userProfile.joinDate}</p>
              </div>

              {/* Edit Profile Button with bounce animation on hover */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 font-medium animate-fade-in-up-delayed-3">
                <Edit3 size={18} className="transition-transform duration-200 ease-in-out group-hover:rotate-12" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Activity with slide-in animation */}
          <div className="lg:col-span-2 space-y-8 animate-slide-in-right">
            {/* Statistics Section with stagger animation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ease-in-out">
              <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
                <Star className="text-blue-600 dark:text-blue-400 animate-pulse" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Streak with scale animation on hover */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700/50 hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in-up-delayed">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="text-orange-500 dark:text-orange-400 animate-bounce" size={24} />
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400 animate-count-up">{userProfile.currentStreak}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Current Streak</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Days in a row</p>
                </div>

                {/* Longest Streak with scale animation on hover */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700/50 hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in-up-delayed-2">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="text-yellow-500 dark:text-yellow-400 animate-pulse" size={24} />
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 animate-count-up">{userProfile.longestStreak}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Longest Streak</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Personal best</p>
                </div>

                {/* Habits Completed with scale animation on hover */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-700/50 hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in-up-delayed-3">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="text-green-500 dark:text-green-400 animate-pulse" size={24} />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400 animate-count-up">{userProfile.habitsCompleted}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Habits Completed</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total count</p>
                </div>
              </div>
            </div>

            {/* Activity Section with fade-in animation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ease-in-out animate-fade-in-up-delayed-4">
              <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
                <Zap className="text-blue-600 dark:text-blue-400 animate-pulse" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity</h3>
              </div>

              {/* Tabs with smooth transition animation */}
              <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center gap-2 hover:scale-105 ${
                    activeTab === 'achievements'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm animate-tab-active'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Award size={16} className="transition-transform duration-200 ease-in-out group-hover:rotate-12" />
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('mood')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center gap-2 hover:scale-105 ${
                    activeTab === 'mood'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm animate-tab-active'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Smile size={16} className="transition-transform duration-200 ease-in-out group-hover:rotate-12" />
                  Mood History
                </button>
              </div>

              {/* Tab Content with slide transition animation */}
              <div className="min-h-[300px] relative">
                {activeTab === 'achievements' && (
                  <div className="space-y-4 animate-slide-in-up">
                    {achievements.map((achievement, index) => (
                      <div
                        key={achievement.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="text-2xl animate-bounce">{achievement.badge}</div>
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
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'mood' && (
                  <div className="space-y-4 animate-slide-in-up">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700/50 mb-6 animate-fade-in-up">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl animate-bounce">{moodHistory[0]?.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Last Mood: {moodHistory[0]?.mood}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{moodHistory[0]?.date}</p>
                        </div>
                      </div>
                    </div>

                    {moodHistory.map((mood, index) => (
                      <div
                        key={mood.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="text-2xl animate-bounce">{mood.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{mood.mood}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{mood.date}</span>
                          </div>
                          {mood.note && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{mood.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        /* Fade-in animation for page load */
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }

        /* Slide-down animation for headers */
        .animate-slide-down {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slide-down-delayed {
          animation: slideDown 0.6s ease-out 0.2s both;
        }

        /* Slide-in animations for columns */
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out 0.2s both;
        }

        /* Fade-in-up animations with delays */
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fade-in-up-delayed {
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .animate-fade-in-up-delayed-2 {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-up-delayed-3 {
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .animate-fade-in-up-delayed-4 {
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        /* Slide-in-up animation for tab content */
        .animate-slide-in-up {
          animation: slideInUp 0.5s ease-out;
        }

        /* Tab active animation */
        .animate-tab-active {
          animation: tabActive 0.3s ease-out;
        }

        /* Count-up animation for statistics */
        .animate-count-up {
          animation: countUp 1s ease-out;
        }

        /* Keyframe definitions */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes tabActive {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes countUp {
          from { 
            opacity: 0; 
            transform: scale(0.5); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;