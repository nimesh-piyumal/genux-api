import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

const Navigation = ({ setSidebarOpen, setShowUserMenu, faSun, faMoon, toggleDarkMode, faSignOutAlt, handleLogout, showUserMenu, faCaretDown, user, faUser, currentTime, darkMode, faBars, faCode, faClock, sidebarOpen, userMenuRef }) => {

  
  return (
    <nav className={`${darkMode ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} shadow-sm sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.button 
                className="mr-4 p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
              </motion.button>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCode} className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="ml-3 font-bold text-xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">GENUX API</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                <span>{currentTime}</span>
              </div>
              
              {/* User profile dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-sm bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                  <span className="hidden sm:inline">{user ? user.name : 'Guest'}</span>
                  <FontAwesomeIcon icon={faCaretDown} className="ml-2 h-3 w-3" />
                </button>
                
                {/* Dropdown menu */}
                {showUserMenu && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/login" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        Sign in
                      </Link>
                    )}
                  </motion.div>
                )}
              </div>
              
              <motion.button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="h-5 w-5 text-blue-500" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navigation;