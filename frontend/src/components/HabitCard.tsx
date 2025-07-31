import React from 'react';
import { Calendar, Target, Zap, Archive, ArchiveRestore, Save, Edit} from 'lucide-react';
import { Habit } from '../types';
import { MiniHeatmap } from './MiniHeatmap';
import { calculateHabitStats } from '../utils/habitStats';
import { formatDate } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onClick: () => void;
  onMarkToday: (e: React.MouseEvent) => void;
  onArchive?: (e: React.MouseEvent) => void;
  onSaveTemplate: () => void;
  showArchiveButton?: boolean;
  onEdit: (habit: Habit) => void; 
}

export const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onClick, 
  onMarkToday, 
  onArchive,
  onSaveTemplate,
  onEdit
}) => {
  const stats = calculateHabitStats(habit);
  const today = formatDate(new Date());
  const todayCompleted = habit.logs[today] === true;

  const handleMarkToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkToday(e);
  };

  const handleSaveTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveTemplate();
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onArchive) onArchive(e);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{habit.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
              {habit.name}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Zap className="w-4 h-4" />
                <span>{stats.currentStreak}d streak</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Target className="w-4 h-4" />
                <span>{Math.round(stats.completionRate)}%</span>
              </div>
              {habit.difficulty && (
                <div className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${getDifficultyColor(habit.difficulty)}`}>
                  {habit.difficulty}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative -right-7 flex items-center gap-2">
          <button onClick={handleSaveTemplate} className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
          title="Save as template">
            <Save className="w-4 h-4" />
          </button>
          { onArchive && (
            <button
              onClick={handleArchive}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title={habit.isArchived ? 'Unarchive habit' : 'Archive habit'}
            >
              {habit.isArchived ? (
                <ArchiveRestore className="w-4 h-4" />
              ) : (
                <Archive className="w-4 h-4" /> 
              )}
            </button>
          )}
          
          <button
            onClick={handleMarkToday}
            disabled={todayCompleted}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              todayCompleted
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow'
            }`}
          >
            {todayCompleted ? 'Done!' : 'Mark Today'}
          </button>
        </div>
        <button onClick={(e) => {
          e.stopPropagation();
          onEdit(habit);
        }} className="p-2 relative -right-8 -top-10 text-gray-400 bg-gray-200 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded-[11px] transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
          {habit.category && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full ml-auto -mt-8">
              {habit.category}
              </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <MiniHeatmap habit={habit} />
          <div className={`text-xs font-mono uppercase ${
            habit.priority === "high"
            ? "text-red-500"
            : habit.priority === "medium"
            ? "text-yellow-500"
            : "text-green-500"
          }`}>
            <span className="relative">{`PRIORITY: ${habit.priority?.toUpperCase()}`}</span>
            <span className="absolute inset-0 blur-md opacity-50">{`PRIORITY: ${habit.priority?.toUpperCase()}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};