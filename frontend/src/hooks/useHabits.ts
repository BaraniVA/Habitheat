import { useState, useEffect, useCallback } from 'react';
import { Habit, Achievement, Challenge, Mood, HabitTemplate } from '../types';
import { saveHabits, loadHabits, saveAchievements, loadAchievements } from '../utils/storage';
// 1. UPDATED: Import the new function from our achievements utility
import { checkNewAchievements } from '../utils/achievements';
import { formatDate } from '../utils/dateUtils';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [moods, setMoods] = useState<Record<string, Mood>>({});
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);

  useEffect(() => {
    const savedHabits = loadHabits();
    const savedAchievements = loadAchievements();
    const savedChallenges = JSON.parse(localStorage.getItem('habit-heat-challenges') || '[]');
    const savedMoods = JSON.parse(localStorage.getItem('habit-heat-moods') || '{}');
    const savedTemplates = JSON.parse(localStorage.getItem('habit-heat-templates') || '[]');
    
    setHabits(savedHabits);
    setAchievements(savedAchievements);
    setChallenges(savedChallenges);
    setMoods(savedMoods);
    setTemplates(savedTemplates);
  }, []);

  // 2. RENAMED & UPDATED: This function now uses our new achievement logic
  const updateHabitsAndCheckAchievements = useCallback((updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    
    // Check for new achievements using the new function
    const newAchievs = checkNewAchievements(updatedHabits, achievements);
    if (newAchievs.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievs];
      setAchievements(updatedAchievements);
      setNewAchievements(newAchievs);
      saveAchievements(updatedAchievements);
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
    
    // 3. UPDATED: Call the new central function
    updateHabitsAndCheckAchievements([...habits, newHabit]);
  }, [habits, updateHabitsAndCheckAchievements]);

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
    };
    
    updateHabitsAndCheckAchievements([...habits, newHabit]);
  }, [habits, updateHabitsAndCheckAchievements]);

  //adding template
  const addTemplate = useCallback((template: HabitTemplate) => {
     const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    localStorage.setItem('habit-heat-templates', JSON.stringify(updatedTemplates));
  }, [templates]);

  const updateHabit = useCallback((updatedHabit: Habit) => {
    const updatedHabits = habits.map(habit =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    updateHabitsAndCheckAchievements(updatedHabits);
  }, [habits, updateHabitsAndCheckAchievements]);

  const deleteHabit = useCallback((id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    updateHabitsAndCheckAchievements(updatedHabits);
  }, [habits, updateHabitsAndCheckAchievements]);

  // All your other functions are preserved
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
        const currentStatus = habit.logs[date];
        const updatedLogs = { ...habit.logs };
        if (currentStatus === undefined) { updatedLogs[date] = true; } 
        else if (currentStatus === true) { updatedLogs[date] = false; } 
        else { delete updatedLogs[date]; }
        return { ...habit, logs: updatedLogs };
      }
      return habit;
    });
    updateHabitsAndCheckAchievements(updatedHabits);
  }, [habits, updateHabitsAndCheckAchievements]);

  const markTodayComplete = useCallback((habitId: string) => {
    const today = formatDate(new Date());
    const habit = habits.find(h => h.id === habitId);
    if (habit && habit.logs[today] !== true) {
      toggleHabitCompletion(habitId, today);
    }
  }, [habits, toggleHabitCompletion]);

  const addNote = useCallback((habitId: string, date: string, note: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedNotes = { ...habit.notes };
        if (note.trim()) { updatedNotes[date] = note.trim(); } 
        else { delete updatedNotes[date]; }
        return { ...habit, notes: updatedNotes };
      }
      return habit;
    });
    updateHabitsAndCheckAchievements(updatedHabits);
  }, [habits, updateHabitsAndCheckAchievements]);

  const startChallenge = useCallback((challengeId: string) => {
    const updatedChallenges = challenges.map(c => c.id === challengeId ? { ...c, isActive: true } : c);
    setChallenges(updatedChallenges);
    localStorage.setItem('habit-heat-challenges', JSON.stringify(updatedChallenges));
  }, [challenges]);

  const completeChallenge = useCallback((challengeId: string) => {
    const updatedChallenges = challenges.map(c => c.id === challengeId ? { ...c, isActive: false } : c);
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
    templates,
    addHabit,
    addHabitFromTemplate,
    addTemplate,
    updateHabit,
    deleteHabit,
    archiveHabit,
    toggleHabitCompletion,
    markTodayComplete,
    addNote,
    startChallenge,
    completeChallenge,
    addMood,
    dismissAchievement
  };
};