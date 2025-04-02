import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen, faTimes, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const CategorySidebar = ({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  darkMode,
  closeSidebar,
  sidebarOpen
}) => {
  // Calculate total endpoints across all categories
  const totalEndpoints = categories.reduce((total, cat) => total + cat.endpoints.length, 0);
  
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div 
          className={`w-72 h-full overflow-y-auto border-r ${
            darkMode 
              ? 'bg-slate-800/95 border-slate-700 backdrop-blur-sm' 
              : 'bg-white/95 border-slate-200 backdrop-blur-sm'
          }`}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                API Categories
              </h2>
              <button 
                onClick={closeSidebar}
                className="md:hidden p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-2">
              {/* All APIs category */}
              <motion.button
                onClick={() => {
                  setActiveCategory(null);
                  if (window.innerWidth < 768) {
                    closeSidebar();
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all ${
                  activeCategory === null 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FontAwesomeIcon 
                  icon={faLayerGroup} 
                  className={`mr-3 ${
                    activeCategory === null 
                      ? 'text-white' 
                      : 'text-blue-500 dark:text-blue-400'
                  }`}
                />
                <span className="font-medium">All APIs</span>
                <span className={`ml-auto px-2.5 py-1 text-xs rounded-full ${
                  activeCategory === null
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {totalEndpoints}
                </span>
              </motion.button>
              
              {/* Category buttons */}
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  onClick={() => {
                    setActiveCategory(category.name);
                    if (window.innerWidth < 768) {
                      closeSidebar();
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all ${
                    activeCategory === category.name 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon 
                    icon={activeCategory === category.name ? faFolderOpen : faFolder} 
                    className={`mr-3 ${
                      activeCategory === category.name 
                        ? 'text-white' 
                        : 'text-blue-500 dark:text-blue-400'
                    }`}
                  />
                  <span className="font-medium">{category.name}</span>
                  <span className={`ml-auto px-2.5 py-1 text-xs rounded-full ${
                    activeCategory === category.name
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {category.endpoints.length}
                  </span>
                </motion.button>
              ))}
            </div>
            
            {/* Help section */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="rounded-lg bg-blue-50 dark:bg-slate-700/50 p-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Need Help?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Check our documentation or contact support for assistance with API integration.
                </p>
                <button className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategorySidebar;