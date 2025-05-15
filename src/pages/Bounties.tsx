import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useBounty } from '../context/BountyContext';
import BountyCard from '../components/bounty/BountyCard';
import { motion } from 'framer-motion';

const Bounties: React.FC = () => {
  const { bounties } = useBounty();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get open bounties
  const openBounties = bounties.filter(b => b.status === 'open');
  
  // Create a list of all unique tags
  const allTags = Array.from(
    new Set(
      openBounties.flatMap(bounty => bounty.tags)
    )
  );
  
  // Filter bounties by search term and selected tags
  const filteredBounties = openBounties.filter(bounty => {
    const matchesSearch = searchTerm === '' || 
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bounty.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => bounty.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-slate-900">Available Bounties</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Create Bounty
        </button>
      </motion.div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bounties..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <select className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option>Newest first</option>
              <option>Highest reward</option>
              <option>Ending soon</option>
            </select>
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } transition-colors`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {filteredBounties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-2">No bounties found</h3>
          <p className="text-slate-600">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBounties.map((bounty, index) => (
            <motion.div
              key={bounty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index % 6) }}
            >
              <BountyCard bounty={bounty} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Bounties;