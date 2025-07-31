import React, { useState } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Trash2, StickyNote, Archive, ArchiveRestore, Save } from 'lucide-react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveTemplate}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Save as template"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleArchive}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Archive habit"
          >
            {habit.isArchived ? (
                <ArchiveRestore className="w-4 h-4" />
              ) : (
                <Archive className="w-4 h-4" /> 
            )}
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
            title="Delete habit"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Habit Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{habit.emoji}</span>
            <div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {habit.name}
                </div>
                <div
                  className={`text-s ml-4 font-mono uppercase relative ${
                    habit.priority === "high"
                      ? "text-red-500"
                      : habit.priority === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  <span className="relative">{`PRIORITY: ${habit.priority?.toUpperCase()}`}</span>
                  <span className="absolute inset-0 blur-md opacity-50">{`PRIORITY: ${habit.priority?.toUpperCase()}`}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-500 dark:text-gray-400">
                  Created {new Date(habit.createdAt).toLocaleDateString()}
                </p>
                {habit.category && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                    {habit.category}
                  </span>
                )}
                {habit.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    habit.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                    habit.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}>
                    {habit.difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={onMarkToday}
            disabled={todayCompleted}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              todayCompleted
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow'
            }`}
          >
            {todayCompleted ? 'Completed Today!' : 'Mark Today Complete'}
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Calendar View
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
          >
            Today
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <span className="px-4 py-2 text-gray-900 dark:text-white font-medium min-w-[120px] text-center">
            {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
          </span>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Heatmap */}
      <Heatmap
        habit={habit}
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        onDateClick={handleDateClick}
      />

      {/* Note Input Modal */}
      {showNoteInput && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <StickyNote className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Note for {new Date(selectedDate).toLocaleDateString()}
              </h3>
            </div>
            
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="How did this day go? Any insights or reflections..."
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              autoFocus
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCancelNote}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <HabitStats stats={stats} />
    </div>
  );
};