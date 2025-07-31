import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Target, Zap, Plus, CheckCircle } from 'lucide-react';
import { Challenge, Habit } from '../types';
import { generatePersonalizedChallenges, calculateChallengeProgress } from '../utils/challenges';
import { motion, AnimatePresence } from 'framer-motion'; // Animation: Import Framer Motion

interface ChallengesViewProps {
  habits: Habit[];
  challenges: Challenge[];
  onStartChallenge: (challengeId: string) => void;
  onCompleteChallenge: (challengeId: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  habits,
  challenges,
  onStartChallenge,
  // onCompleteChallenge
}) => {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
   
  // tabtitle
    useEffect(()=>{
      document.title='Habit Heat-Challenges'
    },[])

  useEffect(() => {
    if (challenges.length === 0) {
      setAvailableChallenges(generatePersonalizedChallenges(habits));
    } else {
      setAvailableChallenges(challenges);
    }
  }, [habits, challenges]);

  const activeChallenges = availableChallenges.filter(c => c.isActive);
  const completedChallenges = availableChallenges.filter(c => !c.isActive && calculateChallengeProgress(c, habits) >= 100);
  const upcomingChallenges = availableChallenges.filter(c => !c.isActive && calculateChallengeProgress(c, habits) < 100);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const ChallengeCard = ({ challenge, isActive = false, isCompleted = false }: { 
    challenge: Challenge; 
    isActive?: boolean; 
    isCompleted?: boolean;
  }) => {
    const progress = calculateChallengeProgress(challenge, habits);
    const daysLeft = Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

    return (
      <motion.div 
        // Animation: Challenge card entrance with modern hover
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
          isActive ? 'border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' :
          isCompleted ? 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' :
          'border-gray-100 dark:border-gray-700'
        }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Animation: Challenge icon with modern hover */}
            <motion.div 
              className={`text-3xl p-3 rounded-xl ${
                isActive ? 'bg-blue-100 dark:bg-blue-900' :
                isCompleted ? 'bg-green-100 dark:bg-green-900' :
                'bg-gray-100 dark:bg-gray-700'
              }`}
              whileHover={{
                scale: 1.2,
                rotate: 10,
                transition: { duration: 0.2 }
              }}
              animate={isActive ? {
                scale: [1, 1.02, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              } : {}}
            >
              {challenge.icon}
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {challenge.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                {isCompleted && (
                  <motion.span 
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                  >
                    Completed
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          
          {/* Animation: CheckCircle icon for completed challenges */}
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.1 }
              }}
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {challenge.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <motion.span 
              className="font-medium text-gray-900 dark:text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            {/* Animation: Progress bar with animated fill */}
            <motion.div 
              className={`h-2 rounded-full ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
              }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{challenge.duration} days</span>
            </div>
            {isActive && (
              <motion.div 
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Target className="w-4 h-4" />
                <span>{daysLeft} days left</span>
              </motion.div>
            )}
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-sm">
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  rotate: 3,
                  transition: { duration: 0.15 }
                }}
              >
                <Trophy className="w-4 h-4 text-yellow-500" />
              </motion.div>
              <span className="text-gray-600 dark:text-gray-400">Reward:</span>
              <span className="font-medium text-gray-900 dark:text-white">{challenge.reward}</span>
            </div>
          </div>
        </div>

        {/* Animation: Start Challenge button with optimized hover effects */}
        {!isActive && !isCompleted && (
          <motion.button
            onClick={() => onStartChallenge(challenge.id)}
            className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            whileHover={{ 
              scale: 1.02,
              y: -2,
              boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3)",
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 0.99,
              transition: { duration: 0.05 }
            }}
          >
            Start Challenge
          </motion.button>
        )}
      </motion.div>
    );
  };

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
          Challenges
        </motion.h2>
        <motion.p 
          className="text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Push yourself with fun challenges and earn rewards
        </motion.p>
      </motion.div>

      {/* Animation: Active Challenges section with conditional rendering */}
      <AnimatePresence>
        {activeChallenges.length > 0 && (
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
                    scale: 1.1,
                    rotate: 3,
                    transition: { duration: 0.15 }
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                <Zap className="w-5 h-5 text-blue-500" />
              </motion.div>
              Active Challenges ({activeChallenges.length})
            </motion.h3>
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
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
              {activeChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
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
                  <ChallengeCard challenge={challenge} isActive={true} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Completed Challenges section with conditional rendering */}
      <AnimatePresence>
        {completedChallenges.length > 0 && (
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
                  scale: 1.1,
                  rotate: 3,
                  transition: { duration: 0.15 }
                }}
                animate={{
                  scale: [1, 1.02, 1],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Trophy className="w-5 h-5 text-green-500" />
              </motion.div>
              Completed Challenges ({completedChallenges.length})
            </motion.h3>
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
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
              {completedChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
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
                  <ChallengeCard challenge={challenge} isCompleted={true} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Available Challenges section with conditional rendering */}
      <AnimatePresence>
        {upcomingChallenges.length > 0 && (
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
                  scale: 1.1,
                  rotate: 3,
                  transition: { duration: 0.15 }
                }}
              >
                <Plus className="w-5 h-5 text-gray-500" />
              </motion.div>
              Available Challenges ({upcomingChallenges.length})
            </motion.h3>
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
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
              {upcomingChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
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
                  <ChallengeCard challenge={challenge} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Empty state with conditional rendering */}
      <AnimatePresence>
        {availableChallenges.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            <motion.div 
              className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: 3,
                transition: { duration: 0.15 }
              }}
            >
              <Trophy className="w-8 h-8 text-gray-400" />
            </motion.div>
            <motion.h3 
              className="text-lg font-medium text-gray-900 dark:text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              No challenges available
            </motion.h3>
            <motion.p 
              className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Create some habits first to unlock personalized challenges!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};