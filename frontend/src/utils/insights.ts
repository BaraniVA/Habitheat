import { Habit } from '../types';
import { calculateHabitStats } from './habitStats';
import { formatDate, getLast60Days } from './dateUtils';

export interface InsightData {
  totalHabits: number;
  activeHabits: number;
  averageStreak: number;
  bestPerformingHabit: { habit: Habit; stats: any } | null;
  strugglingHabits: Habit[];
  weeklyTrend: number;
  monthlyTrend: number;
  bestDay: string;
  worstDay: string;
  consistencyScore: number;
}

export const generateInsights = (habits: Habit[]): InsightData => {
  const activeHabits = habits.filter(h => !h.isArchived);
  const last60Days = getLast60Days();
  
  // Calculate stats for all habits
  const habitStats = activeHabits.map(habit => ({
    habit,
    stats: calculateHabitStats(habit)
  }));

  // Average streak
  const averageStreak = habitStats.length > 0 
    ? habitStats.reduce((sum, h) => sum + h.stats.currentStreak, 0) / habitStats.length 
    : 0;

  // Best performing habit
  const bestPerformingHabit = habitStats.length > 0
    ? habitStats.reduce((best, current) => 
        current.stats.completionRate > best.stats.completionRate ? current : best
      )
    : null;

  // Struggling habits (completion rate < 50%)
  const strugglingHabits = habitStats
    .filter(h => h.stats.completionRate < 50 && h.stats.totalCompletions > 0)
    .map(h => h.habit);

  // Weekly and monthly trends
  const last7Days = last60Days.slice(-7);
  const last30Days = last60Days.slice(-30);
  const previous7Days = last60Days.slice(-14, -7);
  const previous30Days = last60Days.slice(-60, -30);

  const getCompletionRate = (days: Date[]) => {
    const totalPossible = days.length * activeHabits.length;
    if (totalPossible === 0) return 0;
    
    const totalCompleted = days.reduce((sum, day) => {
      const dateStr = formatDate(day);
      return sum + activeHabits.reduce((daySum, habit) => {
        return daySum + (habit.logs[dateStr] === true ? 1 : 0);
      }, 0);
    }, 0);
    
    return (totalCompleted / totalPossible) * 100;
  };

  const weeklyTrend = getCompletionRate(last7Days) - getCompletionRate(previous7Days);
  const monthlyTrend = getCompletionRate(last30Days) - getCompletionRate(previous30Days);

  // Best and worst days of the week
  const dayStats = Array(7).fill(0).map(() => ({ completed: 0, total: 0 }));
  
  last30Days.forEach(day => {
    const dayOfWeek = day.getDay();
    const dateStr = formatDate(day);
    
    activeHabits.forEach(habit => {
      dayStats[dayOfWeek].total++;
      if (habit.logs[dateStr] === true) {
        dayStats[dayOfWeek].completed++;
      }
    });
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayRates = dayStats.map((stat, index) => ({
    day: dayNames[index],
    rate: stat.total > 0 ? (stat.completed / stat.total) * 100 : 0
  }));

  const bestDay = dayRates.reduce((best, current) => current.rate > best.rate ? current : best).day;
  const worstDay = dayRates.reduce((worst, current) => current.rate < worst.rate ? current : worst).day;

  // Consistency score (how evenly distributed completions are)
  const consistencyScore = habitStats.length > 0
    ? habitStats.reduce((sum, h) => sum + h.stats.consistency, 0) / habitStats.length
    : 0;

  return {
    totalHabits: habits.length,
    activeHabits: activeHabits.length,
    averageStreak,
    bestPerformingHabit,
    strugglingHabits,
    weeklyTrend,
    monthlyTrend,
    bestDay,
    worstDay,
    consistencyScore
  };
};