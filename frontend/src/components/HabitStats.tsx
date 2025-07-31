import React from 'react';
import { TrendingUp, Target, Calendar, AlertCircle } from 'lucide-react';
import { HabitStats as StatsType } from '../types';

interface HabitStatsProps {
  stats: StatsType;
}

export const HabitStats: React.FC<HabitStatsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Target,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Calendar,
      label: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: AlertCircle,
      label: 'Missed Days',
      value: `${stats.missedDays} days`,
      color: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${item.color.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-900')}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {item.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};