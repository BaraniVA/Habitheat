import React, { useState, useRef, useEffect } from "react";
import { Settings } from "lucide-react";
import { motion } from "motion/react";

// Define props for the modal
interface WidgetSettingsModalProps {
  // This array will hold IDs of currently enabled widgets
  enabledWidgets: string[];
  // Function to update the enabled widgets list
  onToggleWidget: (widgetId: string, isEnabled: boolean) => void;
}

// List of all available widgets with their friendly names and IDs
const availableWidgets = [
  { id: "currentStreak", name: "Current Streak" },
  { id: "dailyCompletion", name: "Daily Completion Rate" },
  { id: "totalCompleted", name: "Total Habits Completed" },
  // Add more widgets here as you create them
];

const DropdownSettingsMenu: React.FC<WidgetSettingsModalProps> = ({
  enabledWidgets,
  onToggleWidget,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as HTMLElement)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleWidgetToggle = (widgetId: string, isChecked: boolean) => {
    onToggleWidget(widgetId, isChecked);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Button */}
      <motion.button
        whileHover={{
          scale: 1.1,
          rotate: 180,
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          transition: { duration: 0.4, ease: "easeOut" },
        }}
        whileTap={{
          scale: 0.9,
          rotate: 90,
          transition: { duration: 0.2 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={toggleDropdown}
        className={`
          flex items-center gap-2 px-2 py-2 bg-white dark:bg-gray-500 border border-gray-200 dark:border-gray-600 rounded-full
          shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200
          ${isOpen ? "ring-2 ring-blue-500 ring-opacity-100" : ""}
        `}
        title="Manage Widgets"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-50" />
      </motion.button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 py-1 text-center font-bold dark:text-gray-50 rounded-lg">Manage Widgets</div>
          <div className="border-b-2 mx-3"></div>
          <div className="py-2">
            {availableWidgets.map((widget) => {
              if (!widget.id) return null;
              return (
                <label className="flex w-full items-center gap-3 text-left cursor-pointer">
                  <div
                    key={widget.id}
                    className="w-full flex items-center justify-start gap-3 px-4 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      id={widget.id}
                      checked={enabledWidgets.includes(widget.id)}
                      onChange={(e) =>
                        handleWidgetToggle(widget.id, e.target.checked)
                      }
                      defaultChecked={enabledWidgets.includes(widget.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:focus:ring-blue-600 rounded-full"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {widget.name}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSettingsMenu;
