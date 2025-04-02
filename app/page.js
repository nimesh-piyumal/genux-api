'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faTerminal,
  faClock,
  faUser,
  faCode,
  faServer,
  faCircleInfo,
  faTimes,
  faFilter,
  faCaretDown,
  faCheckCircle,
  faExclamationCircle,
  faCopy,
  faExternalLinkAlt,
  faMoon,
  faSun,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ThreeBackground from './components/ThreeBackground';
import CategorySidebar from './components/CategorySidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiDocumentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Add this line to define the missing state
  const searchInputRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    // Format the time in Asia/Colombo timezone
    return new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2').replace(',', '');
  });
  
  useEffect(() => {
    // Update time every minute
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2').replace(',', '');
      
      setCurrentTime(formattedTime);
    }, 60000); 

    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Fetch API data
    const fetchApiData = async () => {
      try {
        const response = await fetch('/data/api-data.json');
        const data = await response.json();
        setApiData(data);
        // Remove this line to keep activeCategory as null (All APIs)
        // if (data && data.categories) {
        //   setActiveCategory(Object.keys(data.categories)[0]);
        // }
        setLoading(false);
      } catch (error) {
        console.error("Error loading API data:", error);
        setLoading(false);
      }
    };

    fetchApiData();
    
    return () => clearInterval(intervalId);
  }, []);

  
  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      // Escape to clear search
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Process the API data for display
  const processedCategories = apiData ? Object.entries(apiData.categories).map(([name, endpointIds]) => ({
    name,
    endpoints: endpointIds.map(id => 
      apiData.apiList.find(api => api.id === id)
    ).filter(endpoint => endpoint) // Remove the active filter to show all endpoints
  })) : [];

  // Filter categories and endpoints based on search and filters
  const filteredCategories = processedCategories.map(category => ({
    ...category,
    endpoints: category.endpoints.filter(endpoint => {
      const matchesSearch = !searchQuery || 
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'stable' && endpoint.status === 'stable') ||
        (statusFilter === 'beta' && endpoint.status === 'beta') ||
        (statusFilter === 'deprecated' && endpoint.status === 'deprecated');
      
      return matchesSearch && matchesStatus;
    })
  })).filter(category => category.endpoints.length > 0);

  const handleCopyPath = (path) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const closeDetailView = () => {
    setSelectedEndpoint(null);
  };

  // Add this function to close the sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin text-blue-600 dark:text-blue-400">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
<div className={`min-h-screen font-sans relative ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`} style={{ zIndex: 1 }}>
    <ThreeBackground darkMode={darkMode} />

      {/* Top Navigation */}
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
              <div className="flex items-center text-sm bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-400">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                <span className="hidden sm:inline">nimesh-piyumal</span>
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

      {/* Hero Section */}
      <HeroSection 
        faSearch={faSearch} 
        searchInputRef={searchInputRef} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        faTimes={faTimes} 
      />

      {/* Main content with sidebar */}
      <div className="flex relative">
        {/* Overlay for mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
              onClick={closeSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        
        {/* Sidebar */}
        <div className="fixed md:sticky top-16 h-[calc(100vh-4rem)] z-20">
          <CategorySidebar 
            categories={processedCategories} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
            darkMode={darkMode}
            closeSidebar={closeSidebar}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filter and Category Tabs */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    {searchQuery ? `Search Results` : activeCategory ? `${activeCategory} API` : 'All APIs'}
                  </h2>
                </div>
              
              {/* Category Pills - Desktop */}
              <div className="hidden md:flex overflow-x-auto pb-2 space-x-2">
                <motion.button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === null 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All APIs
                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    activeCategory === null
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {processedCategories.reduce((total, cat) => total + cat.endpoints.length, 0)}
                  </span>
                </motion.button>
                {processedCategories.map((category) => (
                  <motion.button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.name 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name}
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      activeCategory === category.name
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {category.endpoints.length}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Endpoint Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery || activeCategory || statusFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {searchQuery || statusFilter !== 'all' ? (
                  /* Search Results */
                  <>
                    {filteredCategories.length === 0 ? (
                      <motion.div 
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center max-w-md mx-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <FontAwesomeIcon icon={faSearch} className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">No results found</h3>
                      
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          We couldn&apos;t find any endpoints matching your search criteria.
                        </p>
                        <button 
                          onClick={() => {setSearchQuery(''); setStatusFilter('all');}}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          Clear Filters
                        </button>
                      </motion.div>
                    ) : (
                      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCategories.flatMap((category) => 
                          category.endpoints.map((endpoint) => (
                            <EndpointCard 
                              key={endpoint.id}
                              endpoint={endpoint}
                              category={category.name}
                              handleCopyPath={handleCopyPath}
                              copiedPath={copiedPath}
                              setSelectedEndpoint={setSelectedEndpoint}
                              darkMode={darkMode}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* Category View */
                  <>
                    {activeCategory ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {processedCategories
                          .find(cat => cat.name === activeCategory)?.endpoints
                          .map((endpoint) => (
                            <EndpointCard 
                              key={endpoint.id}
                              endpoint={endpoint}
                              category={activeCategory}
                              handleCopyPath={handleCopyPath}
                              copiedPath={copiedPath}
                              setSelectedEndpoint={setSelectedEndpoint}
                              darkMode={darkMode}
                            />
                          ))}
                      </div>
                    ) : (
                      /* All APIs View */
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {processedCategories.flatMap((category) => 
                          category.endpoints.map((endpoint) => (
                            <EndpointCard 
                              key={endpoint.id}
                              endpoint={endpoint}
                              category={category.name}
                              handleCopyPath={handleCopyPath}
                              copiedPath={copiedPath}
                              setSelectedEndpoint={setSelectedEndpoint}
                              darkMode={darkMode}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedEndpoint && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {selectedEndpoint.name}
                </h2>
                <motion.button 
                  onClick={closeDetailView}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="p-6">
                {/* Modal content */}
                {/* ... existing modal content ... */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer darkMode={darkMode} />
    </div>
  );
}

// Update the EndpointCard component to show active/inactive indicator
const EndpointCard = ({ endpoint, category, handleCopyPath, copiedPath, setSelectedEndpoint, darkMode }) => {
  return (
    <motion.div 
      className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
      }`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`px-5 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faServer} className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-semibold">{endpoint.name}</h3>
          </div>
          {endpoint.active && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 font-medium">
              Active
            </span>
          )}
          {endpoint.active === false && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 font-medium">
              Inactive
            </span>
          )}
        </div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {category}
        </div>
      </div>
      
      <div className="p-5">
        <div className="relative group">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="flex items-center justify-between">
              <code className="text-blue-600 dark:text-blue-400">{endpoint.path}</code>
              <button 
                onClick={() => handleCopyPath(endpoint.path)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                aria-label="Copy path"
              >
                <FontAwesomeIcon icon={copiedPath === endpoint.path ? faCheckCircle : faCopy} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {endpoint.description && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {endpoint.description}
          </p>
        )}
        
        <div className="mt-4 flex justify-end">
          <motion.button 
            onClick={() => setSelectedEndpoint(endpoint)}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faCircleInfo} className="mr-1.5" />
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};