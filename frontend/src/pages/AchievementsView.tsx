import React, { useEffect, useMemo } from 'react';
import { Trophy, Star, Lock } from 'lucide-react';
import { Achievement, Habit } from '../types';
import { getAchievementsStatus, AchievementStatus, ACHIEVEMENT_DEFINITIONS } from '../utils/achievements';
import { motion, AnimatePresence } from 'framer-motion'; // Animation: Import Framer Motion

interface AchievementsViewProps {
  achievements: Achievement[];
  allHabits: Habit[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements = [], allHabits = [] }) => {
  const achievementStatuses = useMemo(() => 
    getAchievementsStatus(allHabits, achievements), 
    [allHabits, achievements]
  );

  const unlockedAchievements = achievementStatuses.filter(status => status.unlockedAt);
  const lockedAchievements = achievementStatuses.filter(status => !status.unlockedAt);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievementStatuses.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
  
  const AchievementCard = ({ achievement }: { achievement: AchievementStatus }) => {
    const isUnlocked = !!achievement.unlockedAt;
    
    return (
      <motion.div
        // Animation: Achievement card entrance with modern hover
        initial={{ opacity: 0, y: 15, scale: 0.98, rotateY: -3 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.99, transition: { duration: 0.05 } }}
        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border transition-all ${
          isUnlocked
            ? 'border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
            : 'border-gray-100 dark:border-gray-700'
        }`}>
        <div className="flex items-start gap-4">
          {/* Animation: Icon container with modern hover */}
          <motion.div
            className={`text-4xl p-3 rounded-xl ${
              isUnlocked
                ? 'bg-yellow-100 dark:bg-yellow-900'
                : 'bg-gray-100 dark:bg-gray-700 grayscale'
            }`}
            whileHover={{
              scale: 1.2,
              rotate: 10,
              transition: { duration: 0.2 }
            }}
            animate={isUnlocked ? {
              scale: [1, 1.02, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            } : {}}
          >
            {achievement.icon}
          </motion.div>
            
            <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${
                isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {achievement.title}
                </h3>
                {/* Animation: Star icon with optimized timing */}
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                )}
            </div>
            
            <p className={`text-sm ${
                isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
            }`}>
                {achievement.description}
            </p>
            
            {/* Animation: Unlock date with optimized timing */}
            {isUnlocked && achievement.unlockedAt && (
              <motion.div 
                className="text-xs text-yellow-600 dark:text-yellow-400 mt-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </motion.div>
            )}
            
            {/* Animation: Progress bar with optimized timing */}
            {!isUnlocked && achievement.goal > 1 && (
              <div className="w-full mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                          className="bg-yellow-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.goal) * 100}%` }}
                          transition={{ 
                            duration: 0.5,
                            ease: "easeOut",
                            delay: 0.1
                          }}
                      />
                  </div>
                  <motion.p 
                    className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                      {achievement.progress} / {achievement.goal}
                  </motion.p>
              </div>
            )}
            </div>
        </div>
        </motion.div>
    );
  }
  
  useEffect(()=>{
    document.title='Habit Heat - Achievements'
  },[])

  return (
    <motion.div 
      // Animation: Page entrance with fade and slide
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Animation: Page heading with staggered text entrance */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Achievements
        </motion.h2>
        <motion.p 
          className="text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Celebrate your habit-building milestones
        </motion.p>
      </motion.div>

      {/* Animation: Progress overview card with optimized timing */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98, rotateY: -3 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
        transition={{ 
          duration: 0.4,
          ease: "easeOut"
        }}
        whileHover={{ 
          y: -1,
          scale: 1.005,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          transition: { duration: 0.15, ease: "easeOut" }
        }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
                         {/* Animation: Trophy icon with optimized timing */}
             <motion.div 
               className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl"
               whileHover={{ 
                 scale: 1.02,
                 transition: { duration: 0.1 }
               }}
              animate={{
                scale: [1, 1.02, 1],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </motion.div>
            <div>
              <motion.h3 
                className="text-lg font-semibold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Progress Overview
              </motion.h3>
              <motion.p 
                className="text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {unlockedCount} of {totalCount} achievements unlocked
              </motion.p>
            </div>
          </div>
          <div className="text-right">
            {/* Animation: Progress percentage with optimized timing */}
            <motion.div 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              {Math.round(progressPercentage)}%
            </motion.div>
            <motion.div 
              className="text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Complete
            </motion.div>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          {/* Animation: Progress bar with optimized timing */}
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2
            }}
          />
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Animation: Unlocked achievements section with optimized timing */}
        <AnimatePresence>
          {unlockedAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <motion.h3 
                className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                >
                  <Star className="w-5 h-5 text-yellow-500" />
                </motion.div>
                Unlocked ({unlockedAchievements.length})
              </motion.h3>
              <motion.div 
                className="grid gap-4"
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
                {unlockedAchievements.map((status, index) => (
                  <motion.div
                    key={status.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.98 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          duration: 0.3,
                          ease: "easeOut"
                        }
                      },
                    }}
                  >
                    <AchievementCard achievement={status} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animation: Locked achievements section with optimized timing */}
        <AnimatePresence>
          {lockedAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <motion.h3 
                className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                >
                  <Lock className="w-5 h-5 text-gray-400" />
                </motion.div>
                Locked ({lockedAchievements.length})
              </motion.h3>
              <motion.div 
                className="grid gap-4"
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
                {lockedAchievements.map((status, index) => (
                  <motion.div
                    key={status.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.98 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          duration: 0.3,
                          ease: "easeOut"
                        }
                      },
                    }}
                  >
                    <AchievementCard achievement={status} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};