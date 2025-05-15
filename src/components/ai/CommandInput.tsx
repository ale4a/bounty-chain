import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandInputProps {
  onResponse?: (response: string) => void;
}

const CommandInput: React.FC<CommandInputProps> = ({ onResponse }) => {
  const [command, setCommand] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { processCommand, isProcessing } = useAI();

  const suggestions = [
    "Create a bounty for a landing page design with a reward of 0.5 ETH",
    "Approve the submission for bounty123",
    "Check the status of my bounties",
    "Create a bounty for building a smart contract with a reward of 1 ETH",
    "Reject the submission for bounty456 due to quality issues"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;
    
    try {
      const result = await processCommand(command);
      setResponse(result);
      if (onResponse) onResponse(result);
      setCommand('');
    } catch (error) {
      console.error("Error processing command:", error);
      setResponse("Sorry, an error occurred while processing your command.");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl">
      <AnimatePresence>
        {response && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-white rounded-lg shadow-md border border-slate-200"
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 mb-1">Nebula AI</h3>
                <div className="text-slate-700 whitespace-pre-line">
                  {response}
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => setResponse(null)} 
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ask Nebula AI to do something..."
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!command.trim() || isProcessing}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
              command.trim() && !isProcessing
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            } transition-colors`}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-slate-200"
            >
              <ul className="py-1">
                <li className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100">
                  Suggestions:
                </li>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommandInput;