// src/components/widgets/CurrentStreakWidget.tsx

import React from 'react';

interface CurrentStreakWidgetProps {
  longestStreak: number;
}

const CurrentStreakWidget: React.FC<CurrentStreakWidgetProps> = ({ longestStreak }) => {
  // Removed inline 'widgetStyle', 'streakValueStyle', 'streakLabelStyle' objects
  return (
    // Replaced inline style with Tailwind CSS classes
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md 
                flex flex-col justify-center items-center min-h-[150px]"> {/* min-h-[150px] is Tailwind for min-height */}
      <div className="text-5xl font-bold text-red-500 mb-1"> {/* Adjusted color to a red that might fit HabitHeat */}
        {longestStreak}
      </div>
      <div className="text-base text-gray-600 dark:text-gray-300">Days Current Streak 🔥</div>
    </div>
  );
};

export default CurrentStreakWidget;