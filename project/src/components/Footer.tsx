import React from 'react';
import { Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Branding */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Habit Heat
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Mindful habits, peaceful life ✨
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="/" className="hover:underline">Dashboard</a></li>
            <li><a href="/insights" className="hover:underline">Insights</a></li>
            <li><a href="/achievements" className="hover:underline">Achievements</a></li>
            <li><a href="/challenges" className="hover:underline">Challenges</a></li>
            <li><a href="/blogs" className="hover:underline">Blogs</a></li>
            <li><a href="/mood" className="hover:underline">Mood Tracker</a></li>
            <li><a href="/templates" className="hover:underline">Habit Templates</a></li>
            <li><a href="/profile" className="hover:underline">Profile</a></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://github.com/BaraniVA/Habitheat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:underline"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </li>
            <li><a href="https://github.com/BaraniVA/Habitheat" className="hover:underline">Contribute</a></li>
            <li><a href="https://github.com/BaraniVA" className="hover:underline">Support</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Legal</h3>
          <ul className="space-y-1">
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms of Use</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-4 text-xs">
        <p>
          © {new Date().getFullYear()} Habit Heat — Built with ❤️ by the community
        </p>
      </div>
    </footer>
  );
};
