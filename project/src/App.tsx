import React, { useState, useEffect } from 'react';
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
import NotFound from './components/NotFound';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import { Habit, View, HabitTemplate } from './types';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';

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
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  // URL-based routing for production/vercel
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      const validRoutes = [
        '/',
        '/dashboard',
        '/insights', 
        '/achievements',
        '/challenges',
        '/mood',
        '/templates',
        '/login', 
        '/register'
      ];

      if (path === '/login') setCurrentView('login');
      else if (path === '/register') setCurrentView('register');
      else if (path === '/' || path === '/dashboard') setCurrentView('dashboard');
      else if (path === '/insights') setCurrentView('insights');
      else if (path === '/achievements') setCurrentView('achievements');
      else if (path === '/challenges') setCurrentView('challenges');
      else if (path === '/mood') setCurrentView('mood');
      else if (path === '/templates') setCurrentView('templates');
      else if (!validRoutes.includes(path)) setCurrentView('not-found');
    };

    handleRouting();

    const handlePopState = () => {
      handleRouting();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToView = (view: Exclude<View, 'not-found' | 'habit-detail' | 'add-habit' | 'social'>) => {
    const routes: Record<string, string> = {
      dashboard: '/',
      insights: '/insights',
      achievements: '/achievements', 
      challenges: '/challenges',
      mood: '/mood',
      templates: '/templates'
    };
    
    const path = routes[view];
    if (path) {
      window.history.pushState({}, '', path);
      setCurrentView(view);
    }
  };

  const getHeaderView = (view: View): 'dashboard' | 'insights' | 'achievements' | 'challenges' | 'mood' | 'templates' => {
    if (['not-found', 'habit-detail', 'add-habit', 'social'].includes(view)) {
      return 'dashboard';
    }
    return view as 'dashboard' | 'insights' | 'achievements' | 'challenges' | 'mood' | 'templates';
  };

  const handleNavigateHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('dashboard');
    setSelectedHabit(null);
  };

  const handleHabitClick = (habit: Habit) => {
    setSelectedHabit(habit);
    setCurrentView('habit-detail');
  };

  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/');
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
    handleNavigateHome();
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
      const habit = habits.find(h => h.id === targetHabitId);
      if(!habit) return;

      archiveHabit(targetHabitId, !habit.isArchived);

      if(selectedHabit && targetHabitId === selectedHabit.id) {
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
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <Header 
        theme={theme} 
        currentView={getHeaderView(currentView)}
        onThemeToggle={toggleTheme}
        onViewChange={(view) => navigateToView(view)}
      />
      
      {currentView === 'login' && (
        <LoginView onLoginSuccess={() => {
          setIsAuthenticated(true);
          handleNavigateHome();
        }} />
      )}

      {currentView === 'register' && (
        <RegisterView onRegisterSuccess={() => {
          window.history.pushState({}, '', '/login');
          setCurrentView('login');
        }} />
      )}
      {currentView === 'not-found' && (
        <NotFound onNavigateHome={handleNavigateHome} />
      )}

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