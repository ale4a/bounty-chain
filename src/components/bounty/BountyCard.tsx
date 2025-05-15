import React from 'react';
import { Link } from 'react-router-dom';
import { Bounty } from '../../types';
import BountyStatusBadge from './BountyStatusBadge';
import { Clock, DollarSign, Tag } from 'lucide-react';

interface BountyCardProps {
  bounty: Bounty;
}

const BountyCard: React.FC<BountyCardProps> = ({ bounty }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Link 
      to={`/bounties/${bounty.id}`}
      className="block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{bounty.title}</h3>
          <BountyStatusBadge status={bounty.status} />
        </div>
        
        <p className="mt-2 text-slate-600 text-sm line-clamp-2">
          {bounty.description}
        </p>
        
        <div className="mt-4 flex items-center text-slate-500 text-sm">
          <DollarSign className="h-4 w-4 mr-1" />
          <span className="font-medium text-slate-700">{bounty.reward} ETH</span>
        </div>
        
        <div className="mt-2 flex items-center text-slate-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Created {formatDate(bounty.createdAt)}</span>
        </div>
        
        {bounty.deadline && (
          <div className="mt-2 flex items-center text-slate-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>Due {formatDate(bounty.deadline)}</span>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {bounty.tags.slice(0, 3).map((tag, index) => (
            <div key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </div>
          ))}
          {bounty.tags.length > 3 && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
              +{bounty.tags.length - 3} more
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BountyCard;