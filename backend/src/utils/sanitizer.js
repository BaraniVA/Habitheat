export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

export const sanitizeHabit = (habit) => {
  return {
    ...habit,
    name: sanitizeString(habit.name),
    description: sanitizeString(habit.description),
    category: sanitizeString(habit.category),
    unit: sanitizeString(habit.unit),
    tags: habit.tags ? habit.tags.map(tag => sanitizeString(tag)) : []
  };
};
