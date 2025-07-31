import React from 'react';

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  createdAt: string;
}

interface HabitCardProps {
  habit: Habit;
  onSave: (habitId: string) => void;
  onArchive: (habitId: string) => void;
  onEdit: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onSave,
  onArchive,
  onEdit,
}) => {
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(habit.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(habit.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(habit.id);
  };

  return (
    <div className="relative group bg-white dark:bg-gray-900 rounded-lg p-5 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
      {/* Habit details */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{habit.name}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{habit.description}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400">Frequency: {habit.frequency}</p>
        <p className="text-xs text-gray-400">Created on: {new Date(habit.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Buttons visible on hover */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity">
        <button
          onClick={handleSave}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={handleArchive}
          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Archive
        </button>
        <button
          onClick={handleEdit}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
