import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`mt-12 py-6 ${darkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-white border-t border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCode} className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 font-bold">GENUX API</span>
            </div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <p>© 2025 GENUX Technologies. All rights reserved.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <a 
              href="#" 
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            >
              Documentation
            </a>
            <a 
              href="#" 
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            >
              Support
            </a>
            <a 
              href="#" 
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;