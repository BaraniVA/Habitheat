import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Flame, BarChart3, Trophy, Target, Smile, BookOpen, Menu, X, User, LogOut ,MessageCircle } from 'lucide-react';

// Types
type Theme = 'light' | 'dark';
type View = 'dashboard' | 'insights' | 'achievements' | 'blogs'| 'challenges' | 'mood' | 'templates' | 'profile';

interface HeaderProps {
  theme: Theme;
  currentView: View;
  onThemeToggle: () => void;
  onViewChange: (view: View) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, currentView, onThemeToggle, onViewChange, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { view: 'dashboard' as View, icon: Flame, label: 'Habits' },
    { view: 'insights' as View, icon: BarChart3, label: 'Insights' },
    { view: 'achievements' as View, icon: Trophy, label: 'Achievements' },
    { view: 'blogs' as View, icon: MessageCircle, label: 'Blogs'},
    { view: 'challenges' as View, icon: Target, label: 'Challenges' },
    { view: 'mood' as View, icon: Smile, label: 'Mood' },
    { view: 'templates' as View, icon: BookOpen, label: 'Templates' },
    { view: 'profile' as View, icon: User, label: 'Profile'},
  ];

  // Handle outside click to close mobile menu
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        hamburgerRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle view change and close mobile menu
  const handleViewChange = (view: View) => {
     console.log("Changing to:", view); 
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  // Handle logo click
  const handleLogoClick = () => {
    onViewChange('dashboard');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* <AnimatePresence>
              {currentView !== 'dashboard' && (
                <motion.button
                  key="back-button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => navigate(-1)}
                  className="p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              )}
            </AnimatePresence> */}

            {/* Logo - Clickable and Responsive */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
              aria-label="Go to dashboard"
            >
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex-shrink-0">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Habit Heat
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Track your daily habits
                </p>
              </div>
              {/* Mobile-only compact title */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Habit Heat
                </h1>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ view, icon: Icon, label  }) => (
                <button
                  key={view}

                  onClick={() => onViewChange(view)}
                  className={`flex flex-col items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    currentView === view
                      ? 'bg-orange-200 dark:bg-blue-900/50 text-orange-700 dark:text-blue-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={` w-4 h-4 flex-shrink-0 `} />
                  <span className="hidden md:inline whitespace-nowrap">{label}</span>
                </button>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="hidden lg:flex p-2 sm:p-3 rounded-full bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors min-h-[44px] min-w-[44px] items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                </button>
              )}

              {/* Mobile Hamburger Menu */}
              <button
                ref={hamburgerRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity" />
          
          {/* Sidebar */}
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Navigation
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-2">
                  {navItems.map(({ view, icon: Icon, label }) => (
                    <button
                      key={view}
                      onClick={() => handleViewChange(view)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 min-h-[56px] ${
                        currentView === view
                          ? 'bg-orange-200 dark:bg-blue-900/50 text-orange-700 dark:text-blue-300 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base">{label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {onLogout && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 mb-4 rounded-xl text-left font-medium transition-all duration-200 min-h-[48px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span className="text-base">Logout</span>
                  </button>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Habit Heat - Track your daily habits
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

