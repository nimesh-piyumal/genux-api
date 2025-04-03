'use client';

// Update the import statement
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faKey, 
  faPlus, 
  faTrash, 
  faCopy, 
  faEye, 
  faEyeSlash,
  faSync,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiKeysComponent({ userId, darkMode }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [keyName, setKeyName] = useState('');
  const [showKeys, setShowKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, [userId, fetchApiKeys]);

  // Move fetchApiKeys function definition inside useCallback
  const fetchApiKeys = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/apikeys/list', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch API keys');
      }
      
      const data = await response.json();
      setApiKeys(data.apiKeys || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createApiKey = async () => {
    if (!keyName.trim()) {
      setError('Please enter a name for your API key');
      return;
    }
    
    try {
      setCreating(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/apikeys/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: keyName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key');
      }
      
      // Show the newly created key
      setNewKey(data.apiKey);
      setShowNewKey(true);
      
      // Reset form
      setKeyName('');
      
      // Refresh the list
      fetchApiKeys();
      
      setSuccess('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  // Fix for line 252 (in the API Keys List section)
  {loading ? (
    <div className="flex justify-center items-center py-8">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : apiKeys.length === 0 ? (
    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
      You don&apos;t have any API keys yet.
    </div>
  ) : (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {apiKeys.map((key) => (
            <tr key={key._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {key.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center">
                  <code className="font-mono">
                    {showKeys[key._id] 
                      ? key.key 
                      : `sk-${key.key.substring(3, 10)}...`}
                  </code>
                  <button
                    onClick={() => toggleShowKey(key._id)}
                    className="ml-2 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    title={showKeys[key._id] ? "Hide key" : "Show key"}
                  >
                    <FontAwesomeIcon icon={showKeys[key._id] ? faEyeSlash : faEye} />
                  </button>
                  <button
                    onClick={() => copyToClipboard(key.key, key._id)}
                    className="ml-1 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    title="Copy to clipboard"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                  {copiedKey === key._id && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                      Copied!
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {new Date(key.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => deleteApiKey(key._id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete key"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
  const toggleShowKey = (keyId) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div 
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="px-6 py-8 sm:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            API Keys
          </h2>
          
          <motion.button
            onClick={() => setShowNewKey(false)}
            className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New Key
          </motion.button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        {/* Create new API key form */}
        <div className="mb-8 p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Create New API Key</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Key Name
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Development, Production, etc."
                className="w-full py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end">
              <motion.button
                onClick={createApiKey}
                disabled={creating}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {creating ? (
                  <>
                    <FontAwesomeIcon icon={faSync} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                    Generate API Key
                  </>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Display newly created key */}
          <AnimatePresence>
            {showNewKey && newKey && (
              <motion.div 
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Your New API Key (copy it now, you won&apos;t see it again)
                  </h4>
                  <button 
                    onClick={() => setShowNewKey(false)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                <div className="flex items-center bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                  <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
                    {newKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newKey, 'new')}
                    className="ml-2 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    title="Copy to clipboard"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                
                {copiedKey === 'new' && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    Copied to clipboard!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* API Keys List */}
        <div>
          <h3 className="text-lg font-medium mb-4">Your API Keys</h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              You don&apos;t have any API keys yet.
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {apiKeys.map((key) => (
                    <tr key={key._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {key.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <code className="font-mono">
                            {showKeys[key._id] 
                              ? key.key 
                              : `sk-${key.key.substring(3, 10)}...`}
                          </code>
                          <button
                            onClick={() => toggleShowKey(key._id)}
                            className="ml-2 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            title={showKeys[key._id] ? "Hide key" : "Show key"}
                          >
                            <FontAwesomeIcon icon={showKeys[key._id] ? faEyeSlash : faEye} />
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key, key._id)}
                            className="ml-1 p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            title="Copy to clipboard"
                          >
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                          {copiedKey === key._id && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                              Copied!
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteApiKey(key._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete key"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const deleteApiKey = async (keyId) => {
  if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
    return;
  }
  
  try {
    setError('');
    setSuccess('');
    
    const response = await fetch(`/api/apikeys/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyId,
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete API key');
    }
    
    // Refresh the list
    fetchApiKeys();
    
    setSuccess('API key deleted successfully');
  } catch (error) {
    console.error('Error deleting API key:', error);
    setError(error.message);
  }
};