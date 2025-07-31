// src/components/widgets/TotalHabitsCompletedWidget.tsx

import React from 'react';

// Define the props interface
interface TotalHabitsCompletedWidgetProps {
  totalCompletedHabits: number;
}

const TotalHabitsCompletedWidget: React.FC<TotalHabitsCompletedWidgetProps> = ({ totalCompletedHabits }) => {
  return (
    // Replaced inline style with Tailwind CSS classes
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md 
                flex flex-col justify-center items-center min-h-[150px]">
      <div className="text-5xl font-bold text-purple-500 mb-1"> {/* Adjusted color to a purple */}
        {totalCompletedHabits}
      </div>
      <div className="text-base text-gray-600 dark:text-gray-300">Total Habits Completed ✅</div>
    </div>
  );
};

export default TotalHabitsCompletedWidget;