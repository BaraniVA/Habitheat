import React from 'react';
import { Habit } from '../types';
import { getCalendarDays, formatDate, getMonthName, getDayName, isToday } from '../utils/dateUtils';

interface HeatmapProps {
  habit: Habit;
  year: number;
  month: number;
  onDateClick: (date: string) => void;
}

export const Heatmap: React.FC<HeatmapProps> = ({ habit, year, month, onDateClick }) => {
  const days = getCalendarDays(year, month);
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getCellColor = (date: Date): string => {
    const dateStr = formatDate(date);
    const completed = habit.logs[dateStr];
    const isCurrentMonth = date.getMonth() === month;
    
    if (!isCurrentMonth) {
      return 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600';
    }
    
    if (completed === true) {
      return `${habit.color} text-white shadow-sm`;
    } else if (completed === false) {
      return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
    }
    
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
  };

  const getCellContent = (date: Date): string => {
    const dateStr = formatDate(date);
    const completed = habit.logs[dateStr];
    
    if (completed === true) return '✓';
    if (completed === false) return '✗';
    return date.getDate().toString();
  };

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {getMonthName(month)} {year}
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${habit.color}`}></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-200 dark:bg-red-900"></div>
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700"></div>
            <span>No log</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((date) => {
              const dateStr = formatDate(date);
              const isCurrentMonth = date.getMonth() === month;
              const isTodayDate = isToday(dateStr);
              
              return (
                <button
                  key={dateStr}
                  onClick={() => isCurrentMonth && onDateClick(dateStr)}
                  disabled={!isCurrentMonth}
                  className={`
                    aspect-square rounded-lg border-2 transition-all duration-200 text-sm font-medium
                    ${getCellColor(date)}
                    ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : 'border-transparent'}
                    ${isCurrentMonth ? 'hover:scale-105 active:scale-95' : 'cursor-not-allowed'}
                  `}
                >
                  {getCellContent(date)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};