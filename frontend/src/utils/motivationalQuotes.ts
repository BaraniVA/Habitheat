export const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only impossible journey is the one you never begin.",
  "Small daily improvements over time lead to stunning results.",
  "You don't have to be great to get started, but you have to get started to be great.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Progress, not perfection.",
  "Every expert was once a beginner.",
  "The journey of a thousand miles begins with one step.",
  "Consistency is the mother of mastery.",
  "What you do today can improve all your tomorrows.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done."
];

export const getRandomQuote = (): string => {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
};

export const getDailyQuote = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
};