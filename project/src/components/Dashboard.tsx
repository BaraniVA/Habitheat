import SelfCareTip from "./SelfCareTip";
import React, {useState, useEffect} from "react"; // Import useEffect
import {Plus, Archive, Settings, Sliders} from "lucide-react"; // Import Settings icon
import {Habit, SortOption, FilterOption} from "../types";
import {HabitCard} from "./HabitCard";
import {QuickActions} from "./QuickActions";
import {AdvancedFilter} from "./AdvancedFilter";
import {useAdvancedFilter} from "../hooks/useAdvancedFilter";
import {applyAdvancedFilters} from "../utils/advancedFilter";

// IMPORTS FOR YOUR WIDGETS
import CurrentStreakWidget from "./widgets/CurrentStreakWidget";
import DailyCompletionRateWidget from "./widgets/DailyCompletionRateWidget";
import TotalHabitsCompletedWidget from "./widgets/TotalHabitsCompletedWidget";
// NEW IMPORT FOR WIDGET SETTINGS MODAL
import WidgetSettingsModal from "./WidgetSettingsModal"; // Adjust path if you put it in widgets/

interface DashboardProps {
  habits: Habit[];
  onAddHabit: () => void;
  onHabitClick: (habit: Habit) => void;
  onMarkToday: (habitId: string) => void;
  onArchiveHabit: (habitId: string) => void;
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
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Advanced filter hook
  const {
    conditions,
    globalLogicOperator,
    presets,
    updateConditions,
    updateGlobalLogicOperator,
    savePreset,
    loadPreset,
    deletePreset,
    hasActiveFilters,
  } = useAdvancedFilter();

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

  // Apply advanced filters first if any are active
  const advancedFilteredHabits = hasActiveFilters
    ? applyAdvancedFilters(displayHabits, conditions, globalLogicOperator)
    : displayHabits;

  const filteredAndSortedHabits = advancedFilteredHabits
    .filter((habit) => {
      const matchesSearch = habit.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // Only apply basic filters if no advanced filters are active
      if (!hasActiveFilters && filterBy === "all") return true;
      if (hasActiveFilters) return true; // Advanced filters already applied

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
        case "priority":
          const priorityOrder = {high: 3, medium: 2, low: 1};
          return (
            (priorityOrder[b.priority || "medium"] || 2) -
            (priorityOrder[a.priority || "medium"] || 2)
          );
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
  ): {completed: number; total: number} => {
    const today = new Date().toISOString().split("T")[0];
    const habitsForToday = habits.filter((h) => !h.isArchived);
    const completedToday = habitsForToday.filter(
      (h) => h.logs[today] === true
    ).length;
    return {completed: completedToday, total: habitsForToday.length};
  };

  const calculateTotalCompletedHabits = (habits: Habit[]): number => {
    let count = 0;
    habits.forEach((habit) => {
      count += Object.values(habit.logs).filter(Boolean).length;
    });
    return count;
  };

  const longestStreak = calculateLongestStreak(habits);
  const {completed: completedHabitsToday, total: totalHabitsToday} =
    calculateDailyCompletion(habits);
  const totalCompletedHabits = calculateTotalCompletedHabits(habits);
  // --- END CALCULATIONS ---

  // NEW: Function to toggle widget
  const handleToggleWidget = (widgetId: string, isEnabled: boolean) => {
    setEnabledWidgets((prev) =>
      isEnabled ? [...prev, widgetId] : prev.filter((id) => id !== widgetId)
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* NEW: Widgets Section with Settings Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        <button
          onClick={() => setShowWidgetSettings(true)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Manage Widgets"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-center">
        <SelfCareTip />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enabledWidgets.includes(WIDGET_IDS.CURRENT_STREAK) && (
          <CurrentStreakWidget longestStreak={longestStreak} />
        )}
        {enabledWidgets.includes(WIDGET_IDS.DAILY_COMPLETION) && (
          <DailyCompletionRateWidget
            completedHabitsToday={completedHabitsToday}
            totalHabitsToday={totalHabitsToday}
          />
        )}
        {enabledWidgets.includes(WIDGET_IDS.TOTAL_COMPLETED) && (
          <TotalHabitsCompletedWidget
            totalCompletedHabits={totalCompletedHabits}
          />
        )}
      </div>
      {/* END NEW: Widgets Section */}

      {/* Widget Settings Modal */}
      <WidgetSettingsModal
        isOpen={showWidgetSettings}
        onClose={() => setShowWidgetSettings(false)}
        enabledWidgets={enabledWidgets}
        onToggleWidget={handleToggleWidget}
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilter
        isOpen={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        conditions={conditions}
        globalLogicOperator={globalLogicOperator}
        onConditionsChange={updateConditions}
        onGlobalLogicOperatorChange={updateGlobalLogicOperator}
        presets={presets}
        onSavePreset={savePreset}
        onLoadPreset={loadPreset}
        onDeletePreset={deletePreset}
        habits={habits}
      />

      {/* Quick Actions */}
      {!showArchived && (
        <QuickActions
          habits={activeHabits}
          onMarkToday={onMarkToday}
          onAddHabit={onAddHabit}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {showArchived ? "Archived Habits" : "Your Habits"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {displayHabits.length === 0
              ? showArchived
                ? "No archived habits"
                : "Start building great habits today"
              : `${displayHabits.length} habit${
                  displayHabits.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`p-2 rounded-full transition-colors ${
              showArchived
                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title={showArchived ? "Show active habits" : "Show archived habits"}
          >
            <Archive className="w-5 h-5" />
          </button>

          {!showArchived && (
            <button
              onClick={onAddHabit}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Habit</span>
            </button>
          )}
        </div>
      </div>

      {!showArchived && displayHabits.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Created</option>
            <option value="priority">Sort by Priority</option>
            <option value="time">Sort by Time</option>
            <option value="streak">Sort by Streak</option>
            <option value="completion">Sort by Completion</option>
          </select>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              disabled={hasActiveFilters}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasActiveFilters ? "opacity-50 cursor-not-allowed" : ""
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
            <button
              onClick={() => setShowAdvancedFilter(true)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                hasActiveFilters
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              title="Advanced Filters"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">
                {hasActiveFilters
                  ? `${conditions.length} filter${
                      conditions.length !== 1 ? "s" : ""
                    }`
                  : "Advanced"}
              </span>
            </button>
          </div>
        </div>
      )}

      {filteredAndSortedHabits.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {showArchived ? (
              <Archive className="w-8 h-8 text-gray-400" />
            ) : (
              <Plus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {showArchived
              ? "No archived habits"
              : searchTerm
              ? "No habits found"
              : "No habits yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {showArchived
              ? "Archived habits will appear here when you archive them."
              : searchTerm
              ? "Try adjusting your search or filters."
              : "Create your first habit to start tracking your daily progress and building consistency."}
          </p>
          {!showArchived && !searchTerm && (
            <button
              onClick={onAddHabit}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors"
            >
              Create Your First Habit
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredAndSortedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onClick={() => onHabitClick(habit)}
              onMarkToday={() => onMarkToday(habit.id)}
              onArchive={() => onArchiveHabit(habit.id)}
              showArchiveButton={!showArchived}
            />
          ))}
        </div>
      )}
    </div>
  );
};
