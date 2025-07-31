import React, { useState, useEffect } from 'react';
import {
  Target,
  BarChart3,
  Trophy,
  Users,
  Zap,
  Star,
  Smile , 
  Dumbbell , 
  ScrollText
} from 'lucide-react';

import { TypeAnimation } from 'react-type-animation';

export default function HabitHeatLanding({ handleGetStarted }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Jemmieson',
      role: 'Marketing Manager',
      content:
        'Habit Heat transformed my morning routine. The visual progress tracking keeps me motivated every single day!',
      rating: 5,
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      content:
        "The streak tracking feature is addictive in the best way. I've maintained my coding practice for 6 months straight!",
      rating: 5,
      avatar: 'MC',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Fitness Enthusiast',
      content:
        "Finally, a habit tracker that's both beautiful and functional. The heat map visualization is incredibly motivating.",
      rating: 5,
      avatar: 'ER',
    },
    {
      name: 'David Kim',
      role: 'Student',
      content:
        'Habit Heat helped me build consistent study habits. My grades improved dramatically after just 2 months of use!',
      rating: 5,
      avatar: 'DK',
    },
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Core Habit Tracking',
      description:
        'Create Custom Habits with emojis , color codes and categories. Archive completed or outdated habits to keep your dashboard clean.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Visual Progress Tracking',
      description:
        'Watch your habits come to life with beautiful heat maps and detailed analytics that show your growth over time.',
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Achievement Rewards',
      description:
        'Unlock badges, celebrate milestones, and earn rewards based on consistency with respect to your performance.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Support',
      description:
        'Connect with like-minded individuals, share your progress, and stay accountable in our supportive community.',
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: 'Mood Tracking ',
      description:
        'Monitor your emotional well-being alongside your habits to understand how they impact your mood and productivity.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Habit Streaks',
      description:
        'Build momentum with powerful streak tracking that motivates you to maintain consistency day after day.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

//   const nextTestimonial = () => {
//     setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//   };

//   const prevTestimonial = () => {
//     setCurrentTestimonial(
//       (prev) => (prev - 1 + testimonials.length) % testimonials.length
//     );
//   };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 animate-fadeIn">
            <div className='flex flex-row space-between relative '>
                <Dumbbell className='w-32 h-32 animate-float absolute left-0 hidden xl:block text-white' />
                <ScrollText className='w-32 h-32 animate-float-delayed absolute right-0 hidden xl:block text-white'  />
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight text-white">
                <TypeAnimation
                    sequence={[
                    'Welcome to Habit Heat ',
                    3000,
                    'Your Habit Tracker',
                    3000,
                    ]}
                    wrapper="span"
                    speed={10}
                    style={{ color: 'orange' }}
                    repeat={Infinity}
                />
            </h1>
            <p className="text-2xl md:text-3xl font-medium mb-8 text-gray-300">
              "Build Habits. Track Progress. Stay Motivated."
            </p>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-400">
              Transform your life one habit at a time with our beautiful,
              intuitive tracking system that makes building lasting habits feel
              effortless and rewarding.
            </p>
            
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button onClick={handleGetStarted} className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
               Start Your Journey Free
            </button>
            <button onClick={()=>{ alert('Route the user to the demo video')
            }} className="px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200 transform hover:scale-105">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What Makes Us Different from Others
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-400">
              Everything you need to build long-lasting habits and achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gray-800 border border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-750 cursor-pointer "
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-orange-500 text-white group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            How It Works
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-400 mb-12">
            Start building better habits in just three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Set Your Goals',
                description:
                  'Define the habits you want to build . Break down big changes into manageable daily actions.',
              },
              {
                step: '02',
                title: 'Track Daily',
                description:
                  'Log your progress with our intuitive interface. Watch your consistency grow with beautiful visual feedback and heat maps.',
              },
              {
                step: '03',
                title: 'Stay Motivated',
                description:
                  'Celebrate milestones, earn rewards, and connect with others on similar journeys. Build momentum that lasts.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 text-2xl font-bold bg-orange-500 text-white group-hover:scale-110 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  {item.title}
                </h3>
                <p className="text-lg leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white">
            What Our Users Say
          </h2>
          <p className="text-xl text-center text-gray-400 mb-12">
            Join thousands of people who have transformed their lives with Habit Heat
          </p>

          <div className="relative">
            <div className="p-8 rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-400">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg leading-relaxed italic text-gray-300">
                "{testimonials[currentTestimonial].content}"
              </p>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentTestimonial ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Buttons*/}
      <section className="py-20 px-4 bg-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have already started their journey to better habits. Start free today!
          </p>
          <button onClick={handleGetStarted} className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
             Get Started Now !!
          </button>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-16 px-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white bg-clip-text text-transparent">
                  Habit Heat
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your life one habit at a time. Build consistency, track progress, and achieve your goals with our beautiful and intuitive habit tracker.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a onClick={() => alert('Route to the contact page')} className="hover:text-white transition-colors cursor-pointer">Contact Us</a></li>
                <li><a onClick={() => alert('Route to the Privacy Policy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a onClick={() => alert('Route to the Terms of Service')} className="hover:text-white transition-colors cursor-pointer">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Habit Heat. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-20px); 
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}