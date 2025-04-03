import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Navigation({ 
  setSidebarOpen, 
  setShowUserMenu, 
  faSun, 
  faMoon, 
  toggleDarkMode, 
  faSignOutAlt, 
  handleLogout, 
  showUserMenu, 
  faCaretDown, 
  user, 
  faUser, 
  currentTime, 
  userMenuRef, 
  sidebarOpen, 
  darkMode, 
  faBars, 
  faCode, 
  faClock 
}) {
  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(prev => !prev)}
              className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
            </button>
            <div className="flex items-center ml-2 md:ml-0">
              <FontAwesomeIcon icon={faCode} className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">GENUX API</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center text-sm text-slate-500 dark:text-slate-400">
              <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-1.5" />
              <span>{currentTime}</span>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="h-5 w-5" />
            </button>
            
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                  </div>
                  <span>{user ? user.name : 'Guest'}</span>
                </div>
                <FontAwesomeIcon icon={faCaretDown} className="h-4 w-4 text-slate-400" />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-50 border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user ? (
                      <>
                        <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          Login
                        </Link>
                        <Link href="/register" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}