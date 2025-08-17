import SelfCareTip from "../components/SelfCareTip";
import React, { useState, useEffect } from "react"; // Import useEffect
import { Plus, Search, Archive, Filter } from "lucide-react"; // Import Settings and Filter icons
import { Habit, SortOption, FilterOption, AdvancedFilter } from "../types";
import { HabitCard } from "../components/HabitCard";
import { QuickActions } from "../components/QuickActions";
import { AdvancedFilterModal } from "../components/AdvancedFilterModal";
import { FilterSummary } from "../components/FilterSummary";
import {
  createDefaultAdvancedFilter,
  filterHabitsAdvanced,
} from "../utils/advancedFilter";
import { motion, AnimatePresence } from 'framer-motion';

// IMPORTS FOR YOUR WIDGETS
import CurrentStreakWidget from "../components/widgets/CurrentStreakWidget";
import DailyCompletionRateWidget from "../components/widgets/DailyCompletionRateWidget";
import TotalHabitsCompletedWidget from "../components/widgets/TotalHabitsCompletedWidget";
// NEW IMPORT FOR WIDGET SETTINGS MODAL
import WidgetSettingsModal from "../components/WidgetSettingsModal"; // Adjust path if you put it in widgets/
// import SettingsDropdown from "../components/WidgetSettingsDropdown";
import DropdownSettingsMenu from "../components/DropdownSettingsMenu";

interface DashboardProps {
  habits: Habit[];
  onAddHabit: () => void;
  onHabitClick: (habit: Habit) => void;
  onMarkToday: (habitId: string) => void;
  onSaveTemplate: (habit: Habit) => void;
  onArchiveHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
}

// Define IDs for your widgets (MUST match 'id' in WidgetSettingsModal.tsx's availableWidgets)
const WIDGET_IDS = {
  CURRENT_STREAK: "currentStreak",
  DAILY_COMPLETION: "dailyCompletion",
  TOTAL_COMPLETED: "totalCompleted",
};

