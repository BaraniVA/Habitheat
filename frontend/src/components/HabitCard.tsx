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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(habit);
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
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0 relative">
        {/* Edit Button - Top Right Corner */}
        <button 
          onClick={handleEdit} 
          className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 p-1.5 sm:p-2 text-gray-400 bg-gray-200 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded-lg sm:rounded-[11px] transition-colors z-10"
          title="Edit habit"
        >
          <Edit className="w-4 h-4" />
        </button>

        {/* Habit Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl sm:text-2xl flex-shrink-0">{habit.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate pr-8 sm:pr-2">
              {habit.name}
            </h3>
            
            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{stats.currentStreak}d streak</span>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{Math.round(stats.completionRate)}%</span>
              </div>
              {habit.difficulty && (
                <div className={`text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${getDifficultyColor(habit.difficulty)}`}>
                  {habit.difficulty}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={handleSaveTemplate} 
            className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
            title="Save as template"
          >
            <Save className="w-4 h-4" />
          </button>
          
          {onArchive && (
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
              todayCompleted
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow'
            }`}
          >
            {todayCompleted ? 'Done!' : 'Mark Today'}
          </button>
        </div>
      </div>
      
      {/* Mobile Action Buttons Row */}
      <div className="flex sm:hidden items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSaveTemplate} 
            className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
            title="Save as template"
          >
            <Save className="w-4 h-4" />
          </button>
          
          {onArchive && (
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
        </div>
        
        <button
          onClick={handleMarkToday}
          disabled={todayCompleted}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
            todayCompleted
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow'
          }`}
        >
          {todayCompleted ? 'Done!' : 'Mark Today'}
        </button>
      </div>
      
      {/* Category and Priority Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {habit.category && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              {habit.category}
            </span>
          )}
          
          <div className={`text-xs font-mono uppercase tracking-wider ${
            habit.priority === "high"
            ? "text-red-500"
            : habit.priority === "medium"
            ? "text-yellow-500"
            : "text-green-500"
          }`}>
            <span className="relative">
              <span className="hidden sm:inline">PRIORITY: </span>
              {habit.priority?.toUpperCase()}
            </span>
            <span className="absolute inset-0 blur-md opacity-50">
              <span className="hidden sm:inline">PRIORITY: </span>
              {habit.priority?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Heatmap */}
      <div className="overflow-x-auto">
        <MiniHeatmap habit={habit} />
      </div>
    </div>
  );
};