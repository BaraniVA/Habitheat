import React from 'react';
import { Trophy, X } from 'lucide-react';
import { Achievement } from '../types';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface AchievementNotificationProps {
  achievement: Achievement;
  t: any; // Toast object from react-hot-toast
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, t }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg max-w-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start">
        <div className="text-3xl mr-4">{achievement.icon}</div>
        <div className="flex-grow">
            <h3 className="font-bold text-gray-900 dark:text-white">Achievement Unlocked!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.title}</p>
        </div>
        <button
            onClick={() => toast.dismiss(t.id)}
            className="p-1 text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full transition-colors"
        >
            <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};