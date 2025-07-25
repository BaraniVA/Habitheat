import React from 'react';
import { AchievementStatus } from '../utils/achievements'; // Import the type
import { motion } from 'framer-motion';

interface AchievementCardProps {
  achievement: AchievementStatus;
}

// A simple progress bar component
const ProgressBar = ({ progress, goal }: { progress: number; goal: number }) => {
  const percentage = goal > 0 ? (progress / goal) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const isUnlocked = !!achievement.unlockedAt;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={cardVariants}
      className={`
        p-6 border rounded-lg flex flex-col items-center text-center transition-all duration-300
        ${isUnlocked 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm' 
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50'
        }
      `}
    >
      <div className={`text-5xl mb-4 transition-transform duration-300 ${isUnlocked ? '' : 'grayscale'}`}>
        {achievement.icon}
      </div>
      
      <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        {achievement.title}
      </h3>
      
      <p className={`text-sm mt-1 flex-grow ${isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
        {achievement.description}
      </p>
      
      {!isUnlocked && achievement.goal > 1 && (
        <div className="w-full mt-4">
          <ProgressBar progress={achievement.progress} goal={achievement.goal} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {achievement.progress} / {achievement.goal}
          </p>
        </div>
      )}
    </motion.div>
  );
};