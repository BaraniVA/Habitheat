import React, { useEffect, useState } from 'react';
import { Zap, Cloud } from 'lucide-react';
import { Mood } from '../types';
import { formatDate } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion'; // Animation: Import Framer Motion

interface MoodTrackerProps {
  moods: Record<string, Mood>;
  onAddMood: (mood: Mood) => void;
}

const getIntensityGradient = (label: string, rating: number) => {
  if (label === "Stress Level") {
    if (rating === 5) return "bg-gradient-to-r from-red-500 to-red-700";
    if (rating === 4) return "bg-gradient-to-r from-orange-400 to-red-500";
    if (rating === 3) return "bg-gradient-to-r from-yellow-200 to-orange-400";
    if (rating === 2) return "bg-gradient-to-r from-green-600 to-yellow-200";
    return "bg-gradient-to-r from-green-500 to-green-700";
  } else {
    if (rating === 1) return "bg-gradient-to-r from-red-700 to-red-500";
    if (rating === 2) return "bg-gradient-to-r from-red-500 to-orange-400";
    if (rating === 3) return "bg-gradient-to-r from-orange-300 to-yellow-200";
    if (rating === 4) return "bg-gradient-to-r from-yellow-200 to-green-600";
    return "bg-gradient-to-r from-green-600 to-green-500";
  }
};

export const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, onAddMood }) => {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [note, setNote] = useState('');

  const today = formatDate(new Date());
  const todayMood = moods[today];

  const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
  const moodLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];

  // Animation: Set page title
  useEffect(()=>{
    document.title='Habit Heat-Mood'
  },[])

  const handleSubmit = () => {
    const mood: Mood = {
      date: today,
      rating: selectedMood,
      energy,
      stress,
      note: note.trim() || undefined
    };
    
    onAddMood(mood);
    setNote('');
  };

  const RatingSlider = ({ 
    value, 
    onChange, 
    label, 
    icon: Icon, 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    label: string; 
    icon: any; 
  }) => (
    <motion.div 
      // Animation: Rating slider container entrance
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        {/* Animation: Icon container with hover effect */}
        <motion.div 
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIntensityGradient(label, value)}`}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: { duration: 0.2 }
          }}
        >
          <Icon className="w-4 h-4 text-white" />
        </motion.div>
        <span className="font-medium text-gray-900 dark:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400 w-8">Low</span>
        <div className="flex-1 flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              onClick={() => onChange(rating)}
              // Animation: Rating button with hover and tap effects
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.15 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              className={`flex-1 h-8 rounded-lg transition-all ${
                value >= rating 
                  ? `${getIntensityGradient(label, rating).replace('text-', 'bg-').replace('-500', '-500')} text-white` 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 w-8">High</span>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      // Animation: Page container entrance with fade and slide
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-6"
    >
      {/* Animation: Page header with staggered text entrance */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <motion.h2 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Mood Tracker
        </motion.h2>
        <motion.p 
          className="text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Track your daily mood and energy levels
        </motion.p>
      </motion.div>

      {/* Animation: Main mood tracking card with entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          delay: 0.2
        }}
        whileHover={{ 
          y: -2,
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6"
      >
        <div>
          <motion.h3 
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            How are you feeling today?
          </motion.h3>
          
          {/* Animation: Conditional rendering for today's mood status */}
          <AnimatePresence mode="wait">
            {todayMood ? (
              <motion.div 
                key="logged"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  {/* Animation: Mood emoji with bounce entrance */}
                  <motion.span 
                    className="text-3xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                      delay: 0.1
                    }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 10,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {moodEmojis[todayMood.rating - 1]}
                  </motion.span>
                  <div>
                    <motion.div 
                      className="font-medium text-green-800 dark:text-green-200"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      Mood logged for today: {moodLabels[todayMood.rating - 1]}
                    </motion.div>
                    <motion.div 
                      className="text-sm text-green-600 dark:text-green-400"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      Energy: {todayMood.energy}/5 • Stress: {todayMood.stress}/5
                    </motion.div>
                  </div>
                </div>
                {todayMood.note && (
                  <motion.p 
                    className="text-sm text-green-700 dark:text-green-300 italic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    "{todayMood.note}"
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Animation: Mood selection section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    {moodEmojis.map((emoji, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.2 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <motion.button 
                          onClick={() => setSelectedMood(index + 1)} 
                          className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-2 ${
                            selectedMood === index + 1 
                              ? "bg-blue-100 dark:bg-blue-900 shadow-lg" 
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          whileHover={{ 
                            scale: 1.1,
                            y: -5,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ 
                            scale: 0.95,
                            transition: { duration: 0.1 }
                          }}
                          animate={selectedMood === index + 1 ? {
                            scale: 1.1,
                            y: -5,
                            transition: { duration: 0.3, ease: "easeOut" }
                          } : {}}
                        >
                          <motion.span 
                            className="text-3xl"
                            whileHover={{ 
                              scale: 1.2,
                              rotate: 10,
                              transition: { duration: 0.2 }
                            }}
                          >
                            {emoji}
                          </motion.span>
                        </motion.button>
                        <motion.div 
                          className="text-center mt-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: selectedMood === index + 1 ? 1 : 0, y: selectedMood === index + 1 ? 0 : 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {selectedMood === index + 1 && (
                            <span className="text-lg font-medium text-gray-900 dark:text-white">
                              {moodLabels[index]}
                            </span>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Animation: Energy and Stress sliders with staggered entrance */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <RatingSlider
                    value={energy}
                    onChange={setEnergy}
                    label="Energy Level"
                    icon={Zap}
                  />
                  
                  <RatingSlider
                    value={stress}
                    onChange={setStress}
                    label="Stress Level"
                    icon={Cloud}
                  />
                </motion.div>

                {/* Animation: Note input with entrance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <motion.textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="How was your day? Any thoughts or reflections..."
                    className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    whileFocus={{ 
                      scale: 1.01,
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                      transition: { duration: 0.2 }
                    }}
                  />
                </motion.div>

                {/* Animation: Submit button with enhanced hover effects */}
                <motion.button
                  onClick={handleSubmit}
                  className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                  whileHover={{ 
                    scale: 1.02,
                    y: -3,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                >
                  Save Today's Mood
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Animation: Recent moods section with conditional rendering */}
      <AnimatePresence>
        {Object.keys(moods).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-8"
          >
            <motion.h3 
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Recent Moods
            </motion.h3>
            <motion.div 
              className="grid gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              {Object.entries(moods)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 7)
                .map(([date, mood], index) => (
                  <motion.div 
                    key={date} 
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          duration: 0.4,
                          ease: "easeOut"
                        }
                      },
                    }}
                    whileHover={{ 
                      y: -3,
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Animation: Mood emoji with hover effect */}
                        <motion.span 
                          className="text-2xl"
                          whileHover={{ 
                            scale: 1.3,
                            rotate: 10,
                            transition: { duration: 0.2 }
                          }}
                        >
                          {moodEmojis[mood.rating - 1]}
                        </motion.span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {new Date(date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {moodLabels[mood.rating - 1]}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div>Energy: {mood.energy}/5</div>
                        <div>Stress: {mood.stress}/5</div>
                      </div>
                    </div>
                    {mood.note && (
                      <motion.p 
                        className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        "{mood.note}"
                      </motion.p>
                    )}
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};