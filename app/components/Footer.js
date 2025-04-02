import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`mt-12 py-10 ${darkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-white border-t border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCode} className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold">GENUX API</span>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Powerful, flexible, and developer-friendly REST API for modern applications.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              © 2025 GENUX Technologies. All rights reserved.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-base text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-base text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
            
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                <span className="sr-only">GitHub</span>
                <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                <span className="sr-only">Twitter</span>
                <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                <span className="sr-only">LinkedIn</span>
                <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
            Made with <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-red-500 mx-1" /> by the GENUX Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;