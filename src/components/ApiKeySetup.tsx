import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    // Check if API key is already set in environment
    const existingKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (existingKey && existingKey !== 'your_gemini_api_key_here') {
      setValidationStatus('valid');
      onApiKeySet(existingKey);
    }
  }, [onApiKeySet]);

  const validateApiKey = async (key: string) => {
    if (!key || key.length < 10) {
      setValidationStatus('invalid');
      return false;
    }

    setIsValidating(true);
    try {
      // Simple validation - check if key format looks correct
      if (key.startsWith('AIza') && key.length > 30) {
        setValidationStatus('valid');
        return true;
      } else {
        setValidationStatus('invalid');
        return false;
      }
    } catch (error) {
      setValidationStatus('invalid');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleApiKeySubmit = async () => {
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      // Store in localStorage for this session
      localStorage.setItem('gemini_api_key', apiKey);
      onApiKeySet(apiKey);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApiKeySubmit();
    }
  };

  if (validationStatus === 'valid') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Gemini API connected successfully!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Setup Gemini AI</h3>
      </div>
      
      <p className="text-blue-800 dark:text-blue-200 mb-4 text-sm">
        To enable real AI-powered conversations, please add your Google Gemini API key. 
        This will allow TimeTuneAI to understand and respond to your natural language requests.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setValidationStatus('idle');
              }}
              onKeyPress={handleKeyPress}
              placeholder="AIza..."
              className="w-full px-4 py-3 pr-20 border border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {validationStatus === 'invalid' && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              {validationStatus === 'valid' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
          {validationStatus === 'invalid' && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">
              Please enter a valid Gemini API key
            </p>
          )}
        </div>

        <button
          onClick={handleApiKeySubmit}
          disabled={!apiKey || isValidating}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isValidating ? (
            <>
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Validating...</span>
            </>
          ) : (
            <>
              <Key className="w-4 h-4" />
              <span>Connect Gemini AI</span>
            </>
          )}
        </button>

        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">How to get your API key:</h4>
          <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-300 inline-flex items-center">Google AI Studio <ExternalLink className="w-3 h-3 ml-1" /></a></li>
            <li>2. Sign in with your Google account</li>
            <li>3. Click "Create API Key"</li>
            <li>4. Copy the generated key and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;