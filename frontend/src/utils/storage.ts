import { Habit, Achievement, HabitTemplate } from '../types';

const STORAGE_KEY = 'habit-heat-data';
const THEME_KEY = 'habit-heat-theme';
const ACHIEVEMENTS_KEY = 'habit-heat-achievements';
const SETTINGS_KEY = 'habit-heat-settings';
const CUSTOM_TEMPLATES_KEY = 'habit-heat-custom-templates';

export const saveHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Failed to save habits:', error);
  }
};

export const loadHabits = (): Habit[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load habits:', error);
    return [];
  }
};

export const saveTheme = (theme: string): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const loadTheme = (): string => {
  return localStorage.getItem(THEME_KEY) || 'light';
};

export const saveAchievements = (achievements: Achievement[]): void => {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
};

export const loadAchievements = (): Achievement[] => {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load achievements:', error);
    return [];
  }
};

export const saveSettings = (settings: any): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettings = (): any => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      notifications: true,
      weekStartsOn: 0, // Sunday
      showWeekends: true
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {
      notifications: true,
      weekStartsOn: 0,
      showWeekends: true
    };
  }
};

export const saveCustomTemplates = (templates: HabitTemplate[]) : void => {
  try{
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save custom templates', error);
  }
};

export const loadCustomTemplates = (): HabitTemplate[] => {
  try {
    const data = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch(error) {
    console.error('Failed to load custom templates', error);
    return [];
  }
};