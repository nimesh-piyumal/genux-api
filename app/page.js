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
        // Set first category as active by default
        if (data && data.categories) {
          setActiveCategory(Object.keys(data.categories)[0]);
        }
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
    ).filter(endpoint => endpoint && endpoint.active)
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
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Navigation */}
      <nav className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                className="sm:hidden mr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
              </button>
              <FontAwesomeIcon icon={faCode} className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="ml-3 font-bold text-xl">GENUX API</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-sm text-slate-600 dark:text-slate-400">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                <span>{currentTime}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span className="hidden sm:inline">nimesh-piyumal</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className={`sm:hidden ${darkMode ? 'bg-slate-800' : 'bg-white'} border-b border-slate-200 dark:border-slate-700`}>
          <div className="px-4 py-3 space-y-1">
            {processedCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left py-2 px-3 rounded-md ${
                  activeCategory === category.name 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white">GENUX REST API Documentation</h1>
          <p className="mt-2 text-blue-100">Explore and integrate with our powerful API endpoints</p>
          
          {/* Search Bar */}
          <div className="mt-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-slate-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search endpoints, paths, or descriptions... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm"
            />
            {searchQuery && (
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            )}
          </div>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs - Desktop */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-700 hidden sm:block">
          <div className="flex overflow-x-auto hide-scrollbar space-x-8">
            {processedCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`pb-4 px-1 font-medium text-sm whitespace-nowrap ${
                  activeCategory === category.name 
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {category.name}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700">
                  {category.endpoints.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View Modal */}
        {selectedEndpoint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedEndpoint.name}</h2>
                <button 
                  onClick={closeDetailView}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Endpoint Status Badge */}
                <div className="mb-4">
                  {selectedEndpoint.status === 'stable' && (
                    <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      Stable
                    </span>
                  )}
                  {selectedEndpoint.status === 'beta' && (
                    <span className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Beta
                    </span>
                  )}
                  {selectedEndpoint.status === 'deprecated' && (
                    <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      Deprecated
                    </span>
                  )}
                </div>
                
                {/* Path with copy button */}
                <div className="mt-4 relative group">
                  <div className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md font-mono text-sm overflow-x-auto">
                    <div className="flex items-center justify-between">
                      <code>{selectedEndpoint.path}</code>
                      <button 
                        onClick={() => handleCopyPath(selectedEndpoint.path)}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        aria-label="Copy path"
                      >
                        <FontAwesomeIcon icon={copiedPath === selectedEndpoint.path ? faCheckCircle : faCopy} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEndpoint.description && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedEndpoint.description}
                    </p>
                  </div>
                )}

                {/* Parameters */}
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Parameters</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Required</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {selectedEndpoint.parameters.map((param, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{param.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{param.type}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {param.required ? (
                                  <span className="text-red-600 dark:text-red-400">Yes</span>
                                ) : (
                                  <span className="text-slate-500 dark:text-slate-400">No</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Response Format */}
                {selectedEndpoint.responseFormat && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Response Format</h3>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-4 font-mono text-sm overflow-x-auto">
                      <pre>{JSON.stringify(selectedEndpoint.responseFormat, null, 2)}</pre>
                    </div>
                  </div>
                )}

                {/* Example Code */}
                {selectedEndpoint.exampleCode && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Example Usage</h3>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-4 font-mono text-sm overflow-x-auto">
                      <pre>{selectedEndpoint.exampleCode}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {searchQuery || statusFilter !== 'all' ? (
          /* Search Results */
          <>
            <h2 className="text-xl font-medium mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : `Filtered Results`}
            </h2>
            
            {filteredCategories.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
                <FontAwesomeIcon icon={faSearch} className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredCategories.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    {category.endpoints.map((endpoint) => (
                      <div 
                        key={endpoint.id}
                        className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faServer} className="h-5 w-5 text-blue-500 mr-2" />
                            <h4 className="font-medium">{endpoint.name}</h4>
                          </div>
                          {endpoint.status === 'stable' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Stable
                            </span>
                          )}
                          {endpoint.status === 'beta' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              Beta
                            </span>
                          )}
                          {endpoint.status === 'deprecated' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              Deprecated
                            </span>
                          )}
                        </div>
                        <div className="mt-2 relative group">
                          <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded font-mono text-sm overflow-x-auto">
                            <div className="flex items-center justify-between">
                              <code>{endpoint.path}</code>
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
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {endpoint.description}
                          </p>
                        )}
                        <div className="mt-3 flex justify-end">
                          <button 
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
                          >
                            <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Category View */
          <>
            {activeCategory && (
              <div>
                <h2 className="text-xl font-medium mb-4">{activeCategory} Endpoints</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {processedCategories
                    .find(cat => cat.name === activeCategory)?.endpoints
                    .map((endpoint) => (
                      <div 
                        key={endpoint.id}
                        className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faServer} className="h-5 w-5 text-blue-500 mr-2" />
                            <h4 className="font-medium">{endpoint.name}</h4>
                          </div>
                          {endpoint.status === 'stable' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Stable
                            </span>
                          )}
                          {endpoint.status === 'beta' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              Beta
                            </span>
                          )}
                          {endpoint.status === 'deprecated' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              Deprecated
                            </span>
                          )}
                        </div>
                        <div className="mt-2 relative group">
                          <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded font-mono text-sm overflow-x-auto">
                            <div className="flex items-center justify-between">
                              <code>{endpoint.path}</code>
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
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {endpoint.description}
                          </p>
                        )}
                        <div className="mt-3 flex justify-end">
                          <button 
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center">
                            <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer darkMode={darkMode} />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}