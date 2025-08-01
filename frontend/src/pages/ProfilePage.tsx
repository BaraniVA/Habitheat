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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editWorking, setEditWorking] = useState(false);
  const [avatarWorking, setAvatarWorking] = useState(false);
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  // Load user data from backend after login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const userData = await res.json();
        setUserProfile(prev => ({
          ...prev,
          name: userData.username || userData.name || "John Doe",
          email: userData.email || "john.doe@example.com",
          avatar: userData.avatar || prev.avatar,
        }));
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    fetchProfile();
  }, []);

  // Flash message timeout
  useEffect(() => {
    if (flash) {
      const t = setTimeout(() => setFlash(null), 2500);
      return () => clearTimeout(t);
    }
  }, [flash]);

  // Handlers
  const handleEditProfile = () => {
    setEditName(userProfile.name);
    setShowEditModal(true);
  };

  const handleUpdateName = async () => {
    setEditWorking(true);
    try {
      console.log('Sending update name request:', editName);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: editName })
      });
      console.log('Update name response status:', res.status);
      if (!res.ok) throw new Error('Failed to update name');
      const updated = await res.json();
      console.log('Update name response data:', updated);
      setUserProfile(prev => ({ ...prev, name: updated.username || updated.name }));
      localStorage.setItem('user', JSON.stringify(updated));
      setFlash({ type: 'success', message: 'Name updated successfully!' });
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating name:', err);
      setFlash({ type: 'error', message: 'Failed to update name.' });
    } finally {
      setEditWorking(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 2MB limit (in bytes)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFlash({ type: 'error', message: 'Image size exceeds 2MB limit.' });
      return;
    }
    setAvatarWorking(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          console.log('Sending update avatar request');
          const base64 = reader.result;
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ avatar: base64 })
          });
          console.log('Update avatar response status:', res.status);
          if (!res.ok) throw new Error('Failed to update avatar');
          const updated = await res.json();
          console.log('Update avatar response data:', updated);
          setUserProfile(prev => ({ ...prev, avatar: updated.avatar }));
          localStorage.setItem('user', JSON.stringify(updated));
          setFlash({ type: 'success', message: 'Avatar updated successfully!' });
        } catch (err) {
          console.error('Error updating avatar:', err);
          setFlash({ type: 'error', message: 'Failed to update avatar.' });
        } finally {
          setAvatarWorking(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error updating avatar:', err);
      setFlash({ type: 'error', message: 'Failed to update avatar.' });
      setAvatarWorking(false);
    }
  };

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
                  <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 ease-in-out hover:scale-110 hover:rotate-12 cursor-pointer">
                    <Camera size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarWorking} />
                  </label>
                </div>
                <label className="mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2 mx-auto cursor-pointer">
                  <Camera size={16} />
                  {avatarWorking ? 'Working...' : 'Change Picture'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarWorking} />
                </label>
              </div>

              {/* User Info with staggered animation */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in-up">"{userProfile.name}"</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-1 animate-fade-in-up-delayed">{userProfile.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up-delayed-2">Member since {userProfile.joinDate}</p>
              </div>

              {/* Edit Profile Button */}
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 font-medium animate-fade-in-up-delayed-3"
                onClick={handleEditProfile}
              >
                <Edit3 size={18} className="transition-transform duration-200 ease-in-out group-hover:rotate-12"/>
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
      {/* Edit Name Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={() => setShowEditModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Username</h2>
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              disabled={editWorking}
            />
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              onClick={handleUpdateName}
              disabled={editWorking}
            >
              {editWorking ? 'Working...' : 'Update Name'}
            </button>
          </div>
        </div>
      )}

      {/* Flash Message */}
      {flash && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${flash.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {flash.message}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;