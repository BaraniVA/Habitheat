import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Target, Zap, Plus, CheckCircle } from 'lucide-react';
import { Challenge, Habit } from '../types';
import { generatePersonalizedChallenges, calculateChallengeProgress } from '../utils/challenges';
import { motion, AnimatePresence } from 'framer-motion';

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border transition-all ${
          isActive ? 'border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' :
          isCompleted ? 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' :
          'border-gray-100 dark:border-gray-700'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`text-3xl p-3 rounded-xl ${
              isActive ? 'bg-blue-100 dark:bg-blue-900' :
              isCompleted ? 'bg-green-100 dark:bg-green-900' :
              'bg-gray-100 dark:bg-gray-700'
            }`}>
              {challenge.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {challenge.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                {isCompleted && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {isCompleted && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {challenge.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{challenge.duration} days</span>
            </div>
            {isActive && (
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{daysLeft} days left</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">Reward:</span>
              <span className="font-medium text-gray-900 dark:text-white">{challenge.reward}</span>
            </div>
          </div>
        </div>

        {!isActive && !isCompleted && (
          <button
            onClick={() => onStartChallenge(challenge.id)}
            className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            Start Challenge
          </button>
        )}
      </motion.div>
    );
  };

  // Animation: Main container entrance
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-6 space-y-8"
    >
      {/* Animation: Header entrance */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Challenges
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Push yourself with fun challenges and earn rewards
        </p>
      </motion.div>

      {/* Active Challenges */}
      {/* Animation: Active challenges section and cards staggered entrance */}
      <AnimatePresence>
        {activeChallenges.length > 0 && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Active Challenges ({activeChallenges.length})
            </h3>
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.09,
                  },
                },
              }}
            >
              {activeChallenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.09, ease: 'easeOut' }}
                >
                  <ChallengeCard challenge={challenge} isActive={true} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed Challenges */}
      {/* Animation: Completed challenges section and cards staggered entrance */}
      <AnimatePresence>
        {completedChallenges.length > 0 && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-500" />
              Completed Challenges ({completedChallenges.length})
            </h3>
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.09,
                  },
                },
              }}
            >
              {completedChallenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.09, ease: 'easeOut' }}
                >
                  <ChallengeCard challenge={challenge} isCompleted={true} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Challenges */}
      {/* Animation: Available challenges section and cards staggered entrance */}
      <AnimatePresence>
        {upcomingChallenges.length > 0 && (
          <motion.div
            key="available"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-gray-500" />
              Available Challenges ({upcomingChallenges.length})
            </h3>
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.09,
                  },
                },
              }}
            >
              {upcomingChallenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.09, ease: 'easeOut' }}
                >
                  <ChallengeCard challenge={challenge} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Empty state entrance */}
      <AnimatePresence>
        {availableChallenges.length === 0 && (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No challenges available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Create some habits first to unlock personalized challenges!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};