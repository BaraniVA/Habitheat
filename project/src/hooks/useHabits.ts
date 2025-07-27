import { useState, useEffect, useCallback } from 'react';
import { Habit, Achievement, Challenge, Mood, HabitTemplate, HabitLog } from '../types';
import { saveHabits, loadHabits, saveAchievements, loadAchievements } from '../utils/storage';
import { checkAchievements } from '../utils/achievements';
import { formatDate } from '../utils/dateUtils';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [moods, setMoods] = useState<Record<string, Mood>>({});

  useEffect(() => {
    const savedHabits = loadHabits();
    const savedAchievements = loadAchievements();
    const savedChallenges = JSON.parse(localStorage.getItem('habit-heat-challenges') || '[]');
    const savedMoods = JSON.parse(localStorage.getItem('habit-heat-moods') || '{}');
    
    setHabits(savedHabits);
    setAchievements(savedAchievements);
    setChallenges(savedChallenges);
    setMoods(savedMoods);
  }, []);

  const saveToStorage = useCallback((updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    
    const newAchievs = checkAchievements(updatedHabits, achievements);
    if (newAchievs.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievs];
      setAchievements(updatedAchievements);
      setNewAchievements(newAchievs);
      saveAchievements(updatedAchievements);
      
      setTimeout(() => setNewAchievements([]), 5000);
    }
  }, [achievements]);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'logs'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      logs: {},
      category: habitData.category || 'General',
      difficulty: habitData.difficulty || 'medium',
      isArchived: false
    };
    
    const updatedHabits = [...habits, newHabit];
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const addHabitFromTemplate = useCallback((template: HabitTemplate) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: template.name,
      emoji: template.emoji,
      color: template.color,
      createdAt: new Date().toISOString(),
      logs: {},
      category: template.category,
      difficulty: template.difficulty,
      isArchived: false,
      targetDays: template.targetDays,
      estimatedTime: template.estimatedTime,
      motivationalQuote: template.motivationalQuote
    };
    
    const updatedHabits = [...habits, newHabit];
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    );
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const deleteHabit = useCallback((id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const archiveHabit = useCallback((id: string, shouldArchive?: boolean) => {
    setHabits(prev => {
      const updated = prev.map(habit =>
        habit.id === id
          ? { ...habit, isArchived: shouldArchive !== undefined ? shouldArchive : !habit.isArchived }
          : habit
      );
      saveHabits(updated);
      return updated;
    });
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const currentLog = habit.logs[date];
        const updatedLogs = { ...habit.logs };

        if (currentLog?.status === 'completed') {
          updatedLogs[date] = { status: 'missed' };
        } else if (currentLog?.status === 'missed') {
          delete updatedLogs[date];
        } else {
          updatedLogs[date] = { status: 'completed' };
        }
        
        return { ...habit, logs: updatedLogs };
      }
      return habit;
    });
    
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const markTodayComplete = useCallback((habitId: string) => {
    const today = formatDate(new Date());
    const habit = habits.find(h => h.id === habitId);
    
    if (habit && habit.logs[today]?.status !== 'completed') {
        const updatedHabits = habits.map(h => {
            if (h.id === habitId) {
                const updatedLogs = { ...h.logs };
                updatedLogs[today] = { status: 'completed' };
                return { ...h, logs: updatedLogs };
            }
            return h;
        });
        saveToStorage(updatedHabits);
    }
  }, [habits, saveToStorage]);

  const skipToday = useCallback((habitId: string, reason: string) => {
    const today = formatDate(new Date());
    const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
            const updatedLogs = {
                ...habit.logs,
                [today]: { status: 'skipped', reason }
            };
            return { ...habit, logs: updatedLogs };
        }
        return habit;
    });
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);


  const addNote = useCallback((habitId: string, date: string, note: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedNotes = { ...habit.notes };
        if (note.trim()) {
          updatedNotes[date] = note.trim();
        } else {
          delete updatedNotes[date];
        }
        return { ...habit, notes: updatedNotes };
      }
      return habit;
    });
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const startChallenge = useCallback((challengeId: string) => {
    const updatedChallenges = challenges.map(challenge =>
      challenge.id === challengeId ? { ...challenge, isActive: true } : challenge
    );
    setChallenges(updatedChallenges);
    localStorage.setItem('habit-heat-challenges', JSON.stringify(updatedChallenges));
  }, [challenges]);

  const completeChallenge = useCallback((challengeId: string) => {
    const updatedChallenges = challenges.map(challenge =>
      challenge.id === challengeId ? { ...challenge, isActive: false } : challenge
    );
    setChallenges(updatedChallenges);
    localStorage.setItem('habit-heat-challenges', JSON.stringify(updatedChallenges));
  }, [challenges]);

  const addMood = useCallback((mood: Mood) => {
    const updatedMoods = { ...moods, [mood.date]: mood };
    setMoods(updatedMoods);
    localStorage.setItem('habit-heat-moods', JSON.stringify(updatedMoods));
  }, [moods]);

  const dismissAchievement = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
  }, []);

  return {
    habits,
    achievements,
    newAchievements,
    challenges,
    moods,
    addHabit,
    addHabitFromTemplate,
    updateHabit,
    deleteHabit,
    archiveHabit,
    toggleHabitCompletion,
    markTodayComplete,
    addNote,
    startChallenge,
    completeChallenge,
    addMood,
    dismissAchievement,
    skipToday
  };
};
