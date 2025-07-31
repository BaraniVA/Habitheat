import {
  Habit,
  FilterCriteria,
  FilterGroup,
  AdvancedFilter,
  FilterOperator,
  SavedFilterPreset,
} from "../types";
import {calculateHabitStats} from "./habitStats";

// Available filter criteria configurations
export const FILTER_CRITERIA_CONFIG = {
  category: {
    label: "Category",
    type: "select",
    operators: ["equals", "not_equals"],
    values: [
      "Health",
      "Learning",
      "Mindfulness",
      "Productivity",
      "Social",
      "Creative",
      "Fitness",
      "Digital Wellness",
    ],
  },
  priority: {
    label: "Priority",
    type: "select",
    operators: ["equals", "not_equals"],
    values: ["low", "medium", "high"],
  },
  difficulty: {
    label: "Difficulty",
    type: "select",
    operators: ["equals", "not_equals"],
    values: ["easy", "medium", "hard"],
  },
  completionRate: {
    label: "Completion Rate (%)",
    type: "number",
    operators: [
      "greater_than",
      "less_than",
      "greater_equal",
      "less_equal",
      "equals",
    ],
    min: 0,
    max: 100,
  },
  streak: {
    label: "Current Streak (days)",
    type: "number",
    operators: [
      "greater_than",
      "less_than",
      "greater_equal",
      "less_equal",
      "equals",
    ],
    min: 0,
  },
  estimatedTime: {
    label: "Estimated Time (minutes)",
    type: "number",
    operators: [
      "greater_than",
      "less_than",
      "greater_equal",
      "less_equal",
      "equals",
    ],
    min: 0,
  },
  status: {
    label: "Status",
    type: "select",
    operators: ["equals", "not_equals"],
    values: ["completed_today", "pending_today", "missed_today"],
  },
  archived: {
    label: "Archived Status",
    type: "select",
    operators: ["equals"],
    values: ["true", "false"],
  },
} as const;

// Operator labels
export const OPERATOR_LABELS = {
  equals: "equals",
  not_equals: "does not equal",
  greater_than: "greater than",
  less_than: "less than",
  greater_equal: "greater than or equal to",
  less_equal: "less than or equal to",
  contains: "contains",
} as const;

// Generate unique ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Create default filter criteria
export const createDefaultCriteria = (): FilterCriteria => ({
  id: generateId(),
  type: "category",
  operator: "equals",
  value: "Health",
});

// Create default filter group
export const createDefaultGroup = (): FilterGroup => ({
  id: generateId(),
  name: "Group 1",
  criteria: [createDefaultCriteria()],
  logicalOperator: "AND",
  isActive: true,
});

// Create default advanced filter
export const createDefaultAdvancedFilter = (): AdvancedFilter => ({
  groups: [createDefaultGroup()],
  globalOperator: "AND",
});

// Evaluate a single criteria against a habit
export const evaluateCriteria = (
  habit: Habit,
  criteria: FilterCriteria
): boolean => {
  const {type, operator, value} = criteria;

  try {
    switch (type) {
      case "category":
        const habitCategory = habit.category || "";
        return evaluateStringComparison(habitCategory, operator, String(value));

      case "priority":
        const habitPriority = habit.priority || "medium";
        return evaluateStringComparison(habitPriority, operator, String(value));

      case "difficulty":
        const habitDifficulty = habit.difficulty || "";
        return evaluateStringComparison(
          habitDifficulty,
          operator,
          String(value)
        );

      case "completionRate":
        const stats = calculateHabitStats(habit);
        return evaluateNumberComparison(
          stats.completionRate,
          operator,
          Number(value)
        );

      case "streak":
        const streakStats = calculateHabitStats(habit);
        return evaluateNumberComparison(
          streakStats.currentStreak,
          operator,
          Number(value)
        );

      case "estimatedTime":
        const habitTime = habit.estimatedTime || 0;
        return evaluateNumberComparison(habitTime, operator, Number(value));

      case "status":
        const today = new Date().toISOString().split("T")[0];
        const todayStatus = habit.logs[today];

        switch (String(value)) {
          case "completed_today":
            return todayStatus === true;
          case "pending_today":
            return todayStatus === undefined && !habit.isArchived;
          case "missed_today":
            return todayStatus === false;
          default:
            return false;
        }

      case "archived":
        const isArchived = habit.isArchived || false;
        return evaluateBooleanComparison(
          isArchived,
          operator,
          String(value) === "true"
        );

      default:
        return true;
    }
  } catch (error) {
    console.warn("Error evaluating criteria:", error);
    return true;
  }
};

// String comparison helper
const evaluateStringComparison = (
  habitValue: string,
  operator: FilterOperator,
  filterValue: string
): boolean => {
  const lowerHabitValue = habitValue.toLowerCase();
  const lowerFilterValue = filterValue.toLowerCase();

  switch (operator) {
    case "equals":
      return lowerHabitValue === lowerFilterValue;
    case "not_equals":
      return lowerHabitValue !== lowerFilterValue;
    case "contains":
      return lowerHabitValue.includes(lowerFilterValue);
    default:
      return false;
  }
};

// Number comparison helper
const evaluateNumberComparison = (
  habitValue: number,
  operator: FilterOperator,
  filterValue: number
): boolean => {
  switch (operator) {
    case "equals":
      return habitValue === filterValue;
    case "not_equals":
      return habitValue !== filterValue;
    case "greater_than":
      return habitValue > filterValue;
    case "less_than":
      return habitValue < filterValue;
    case "greater_equal":
      return habitValue >= filterValue;
    case "less_equal":
      return habitValue <= filterValue;
    default:
      return false;
  }
};

// Boolean comparison helper
const evaluateBooleanComparison = (
  habitValue: boolean,
  operator: FilterOperator,
  filterValue: boolean
): boolean => {
  switch (operator) {
    case "equals":
      return habitValue === filterValue;
    case "not_equals":
      return habitValue !== filterValue;
    default:
      return false;
  }
};

// Evaluate a filter group
export const evaluateGroup = (habit: Habit, group: FilterGroup): boolean => {
  if (!group.isActive || group.criteria.length === 0) {
    return true;
  }

  const results = group.criteria.map((criteria) =>
    evaluateCriteria(habit, criteria)
  );

  if (group.logicalOperator === "AND") {
    return results.every((result) => result);
  } else {
    return results.some((result) => result);
  }
};

// Evaluate the entire advanced filter
export const evaluateAdvancedFilter = (
  habit: Habit,
  filter: AdvancedFilter
): boolean => {
  if (filter.groups.length === 0) {
    return true;
  }

  const activeGroups = filter.groups.filter((group) => group.isActive);
  if (activeGroups.length === 0) {
    return true;
  }

  const groupResults = activeGroups.map((group) => evaluateGroup(habit, group));

  if (filter.globalOperator === "AND") {
    return groupResults.every((result) => result);
  } else {
    return groupResults.some((result) => result);
  }
};

// Filter habits using advanced filter
export const filterHabitsAdvanced = (
  habits: Habit[],
  filter: AdvancedFilter
): Habit[] => {
  return habits.filter((habit) => evaluateAdvancedFilter(habit, filter));
};

// Save filter preset to localStorage
export const saveFilterPreset = (preset: SavedFilterPreset): void => {
  const presets = getFilterPresets();
  const updatedPresets = [...presets.filter((p) => p.id !== preset.id), preset];
  localStorage.setItem(
    "habit-heat-filter-presets",
    JSON.stringify(updatedPresets)
  );
};

// Get filter presets from localStorage
export const getFilterPresets = (): SavedFilterPreset[] => {
  try {
    const stored = localStorage.getItem("habit-heat-filter-presets");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Error loading filter presets:", error);
    return [];
  }
};

// Delete filter preset
export const deleteFilterPreset = (presetId: string): void => {
  const presets = getFilterPresets();
  const updatedPresets = presets.filter((p) => p.id !== presetId);
  localStorage.setItem(
    "habit-heat-filter-presets",
    JSON.stringify(updatedPresets)
  );
};

// Get readable label for criteria
export const getCriteriaLabel = (criteria: FilterCriteria): string => {
  const config = FILTER_CRITERIA_CONFIG[criteria.type];
  const operatorLabel = OPERATOR_LABELS[criteria.operator];
  let valueLabel = String(criteria.value);

  // Format value based on type
  if (criteria.type === "completionRate") {
    valueLabel = `${criteria.value}%`;
  } else if (criteria.type === "estimatedTime") {
    valueLabel = `${criteria.value} min`;
  } else if (criteria.type === "streak") {
    valueLabel = `${criteria.value} days`;
  } else if (criteria.type === "status") {
    const statusLabels = {
      completed_today: "Completed Today",
      pending_today: "Pending Today",
      missed_today: "Missed Today",
    };
    valueLabel =
      statusLabels[criteria.value as keyof typeof statusLabels] ||
      String(criteria.value);
  } else if (criteria.type === "archived") {
    valueLabel = criteria.value === "true" ? "Archived" : "Active";
  }

  return `${config.label} ${operatorLabel} ${valueLabel}`;
};

// Update last used timestamp for preset
export const updatePresetLastUsed = (presetId: string): void => {
  const presets = getFilterPresets();
  const updatedPresets = presets.map((preset) =>
    preset.id === presetId
      ? {...preset, lastUsed: new Date().toISOString()}
      : preset
  );
  localStorage.setItem(
    "habit-heat-filter-presets",
    JSON.stringify(updatedPresets)
  );
};
