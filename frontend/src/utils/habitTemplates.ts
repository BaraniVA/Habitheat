import { HabitTemplate } from '../types';

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: 'drink-water',
    name: 'Drink 8 glasses of water',
    emoji: '💧',
    color: 'bg-blue-500',
    category: 'Health & Fitness',
    difficulty: 'easy',
    description: 'Stay hydrated throughout the day for better health and energy',
    tips: [
      'Keep a water bottle at your desk',
      'Set hourly reminders',
      'Add lemon for flavor',
      'Track with an app or marks on your bottle'
    ],
    estimatedTime: 5,
    daysPerWeek: 7,
    motivationalQuote: 'Water is life. Stay hydrated, stay healthy!'
  },
  {
    id: 'morning-exercise',
    name: '30-minute morning workout',
    emoji: '🏃',
    color: 'bg-orange-500',
    category: 'Health & Fitness',
    difficulty: 'medium',
    description: 'Start your day with energy and endorphins',
    tips: [
      'Prepare workout clothes the night before',
      'Start with 10 minutes and gradually increase',
      'Find a workout buddy for accountability',
      'Mix cardio and strength training'
    ],
    estimatedTime: 30,
    daysPerWeek: 5,
    motivationalQuote: 'Your body can do it. It\'s your mind you need to convince.'
  },
  {
    id: 'read-daily',
    name: 'Read for 20 minutes',
    emoji: '📚',
    color: 'bg-green-500',
    category: 'Learning',
    difficulty: 'easy',
    description: 'Expand your knowledge and vocabulary daily',
    tips: [
      'Always carry a book or use an e-reader app',
      'Read during commute or breaks',
      'Join a book club for motivation',
      'Set a yearly reading goal'
    ],
    estimatedTime: 20,
    daysPerWeek: 7,
    motivationalQuote: 'Reading is to the mind what exercise is to the body.'
  },
  {
    id: 'meditation',
    name: '10-minute meditation',
    emoji: '🧘',
    color: 'bg-purple-500',
    category: 'Mindfulness',
    difficulty: 'medium',
    description: 'Practice mindfulness and reduce stress',
    tips: [
      'Use guided meditation apps',
      'Find a quiet, comfortable space',
      'Start with just 5 minutes',
      'Focus on your breath'
    ],
    estimatedTime: 10,
    daysPerWeek: 7,
    motivationalQuote: 'Peace comes from within. Do not seek it without.'
  },
  {
    id: 'gratitude-journal',
    name: 'Write 3 things I\'m grateful for',
    emoji: '✍️',
    color: 'bg-pink-500',
    category: 'Mindfulness',
    difficulty: 'easy',
    description: 'Cultivate positivity and appreciation',
    tips: [
      'Keep a journal by your bed',
      'Be specific in your gratitude',
      'Include small and big things',
      'Read past entries when feeling down'
    ],
    estimatedTime: 5,
    daysPerWeek: 7,
    motivationalQuote: 'Gratitude turns what we have into enough.'
  },
  {
    id: 'learn-language',
    name: 'Practice a new language',
    emoji: '🌍',
    color: 'bg-indigo-500',
    category: 'Learning',
    difficulty: 'medium',
    description: 'Expand your communication skills and cultural understanding',
    tips: [
      'Use language learning apps',
      'Practice with native speakers',
      'Watch movies with subtitles',
      'Set small daily goals'
    ],
    estimatedTime: 15,
    daysPerWeek: 5,
    motivationalQuote: 'A different language is a different vision of life.'
  },
  {
    id: 'no-phone-morning',
    name: 'No phone for first hour',
    emoji: '📱',
    color: 'bg-red-500',
    category: 'Digital Wellness',
    difficulty: 'hard',
    description: 'Start your day mindfully without digital distractions',
    tips: [
      'Charge phone outside bedroom',
      'Use a physical alarm clock',
      'Create a morning routine',
      'Replace phone time with reading or exercise'
    ],
    estimatedTime: 60,
    daysPerWeek: 7,
    motivationalQuote: 'The first hour of the morning is the rudder of the day.'
  },
  {
    id: 'healthy-meal',
    name: 'Eat one healthy meal',
    emoji: '🥗',
    color: 'bg-green-600',
    category: 'Health & Fitness',
    difficulty: 'easy',
    description: 'Nourish your body with nutritious food',
    tips: [
      'Meal prep on weekends',
      'Include vegetables in every meal',
      'Choose whole grains over processed',
      'Stay hydrated while eating'
    ],
    estimatedTime: 30,
    daysPerWeek: 7,
    motivationalQuote: 'Let food be thy medicine and medicine be thy food.'
  }
];

export const getTemplatesByCategory = (category: string): HabitTemplate[] => {
  return HABIT_TEMPLATES.filter(template => template.category === category);
};

export const getTemplateById = (id: string): HabitTemplate | undefined => {
  return HABIT_TEMPLATES.find(template => template.id === id);
};