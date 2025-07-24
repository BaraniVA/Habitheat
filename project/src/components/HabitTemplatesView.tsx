import React, { useState } from 'react';
import { ArrowLeft, Clock, Target, Lightbulb, Plus } from 'lucide-react';
import { HabitTemplate } from '../types';
import { HABIT_TEMPLATES, getTemplatesByCategory } from '../utils/habitTemplates';

interface HabitTemplatesViewProps {
  onBack: () => void;
  onUseTemplate: (template: HabitTemplate) => void;
}

export const HabitTemplatesView: React.FC<HabitTemplatesViewProps> = ({  onUseTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null);

  const categories = ['all', ...Array.from(new Set(HABIT_TEMPLATES.map(t => t.category)))];
  const filteredTemplates = selectedCategory === 'all' 
    ? HABIT_TEMPLATES 
    : getTemplatesByCategory(selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (selectedTemplate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => setSelectedTemplate(null)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Templates</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{selectedTemplate.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedTemplate.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                  {selectedTemplate.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                  {selectedTemplate.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedTemplate.estimatedTime} minutes
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Estimated time</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedTemplate.targetDays.length} days/week
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Recommended frequency</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Tips for Success
              </h3>
              <ul className="space-y-2">
                {selectedTemplate.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-400">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 font-medium italic">
                "{selectedTemplate.motivationalQuote}"
              </p>
            </div>

            <button
              onClick={() => onUseTemplate(selectedTemplate)}
              className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Use This Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Habit Templates
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Get started quickly with proven habit templates
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{template.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {template.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {template.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{template.estimatedTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{template.targetDays.length}/week</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};