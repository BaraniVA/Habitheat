import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { HabitDetail } from './components/HabitDetail';
import { AddHabitModal } from './components/AddHabitModal';
import { InsightsView } from './components/InsightsView';
// THE FIX: Changed from { AchievementsView } to AchievementsView
import AchievementsView from './components/AchievementsView'; 
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

  useEffect(() => {
    if (newAchievements.length > 0) {
      const achievementToShow = newAchievements[0];
      toast.custom(
        (t) => <AchievementNotification achievement={achievementToShow} t={t} />,
        { duration: 5000 }
      );
      dismissAchievement(achievementToShow.id);
    }
  }, [newAchievements, dismissAchievement]);

  const handleHabitClick = (habit: Habit) => { setSelectedHabit(habit); setCurrentView('habit-detail'); };
  const handleBackToDashboard = () => { setCurrentView('dashboard'); setSelectedHabit(null); };
  const handleAddHabit = () => { setIsAddModalOpen(true); };
  const handleHabitAdded = (habitData: any) => { addHabit(habitData); };
  const handleUseTemplate = (template: HabitTemplate) => { addHabitFromTemplate(template); setCurrentView('dashboard'); };
  const handleDeleteHabit = () => { if (selectedHabit) { deleteHabit(selectedHabit.id); handleBackToDashboard(); } };
  const handleArchiveHabit = (habitId?: string) => { const id = habitId || selectedHabit?.id; if (id) { archiveHabit(id); if (selectedHabit?.id === id) handleBackToDashboard(); } };
  const handleDateToggle = (date: string) => { if (selectedHabit) toggleHabitCompletion(selectedHabit.id, date); };
  const handleMarkToday = (habitId?: string) => { const id = habitId || selectedHabit?.id; if (id) markTodayComplete(id); };
  const handleAddNote = (date: string, note: string) => { if (selectedHabit) addNote(selectedHabit.id, date, note); };

  useEffect(() => {
    if (selectedHabit) {
      const updatedHabit = habits.find(h => h.id === selectedHabit.id);
      if (!updatedHabit) {
        handleBackToDashboard();
      }
    }
  }, [habits, selectedHabit]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Toaster position="top-center" />

      <Header
        theme={theme}
        currentView={currentView}
        onThemeToggle={toggleTheme}
        onViewChange={setCurrentView}
      />

      {currentView === 'dashboard' && <Dashboard habits={habits} onAddHabit={handleAddHabit} onHabitClick={handleHabitClick} onMarkToday={handleMarkToday} onArchiveHabit={handleArchiveHabit} />}
      {currentView === 'insights' && <InsightsView habits={habits} />}
      {currentView === 'achievements' && <AchievementsView achievements={achievements} allHabits={habits} />}
      {currentView === 'challenges' && <ChallengesView habits={habits} challenges={challenges} onStartChallenge={startChallenge} onCompleteChallenge={completeChallenge} />}
      {currentView === 'mood' && <MoodTracker moods={moods} onAddMood={addMood} />}
      {currentView === 'templates' && <HabitTemplatesView onBack={handleBackToDashboard} onUseTemplate={handleUseTemplate} />}
      {currentView === 'habit-detail' && selectedHabit && <HabitDetail habit={selectedHabit} onBack={handleBackToDashboard} onDateToggle={handleDateToggle} onMarkToday={() => handleMarkToday()} onDelete={handleDeleteHabit} onArchive={() => handleArchiveHabit()} onAddNote={handleAddNote} />}
      
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleHabitAdded}
      />
    </div>
  );
}

export default App;