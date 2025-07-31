import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { X, Clock, Flag } from 'lucide-react';

interface UpdateHabitModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedHabit: { 
    name: string; 
    emoji: string; 
    color?: string; 
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    targetDays?: number[];
    reminderTime?: string;
    priority?: 'low' | 'medium' | 'high';
    estimatedTime?: number;
    motivationalQuote?: string;
  }) => void;
}

const EMOJI_OPTIONS = [ '💪', '🏃', '📚', '💧', '🧘', '🏋️', '🥗', '😴', '🎯', '🌱',
  '🎨', '✍️', '🎵', '🏊', '🚴', '🍎', '🫖', '🌅', '🧹', '📱',
  '🌍', '💼', '🎮', '🧠', '❤️', '🔥', '⚡', '🌟', '🎪', '🎭'
];

const COLOR_OPTIONS = [
  'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
];

const CATEGORIES = [
  'Health & Fitness', 'Learning', 'Productivity', 'Mindfulness',
  'Social', 'Creative', 'Finance', 'Personal Care', 'Digital Wellness', 'Other'
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' }
];

export const UpdateHabitModal: React.FC<UpdateHabitModalProps> = ({ habit, isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💪');
  const [selectedColor, setSelectedColor] = useState('bg-green-500');
  const [category, setCategory] = useState('Health & Fitness');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetDays, setTargetDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const [reminderTime, setReminderTime] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<number>(15);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  // Pre-fill fields when habit changes
  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setSelectedEmoji(habit.emoji || '💪');
      setSelectedColor(habit.color || 'bg-green-500');
      setCategory(habit.category || 'Health & Fitness');
      setDifficulty(habit.difficulty || 'medium');
      setPriority(habit.priority || 'medium');
      setTargetDays(habit.targetDays || [1, 2, 3, 4, 5, 6, 0]);
      setReminderTime(habit.reminderTime || '');
      setEstimatedTime(habit.estimatedTime || 15);
      setMotivationalQuote(habit.motivationalQuote || '');
    }
  }, [habit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        emoji: selectedEmoji,
        color: selectedColor,
        category,
        difficulty,
        priority,
        targetDays: targetDays.length > 0 ? targetDays : undefined,
        reminderTime: reminderTime || undefined,
        estimatedTime,
        motivationalQuote: motivationalQuote.trim() || undefined
      });
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const toggleTargetDay = (day: number) => {
    setTargetDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300';
      default: return 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  useEffect(() => {
    if(isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] template-scroll overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {habit ? 'Update Habit' : 'Add New Habit'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose an Emoji
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto template-scroll">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`p-2 text-xl rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedEmoji === emoji
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose a Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full ${color} border-4 transition-all hover:scale-105 ${
                    selectedColor === color
                      ? 'border-gray-900 dark:border-white'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all capitalize flex items-center justify-center gap-2 ${
                    priority === level
                      ? getPriorityColor(level)
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Time (minutes)
            </label>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                min="1"
                max="480"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Target Days (optional)
            </label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleTargetDay(value)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                    targetDays.includes(value)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reminder Time (optional)
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Motivation (optional)
            </label>
            <textarea
              value={motivationalQuote}
              onChange={(e) => setMotivationalQuote(e.target.value)}
              placeholder="A personal quote or reason that motivates you..."
              className="w-full h-20 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              {habit ? 'Update Habit' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
