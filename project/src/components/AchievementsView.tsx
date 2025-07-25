import React, { useMemo } from 'react';
import { getAchievementsStatus } from '../utils/achievements';
import { AchievementCard } from './AchievementCard';
import { motion } from 'framer-motion';
import { Habit, Achievement } from '../types';

// Define the props the component will receive from App.tsx
interface AchievementsViewProps {
  achievements: Achievement[];
  allHabits: Habit[];
}

const AchievementsView: React.FC<AchievementsViewProps> = ({
  // THE FIX: Provide default empty arrays for the props.
  // This prevents the component from crashing if the data isn't ready.
  achievements = [],
  allHabits = [],
}) => {
  
  // This now safely uses the props passed from App.tsx
  const achievementStatuses = useMemo(() => 
    getAchievementsStatus(allHabits, achievements), 
    [allHabits, achievements]
  );
  
  const unlockedCount = achievementStatuses.filter(a => a.unlockedAt).length;
  const totalCount = achievementStatuses.length;
  const overallProgress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Celebrate your habit-building milestones</p>
      </header>

      {/* Progress Overview Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Progress Overview</h2>
          <span className="font-bold text-blue-600">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{unlockedCount} of {totalCount} achievements unlocked</p>
      </div>

      {/* Achievements Grid */}
      {achievementStatuses.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {achievementStatuses.map(status => (
            <AchievementCard key={status.id} achievement={status} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No achievements yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Start building habits to unlock your first achievement!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsView;