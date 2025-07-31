import { ArrowLeft, Flame } from 'lucide-react';
import { useEffect } from 'react';

interface NotFoundProps {
  onNavigateHome: () => void;
}

export default function NotFound({ onNavigateHome }: NotFoundProps) {

   
  // tabtitle
              useEffect(()=>{
                document.title='Habit Heat-Page Not Found'
              },[])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onNavigateHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="relative mb-4">
            <div className="text-8xl font-bold text-gray-300 dark:text-gray-600">404</div>
          </div>
          <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Let's get you back on track with your habits!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onNavigateHome}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl "
          >
            <Flame size={20} />
            Back to Habits
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Fun little animation */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
      </div>
    </div>
  );
}
