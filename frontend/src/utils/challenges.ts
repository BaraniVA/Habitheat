import { Challenge, Habit } from '../types';
import { calculateHabitStats } from './habitStats';
import { formatDate } from './dateUtils';

export const CHALLENGE_TEMPLATES: Omit<Challenge, 'id' | 'startDate' | 'endDate' | 'isActive' | 'progress'>[] = [
  {
    title: '7-Day Streak Master',
    description: 'Complete any habit for 7 days in a row',
    icon: '🔥',
    type: 'streak',
    target: 7,
    duration: 14,
    reward: 'Streak Master Badge',
    difficulty: 'easy'
  },
  {
    title: 'Perfect Week',
    description: 'Complete all your habits every day for a week',
    icon: '⭐',
    type: 'completion',
    target: 100,
    duration: 7,
    reward: 'Perfect Week Trophy',
    difficulty: 'hard'
  },
  {
    title: 'Consistency Champion',
    description: 'Maintain 80% completion rate for 30 days',
    icon: '🎯',
    type: 'consistency',
    target: 80,
    duration: 30,
    reward: 'Consistency Crown',
    difficulty: 'medium'
  },
  {
    title: 'Multi-Habit Hero',
    description: 'Complete 3 different habits in one day, 10 times',
    icon: '🦸',
    type: 'multi-habit',
    target: 10,
    duration: 21,
    reward: 'Hero Cape',
    difficulty: 'medium'
  },
  {
    title: 'Morning Warrior',
    description: 'Complete morning habits before 9 AM for 14 days',
    icon: '🌅',
    type: 'streak',
    target: 14,
    duration: 21,
    reward: 'Early Bird Badge',
    difficulty: 'medium'
  },
  {
    title: 'Habit Collector',
    description: 'Complete 100 total habit instances',
    icon: '📚',
    type: 'completion',
    target: 100,
    duration: 60,
    reward: 'Collector\'s Edition Badge',
    difficulty: 'easy'
  }
];

export const generatePersonalizedChallenges = (habits: Habit[]): Challenge[] => {
  const challenges: Challenge[] = [];
  const today = new Date();
  
  CHALLENGE_TEMPLATES.forEach((template, index) => {
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + template.duration);
    
    const challenge: Challenge = {
      ...template,
      id: `challenge-${index}-${Date.now()}`,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      isActive: false,
      progress: 0,
      habitIds: template.type === 'multi-habit' ? habits.slice(0, 3).map(h => h.id) : undefined
    };
    
    challenges.push(challenge);
  });
  
  return challenges;
};

export const calculateChallengeProgress = (challenge: Challenge, habits: Habit[]): number => {
  const startDate = new Date(challenge.startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (challenge.type) {
    case 'streak':
      const relevantHabits = challenge.habitIds ? 
        habits.filter(h => challenge.habitIds!.includes(h.id)) : habits;
      const maxStreak = Math.max(...relevantHabits.map(h => calculateHabitStats(h).currentStreak));
      return Math.min((maxStreak / challenge.target) * 100, 100);
      
    case 'completion':
      if (challenge.habitIds) {
        const targetHabits = habits.filter(h => challenge.habitIds!.includes(h.id));
        const totalCompletions = targetHabits.reduce((sum, habit) => {
          return sum + calculateHabitStats(habit).totalCompletions;
        }, 0);
        return Math.min((totalCompletions / challenge.target) * 100, 100);
      }
      break;
      
    case 'consistency':
      const avgConsistency = habits.reduce((sum, habit) => {
        return sum + calculateHabitStats(habit).completionRate;
      }, 0) / habits.length;
      return avgConsistency >= challenge.target ? 100 : (avgConsistency / challenge.target) * 100;
      
    case 'multi-habit':
      // Count days where multiple habits were completed
      let multiHabitDays = 0;
      for (let i = 0; i <= daysSinceStart && i < challenge.duration; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(startDate.getDate() + i);
        const dateStr = formatDate(checkDate);
        
        const completedHabits = habits.filter(h => h.logs[dateStr] === true).length;
        if (completedHabits >= 3) multiHabitDays++;
      }
      return Math.min((multiHabitDays / challenge.target) * 100, 100);
  }
  
  return 0;
};