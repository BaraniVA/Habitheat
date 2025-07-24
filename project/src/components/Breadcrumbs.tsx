// src/components/Breadcrumbs.tsx
import React from 'react';
import { View } from '../types';

type NavigableView = Exclude<View, 'not-found' | 'habit-detail' | 'add-habit' | 'social'>;

interface BreadcrumbsProps {
  currentView: View;
  onNavigate: (view: NavigableView) => void;
}

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  insights: 'Insights',
  achievements: 'Achievements',
  challenges: 'Challenges',
  mood: 'Mood Tracker',
  templates: 'Habit Templates',
  'habit-detail': 'Habit Detail',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentView, onNavigate }) => {
  if (currentView === 'not-found') return null;

  // Build breadcrumb path
  const crumbs = [];
  crumbs.push({ label: 'Dashboard', view: 'dashboard' as NavigableView });

  if (currentView !== 'dashboard') {
    const viewParts = currentView.split('/');
    const mainView = viewParts[0] as NavigableView;
    
    if (breadcrumbLabels[mainView]) {
      crumbs.push({ label: breadcrumbLabels[mainView], view: mainView });
    }

    // Add additional parts if they exist (like week-1, habit-id, etc.)
    if (viewParts.length > 1) {
      crumbs.push({
        label: viewParts[1].replace(/-/g, ' '),
        view: currentView as NavigableView
      });
    }
  }

  return (
    <div className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm">
      <nav className="text-sm">
        <ol className="flex items-center space-x-2">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <li>
                <button
                  onClick={() => onNavigate(crumb.view)}
                  className={`${
                    index === crumbs.length - 1
                      ? 'text-gray-600 font-medium'
                      : 'text-blue-500 hover:underline'
                  }`}
                  disabled={index === crumbs.length - 1}
                >
                  {crumb.label}
                </button>
              </li>
              {index < crumbs.length - 1 && (
                <li className="text-gray-400">/</li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
};