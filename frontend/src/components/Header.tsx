import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Flame, BarChart3, Trophy, Target, Smile, BookOpen, Menu, X, User, LogOut, ArrowLeft } from 'lucide-react';

// Types
type Theme = 'light' | 'dark';
type View = 'dashboard' | 'insights' | 'achievements' | 'challenges' | 'mood' | 'templates' | 'profile';

interface HeaderProps {
  theme: Theme;
  currentView: View;
  onThemeToggle: () => void;
  onViewChange: (view: View) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  currentView,
  onThemeToggle,
  onViewChange,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Scroll bg transition logic
  const [scrolled, setScrolled] = useState(false);
  // Shake animation index for nav icons
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (shakeIndex !== null) {
      const timer = setTimeout(() => setShakeIndex(null), 420);
      return () => clearTimeout(timer);
    }
  }, [shakeIndex]);

  const navItems = [
    { view: 'dashboard' as View, icon: Flame, label: 'Habits' },
    { view: 'insights' as View, icon: BarChart3, label: 'Insights' },
    { view: 'achievements' as View, icon: Trophy, label: 'Achievements' },
    { view: 'challenges' as View, icon: Target, label: 'Challenges' },
    { view: 'mood' as View, icon: Smile, label: 'Mood' },
    { view: 'templates' as View, icon: BookOpen, label: 'Templates' },
    { view: 'profile' as View, icon: User, label: 'Profile' },
  ];

  // Close mobile menu on outside click
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
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle nav item click: update view, close menu, and trigger shake animation
  const handleViewChange = (view: View, idx: number) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
    setShakeIndex(idx);
  };

  // Handle logo click: go to dashboard and close menu
  const handleLogoClick = () => {
    onViewChange('dashboard');
    setIsMobileMenuOpen(false);
  };

  const navigate = useNavigate();
  return (
    <>
      <header
        className={`
          sticky top-0 z-50 transition-all duration-300
          ${scrolled
            ? 'backdrop-blur-md bg-gradient-to-r from-orange-100/80 via-white/60 to-orange-200/80 dark:from-blue-900/80 dark:via-slate-900/70 dark:to-blue-950/80 shadow-xl border-b border-orange-200 dark:border-blue-900'
            : 'bg-white dark:bg-gray-900 border-b border-transparent'
          } animate-slide-down
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <AnimatePresence>
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
            </AnimatePresence>
            {/* Logo - Clickable and Responsive with hover animations */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 group"
              aria-label="Go to dashboard"
            >
              {/* Logo icon with pulse animation and hover effects */}
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex-shrink-0 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg animate-pulse">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 ease-in-out group-hover:rotate-12" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Habit Heat
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Track your daily habits
                </p>
              </div>
              {/* Mobile-only compact title with fade-in animation */}
              <div className="sm:hidden animate-fade-in">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Habit Heat
                </h1>
              </div>
            </button>

            {/* Desktop Navigation with stagger animation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ view, icon: Icon, label }, idx) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view, idx)}
                  className={`flex flex-col items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out min-h-[44px] hover:scale-105 animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Shake icon animation added conditionally */}
                  <span className={shakeIndex === idx ? 'shake-anim' : undefined}>
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ease-in-out hover:rotate-12 ${
                      currentView === view
                        ? 'text-orange-700 dark:text-blue-300 animate-pulse'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </span>
                  <span className="hidden md:inline whitespace-nowrap transition-colors duration-300">{label}</span>
                  {/* Active indicator bar */}
                  <div className={`w-full h-1 rounded-full transition-all duration-300 ease-in-out ${
                    currentView === view
                      ? 'bg-orange-500 dark:bg-blue-500 animate-slide-up'
                      : 'bg-transparent'
                  }`} />
                </button>
              ))}
            </nav>

            {/* Right Side Controls with fade-in animation */}
            <div className="flex items-center gap-2 animate-fade-in-up-delayed">
              {/* Theme Toggle with rotation animation */}
              <button
                onClick={onThemeToggle}
                className="p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-180 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out" />
                ) : (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out" />
                )}
              </button>

              {/* Logout Button with shake animation on hover */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="hidden lg:flex p-2 sm:p-3 rounded-full bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 transition-all duration-300 ease-in-out hover:scale-110 hover:animate-shake min-h-[44px] min-w-[44px] items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 transition-transform duration-300 ease-in-out hover:translate-x-1" />
                </button>
              )}

              {/* Mobile Hamburger Menu with morphing animation */}
              <button
                ref={hamburgerRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out animate-rotate-in" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with slide-in animation */}
      {isMobileMenuOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-all duration-300 ease-in-out animate-fade-in" />
          {/* Sidebar with slide-in animation */}
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-all duration-300 ease-in-out animate-slide-in-right"
          >
            <div className="flex flex-col h-full">
              {/* Header with fade-in animation */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  {/* Logo with pulse animation */}
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl animate-pulse">
                    <Flame className="w-5 h-5 text-white transition-transform duration-300 ease-in-out hover:rotate-12" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                      Navigation
                    </h2>
                  </div>
                </div>
                {/* Close button with scale animation */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ease-in-out hover:rotate-90" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="space-y-2">
                  {navItems.map(({ view, icon: Icon, label }, idx) => (
                    <button
                      key={view}
                      onClick={() => handleViewChange(view, idx)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left font-medium transition-all duration-300 ease-in-out hover:scale-105 min-h-[56px] animate-fade-in-up`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className={shakeIndex === idx ? 'shake-anim' : undefined}>
                        <Icon className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out hover:rotate-12" />
                      </span>
                      <span className="text-base transition-colors duration-300">{label}</span>
                      <div className={`ml-auto w-2 h-2 rounded-full transition-all duration-300 ease-in-out ${
                        currentView === view
                          ? 'bg-orange-500 dark:bg-blue-500 animate-pulse'
                          : 'bg-transparent'
                      }`} />
                    </button>
                  ))}
                </div>
              </nav>

              {/* Footer with fade-in animation */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in-up-delayed">
                {onLogout && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 mb-4 rounded-xl text-left font-medium transition-all duration-300 ease-in-out hover:scale-105 min-h-[48px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 animate-fade-in-up"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-300 ease-in-out hover:translate-x-1" />
                    <span className="text-base">Logout</span>
                  </button>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
                  Habit Heat - Track your daily habits
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom CSS for animations including your shake */}
      <style>{`
        /* Slide-down animation for header on mount */
        .animate-slide-down {
          animation: slideDown 0.6s ease-out;
        }

        /* Fade-in animation for elements */
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        /* Fade-in-up animation with delays */
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fade-in-up-delayed {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        /* Slide-in-right animation for mobile menu */
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        /* Slide-up animation for active indicators */
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }

        /* Rotate-in animation for close button */
        .animate-rotate-in {
          animation: rotateIn 0.3s ease-out;
        }

        /* Shake animation for logout button */
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        /* Your custom shake animation for nav icons triggered on click */
        .shake-anim {
          animation: shake-x 0.42s cubic-bezier(0.26, 0.77, 0.48, 1) both;
        }

        /* Keyframe definitions */
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(100%); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes rotateIn {
          from { 
            opacity: 0; 
            transform: rotate(-90deg); 
          }
          to { 
            opacity: 1; 
            transform: rotate(0deg); 
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes shake-x {
          10%, 90% { transform: translateX(-1px);}
          20%, 80% { transform: translateX(2px);}
          30%, 50%, 70% { transform: translateX(-4px);}
          40%, 60% { transform: translateX(4px);}
        }
      `}</style>
    </>
  );
};
