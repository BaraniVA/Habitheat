export type HabitCategory = 
  | "Health & Fitness" 
  | "Learning" 
  | "Mindfulness" 
  | "Digital Wellness" 
  | "Home";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  logs: Record<string, boolean>; // YYYY-MM-DD -> completion status
  notes?: Record<string, string>; // Daily notes
  targetDays?: number[]; // Days of week (0-6) when habit should be done
  reminderTime?: string; // HH:MM format
  category?: HabitCategory; // <-- UPDATED
  difficulty?: "easy" | "medium" | "hard";
  isArchived?: boolean;
  priority?: "low" | "medium" | "high";
  estimatedTime?: number; // minutes
  linkedHabits?: string[]; // IDs of habits that work well together
  motivationalQuote?: string;
  rewards?: string[]; // Custom rewards for milestones
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  missedDays: number;
  completionRate: number;
  weeklyProgress: number;
  monthlyProgress: number;
  bestWeek: {week: string; completions: number};
  consistency: number; // How consistent the habit is over time
  momentum: number; // Recent performance trend
  perfectWeeks: number;
  totalTimeSpent: number; // estimated minutes
}

export interface DateInfo {
  date: string;
  dayOfWeek: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  completed?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  habitId?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  points?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "streak" | "completion" | "consistency" | "multi-habit";
  target: number;
  duration: number; // days
  startDate: string;
  endDate: string;
  habitIds?: string[];
  isActive: boolean;
  progress: number;
  reward: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface HabitTemplate {
  id: string;
  name: string;
  emoji: string;
  color?: string;
  category: HabitCategory; // <-- UPDATED
  difficulty: "easy" | "medium" | "hard";
  description: string;
  tips: string[];
  estimatedTime: number;
  daysPerWeek: number;
  motivationalQuote: string;
}

export interface Mood {
  date: string;
  rating: number; // 1-5
  note?: string;
  energy: number; // 1-5
  stress: number; // 1-5
}

export interface WeeklyGoal {
  habitId: string;
  targetDays: number;
  currentWeek: string; // YYYY-WW format
}

export interface HabitGroup {
  id: string;
  name: string;
  emoji: string;
  color: string;
  habitIds: string[];
  description?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  habitId: string;
  type: "streak" | "total" | "consistency";
  value: number;
  achievedAt: string;
  title: string;
  description: string;
}

export type Theme = "light" | "dark";
export type View =
  | "dashboard"
  | "habit-detail"
  | "add-habit"
  | "insights"
  | "achievements"
  | "challenges"
  | "mood"
  | "social"
  | "templates"
  | "profile"
  | "not-found";
export type SortOption =
  | "name"
  | "streak"
  | "completion"
  | "created"
  | "priority"
  | "time";
export type FilterOption =
  | "all"
  | "active"
  | "struggling"
  | "perfect"
  | "priority-high"
  | "quick"
  | "long";

// Advanced Filter System Types
export type FilterCriteriaType =
  | "category"
  | "priority"
  | "difficulty"
  | "completionRate"
  | "streak"
  | "estimatedTime"
  | "status"
  | "archived";
export type FilterOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "greater_equal"
  | "less_equal"
  | "contains";
export type LogicalOperator = "AND" | "OR";

export interface FilterCriteria {
  id: string;
  type: FilterCriteriaType;
  operator: FilterOperator;
  value: string | number;
  label?: string;
}

export interface FilterGroup {
  id: string;
  name: string;
  criteria: FilterCriteria[];
  logicalOperator: LogicalOperator;
  isActive: boolean;
}

export interface AdvancedFilter {
  groups: FilterGroup[];
  globalOperator: LogicalOperator; // How groups are combined
}

export interface SavedFilterPreset {
  id: string;
  name: string;
  description?: string;
  filter: AdvancedFilter;
  createdAt: string;
  lastUsed?: string;
}