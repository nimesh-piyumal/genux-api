import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HeroSection = ({ faSearch, searchInputRef, searchQuery, faTimes }) => {
  return (
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
  );
};

export default HeroSection;