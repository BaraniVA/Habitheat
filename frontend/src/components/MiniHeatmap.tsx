import React from 'react';
import { Habit } from '../types';
import { getLast60Days, formatDate } from '../utils/dateUtils';

interface MiniHeatmapProps {
  habit: Habit;
  className?: string;
}

export const MiniHeatmap: React.FC<MiniHeatmapProps> = ({ habit, className = '' }) => {
  const last30Days = getLast60Days().slice(-30);
  
  const getCellColor = (date: Date): string => {
    const dateStr = formatDate(date);
    const completed = habit.logs[dateStr];
    
    if (completed === true) {
      return habit.color; // Use habit's color for completed days
    } else if (completed === false) {
      return 'bg-red-200 dark:bg-red-900'; // Red for missed days
    }
    return 'bg-gray-100 dark:bg-gray-700'; // Gray for no log
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {last30Days.map((date) => (
        <div
          key={formatDate(date)}
          className={`w-2 h-2 rounded-sm ${getCellColor(date)} transition-colors`}
          title={formatDate(date)}
        />
      ))}
    </div>
  );
};