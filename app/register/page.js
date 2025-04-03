'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEnvelope, 
  faEye, 
  faEyeSlash,
  faArrowLeft,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThreeBackground from '../components/ThreeBackground';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Add audio reference
  const audioRef = useRef(null);

  // Add useEffect to handle client-side mounting and auth check
  useEffect(() => {
    setMounted(true);
    
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
        });
        
        if (response.ok) {
          // If authenticated, redirect to home
          window.location.href = '/';
        }
      } catch (error) {
        // If error, user is not authenticated, so do nothing
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, []);

  // Add effect to play audio when registered state changes to true
  useEffect(() => {
    if (registered && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  }, [registered]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Show success message
      setRegistered(true);
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only render content after component has mounted on client
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>;
  }

  if (registered) {
    return (
      <div className={`min-h-screen font-sans relative flex items-center justify-center ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
        <div className="absolute inset-0 z-0">
          <ThreeBackground darkMode={darkMode} />
        </div>
        
        {/* Add audio element */}
        <audio ref={audioRef} src="https://files.catbox.moe/abctmn.mp3" preload="auto" />
        
        <motion.div 
          className="w-full max-w-md p-8 rounded-xl shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-center z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mb-4" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-4">Registration Successful!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your account has been created successfully. You can now log in with your credentials.
          </p>
          
          <Link href="/login">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Login
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans relative flex items-center justify-center ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <ThreeBackground darkMode={darkMode} />
      
      <Link href="/" className="absolute top-6 left-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Home
      </Link>
      
      <motion.div 
        className="w-full max-w-md p-8 rounded-xl shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Join GENUX API platform today
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          
          <div className="pt-2">
            <motion.button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?
            <Link href="/login" className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}