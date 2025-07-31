import React, { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onDismiss: (id: string) => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievements,
  onDismiss
}) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (achievements.length > 0 && !currentAchievement) {
      setCurrentAchievement(achievements[0]);
    }
  }, [achievements, currentAchievement]);

  const handleDismiss = () => {
    if (currentAchievement) {
      onDismiss(currentAchievement.id);
      setCurrentAchievement(null);
      
      // Show next achievement if any
      const remaining = achievements.filter(a => a.id !== currentAchievement.id);
      if (remaining.length > 0) {
        setTimeout(() => setCurrentAchievement(remaining[0]), 500);
      }
    }
  };

  if (!currentAchievement) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-scale-in">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-lg max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentAchievement.icon}</span>
          <div>
            <div className="font-semibold">{currentAchievement.title}</div>
            <div className="text-sm opacity-90">{currentAchievement.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};