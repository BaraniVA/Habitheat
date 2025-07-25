import { Habit, Achievement } from '../types';
import { calculateHabitStats } from './habitStats'; // Assuming this function exists and works

// --- DATA STRUCTURES ---

// This defines the "blueprint" for an achievement.
// We've changed `check` to `progress` and `goal` to better support UI progress bars.
export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: (habits: Habit[]) => number;
  goal: number;
}

// This will be the shape of the data we use in the UI component.
export interface AchievementStatus {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  goal: number;
  unlockedAt: string | null; // Keep as string to match your existing Achievement type
}

// --- MASTER ACHIEVEMENT LIST ---

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-habit',
    title: 'Getting Started',
    description: 'Created your first habit',
    icon: '🌱',
    progress: (habits) => habits.length,
    goal: 1,
  },
  {
    id: 'habit-collector',
    title: 'Habit Collector',
    description: 'Created 5 different habits',
    icon: '📚',
    progress: (habits) => habits.length,
    goal: 5,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Completed a habit for 7 days straight',
    icon: '🔥',
    progress: (habits) => {
      const streaks = habits.map(h => calculateHabitStats(h).currentStreak);
      return Math.max(0, ...streaks);
    },
    goal: 7,
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Completed a habit for 30 days straight',
    icon: '👑',
    progress: (habits) => {
        const streaks = habits.map(h => calculateHabitStats(h).currentStreak);
        return Math.max(0, ...streaks);
    },
    goal: 30,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Achieved 100% completion rate for a habit',
    icon: '💎',
    progress: (habits) => {
        const rates = habits.map(h => calculateHabitStats(h).completionRate);
        return Math.max(0, ...rates);
    },
    goal: 100,
  },
  {
    id: 'comeback-kid',
    title: 'Comeback Kid',
    description: 'Restarted a habit after missing a day',
    icon: '💪',
    progress: (habits) => {
      const hasComeback = habits.some(h => {
        const stats = calculateHabitStats(h);
        return stats.currentStreak > 0 && stats.missedDays > 0;
      });
      return hasComeback ? 1 : 0;
    },
    goal: 1,
  }
];

// --- LOGIC FUNCTIONS ---

/**
 * Gets the status and progress of ALL achievements.
 * Perfect for the Achievements Gallery page.
 * @param habits The user's full list of habits.
 * @param unlockedAchievements The user's list of already unlocked achievements.
 */
export const getAchievementsStatus = (habits: Habit[], unlockedAchievements: Achievement[]): AchievementStatus[] => {
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
  const unlockedMap = new Map(unlockedAchievements.map(a => [a.id, a.unlockedAt]));

  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const currentProgress = def.progress(habits);
    const isUnlocked = unlockedIds.has(def.id) || currentProgress >= def.goal;
    
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      progress: Math.min(currentProgress, def.goal), // Cap progress at the goal
      goal: def.goal,
      unlockedAt: isUnlocked ? (unlockedMap.get(def.id) || new Date().toISOString()) : null,
    };
  });
};

/**
 * Checks for NEWLY unlocked achievements.
 * Perfect for triggering notifications.
 * @param habits The user's full list of habits.
 * @param existingAchievements The user's list of achievements before the latest action.
 */
export const checkNewAchievements = (habits: Habit[], existingAchievements: Achievement[]): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const existingIds = new Set(existingAchievements.map(a => a.id));

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    // If we don't have it already, and the progress now meets the goal...
    if (!existingIds.has(def.id) && def.progress(habits) >= def.goal) {
      newAchievements.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlockedAt: new Date().toISOString()
      });
    }
  }

  return newAchievements;
};