import { ArrowLeft, Flame } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

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

  // Animation: Main container entrance
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        {/* Animation: 404 number and text entrance */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative mb-4">
            <span className="text-8xl font-bold text-gray-300 dark:text-gray-600">404</span>
          </div>
          <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </div>
        </motion.div>

        {/* Animation: Description text entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="mb-8"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Let's get you back on track with your habits!
          </p>
        </motion.div>

        {/* Animation: Buttons entrance and hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(255,140,0,0.10)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={onNavigateHome}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl "
          >
            <Flame size={20} />
            Back to Habits
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(80,80,80,0.10)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={handleGoBack}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </motion.button>
        </motion.div>

        {/* Animation: Fun dots entrance and pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
          className="mt-12 flex justify-center space-x-4"
        >
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2 h-2 bg-orange-400 rounded-full" />
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 bg-red-400 rounded-full" />
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 bg-yellow-400 rounded-full" />
        </motion.div>
        
      </div>
    </motion.div>
  );
}
