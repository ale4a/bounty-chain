import React from 'react';
import { 
  User, 
  Award, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  Github, 
  Link as LinkIcon, 
  Shield 
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useBounty } from '../context/BountyContext';
import { mockBadges } from '../data/mockData';
import BountyStatusBadge from '../components/bounty/BountyStatusBadge';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { user } = useUser();
  const { loadBountiesForUser } = useBounty();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Connect wallet to view profile</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto shadow-sm transition-colors">
            <User className="h-5 w-5 mr-2" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  const createdBounties = loadBountiesForUser(user.id, 'creator');
  const workingBounties = loadBountiesForUser(user.id, 'worker');
  
  // Get 5 most recent bounties
  const recentActivity = [...createdBounties, ...workingBounties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Calculate reputation level
  const getReputationLevel = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 4.0) return 'Very Good';
    if (score >= 3.5) return 'Good';
    if (score >= 3.0) return 'Average';
    return 'Beginner';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                  <img 
                    src={user.avatarUrl || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h1>
                <p className="text-slate-500 mb-4 text-center break-all">
                  {user.walletAddress}
                </p>
                
                <div className="flex items-center mb-4 bg-blue-50 px-4 py-2 rounded-full">
                  <Award className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-800">
                    {user.reputation.toFixed(1)} - {getReputationLevel(user.reputation)}
                  </span>
                </div>
                
                {user.githubLink && (
                  <a 
                    href={user.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 flex items-center mb-2"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    <span>GitHub Profile</span>
                  </a>
                )}
              </div>
              
              {user.bio && (
                <div className="mt-6">
                  <h3 className="font-medium text-slate-900 mb-2">About</h3>
                  <p className="text-slate-700">{user.bio}</p>
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4">
              <h3 className="font-medium text-slate-900 mb-3">Stats</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{user.completedBounties}</div>
                  <div className="text-xs text-slate-500">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{user.createdBounties}</div>
                  <div className="text-xs text-slate-500">Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{user.disputedBounties}</div>
                  <div className="text-xs text-slate-500">Disputed</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <h3 className="font-medium text-slate-900 mb-4">Badges</h3>
              <div className="space-y-4">
                {mockBadges.map((badge) => {
                  // Determine if the badge is earned based on user stats
                  let isEarned = false;
                  if (badge.id === 'badge1' && user.completedBounties >= 10) isEarned = true;
                  if (badge.id === 'badge2' && user.createdBounties >= 5 && user.disputedBounties === 0) isEarned = true;
                  if (badge.id === 'badge3') isEarned = true; // Just for demo
                  
                  return (
                    <div 
                      key={badge.id}
                      className={`flex items-center p-3 rounded-lg ${
                        isEarned ? 'bg-green-50' : 'bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isEarned ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {badge.icon === 'award' && <Award className="h-5 w-5" />}
                        {badge.icon === 'shield' && <Shield className="h-5 w-5" />}
                        {badge.icon === 'zap' && <LinkIcon className="h-5 w-5" />}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-slate-900">{badge.name}</h4>
                        <p className="text-xs text-slate-500">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                Bounty Activity
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-slate-900">Created Bounties</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {createdBounties.filter(b => b.status === 'open').length}
                      </div>
                      <div className="text-xs text-slate-500">Open</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {createdBounties.filter(b => b.status === 'in-progress').length}
                      </div>
                      <div className="text-xs text-slate-500">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {createdBounties.filter(b => b.status === 'completed').length}
                      </div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {createdBounties.filter(b => ['pending-review', 'dispute'].includes(b.status)).length}
                      </div>
                      <div className="text-xs text-slate-500">Pending/Dispute</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-slate-900">Working On</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {workingBounties.filter(b => b.status === 'in-progress').length}
                      </div>
                      <div className="text-xs text-slate-500">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {workingBounties.filter(b => b.status === 'pending-review').length}
                      </div>
                      <div className="text-xs text-slate-500">Pending Review</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {workingBounties.filter(b => b.status === 'completed').length}
                      </div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {workingBounties.filter(b => b.status === 'dispute').length}
                      </div>
                      <div className="text-xs text-slate-500">Disputed</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Recent Activity
              </h3>
              
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((bounty) => (
                    <div key={bounty.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-slate-900">{bounty.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {bounty.creatorId === user.id ? 'Created by you' : 'Working on this'} • {formatDate(bounty.createdAt)}
                          </p>
                        </div>
                        <BountyStatusBadge status={bounty.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Payout History</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Bounty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {workingBounties
                      .filter(b => b.status === 'completed')
                      .map((bounty) => (
                        <tr key={bounty.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                            {formatDate(bounty.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                            {bounty.title}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                            {bounty.reward} ETH
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    {workingBounties.filter(b => b.status === 'completed').length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          No payout history yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;