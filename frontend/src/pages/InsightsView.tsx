import React, { useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Habit } from '../types';
import { generateInsights } from '../utils/insights';
import { motion, AnimatePresence } from 'framer-motion'; // Animation: Import Framer Motion

/* ------------------------------------------------------------------
   Reusable ShinyBorder wrapper with enhanced animations
   Usage:
     <ShinyBorder>
       ...your card content...
     </ShinyBorder>
   ------------------------------------------------------------------ */
interface ShinyBorderProps {
  children: React.ReactNode;
  className?: string; // optional extra classes for inner content wrapper
  innerClassName?: string; // if you want to override inner styling
}

const ShinyBorder: React.FC<ShinyBorderProps> = ({
  children,
  className = '',
  innerClassName = '',
}) => {
  return (
    <motion.div
      // Animation: Shiny border entrance with scale and rotation
      initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 80,
        damping: 12
      }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={
        // Outer gradient border
        'p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 ' +
        'bg-[length:200%_200%] animate-shine ' +
        className
      }
    >
      <div
        className={
          // Inner actual card surface
          'rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm ' +
          'border border-gray-100 dark:border-gray-700 ' +
          innerClassName
        }
      >
        {children}
      </div>
    </motion.div>
  );
};

interface InsightsViewProps {
  habits: Habit[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ habits }) => {
  const insights = generateInsights(habits);

  // tabtitle
  useEffect(()=>{
    document.title='Habit Heat-Insights'
  },[])

  /* --------------------------------------------------------------
     NOTE on Tailwind + dynamic color strings:
     bg-${color}-100 etc. only work if JIT sees the classes somewhere.
     If colors do NOT show, replace with a lookup map (see commented code).
     -------------------------------------------------------------- */
  // const colorMap: Record<string, string> = {
  //   blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
  //   green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
  //   purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  //   orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
  // };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = 'blue',
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }) => (
    <motion.div
      // Animation: Stat card entrance with staggered delay
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        rotateY: 3,
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <ShinyBorder innerClassName="p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Animation: Icon bubble with pulse effect */}
          <motion.div 
            className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900`}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          >
            <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
          </motion.div>

          {/* Animation: Trend arrow with bounce effect */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.2,
                transition: { duration: 0.2 }
              }}
              className={`flex items-center gap-1 ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
            </motion.div>
          )}
        </div>

        {/* Animation: Value with count-up effect */}
        <motion.div 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {value}
        </motion.div>
        <motion.div 
          className="text-sm text-gray-600 dark:text-gray-400 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {title}
        </motion.div>
        {subtitle && (
          <motion.div 
            className="text-xs text-gray-500 dark:text-gray-500 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {subtitle}
          </motion.div>
        )}
      </ShinyBorder>
    </motion.div>
  );

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
          Insights & Analytics
        </motion.h2>
        <motion.p 
          className="text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Understand your habit patterns and progress over time
        </motion.p>
      </motion.div>

      {/* Animation: Overview stats grid with staggered entrance */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.4,
            },
          },
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={{
          hidden: { opacity: 0, y: 30, scale: 0.9 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15
            }
          },
        }}>
          <StatCard
            icon={Target}
            title="Active Habits"
            value={insights.activeHabits}
            color="blue"
          />
        </motion.div>
        <motion.div variants={{
          hidden: { opacity: 0, y: 30, scale: 0.9 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15
            }
          },
        }}>
          <StatCard
            icon={TrendingUp}
            title="Avg. Streak"
            value={`${Math.round(insights.averageStreak)}d`}
            color="green"
          />
        </motion.div>
        <motion.div variants={{
          hidden: { opacity: 0, y: 30, scale: 0.9 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15
            }
          },
        }}>
          <StatCard
            icon={Calendar}
            title="Weekly Trend"
            value={`${
              insights.weeklyTrend > 0 ? '+' : ''
            }${Math.round(insights.weeklyTrend)}%`}
            trend={
              insights.weeklyTrend > 0
                ? 'up'
                : insights.weeklyTrend < 0
                ? 'down'
                : 'neutral'
            }
            color="purple"
          />
        </motion.div>
        <motion.div variants={{
          hidden: { opacity: 0, y: 30, scale: 0.9 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15
            }
          },
        }}>
          <StatCard
            icon={Award}
            title="Consistency"
            value={`${Math.round(insights.consistencyScore)}%`}
            color="orange"
          />
        </motion.div>
      </motion.div>

      {/* Animation: Performance analysis section with staggered entrance */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.8,
            },
          },
        }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Animation: Best Performing Habit card */}
        {insights.bestPerformingHabit && (
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30, rotateY: -15 },
              visible: { 
                opacity: 1, 
                x: 0, 
                rotateY: 0,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 12
                }
              },
            }}
            whileHover={{ 
              x: 5,
              rotateY: 2,
              transition: { duration: 0.3 }
            }}
          >
            <ShinyBorder>
              <motion.h3 
                className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Award className="w-5 h-5 text-yellow-500" />
                Top Performer
              </motion.h3>
              <motion.div 
                className="flex items-center gap-3 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.span 
                  className="text-2xl"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 10,
                    transition: { duration: 0.2 }
                  }}
                >
                  {insights.bestPerformingHabit.habit.emoji}
                </motion.span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {insights.bestPerformingHabit.habit.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(
                      insights.bestPerformingHabit.stats.completionRate
                    )}
                    % completion rate
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Current streak: {insights.bestPerformingHabit.stats.currentStreak}{' '}
                days
              </motion.div>
            </ShinyBorder>
          </motion.div>
        )}

        {/* Animation: Day Performance card */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 30, rotateY: 15 },
            visible: { 
              opacity: 1, 
              x: 0, 
              rotateY: 0,
              transition: {
                type: "spring",
                stiffness: 80,
                damping: 12
              }
            },
          }}
          whileHover={{ 
            x: -5,
            rotateY: -2,
            transition: { duration: 0.3 }
          }}
        >
          <ShinyBorder>
            <motion.h3 
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Calendar className="w-5 h-5 text-blue-500" />
              Day Performance
            </motion.h3>
            <motion.div 
              className="space-y-3"
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
              <motion.div 
                className="flex justify-between items-center"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Best day:
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {insights.bestDay}
                </span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Challenging day:
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {insights.worstDay}
                </span>
              </motion.div>
              <motion.div 
                className="text-xs text-gray-500 dark:text-gray-500 mt-2"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                Based on last 30 days of activity
              </motion.div>
            </motion.div>
          </ShinyBorder>
        </motion.div>
      </motion.div>

      {/* Animation: Struggling Habits section with conditional rendering */}
      <AnimatePresence>
        {insights.strugglingHabits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 80,
              damping: 12
            }}
          >
            <ShinyBorder>
              <motion.h3 
                className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Habits That Need Attention
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
                {insights.strugglingHabits.slice(0, 3).map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    variants={{
                      hidden: { opacity: 0, x: -20, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }
                      },
                    }}
                    whileHover={{ 
                      x: 5,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.span 
                      className="text-xl"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {habit.emoji}
                    </motion.span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {habit.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Consider adjusting your approach or setting smaller goals
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </ShinyBorder>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Monthly Trends card with enhanced entrance */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ 
          duration: 0.7,
          type: "spring",
          stiffness: 80,
          damping: 12
        }}
        whileHover={{ 
          y: -5,
          rotateX: 2,
          transition: { duration: 0.3 }
        }}
      >
        <ShinyBorder>
          <motion.h3 
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <TrendingUp className="w-5 h-5 text-green-500" />
            Progress Trends
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
                  staggerChildren: 0.2,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }
                },
              }}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Weekly Progress
              </div>
              <motion.div
                className={`text-2xl font-bold ${
                  insights.weeklyTrend > 0
                    ? 'text-green-600'
                    : insights.weeklyTrend < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {insights.weeklyTrend > 0 ? '+' : ''}
                {Math.round(insights.weeklyTrend)}%
              </motion.div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                vs. previous week
              </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }
                },
              }}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Monthly Progress
              </div>
              <motion.div
                className={`text-2xl font-bold ${
                  insights.monthlyTrend > 0
                    ? 'text-green-600'
                    : insights.monthlyTrend < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {insights.monthlyTrend > 0 ? '+' : ''}
                {Math.round(insights.monthlyTrend)}%
              </motion.div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                vs. previous month
              </div>
            </motion.div>
          </motion.div>
        </ShinyBorder>
      </motion.div>

      {/* Animation: Empty state with enhanced animations */}
      <AnimatePresence>
        {habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="text-center py-16"
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                type: "spring",
                stiffness: 120,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            >
              <TrendingUp className="w-8 h-8 text-gray-500 dark:text-gray-300" />
            </motion.div>
            <motion.h3 
              className="text-lg font-medium text-gray-900 dark:text-white mb-2"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4,
                type: "spring",
                stiffness: 100
              }}
            >
              No insights yet
            </motion.h3>
            <motion.p 
              className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5,
                type: "spring",
                stiffness: 80
              }}
            >
              Start tracking habits to see detailed insights and analytics about
              your progress.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
