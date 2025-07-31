import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { HabitDetail } from './components/HabitDetail';
import { AddHabitModal } from './components/AddHabitModal';
import { SaveAsTemplateModal } from './components/SaveAsTemplateModal';
import { InsightsView } from './pages/InsightsView';
import { AchievementsView } from './pages/AchievementsView';
import { ChallengesView } from './pages/ChallengesView';
import { MoodTracker } from './pages/MoodTracker';
import { HabitTemplatesView } from './pages/HabitTemplatesView';
import { AchievementNotification } from './components/AchievementNotification';
import NotFound from './pages/NotFound';
import Login from './components/Login';
import Signup from './components/Signup';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import { Habit, View, HabitTemplate } from './types';
import ProfilePage from './pages/ProfilePage';
import { Footer } from './components/Footer';
import Blogs from './pages/Blogs';
import { loadCustomTemplates, saveCustomTemplates } from './utils/storage';

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
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [habitToSave, setHabitToSave] = useState<Habit | null>(null);
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedHabit(null);
  };

  // URL-based routing for production/vercel
  useEffect(() => {
    if (!isAuthenticated) return; // Don't handle routing if not authenticated

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
        '/profile'
      ];

      if (path === '/' || path === '/dashboard') {
        setCurrentView('dashboard');
      } else if (path === '/insights') {
        setCurrentView('insights');
      } else if (path === '/achievements') {
        setCurrentView('achievements');
      }else if(path == '/blogs'){
        setCurrentView('blogs');
      } else if (path === '/challenges') {
        setCurrentView('challenges');
      } else if (path === '/mood') {
        setCurrentView('mood');
      } else if (path === '/templates') {
        setCurrentView('templates');
      } else if (path === '/profile') {
        setCurrentView('profile');
      } else if (!validRoutes.includes(path)) {
        setCurrentView('not-found');
      }
    };

    handleRouting();

    const handlePopState = () => {
      handleRouting();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  const navigateToView = (view: Exclude<View, 'not-found' | 'habit-detail' | 'add-habit' | 'social'>) => {
    const routes: Record<string, string> = {
      dashboard: '/',
      insights: '/insights',
      achievements: '/achievements', 
      challenges: '/challenges',
      blogs: '/blogs',
      mood: '/mood',
      templates: '/templates',
      profile: '/profile'
    };
    
    const path = routes[view];
    if (path) {
      window.history.pushState({}, '', path);
      setCurrentView(view);
    }
  };

  const getHeaderView = (view: View): 'dashboard' | 'insights' | 'achievements' | 'blogs' |'challenges' | 'mood' | 'templates' | 'profile' => {
    if (['not-found', 'habit-detail', 'add-habit', 'social'].includes(view)) {
      return 'dashboard';
    }
    return view as 'dashboard' | 'insights' | 'achievements' | 'blogs' | 'challenges' | 'mood' | 'templates' | 'profile';
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

  const handleSaveTemplate = (templateData: Omit<HabitTemplate, 'id'>) => {
    const newTemplate: HabitTemplate = {
      ...templateData,
      id: crypto.randomUUID(),
    };
    addTemplate(newTemplate);
    setIsSaveTemplateOpen(false);
  };

  const handleSaveTemplateClick = (habit: Habit) => {
    setHabitToSave(habit);
    setIsSaveTemplateOpen(true);
  };

  useEffect(() => {
    setTemplates(loadCustomTemplates());
  }, []);

  const addTemplate = (template: HabitTemplate) => {
    setTemplates(prev => {
      const updated = [...prev, template];
      saveCustomTemplates(updated);
      return updated;
    });
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('habit-heat-custom-templates', JSON.stringify(updated));
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

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <Login 
            onSwitchToSignup={() => setAuthView('signup')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Signup 
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        theme={theme} 
        currentView={getHeaderView(currentView)}
        onThemeToggle={toggleTheme}
        onViewChange={(view) => navigateToView(view)}
        onLogout={handleLogout}
      />
      
      {currentView === 'not-found' && (
        <NotFound onNavigateHome={handleNavigateHome} />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          habits={habits}
          onAddHabit={handleAddHabit}
          onHabitClick={handleHabitClick}
          onMarkToday={handleMarkToday}
          onSaveTemplate={handleSaveTemplateClick}
          onArchiveHabit={handleArchiveHabit}
        />
      )}

      {habitToSave && (
        <SaveAsTemplateModal
          habit={habitToSave}
          isOpen={isSaveTemplateOpen}
          onClose={() => setIsSaveTemplateOpen(false)}
          onSave={handleSaveTemplate}
          existingTemplates={templates}
        />
      )}


      {currentView === 'insights' && (
        <InsightsView habits={habits} />
      )}

      {currentView === 'achievements' && (
        <AchievementsView achievements={achievements} />
      )}
      {currentView === 'blogs' && (
        <Blogs />
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
          customTemplates={templates}
          onDeleteTemplate={handleDeleteTemplate}
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

      {currentView === 'profile' && (
        <ProfilePage theme={theme} />
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

      <Footer /> 
    </div>

  );
}

export default App;