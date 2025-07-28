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
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------
   Reusable ShinyBorder wrapper
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
    <div
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
    </div>
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
    <ShinyBorder innerClassName="p-6">
      <div className="flex items-center justify-between mb-4">
        {/* Icon bubble */}
        {/* If dynamic color classes break, swap to a colorMap */}
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>

        {/* Trend arrow */}
        {trend && (
          <div
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
          </div>
        )}
      </div>

      {/* Value + Labels */}
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {subtitle}
        </div>
      )}
    </ShinyBorder>
  );

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
          Insights & Analytics
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Understand your habit patterns and progress over time
        </p>
      </motion.div>

      {/* Animation: Stat cards staggered entrance */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}><StatCard icon={Target} title="Active Habits" value={insights.activeHabits} color="blue" /></motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}><StatCard icon={TrendingUp} title="Avg. Streak" value={`${Math.round(insights.averageStreak)}d`} color="green" /></motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}><StatCard icon={Calendar} title="Weekly Trend" value={`${insights.weeklyTrend > 0 ? '+' : ''}${Math.round(insights.weeklyTrend)}%`} trend={insights.weeklyTrend > 0 ? 'up' : insights.weeklyTrend < 0 ? 'down' : 'neutral'} color="purple" /></motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}><StatCard icon={Award} title="Consistency" value={`${Math.round(insights.consistencyScore)}%`} color="orange" /></motion.div>
      </motion.div>

      {/* Animation: Performance/analysis cards staggered entrance */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        {/* Best Performing Habit */}
        {insights.bestPerformingHabit && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <ShinyBorder>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Top Performer
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {insights.bestPerformingHabit.habit.emoji}
                </span>
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
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current streak: {insights.bestPerformingHabit.stats.currentStreak}{' '}
                days
              </div>
            </ShinyBorder>
          </motion.div>
        )}

        {/* Day Performance */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}>
          <ShinyBorder>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Day Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Best day:
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {insights.bestDay}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Challenging day:
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {insights.worstDay}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Based on last 30 days of activity
              </div>
            </div>
          </ShinyBorder>
        </motion.div>
      </motion.div>

      {/* Animation: Struggling habits card entrance */}
      <AnimatePresence>
        {insights.strugglingHabits.length > 0 && (
          <motion.div
            key="struggling-habits"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <ShinyBorder>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Habits That Need Attention
              </h3>
              <div className="grid gap-3">
                {insights.strugglingHabits.slice(0, 3).map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <span className="text-xl">{habit.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {habit.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Consider adjusting your approach or setting smaller goals
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ShinyBorder>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation: Monthly trends card entrance */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}>
        <ShinyBorder>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Progress Trends
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Weekly Progress
              </div>
              <div
                className={`text-2xl font-bold ${
                  insights.weeklyTrend > 0
                    ? 'text-green-600'
                    : insights.weeklyTrend < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {insights.weeklyTrend > 0 ? '+' : ''}
                {Math.round(insights.weeklyTrend)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                vs. previous week
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Monthly Progress
              </div>
              <div
                className={`text-2xl font-bold ${
                  insights.monthlyTrend > 0
                    ? 'text-green-600'
                    : insights.monthlyTrend < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {insights.monthlyTrend > 0 ? '+' : ''}
                {Math.round(insights.monthlyTrend)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                vs. previous month
              </div>
            </div>
          </div>
        </ShinyBorder>
      </motion.div>

      {/* Animation: Empty state entrance */}
      <AnimatePresence>
        {habits.length === 0 && (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No insights yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Start tracking habits to see detailed insights and analytics about
              your progress.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
