import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  path: string;
  onNavigate: (path: string) => void;
}

const nameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  insights: 'Insights',
  achievements: 'Achievements',
  challenges: 'Challenges',
  mood: 'Mood Tracker',
  templates: 'Habit Templates',
  profile: 'Profile'
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  const segments = path.split('/').filter(Boolean);

  const buildPath = (index: number) => {
    return '/' + segments.slice(0, index + 1).join('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-3">
      <ol className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-2">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="text-blue-500 hover:underline font-medium"
          >
            Home
          </button>
        </li>

        {segments.map((segment, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            <button
              onClick={() => onNavigate(buildPath(index))}
              className="text-blue-500 hover:underline capitalize font-medium"
            >
              {nameMap[segment] || decodeURIComponent(segment)}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};
