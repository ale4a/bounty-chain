import React, { useState } from 'react';
import { Sparkles, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import CommandInput from '../components/ai/CommandInput';
import { useBounty } from '../context/BountyContext';
import { useUser } from '../context/UserContext';
import BountyCard from '../components/bounty/BountyCard';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { user } = useUser();
  const { loadBountiesForUser } = useBounty();
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  
  // Get user's bounties if logged in
  const createdBounties = user ? loadBountiesForUser(user.id, 'creator') : [];
  const workingBounties = user ? loadBountiesForUser(user.id, 'worker') : [];
  
  // Filter bounties by status
  const openBounties = createdBounties.filter(b => b.status === 'open');
  const inProgressBounties = createdBounties.filter(b => b.status === 'in-progress');
  const pendingReviewBounties = createdBounties.filter(b => b.status === 'pending-review');
  const disputeBounties = createdBounties.filter(b => b.status === 'dispute');

  const handleAIResponse = (response: string) => {
    setAIResponse(response);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-7 w-7 text-blue-500" />
            <h1 className="text-3xl font-bold text-slate-900">Nebula AI Command Center</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Communicate with Nebula AI using natural language to create bounties, check status, approve submissions, and more.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <CommandInput onResponse={handleAIResponse} />
        </motion.div>
      </div>
      
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center">
            <Briefcase className="h-6 w-6 mr-2 text-blue-500" />
            Your Bounties
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-slate-900">Open</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{openBounties.length}</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-slate-900">In Progress</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{inProgressBounties.length}</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="font-medium text-slate-900">Pending Review</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{pendingReviewBounties.length}</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-medium text-slate-900">Disputes</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{disputeBounties.length}</p>
            </div>
          </div>
          
          {pendingReviewBounties.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Pending Review</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingReviewBounties.map(bounty => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </div>
            </div>
          )}
          
          {workingBounties.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Bounties You're Working On</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {workingBounties.map(bounty => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Home;