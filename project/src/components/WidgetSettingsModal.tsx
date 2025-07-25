// src/components/WidgetSettingsModal.tsx

import React, {useEffect} from 'react';

// Define props for the modal
interface WidgetSettingsModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Function to close the modal
  // This array will hold IDs of currently enabled widgets
  enabledWidgets: string[]; 
  // Function to update the enabled widgets list
  onToggleWidget: (widgetId: string, isEnabled: boolean) => void;
}

// List of all available widgets with their friendly names and IDs
const availableWidgets = [
  { id: 'currentStreak', name: 'Current Streak' },
  { id: 'dailyCompletion', name: 'Daily Completion Rate' },
  { id: 'totalCompleted', name: 'Total Habits Completed' },
  // Add more widgets here as you create them
];

const WidgetSettingsModal: React.FC<WidgetSettingsModalProps> = ({
  isOpen,
  onClose,
  enabledWidgets,
  onToggleWidget,
}) => {
  
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

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Manage Dashboard Widgets</h2>
        
        <div className="space-y-3 mb-6">
          {availableWidgets.map((widget) => (
            <div key={widget.id} className="flex items-center">
              <input
                type="checkbox"
                id={widget.id}
                checked={enabledWidgets.includes(widget.id)}
                onChange={(e) => onToggleWidget(widget.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:focus:ring-blue-600"
              />
              <label htmlFor={widget.id} className="ml-3 text-gray-700 dark:text-gray-300">
                {widget.name}
              </label>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetSettingsModal;