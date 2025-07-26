import {Habit, FilterCondition, LogicOperator, HabitStats} from "../types";
import {calculateHabitStats} from "./habitStats";

export const applyAdvancedFilters = (
  habits: Habit[],
  conditions: FilterCondition[],
  globalLogicOperator: LogicOperator = "AND"
): Habit[] => {
  if (conditions.length === 0) {
    return habits;
  }

  return habits.filter((habit) => {
    const habitStats = calculateHabitStats(habit);
    const results = conditions.map((condition) =>
      evaluateCondition(habit, condition, habitStats)
    );

    if (globalLogicOperator === "AND") {
      return results.every((result) => result);
    } else {
      return results.some((result) => result);
    }
  });
};

const evaluateCondition = (
  habit: Habit,
  condition: FilterCondition,
  stats: HabitStats
): boolean => {
  const {type, operator, value} = condition;

  let habitValue: any;

  switch (type) {
    case "category":
      habitValue = habit.category || "";
      break;
    case "priority":
      habitValue = habit.priority || "";
      break;
    case "difficulty":
      habitValue = habit.difficulty || "";
      break;
    case "completionRate":
      habitValue = stats.completionRate;
      break;
    case "streak":
      habitValue = stats.currentStreak;
      break;
    case "estimatedTime":
      habitValue = habit.estimatedTime || 0;
      break;
    case "targetDays":
      habitValue = habit.targetDays?.length || 0;
      break;
    default:
      return false;
  }

  switch (operator) {
    case "equals":
      return habitValue === value;
    case "contains":
      return String(habitValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "greaterThan":
      return Number(habitValue) > Number(value);
    case "lessThan":
      return Number(habitValue) < Number(value);
    case "greaterThanOrEqual":
      return Number(habitValue) >= Number(value);
    case "lessThanOrEqual":
      return Number(habitValue) <= Number(value);
    case "in":
      return Array.isArray(value) ? value.includes(habitValue) : false;
    default:
      return false;
  }
};

export const getFilterOptions = (habits: Habit[]) => {
  const categories = [
    ...new Set(habits.map((h) => h.category).filter(Boolean)),
  ];
  const priorities = ["low", "medium", "high"];
  const difficulties = ["easy", "medium", "hard"];

  return {
    categories,
    priorities,
    difficulties,
  };
};

export const createDefaultCondition = (): FilterCondition => ({
  id: Math.random().toString(36).substr(2, 9),
  type: "category",
  operator: "equals",
  value: "",
  logicOperator: "AND",
});

export const validateCondition = (condition: FilterCondition): boolean => {
  if (!condition.type || !condition.operator) {
    return false;
  }

  if (
    condition.value === null ||
    condition.value === undefined ||
    condition.value === ""
  ) {
    return false;
  }

  return true;
};
