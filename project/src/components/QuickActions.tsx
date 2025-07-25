import React from 'react';
import { Zap, Target, Plus, TrendingUp } from 'lucide-react';
import { Habit } from '../types';
import { formatDate } from '../utils/dateUtils';
import { getDailyQuote } from '../utils/motivationalQuotes';

interface QuickActionsProps {
  habits: Habit[];
  onMarkToday: (habitId: string) => void;
  onAddHabit: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ habits, onMarkToday, onAddHabit }) => {
  const today = formatDate(new Date());
  const activeHabits = habits.filter(h => !h.isArchived);
  const todaysPendingHabits = activeHabits.filter(h => h.logs[today] !== true);
  const todaysCompletedHabits = activeHabits.filter(h => h.logs[today] === true);
  
  const completionRate = activeHabits.length > 0 
    ? Math.round((todaysCompletedHabits.length / activeHabits.length) * 100)
    : 0;

  const dailyQuote = getDailyQuote();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Today's Progress
          </div>
        </div>
      </div>

      {/* Daily Quote */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-blue-800 dark:text-blue-200 font-medium italic text-center">
          "{dailyQuote}"
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Daily Progress
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {todaysCompletedHabits.length} of {activeHabits.length} habits
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Pending Habits */}
      {todaysPendingHabits.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Pending Today ({todaysPendingHabits.length})
          </h4>
          <div className="space-y-2">
            {todaysPendingHabits.slice(0, 3).map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{habit.emoji}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {habit.name}
                  </span>
                </div>
                <button
                  onClick={() => onMarkToday(habit.id)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs font-medium transition-colors"
                >
                  Mark Done
                </button>
              </div>
            ))}
            {todaysPendingHabits.length > 3 && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                +{todaysPendingHabits.length - 3} more habits
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed Habits */}
      {todaysCompletedHabits.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            Completed Today ({todaysCompletedHabits.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {todaysCompletedHabits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                <span>{habit.emoji}</span>
                <span className="font-medium">{habit.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Done Message */}
      {activeHabits.length > 0 && todaysPendingHabits.length === 0 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            All habits completed! 🎉
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Great job staying consistent today!
          </p>
        </div>
      )}

      {/* No Habits Message */}
      {activeHabits.length === 0 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            No habits yet
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Create your first habit to get started!
          </p>
          <button
            onClick={onAddHabit}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            Add Your First Habit
          </button>
        </div>
      )}
    </div>
  );
};