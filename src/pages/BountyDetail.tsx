import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  DollarSign, 
  User, 
  ArrowLeft, 
  Tag, 
  CheckCircle, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useBounty } from '../context/BountyContext';
import BountyStatusBadge from '../components/bounty/BountyStatusBadge';
import ChatInterface from '../components/chat/ChatInterface';
import { Bounty } from '../types';
import { motion } from 'framer-motion';

const BountyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { loadBounty, updateBountyStatus, applyToBounty } = useBounty();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const fetchedBounty = loadBounty(id);
      if (fetchedBounty) {
        setBounty(fetchedBounty);
      } else {
        // Bounty not found
        navigate('/bounties');
      }
    }
  }, [id, loadBounty, navigate]);
  
  if (!bounty) {
    return <div>Loading...</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const handleApply = async () => {
    if (!user) return;
    
    setIsApplying(true);
    try {
      const success = await applyToBounty(bounty.id, user.id);
      if (success) {
        // In a real app, this would show the application was submitted
        // For demo, we'll immediately accept the application
        const updatedBounty = await updateBountyStatus(bounty.id, 'in-progress', user.id);
        if (updatedBounty) {
          setBounty(updatedBounty);
        }
      }
    } catch (error) {
      console.error("Error applying to bounty:", error);
    } finally {
      setIsApplying(false);
    }
  };
  
  const handleStatusUpdate = async (newStatus: 'completed' | 'pending-review' | 'dispute') => {
    try {
      const updatedBounty = await updateBountyStatus(bounty.id, newStatus);
      if (updatedBounty) {
        setBounty(updatedBounty);
      }
    } catch (error) {
      console.error("Error updating bounty status:", error);
    }
  };
  
  const isCreator = user && user.id === bounty.creatorId;
  const isWorker = user && user.id === bounty.workerId;
  const canApply = user && bounty.status === 'open' && !isCreator;
  const canSubmit = user && bounty.status === 'in-progress' && isWorker;
  const canApprove = user && bounty.status === 'pending-review' && isCreator;
  const canDispute = user && (bounty.status === 'pending-review' || bounty.status === 'completed') && 
                    (isCreator || isWorker);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/bounties" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Bounties
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-slate-900">{bounty.title}</h1>
            <BountyStatusBadge status={bounty.status} />
          </div>
          
          <div className="mb-6">
            <p className="text-slate-700 whitespace-pre-line">{bounty.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-slate-700">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              <span className="font-medium">{bounty.reward} ETH</span>
            </div>
            
            <div className="flex items-center text-slate-700">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              <span>Created on {formatDate(bounty.createdAt)}</span>
            </div>
            
            {bounty.deadline && (
              <div className="flex items-center text-slate-700">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                <span>Due by {formatDate(bounty.deadline)}</span>
              </div>
            )}
            
            <div className="flex items-center text-slate-700">
              <User className="h-5 w-5 mr-2 text-purple-500" />
              <span>Created by {isCreator ? 'you' : 'someone else'}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-slate-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {bounty.tags.map((tag, index) => (
                <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700">
                  <Tag className="h-4 w-4 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {canApply && (
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors disabled:bg-blue-300"
              >
                {isApplying ? 'Applying...' : 'Apply for Bounty'}
              </button>
            )}
            
            {canSubmit && (
              <button
                onClick={() => handleStatusUpdate('pending-review')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Submit Work
              </button>
            )}
            
            {canApprove && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('dispute')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject
                </button>
              </div>
            )}
            
            {canDispute && bounty.status !== 'dispute' && (
              <button
                onClick={() => handleStatusUpdate('dispute')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Dispute
              </button>
            )}
          </div>
        </div>
      </motion.div>
      
      {bounty.workerId && (bounty.status === 'in-progress' || bounty.status === 'pending-review' || bounty.status === 'dispute') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ChatInterface bountyId={bounty.id} />
        </motion.div>
      )}
    </div>
  );
};

export default BountyDetail;