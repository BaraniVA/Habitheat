import React, { useState, useEffect } from 'react';
import { Habit, HabitTemplate } from '../types';
import { X, Clock, Plus, Trash } from 'lucide-react';

interface SaveAsTemplateProps {
  habit: Habit;
  isOpen: boolean,
  onClose: () => void;
  onSave: (template: Omit<HabitTemplate, 'id'>) => void;
  existingTemplates: HabitTemplate[];
}

const EMOJI_OPTIONS = [
  '💪', '🏃', '📚', '💧', '🧘', '🏋️', '🥗', '😴', '🎯', '🌱',
  '🎨', '✍️', '🎵', '🏊', '🚴', '🍎', '🫖', '🌅', '🧹', '📱',
  '🌍', '💼', '🎮', '🧠', '❤️', '🔥', '⚡', '🌟', '🎪', '🎭'
]

const CATEGORIES = [
  'Health & Fitness', 'Learning', 'Productivity', 'Mindfulness',
  'Social', 'Creative', 'Finance', 'Personal Care', 'Digital Wellness', 'Other'
];

export const SaveAsTemplateModal: React.FC<SaveAsTemplateProps> = ({habit, isOpen, onClose, onSave, existingTemplates}) => {
  //fields to prefill
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(7); // **NEW**

  //fields to fill
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [newTip, setNewTip] = useState(''); // **NEW for adding tips**

  //prefilling details
  useEffect(() => {
    if (isOpen && habit) {
      setName(habit.name || '');
      setSelectedEmoji(habit.emoji || '');
      setCategory(habit.category || '');
      setDifficulty(habit.difficulty || 'easy');
      setEstimatedTime(habit.estimatedTime || 0);
      setMotivationalQuote(habit.motivationalQuote || '');
      setDescription('');
      setTips([]);
      setDaysPerWeek(7);
    }
  }, [isOpen, habit]);

  const handleAddTip = () => {
    if (newTip.trim()) {
      setTips([...tips, newTip.trim()]);
      setNewTip('');
    }
  };

  const handleRemoveTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exists = existingTemplates.some(
      t => t.name.trim().toLowerCase() === name.trim().toLowerCase() && t.category === category
    );

    if (exists) {
      alert('A template with this name and category already exists!');
      return;
    }

    if(description.trim()) {
      onSave({
        name: name.trim(),
        emoji: selectedEmoji,
        category,
        difficulty,
        estimatedTime,
        description: description.trim(),
        tips,
        motivationalQuote,
        daysPerWeek
      });

      handleClose();
    }
  }

  const handleClose = () => {
    setDescription('');
    setTips([]);
    onClose();
  }

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

  if(!isOpen) return null;  

  return(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] template-scroll overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Save habit as template
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
              Habit Name (Required)
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Required)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the habit..."
              className="w-full h-20 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Days per Week
            </label>
            <select
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1,2,3,4,5,6,7].map(day => (
                <option key={day} value={day}>{day} day{day > 1 ? 's' : ''}/week</option>
              ))}
            </select>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tips
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Add a tip..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTip}
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                  <span className="text-gray-800 dark:text-gray-200">{tip}</span>
                  <button onClick={() => handleRemoveTip(index)} className="text-red-500 hover:text-red-700">
                    <Trash className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
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
              disabled={!name.trim() || !description.trim()}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              Save as Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
