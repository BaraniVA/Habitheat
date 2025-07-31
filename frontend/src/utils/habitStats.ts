import { Habit, HabitStats } from '../types';
import { formatDate, getLast60Days } from './dateUtils';

export const calculateHabitStats = (habit: Habit): HabitStats => {
  const logs = habit.logs;
  const dates = getLast60Days().map(date => formatDate(date));
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let totalCompletions = 0;
  let missedDays = 0;
  
  // Calculate current streak (from today backwards)
  const today = formatDate(new Date());
  const todayIndex = dates.indexOf(today);
  
  if (todayIndex !== -1) {
    for (let i = todayIndex; i >= 0; i--) {
      const date = dates[i];
      if (logs[date] === true) {
        currentStreak++;
      } else if (logs[date] === false) {
        break; // Streak broken by missed day
      } else {
        // No log for this day - only break streak if it's not today
        if (i !== todayIndex) break;
      }
    }
  }
  
  // Calculate longest streak and other stats
  for (const date of dates) {
    const completed = logs[date];
    
    if (completed === true) {
      totalCompletions++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (completed === false) {
      missedDays++;
      tempStreak = 0;
    } else {
      // No log - reset streak
      tempStreak = 0;
    }
  }
  
  const totalLoggedDays = totalCompletions + missedDays;
  const completionRate = totalLoggedDays > 0 ? (totalCompletions / totalLoggedDays) * 100 : 0;
  
  // Weekly progress (last 7 days)
  const last7Days = dates.slice(-7);
  const weeklyCompletions = last7Days.reduce((sum, date) => sum + (logs[date] === true ? 1 : 0), 0);
  const weeklyProgress = (weeklyCompletions / 7) * 100;
  
  // Monthly progress (last 30 days)
  const last30Days = dates.slice(-30);
  const monthlyCompletions = last30Days.reduce((sum, date) => sum + (logs[date] === true ? 1 : 0), 0);
  const monthlyProgress = (monthlyCompletions / 30) * 100;
  
  // Best week
  let bestWeek = { week: '', completions: 0 };
  for (let i = 0; i < dates.length - 6; i += 7) {
    const weekDates = dates.slice(i, i + 7);
    const weekCompletions = weekDates.reduce((sum, date) => sum + (logs[date] === true ? 1 : 0), 0);
    if (weekCompletions > bestWeek.completions) {
      bestWeek = {
        week: `${weekDates[0]} to ${weekDates[6]}`,
        completions: weekCompletions
      };
    }
  }
  
  // Consistency score (variance in daily completion)
  const dailyRates = [];
  for (let i = 0; i < dates.length - 6; i += 7) {
    const weekDates = dates.slice(i, i + 7);
    const weekCompletions = weekDates.reduce((sum, date) => sum + (logs[date] === true ? 1 : 0), 0);
    dailyRates.push(weekCompletions / 7);
  }
  
  const avgRate = dailyRates.reduce((sum, rate) => sum + rate, 0) / dailyRates.length;
  const variance = dailyRates.reduce((sum, rate) => sum + Math.pow(rate - avgRate, 2), 0) / dailyRates.length;
  const consistency = Math.max(0, 100 - (variance * 100));
  
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    missedDays,
    completionRate,
    weeklyProgress,
    monthlyProgress,
    bestWeek,
    consistency
  };
};