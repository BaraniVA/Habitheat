import React, { useEffect } from 'react';
import { Trophy, Star, Lock } from 'lucide-react';
import { Achievement } from '../types';
import { ACHIEVEMENT_DEFINITIONS } from '../utils/achievements';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const unlockedIds = new Set(achievements.map(a => a.id));
  
  const AchievementCard = ({ 
    achievement, 
    isUnlocked, 
    unlockedAt 
  }: { 
    achievement: any; 
    isUnlocked: boolean; 
    unlockedAt?: string;
  }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border transition-all ${
      isUnlocked 
        ? 'border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' 
        : 'border-gray-100 dark:border-gray-700'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`text-4xl p-3 rounded-xl ${
          isUnlocked 
            ? 'bg-yellow-100 dark:bg-yellow-900' 
            : 'bg-gray-100 dark:bg-gray-700 grayscale'
        }`}>
          {isUnlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-400" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-semibold ${
              isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {achievement.title}
            </h3>
            {isUnlocked && <Star className="w-4 h-4 text-yellow-500" />}
          </div>
          
          <p className={`text-sm ${
            isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
          }`}>
            {achievement.description}
          </p>
          
          {isUnlocked && unlockedAt && (
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const unlockedCount = achievements.length;
  const totalCount = ACHIEVEMENT_DEFINITIONS.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;
  
  // tabtitle
  useEffect(()=>{
    document.title='Habit Heat -Achievements'
  },[])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Achievements
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Celebrate your habit-building milestones
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Progress Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unlockedCount} of {totalCount} achievements unlocked
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Complete
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-6">
        {/* Unlocked Achievements */}
        {unlockedCount > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Unlocked ({unlockedCount})
            </h3>
            <div className="grid gap-4">
              {ACHIEVEMENT_DEFINITIONS
                .filter(def => unlockedIds.has(def.id))
                .map((def) => {
                  const achievement = achievements.find(a => a.id === def.id);
                  return (
                    <AchievementCard
                      key={def.id}
                      achievement={def}
                      isUnlocked={true}
                      unlockedAt={achievement?.unlockedAt}
                    />
                  );
                })}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {totalCount > unlockedCount && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              Locked ({totalCount - unlockedCount})
            </h3>
            <div className="grid gap-4">
              {ACHIEVEMENT_DEFINITIONS
                .filter(def => !unlockedIds.has(def.id))
                .map((def) => (
                  <AchievementCard
                    key={def.id}
                    achievement={def}
                    isUnlocked={false}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {unlockedCount === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No achievements yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Start building habits to unlock your first achievement!
          </p>
        </div>
      )}
    </div>
  );
};