export const Dashboard: React.FC<DashboardProps> = ({
  habits,
  onAddHabit,
  onHabitClick,
  onMarkToday,
  onArchiveHabit,
  onSaveTemplate,
  onEditHabit
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [showArchived, setShowArchived] = useState(false);

  // Advanced Filter State
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter>(() => {
    try {
      const saved = localStorage.getItem("habit-heat-advanced-filter");
      return saved ? JSON.parse(saved) : createDefaultAdvancedFilter();
    } catch {
      return createDefaultAdvancedFilter();
    }
  });
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [useAdvancedFilter, setUseAdvancedFilter] = useState(false);

  // tabtitle
  useEffect(() => {
    document.title = "Habit Heat-Track Habits";
  }, []);

  // Save advanced filter to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "habit-heat-advanced-filter",
      JSON.stringify(advancedFilter)
    );
  }, [advancedFilter]);

  // NEW STATE FOR WIDGET CUSTOMIZATION
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);
  // Initialize enabledWidgets from localStorage or with defaults
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>(() => {
    const savedWidgets = localStorage.getItem("enabledWidgets");
    return savedWidgets
      ? JSON.parse(savedWidgets)
      : [
        WIDGET_IDS.CURRENT_STREAK,
        WIDGET_IDS.DAILY_COMPLETION,
        WIDGET_IDS.TOTAL_COMPLETED, // Default: all three enabled
      ];
  });

  // NEW useEffect to save enabled widgets to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("enabledWidgets", JSON.stringify(enabledWidgets));
  }, [enabledWidgets]);

  const activeHabits = habits.filter((h) => !h.isArchived);
  const archivedHabits = habits.filter((h) => h.isArchived);
  const displayHabits = showArchived ? archivedHabits : activeHabits;

  // Apply advanced filter first if enabled, then basic filter
  let filteredHabits = displayHabits;

  if (useAdvancedFilter) {
    filteredHabits = filterHabitsAdvanced(filteredHabits, advancedFilter);
  }

  const filteredAndSortedHabits = filteredHabits
    .filter((habit) => {
      const matchesSearch = habit.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (filterBy === "all") return true;

      const today = new Date().toISOString().split("T")[0];
      const completedToday = habit.logs[today] === true;
      const hasLogs = Object.keys(habit.logs).length > 0;

      switch (filterBy) {
        case "active":
          return hasLogs && !completedToday;
        case "struggling":
          return (
            hasLogs &&
            Object.values(habit.logs).filter(Boolean).length /
            Object.keys(habit.logs).length <
            0.5
          );
        case "perfect":
          return hasLogs && Object.values(habit.logs).every(Boolean);
        case "priority-high":
          return habit.priority === "high";
        case "quick":
          return (habit.estimatedTime || 0) <= 15;
        case "long":
          return (habit.estimatedTime || 0) > 30;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (
            (priorityOrder[b.priority || "medium"] || 2) -
            (priorityOrder[a.priority || "medium"] || 2)
          );
        }
        case "time":
          return (a.estimatedTime || 0) - (b.estimatedTime || 0);
        case "streak":
        case "completion":
          return 0; // Would need streak/completion calculation
        default:
          return 0;
      }
    });

  // --- Calculate data for widgets based on 'habits' prop ---
  const calculateLongestStreak = (habits: Habit[]): number => {
    let overallLongestStreak = 0;
    habits.forEach((habit) => {
      let currentStreak = 0;
      let maxStreakForHabit = 0;
      const sortedDates = Object.keys(habit.logs).sort();

      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        if (habit.logs[date]) {
          // If habit was completed on this date
          currentStreak++;
        } else {
          currentStreak = 0; // Reset streak if missed
        }
        maxStreakForHabit = Math.max(maxStreakForHabit, currentStreak);
      }
      overallLongestStreak = Math.max(overallLongestStreak, maxStreakForHabit);
    });
    return overallLongestStreak;
  };

  const calculateDailyCompletion = (
    habits: Habit[]
  ): { completed: number; total: number } => {
    const today = new Date().toISOString().split("T")[0];
    const habitsForToday = habits.filter((h) => !h.isArchived);
    const completedToday = habitsForToday.filter(
      (h) => h.logs[today] === true
    ).length;
    return { completed: completedToday, total: habitsForToday.length };
  };

  const calculateTotalCompletedHabits = (habits: Habit[]): number => {
    let count = 0;
    habits.forEach((habit) => {
      count += Object.values(habit.logs).filter(Boolean).length;
    });
    return count;
  };

  const longestStreak = calculateLongestStreak(habits);
  const { completed: completedHabitsToday, total: totalHabitsToday } =
    calculateDailyCompletion(habits);
  const totalCompletedHabits = calculateTotalCompletedHabits(habits);
  // --- END CALCULATIONS ---

  // NEW: Function to toggle widget
  const handleToggleWidget = (widgetId: string, isEnabled: boolean) => {
    setEnabledWidgets((prev) =>
      isEnabled ? [...prev, widgetId] : prev.filter((id) => id !== widgetId)
    );
  };

  // Advanced Filter Handlers
  const handleApplyAdvancedFilter = (filter: AdvancedFilter) => {
    setAdvancedFilter(filter);
    setUseAdvancedFilter(true);
    setFilterBy("all"); // Reset basic filter when using advanced
  };

  const handleResetAdvancedFilter = () => {
    setAdvancedFilter(createDefaultAdvancedFilter());
    setUseAdvancedFilter(false);
  };

  const handleClearAdvancedFilter = () => {
    setUseAdvancedFilter(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-6"
    >
      {/* NEW: Widgets Section with Settings Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        {/* <motion.button
          whileHover={{
            scale: 1.1,
            rotate: 180,
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            transition: { duration: 0.4, ease: "easeOut" }
          }}
          whileTap={{
            scale: 0.9,
            rotate: 90,
            transition: { duration: 0.2 }
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          // onClick={() => setShowWidgetSettings(true)}
          className="p-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-md"
          title="Manage Widgets"
        >
          {/* <Settings className="w-5 h-5" /> */}
        {/* </motion.button> */}
          <DropdownSettingsMenu
            enabledWidgets={enabledWidgets}
            onToggleWidget={handleToggleWidget}
          />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <SelfCareTip />
      </motion.div>
      {/* Animation: Widgets grid with staggered entrance */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.3,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {enabledWidgets.includes(WIDGET_IDS.CURRENT_STREAK) && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: -15 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.6
                }
              },
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              rotateY: 2,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            className="cursor-default"
          >
            <CurrentStreakWidget longestStreak={longestStreak} />
          </motion.div>
        )}
        {enabledWidgets.includes(WIDGET_IDS.DAILY_COMPLETION) && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: -15 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.6
                }
              },
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              rotateY: -2,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            className="cursor-default"
          >
            <DailyCompletionRateWidget
              completedHabitsToday={completedHabitsToday}
              totalHabitsToday={totalHabitsToday}
            />
          </motion.div>
        )}
        {enabledWidgets.includes(WIDGET_IDS.TOTAL_COMPLETED) && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: -15 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.6
                }
              },
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              rotateY: 2,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            className="cursor-default"
          >
            <TotalHabitsCompletedWidget
              totalCompletedHabits={totalCompletedHabits}
            />
          </motion.div>
        )}
      </motion.div>
      {/* END NEW: Widgets Section */}

      {/* Widget Settings Modal */}
      <WidgetSettingsModal
        isOpen={showWidgetSettings}
        onClose={() => setShowWidgetSettings(false)}
        enabledWidgets={enabledWidgets}
        onToggleWidget={handleToggleWidget}
      />

      {/* Quick Actions */}
      <AnimatePresence>
        {!showArchived && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <QuickActions
              habits={activeHabits}
              onMarkToday={onMarkToday}
              onAddHabit={onAddHabit}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Header section entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {showArchived ? "Archived Habits" : "Your Habits"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {displayHabits.length === 0
              ? showArchived
                ? "No archived habits"
                : "Start building great habits today"
              : `${displayHabits.length} habit${displayHabits.length !== 1 ? "s" : ""
              }`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{
              scale: 1.15,
              rotate: 5,
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.9,
              rotate: -5,
              transition: { duration: 0.15 }
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={() => setShowArchived(!showArchived)}
            className={`p-2 rounded-full transition-all duration-300 shadow-md ${showArchived
                ? "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300"
                : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-500 dark:text-gray-400 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600"
              }`}
            title={showArchived ? "Show active habits" : "Show archived habits"}
          >
            <Archive className="w-5 h-5" />
          </motion.button>

          {!showArchived && (
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: '0 8px 25px rgba(59,130,246,0.4)',
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{
                scale: 0.95,
                y: 0,
                transition: { duration: 0.1 }
              }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={onAddHabit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-medium shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Habit</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Animation: Search and filter controls entrance */}
      <AnimatePresence>
        {!showArchived && displayHabits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search habits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Created</option>
              <option value="priority">Sort by Priority</option>
              <option value="time">Sort by Time</option>
              <option value="streak">Sort by Streak</option>
              <option value="completion">Sort by Completion</option>
            </select>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              disabled={useAdvancedFilter}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${useAdvancedFilter ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              <option value="all">All Habits</option>
              <option value="active">Active Today</option>
              <option value="struggling">Struggling</option>
              <option value="perfect">Perfect</option>
              <option value="priority-high">High Priority</option>
              <option value="quick">Quick (≤15min)</option>
              <option value="long">Long (30min)</option>
            </select>

            {/* Advanced Filter Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{
                scale: 0.95,
                y: 0,
                transition: { duration: 0.1 }
              }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onClick={() => setShowAdvancedFilter(true)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 shadow-sm ${useAdvancedFilter
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 shadow-blue-200 dark:shadow-blue-900"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 shadow-gray-200 dark:shadow-gray-700"
                }`}
              title="Advanced Filters"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {useAdvancedFilter ? "Advanced" : "Filters"}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filter Summary */}
      <AnimatePresence>
        {useAdvancedFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-4"
          >
            <FilterSummary
              filter={advancedFilter}
              onClearFilter={handleClearAdvancedFilter}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Empty state or habit cards grid */}
      <AnimatePresence mode="wait">
        {filteredAndSortedHabits.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 120,
                damping: 15
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.3 }
              }}
              className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              {showArchived ? (
                <Archive className="w-8 h-8 text-gray-500 dark:text-gray-300" />
              ) : (
                <Plus className="w-8 h-8 text-gray-500 dark:text-gray-300" />
              )}
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                type: "spring",
                stiffness: 100
              }}
              className="text-lg font-medium text-gray-900 dark:text-white mb-2"
            >
              {showArchived
                ? "No archived habits"
                : searchTerm
                  ? "No habits found"
                  : "No habits yet"}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                type: "spring",
                stiffness: 80
              }}
              className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto"
            >
              {showArchived
                ? "Archived habits will appear here when you archive them."
                : searchTerm
                  ? "Try adjusting your search or filters."
                  : "Create your first habit to start tracking your daily progress and building consistency."}
            </motion.p>
            {!showArchived && !searchTerm && (
              <motion.button
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{
                  scale: 1.08,
                  y: -2,
                  boxShadow: '0 8px 25px rgba(59,130,246,0.4)',
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{
                  scale: 0.95,
                  y: 0,
                  transition: { duration: 0.1 }
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 120,
                  damping: 15
                }}
                onClick={onAddHabit}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-medium shadow-lg"
              >
                Create Your First Habit
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="habits-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {filteredAndSortedHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.9,
                  rotateX: -10,
                  filter: "blur(4px)"
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  filter: "blur(0px)"
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 80,
                  damping: 12
                }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  rotateY: 3,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }
                }}
                whileTap={{
                  scale: 0.97,
                  y: -8,
                  transition: { duration: 0.15 }
                }}
                layout
                className="cursor-pointer"
              >
                <HabitCard
                  habit={habit}
                  onClick={() => onHabitClick(habit)}
                  onMarkToday={() => onMarkToday(habit.id)}
                  onSaveTemplate={() => onSaveTemplate(habit)}
                  onArchive={() => onArchiveHabit(habit.id)}
                  showArchiveButton={!showArchived}
                  onEdit={() => onEditHabit(habit)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        filter={advancedFilter}
        onApplyFilter={handleApplyAdvancedFilter}
        onResetFilter={handleResetAdvancedFilter}
      />
    </motion.div>
  );
};
