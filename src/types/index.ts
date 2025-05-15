export type BountyStatus = 'open' | 'in-progress' | 'completed' | 'pending-review' | 'dispute' | 'closed';

export interface User {
  id: string;
  name: string;
  walletAddress: string;
  githubLink?: string;
  bio?: string;
  reputation: number;
  completedBounties: number;
  createdBounties: number;
  disputedBounties: number;
  avatarUrl?: string;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: BountyStatus;
  createdAt: string;
  deadline?: string;
  creatorId: string;
  workerId?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  bountyId: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  bountyId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Command {
  input: string;
  type: 'create' | 'update' | 'check' | 'approve' | 'reject' | 'other';
  processed: boolean;
}