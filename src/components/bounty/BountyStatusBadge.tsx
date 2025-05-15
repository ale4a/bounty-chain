import React from 'react';
import { BountyStatus } from '../../types';

interface StatusConfig {
  label: string;
  color: string;
  textColor: string;
}

const BountyStatusBadge: React.FC<{ status: BountyStatus }> = ({ status }) => {
  const getStatusConfig = (status: BountyStatus): StatusConfig => {
    switch (status) {
      case 'open':
        return {
          label: 'Open',
          color: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          color: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-purple-100',
          textColor: 'text-purple-800'
        };
      case 'pending-review':
        return {
          label: 'Pending Review',
          color: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        };
      case 'dispute':
        return {
          label: 'Dispute',
          color: 'bg-red-100',
          textColor: 'text-red-800'
        };
      case 'closed':
        return {
          label: 'Closed',
          color: 'bg-slate-100',
          textColor: 'text-slate-800'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-slate-100',
          textColor: 'text-slate-800'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}>
      {config.label}
    </span>
  );
};

export default BountyStatusBadge;