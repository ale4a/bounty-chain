import React from 'react';
import { Briefcase, Check, AlertCircle, Clock, BarChart2, PieChart } from 'lucide-react';
import { useBounty } from '../context/BountyContext';
import { useUser } from '../context/UserContext';
import BountyCard from '../components/bounty/BountyCard';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const { loadBountiesForUser } = useBounty();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Connect wallet to view dashboard</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto shadow-sm transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  const createdBounties = loadBountiesForUser(user.id, 'creator');
  const workingBounties = loadBountiesForUser(user.id, 'worker');
  
  // Get bounties by status
  const pendingReviewBounties = createdBounties.filter(b => b.status === 'pending-review');
  const disputeBounties = createdBounties.filter(b => b.status === 'dispute');
  const inProgressCreated = createdBounties.filter(b => b.status === 'in-progress');
  const inProgressWorking = workingBounties.filter(b => b.status === 'in-progress');
  
  // Calculate total earnings
  const totalEarnings = workingBounties
    .filter(b => b.status === 'completed')
    .reduce((total, bounty) => total + bounty.reward, 0);
  
  // Calculate total spent
  const totalSpent = createdBounties
    .filter(b => b.status === 'completed')
    .reduce((total, bounty) => total + bounty.reward, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard</h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-medium text-slate-900">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {workingBounties.filter(b => b.status === 'completed').length}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Total completed bounties
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-900">In Progress</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {inProgressWorking.length}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Bounties you're working on
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-full">
              <BarChart2 className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-medium text-slate-900">Earnings</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {totalEarnings.toFixed(2)} ETH
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Total earnings from bounties
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-red-100 rounded-full">
              <PieChart className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-medium text-slate-900">Spent</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {totalSpent.toFixed(2)} ETH
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Total spent on bounties
          </p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {pendingReviewBounties.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-yellow-50">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-900">Pending Review</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {pendingReviewBounties.map(bounty => (
                    <BountyCard key={bounty.id} bounty={bounty} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {disputeBounties.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-red-50">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-900">Disputes</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {disputeBounties.map(bounty => (
                    <BountyCard key={bounty.id} bounty={bounty} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {inProgressCreated.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-blue-50">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-900">Your Active Bounties</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {inProgressCreated.map(bounty => (
                    <BountyCard key={bounty.id} bounty={bounty} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {inProgressWorking.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-blue-50">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-slate-900">Bounties You're Working On</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {inProgressWorking.map(bounty => (
                    <BountyCard key={bounty.id} bounty={bounty} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;