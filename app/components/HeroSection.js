import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ faSearch, searchInputRef, searchQuery, setSearchQuery, faTimes }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [typingEffect, setTypingEffect] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Wrap searchExamples in useMemo to prevent it from being recreated on every render
  const searchExamples = useMemo(() => ["download"], []);
  
  useEffect(() => {
    const text = searchExamples[currentTextIndex];
    let i = 0;
    setTypingEffect('');
    
    const typing = setInterval(() => {
      if (i < text.length) {
        setTypingEffect(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 150);
    
    return () => clearInterval(typing);
  }, [currentTextIndex, searchExamples]);
  
  const handleSearchFocus = () => {
    setIsAnimating(true);
  };
  
  const handleSearchBlur = () => {
    setIsAnimating(false);
  };
  
  return (
    <div className="relative overflow-hidden">
      {/* Background with modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 dark:from-indigo-900 dark:via-blue-800 dark:to-purple-900"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white dark:bg-blue-400 opacity-10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            GENUX REST API
            <span className="block text-blue-200 mt-2">Documentation</span>
          </motion.h1>
          
          <motion.p 
            className="mt-3 max-w-md mx-auto text-xl text-blue-100 sm:text-2xl md:mt-5 md:max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore and integrate with our powerful API endpoints
          </motion.p>
          
          {/* Animated Search Bar */}
          <motion.div 
            className={`mt-10 max-w-xl mx-auto transition-all duration-300 ease-in-out transform ${isAnimating ? 'scale-105' : 'scale-100'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative rounded-xl shadow-lg">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className={`h-5 w-5 text-slate-400 transition-all duration-300 ${isAnimating ? 'text-blue-500' : ''}`} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Try searching for "${searchExamples[currentTextIndex]}"`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="block w-full pl-14 pr-12 py-4 border-0 rounded-xl focus:ring-2 focus:ring-blue-400 dark:bg-slate-800/90 dark:text-white shadow-lg text-lg backdrop-blur-sm"
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-blue-200 dark:text-blue-300">
              Press <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Ctrl+K</kbd> to search
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,37.5L48,42.2C96,46.9 192,56.3 288,56.3C384,56.3 480,46.9 576,37.5C672,28.1 768,18.8 864,18.8C960,18.8 1056,28.1 1152,32.8C1248,37.5 1344,37.5 1392,37.5L1440,37.5L1440,75L1392,75C1344,75 1248,75 1152,75C1056,75 960,75 864,75C768,75 672,75 576,75C480,75 384,75 288,75C192,75 96,75 48,75L0,75Z" 
            fill="currentColor" className="text-slate-50 dark:text-slate-900" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;