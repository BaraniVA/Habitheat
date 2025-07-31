import { Habit, Achievement } from '../types';
import { calculateHabitStats } from './habitStats';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: (habits: Habit[]) => number;
  goal: number;
}
export interface AchievementStatus extends AchievementDefinition {
  unlockedAt: string | null;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // --- Original Achievements ---
  { id: 'first-habit', title: 'Getting Started', description: 'Created your first habit', icon: '🌱', progress: (habits) => habits.length, goal: 1 },
  { id: 'habit-collector', title: 'Habit Collector', description: 'Created 5 different habits', icon: '📚', progress: (habits) => habits.length, goal: 5 },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Completed a habit for 7 days straight', icon: '🔥', progress: (habits) => Math.max(0, ...habits.map(h => calculateHabitStats(h).currentStreak)), goal: 7 },
  { id: 'month-master', title: 'Month Master', description: 'Completed a habit for 30 days straight', icon: '👑', progress: (habits) => Math.max(0, ...habits.map(h => calculateHabitStats(h).currentStreak)), goal: 30 },
  { id: 'perfectionist', title: 'Perfectionist', description: 'Achieved 100% completion rate', icon: '💎', progress: (habits) => Math.max(0, ...habits.map(h => calculateHabitStats(h).completionRate)), goal: 100 },
  { id: 'comeback-kid', title: 'Comeback Kid', description: 'Restarted a habit after missing a day', icon: '💪', progress: (habits) => (habits.some(h => { const s = calculateHabitStats(h); return s.currentStreak > 0 && s.missedDays > 0; }) ? 1 : 0), goal: 1 },
  
  // --- New Achievements ---
  { 
    id: 'unstoppable', 
    title: 'Unstoppable', 
    description: 'Complete habits 250 times in total', 
    icon: '🚀', 
    progress: (habits) => habits.reduce((acc, h) => acc + Object.keys(h.logs).length, 0), 
    goal: 250 
  },
  { 
    id: 'legend', 
    title: 'Legend', 
    description: 'Complete habits 500 times in total', 
    icon: '🏆', 
    progress: (habits) => habits.reduce((acc, h) => acc + Object.keys(h.logs).length, 0), 
    goal: 500 
  },
  { 
    id: 'easy-does-it', 
    title: 'Easy Does It', 
    description: 'Create 3 habits with "easy" difficulty', 
    icon: '😊', 
    progress: (habits) => habits.filter(h => h.difficulty === 'easy').length, 
    goal: 3 
  },
  { 
    id: 'challenge-seeker', 
    title: 'Challenge Seeker', 
    description: 'Create 3 habits with "hard" difficulty', 
    icon: '🧗', 
    progress: (habits) => habits.filter(h => h.difficulty === 'hard').length, 
    goal: 3 
  },
];

// --- LOGIC FUNCTIONS (Unchanged) ---
export const getAchievementsStatus = (habits: Habit[], unlockedAchievements: Achievement[]): AchievementStatus[] => {
  const unlockedMap = new Map(unlockedAchievements.map(a => [a.id, a.unlockedAt]));
  return ACHIEVEMENT_DEFINITIONS.map(def => ({
    ...def,
    progress: Math.min(def.progress(habits), def.goal),
    unlockedAt: unlockedMap.get(def.id) || (def.progress(habits) >= def.goal ? new Date().toISOString() : null),
  }));
};
export const checkNewAchievements = (habits: Habit[], existingAchievements: Achievement[]): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const existingIds = new Set(existingAchievements.map(a => a.id));
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (!existingIds.has(def.id) && def.progress(habits) >= def.goal) {
      newAchievements.push({ id: def.id, title: def.title, description: def.description, icon: def.icon, unlockedAt: new Date().toISOString() });
    }
  }
  return newAchievements;
};