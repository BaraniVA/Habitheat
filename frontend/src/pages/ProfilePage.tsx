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
  Zap,
  Loader,
  CrossIcon,
  LucideFolderClosed,
  Cross,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { div } from 'framer-motion/client';
import toast from 'react-hot-toast';
import TimeInput from '../components/TimeInput';
import axios from 'axios';

type Theme = 'light' | 'dark';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  completedDate: string;
}

interface AuthorizedUser {
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  startTime?: string;
  reminderTime?: string;
  startOfWeek?: string;
  age?: number;
}

interface editProfile {
  username: string;
  password?: string;
  currentPassword?: string;
  startTime?: string;
  reminderTime?: string;
  startOfWeek?: string;
  age?: number;
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
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthorizedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [wakeUpTime, setWakeUpTime] = useState<string>("07:00");
  const [reminderTime, setReminderTime] = useState<string>("07:00");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [age, setAge] = useState<number>(20);
  const [username, setUsername] = useState<string>(authUser ? authUser.username : "");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAuthUser(data))
      .catch(() => {
        localStorage.removeItem("authToken");
        setAuthUser(null);
      }).finally(() => setLoading(false));
  }, []);



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
        console.error('Error loading user data:', (error as Error).message);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success("Image uploaded! Changes will appear soon🎉", {
      style: {
        minWidth: "410px",
        whiteSpace: "nowrap",
      },
    });
    setIsUpdatingProfile(true);

    const previewUrl = URL.createObjectURL(file);
    setAuthUser((prev) => ({
      ...prev!,
      profilePic: previewUrl,
    }));

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      if (typeof reader.result === "string") {
        setSelectedImg(reader.result);

        try {
          const response = await fetch("http://localhost:5000/api/auth/upload-pic", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
              image: reader.result,
              email: authUser?.email,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update profile picture");
          }

          const data = await response.json();

          setAuthUser(data);
        } catch (error) {
          console.error("Error updating profile picture:", (error as Error).message);
        } finally {
          setIsUpdatingProfile(false);
        }
      }
    };
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    let formData: editProfile;
    if (changePassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Please fill the password field!");
        setIsSaving(false);
        return;
      }
      if (newPassword != confirmPassword) {
        toast.error("Password did not match!");
        setIsSaving(false);
        return;
      }
      if(newPassword.length < 6) {
        toast.error("Password must be at least of length 6!");
        setIsSaving(false);
        return;
      }
      formData = {
        username: username,
        password: newPassword,
        currentPassword: currentPassword,
        startTime: wakeUpTime,
        reminderTime: reminderTime,
        startOfWeek: selectedDay,
        age: age
      }
    } else {
      formData = {
        username: username,
        startTime: wakeUpTime,
        reminderTime: reminderTime,
        startOfWeek: selectedDay,
        age: age
      }
    }
    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/edit-profile",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success(response.data.message || "Profile updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your profile and track your progress</p>
        </div>

        <div className={isEditingProfile ? "grid grid-cols-1 md:grid-cols-[35%_65%] gap-4" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}>
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-8 border border-gray-200 dark:border-gray-700">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {loading ? (
                    <div className='flex flex-col w-full h-full justify-center items-center'>
                      <Loader size={25} className='animate-spin' />
                    </div>
                  ) : (
                    <img
                      src={selectedImg || authUser?.profilePic || userProfile.avatar}
                      alt="Profile"
                    />
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-0 right-0 
                      bg-base-content hover:scale-105
                      p-2 rounded-full cursor-pointer 
                      transition-all duration-200
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                    `}
                  >
                    {!loading && <Camera className="w-5 h-5 text-base-200" aria-hidden={loading} />}
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>

                <button className="mt-4 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2 mx-auto">
                  <Camera size={16} />
                  <label htmlFor="avatar-uploads" className='cursor-pointer'>
                    Change Picture
                    <input
                      type="file"
                      id="avatar-uploads"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{authUser?.username}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-1">{authUser?.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member since {userProfile.joinDate}</p>
              </div>

              {/* Edit Profile Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium" onClick={() => setIsEditingProfile(true)}>
                <Edit3 size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          {!isEditingProfile ? (<div className="lg:col-span-2 space-y-8">
            {/* Statistics Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
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
            </div>

            {/* Activity Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-blue-600 dark:text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity</h3>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'achievements'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Award size={16} />
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('mood')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'mood'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Smile size={16} />
                  Mood History
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'achievements' && (
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
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
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'mood' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700/50 mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{moodHistory[0]?.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Last Mood: {moodHistory[0]?.mood}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{moodHistory[0]?.date}</p>
                        </div>
                      </div>
                    </div>

                    {moodHistory.map((mood) => (
                      <div
                        key={mood.id}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>) : (<div className='flex flex-col'>
            <div className='flex sm:gap-20 gap-10'>
              <ArrowLeft onClick={() => setIsEditingProfile(false)} className='dark:text-white ml-10 cursor-pointer'/>
              <h1 className='dark:text-white text-2xl font-bold lg:ml-36 md:ml-8 sm:ml-11 text-center'>Change your details</h1>
            </div>
            <form className="m-8" onSubmit={handleSubmit}>
              <label className='dark:text-white m-2'>Username:</label>
              <input
                type="text"
                value={username}
                className="w-full ml-2 mb-5 border border-gray-600 focus:border-gray-800 focus:outline-none px-4 py-2 rounded"
                placeholder={authUser?.username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className='dark:text-white m-2'>Email:</label>
              <input
                type="email"
                value={authUser?.email}
                disabled
                className="w-full ml-2 border dark:text-white border-gray-600 focus:border-gray-800 focus:outline-none px-4 py-2 rounded"
              />
              <div className="flex items-center justify-between mt-5 ml-2 mb-3">
                <label className="flex items-center cursor-pointer">
                  {/* Toggle Label */}
                  <span className="mr-3 text-sm dark:text-white text-gray-700">Change Password?</span>

                  {/* Toggle Switch */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={changePassword}
                      onChange={() => setChangePassword(!changePassword)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300" />
                    <div
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"
                    />
                  </div>
                </label>
              </div>

              {/* Password fields - only show if toggle is ON */}
              {changePassword && (
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full ml-2 border px-4 py-2 rounded"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full ml-2 border px-4 py-2 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full ml-2 border px-4 py-2 rounded"
                  />
                </div>
              )}

              <h1 className='dark:text-white ml-2 text-xl my-4 font-bold'>Profile Settings</h1>
              <TimeInput
                label="What time do you usually wake up?"
                name="wakeUpTime"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
              />
              <TimeInput
                label="What time do you prefer reminders?"
                name="reminderTime"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
              <label htmlFor="week" className="text-sm ml-2 text-gray-700 dark:text-white mb-1 block">
                When does your week start?
              </label>
              <select
                id="week"
                name="week"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="block w-full px-4 py-2 ml-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
              <label htmlFor="week" className="text-sm ml-2 text-gray-700 dark:text-white mb-1 mt-2 block">
                What is your age?
              </label>
              <input
                type="number"
                min={10}
                max={100}
                placeholder="20"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full ml-2 border px-4 py-2 rounded"
              />

              {/* Save Changes button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex justify-center ml-2 mt-5 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isSaving ? <Loader size={15} /> : "Save Changes"}
              </button>
            </form>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;