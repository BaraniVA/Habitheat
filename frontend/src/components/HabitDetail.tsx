import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Trash2, StickyNote, Archive, ArchiveRestore, Save, MoreVertical } from 'lucide-react';
import { Habit } from '../types';
import { Heatmap } from './Heatmap';
import { HabitStats } from './HabitStats';
import { calculateHabitStats } from '../utils/habitStats';
import { formatDate, getMonthName } from '../utils/dateUtils';

interface HabitDetailProps {
  habit: Habit;
  onBack: () => void;
  onDateToggle: (date: string) => void;
  onMarkToday: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onAddNote: (date: string, note: string) => void;
}

export const HabitDetail: React.FC<HabitDetailProps> = ({
  habit,
  onBack,
  onDateToggle,
  onMarkToday,
  onDelete,
  onArchive,
  onAddNote
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const stats = calculateHabitStats(habit);
  
  const today = formatDate(new Date());
  const todayCompleted = habit.logs[today] === true;

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      onDelete();
    }
  };

  const handleSaveTemplate = () => {
    window.alert("Save this template by going back to dashboard..")
  }

  const handleArchive = () => {
    if (window.confirm(`Are you sure you want to ${habit.isArchived ? 'unarchive' : 'archive'} this habit?`)) {
      onArchive();
    }
  };

  const handleDateClick = (date: string) => {
    onDateToggle(date);
    setSelectedDate(date);
    setNoteText(habit.notes?.[date] || '');
    setShowNoteInput(true);
  };

  const handleSaveNote = () => {
    if (selectedDate) {
      onAddNote(selectedDate, noteText);
      setShowNoteInput(false);
      setSelectedDate(null);
      setNoteText('');
    }
  };

  const handleCancelNote = () => {
    setShowNoteInput(false);
    setSelectedDate(null);
    setNoteText('');
  };

  type ActionButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    className?: string;
    destructive?: boolean;
  };

  const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon: Icon, title, className = "", destructive = false }) => (
    <button
      onClick={onClick}
      className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
        destructive 
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600' 
          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
      } ${className}`}
      title={title}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Back</span>
          </button>
          
          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <ActionButton onClick={handleSaveTemplate} icon={Save} title="Save as template" />
            <ActionButton 
              onClick={handleArchive} 
              icon={habit.isArchived ? ArchiveRestore : Archive} 
              title={habit.isArchived ? "Unarchive habit" : "Archive habit"} 
            />
            <ActionButton onClick={handleDelete} icon={Trash2} title="Delete habit" destructive />
          </div>

          {/* Mobile Menu Button */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] z-50">
                <button
                  onClick={() => {
                    handleSaveTemplate();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save as template
                </button>
                <button
                  onClick={() => {
                    handleArchive();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {habit.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  {habit.isArchived ? 'Unarchive habit' : 'Archive habit'}
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete habit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Habit Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="space-y-4 sm:space-y-6">
            {/* Habit Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="text-3xl sm:text-4xl lg:text-5xl flex-shrink-0">{habit.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-row sm:flex-row sm:items-start items-start gap-2 sm:gap-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white break-words max-w-[calc(100%-12rem)]">
                      {habit.name}
                    </h1>
                    <div className={`text-xs sm:text-sm font-mono uppercase px-3 py-1 rounded-full font-medium border ${
                      habit.priority === "high"
                        ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                        : habit.priority === "medium"
                        ? "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800"
                        : "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800"
                    }`}>
                      {habit.priority?.toUpperCase()} PRIORITY
                    </div>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created {new Date(habit.createdAt).toLocaleDateString()}
                    </p>
                    {habit.category && (
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
                        {habit.category}
                      </span>
                    )}
                    {habit.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        habit.difficulty === 'easy' 
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' :
                        habit.difficulty === 'medium' 
                          ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                        'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                      }`}>
                        {habit.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={onMarkToday}
                disabled={todayCompleted}
                className={`w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-semibold transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
                  todayCompleted
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 cursor-not-allowed border border-green-200 dark:border-green-800'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {todayCompleted ? '✓ Completed Today!' : 'Mark Today Complete'}
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          {/* Calendar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Calendar View
              </h2>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 font-medium"
              >
                Today
              </button>
            </div>
            
            {/* Month Navigation */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-2xl p-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 sm:p-3 hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <span className="px-4 py-2 text-gray-900 dark:text-white font-semibold text-sm sm:text-base min-w-[140px] sm:min-w-[160px] text-center">
                {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
              </span>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 sm:p-3 hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Heatmap Container with scroll on mobile */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[350px]">
              <Heatmap
                habit={habit}
                year={currentDate.getFullYear()}
                month={currentDate.getMonth()}
                onDateClick={handleDateClick}
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <HabitStats stats={stats} />
        </div>

        {/* Note Input Modal */}
        {showNoteInput && selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <StickyNote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Add Note
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="How did this day go? Any insights or reflections..."
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                autoFocus
              />
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancelNote}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-200 font-medium"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close mobile menu */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 z-40 sm:hidden" 
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};