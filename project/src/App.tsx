import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { HabitDetail } from './components/HabitDetail';
import { AddHabitModal } from './components/AddHabitModal';
import { InsightsView } from './components/InsightsView';
import { AchievementsView } from './components/AchievementsView';
import { ChallengesView } from './components/ChallengesView';
import { MoodTracker } from './components/MoodTracker';
import { HabitTemplatesView } from './components/HabitTemplatesView';
import { AchievementNotification } from './components/AchievementNotification';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import { Habit, View, HabitTemplate } from './types';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { 
    habits, 
    achievements, 
    newAchievements,
    challenges,
    moods,
    addHabit,
    addHabitFromTemplate,
    deleteHabit, 
    archiveHabit,
    toggleHabitCompletion, 
    markTodayComplete,
    addNote,
    startChallenge,
    completeChallenge,
    addMood,
    dismissAchievement
  } = useHabits();
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleHabitClick = (habit: Habit) => {
    setSelectedHabit(habit);
    setCurrentView('habit-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedHabit(null);
  };

  const handleAddHabit = () => {
    setIsAddModalOpen(true);
  };

  const handleHabitAdded = (habitData: { 
    name: string; 
    emoji: string; 
    color: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    targetDays?: number[];
    reminderTime?: string;
    priority?: 'low' | 'medium' | 'high';
    estimatedTime?: number;
    motivationalQuote?: string;
  }) => {
    addHabit(habitData);
  };

  const handleUseTemplate = (template: HabitTemplate) => {
    addHabitFromTemplate(template);
    setCurrentView('dashboard');
  };

  const handleDeleteHabit = () => {
    if (selectedHabit) {
      deleteHabit(selectedHabit.id);
      handleBackToDashboard();
    }
  };

  const handleArchiveHabit = (habitId?: string) => {
    const targetHabitId = habitId || selectedHabit?.id;
    if (targetHabitId) {
      archiveHabit(targetHabitId);
      if (selectedHabit && targetHabitId === selectedHabit.id) {
        handleBackToDashboard();
      }
    }
  };

  const handleDateToggle = (date: string) => {
    if (selectedHabit) {
      toggleHabitCompletion(selectedHabit.id, date);
      // Update the selected habit to reflect changes
      const updatedHabit = habits.find(h => h.id === selectedHabit.id);
      if (updatedHabit) {
        setSelectedHabit(updatedHabit);
      }
    }
  };

  const handleMarkToday = (habitId?: string) => {
    const targetHabitId = habitId || selectedHabit?.id;
    if (targetHabitId) {
      markTodayComplete(targetHabitId);
      // Update selected habit if it's the current one
      if (selectedHabit && targetHabitId === selectedHabit.id) {
        const updatedHabit = habits.find(h => h.id === selectedHabit.id);
        if (updatedHabit) {
          setSelectedHabit(updatedHabit);
        }
      }
    }
  };

  const handleAddNote = (date: string, note: string) => {
    if (selectedHabit) {
      addNote(selectedHabit.id, date, note);
      // Update the selected habit to reflect changes
      const updatedHabit = habits.find(h => h.id === selectedHabit.id);
      if (updatedHabit) {
        setSelectedHabit(updatedHabit);
      }
    }
  };

  // Update selected habit when habits change
  React.useEffect(() => {
    if (selectedHabit) {
      const updatedHabit = habits.find(h => h.id === selectedHabit.id);
      if (updatedHabit) {
        setSelectedHabit(updatedHabit);
      }
    }
  }, [habits, selectedHabit]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        theme={theme} 
        currentView={currentView}
        onThemeToggle={toggleTheme}
        onViewChange={setCurrentView}
      />
      
      {currentView === 'dashboard' && (
        <Dashboard
          habits={habits}
          onAddHabit={handleAddHabit}
          onHabitClick={handleHabitClick}
          onMarkToday={handleMarkToday}
          onArchiveHabit={handleArchiveHabit}
        />
      )}

      {currentView === 'insights' && (
        <InsightsView habits={habits} />
      )}

      {currentView === 'achievements' && (
        <AchievementsView achievements={achievements} />
      )}

      {currentView === 'challenges' && (
        <ChallengesView 
          habits={habits}
          challenges={challenges}
          onStartChallenge={startChallenge}
          onCompleteChallenge={completeChallenge}
        />
      )}

      {currentView === 'mood' && (
        <MoodTracker 
          moods={moods}
          onAddMood={addMood}
        />
      )}

      {currentView === 'templates' && (
        <HabitTemplatesView
          onBack={handleBackToDashboard}
          onUseTemplate={handleUseTemplate}
        />
      )}

      {currentView === 'habit-detail' && selectedHabit && (
        <HabitDetail
          habit={selectedHabit}
          onBack={handleBackToDashboard}
          onDateToggle={handleDateToggle}
          onMarkToday={() => handleMarkToday()}
          onDelete={handleDeleteHabit}
          onArchive={() => handleArchiveHabit()}
          onAddNote={handleAddNote}
        />
      )}

      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleHabitAdded}
      />

      <AchievementNotification
        achievements={newAchievements}
        onDismiss={dismissAchievement}
      />
    </div>
  );
}

export default App;