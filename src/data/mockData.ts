import { Bounty, User, Notification, ChatMessage, Badge } from '../types';

export const currentUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  githubLink: 'https://github.com/alexjohnson',
  bio: 'Full-stack developer specializing in React and Solidity. Building decentralized applications since 2018.',
  reputation: 4.8,
  completedBounties: 15,
  createdBounties: 7,
  disputedBounties: 1,
  avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

export const mockBounties: Bounty[] = [
  {
    id: 'bounty1',
    title: 'Develop Smart Contract for NFT Marketplace',
    description: 'Create a secure and gas-efficient smart contract for an NFT marketplace on the Mantle blockchain. The contract should handle listing, buying, selling, and royalties.',
    reward: 1.5,
    status: 'open',
    createdAt: '2025-01-15T10:30:00Z',
    deadline: '2025-02-10T23:59:59Z',
    creatorId: 'user2',
    tags: ['smart-contract', 'solidity', 'nft', 'blockchain']
  },
  {
    id: 'bounty2',
    title: 'Design DeFi Dashboard UI/UX',
    description: 'Design a modern and intuitive dashboard for a DeFi application. Focus on clear data visualization and smooth user experience.',
    reward: 0.8,
    status: 'in-progress',
    createdAt: '2025-01-10T14:20:00Z',
    deadline: '2025-01-25T23:59:59Z',
    creatorId: 'user3',
    workerId: 'user1',
    tags: ['design', 'ui/ux', 'defi', 'dashboard']
  },
  {
    id: 'bounty3',
    title: 'Optimize Gas Usage in Existing Contract',
    description: 'Review and optimize gas usage in an existing DEX contract. Identify inefficiencies and implement improvements.',
    reward: 0.5,
    status: 'pending-review',
    createdAt: '2025-01-05T09:15:00Z',
    deadline: '2025-01-20T23:59:59Z',
    creatorId: 'user4',
    workerId: 'user1',
    tags: ['optimization', 'gas', 'solidity', 'dex']
  },
  {
    id: 'bounty4',
    title: 'Create Logo for Blockchain Startup',
    description: 'Design a unique and memorable logo for a new blockchain startup focused on decentralized identity solutions.',
    reward: 0.3,
    status: 'completed',
    createdAt: '2024-12-28T11:45:00Z',
    deadline: '2025-01-10T23:59:59Z',
    creatorId: 'user5',
    workerId: 'user1',
    tags: ['design', 'logo', 'branding', 'identity']
  },
  {
    id: 'bounty5',
    title: 'Implement Multi-sig Wallet',
    description: 'Develop a multi-signature wallet contract that requires M-of-N signatures to execute transactions.',
    reward: 1.2,
    status: 'open',
    createdAt: '2025-01-17T16:40:00Z',
    deadline: '2025-02-15T23:59:59Z',
    creatorId: 'user2',
    tags: ['wallet', 'multi-sig', 'solidity', 'security']
  },
  {
    id: 'bounty6',
    title: 'Write Technical Documentation',
    description: 'Create comprehensive technical documentation for a DeFi lending protocol, including architecture, API references, and examples.',
    reward: 0.6,
    status: 'dispute',
    createdAt: '2025-01-08T13:25:00Z',
    deadline: '2025-01-22T23:59:59Z',
    creatorId: 'user3',
    workerId: 'user1',
    tags: ['documentation', 'technical-writing', 'defi', 'lending']
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    message: 'New applicant for your bounty: Develop Smart Contract for NFT Marketplace',
    type: 'info',
    read: false,
    timestamp: '2025-01-18T09:15:00Z',
    bountyId: 'bounty1'
  },
  {
    id: 'notif2',
    userId: 'user1',
    message: 'Your submission for "Design DeFi Dashboard UI/UX" has been moved to pending review',
    type: 'warning',
    read: false,
    timestamp: '2025-01-17T14:30:00Z',
    bountyId: 'bounty2'
  },
  {
    id: 'notif3',
    userId: 'user1',
    message: 'Payment of 0.3 ETH released for "Create Logo for Blockchain Startup"',
    type: 'success',
    read: true,
    timestamp: '2025-01-15T11:20:00Z',
    bountyId: 'bounty4'
  },
  {
    id: 'notif4',
    userId: 'user1',
    message: 'Dispute initiated for "Write Technical Documentation"',
    type: 'error',
    read: true,
    timestamp: '2025-01-14T16:45:00Z',
    bountyId: 'bounty6'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    bountyId: 'bounty2',
    senderId: 'user3',
    content: 'How is the dashboard design coming along?',
    timestamp: '2025-01-16T10:30:00Z'
  },
  {
    id: 'msg2',
    bountyId: 'bounty2',
    senderId: 'user1',
    content: 'Going well! I\'ve completed the main layout and working on the charts now.',
    timestamp: '2025-01-16T10:35:00Z'
  },
  {
    id: 'msg3',
    bountyId: 'bounty2',
    senderId: 'user3',
    content: 'Great! Can you share a preview when you have something to show?',
    timestamp: '2025-01-16T10:40:00Z'
  },
  {
    id: 'msg4',
    bountyId: 'bounty2',
    senderId: 'user1',
    content: 'Sure, I\'ll have a preview ready by tomorrow.',
    timestamp: '2025-01-16T10:42:00Z'
  },
  {
    id: 'msg5',
    bountyId: 'bounty6',
    senderId: 'user3',
    content: 'The documentation is missing API examples and integration guides.',
    timestamp: '2025-01-14T15:30:00Z'
  },
  {
    id: 'msg6',
    bountyId: 'bounty6',
    senderId: 'user1',
    content: 'The API examples were not part of the original requirements. I can add them but would need to adjust the timeline.',
    timestamp: '2025-01-14T15:40:00Z'
  },
  {
    id: 'msg7',
    bountyId: 'bounty6',
    senderId: 'user3',
    content: 'They were definitely part of the requirements. I\'m rejecting this submission.',
    timestamp: '2025-01-14T16:30:00Z'
  },
  {
    id: 'msg8',
    bountyId: 'bounty6',
    senderId: 'user1',
    content: 'I\'m initiating a dispute as this was not explicitly stated in the bounty description.',
    timestamp: '2025-01-14T16:45:00Z'
  }
];

export const mockBadges: Badge[] = [
  {
    id: 'badge1',
    name: 'Veteran',
    description: 'Completed 10+ bounties successfully',
    icon: 'award'
  },
  {
    id: 'badge2',
    name: 'Trusted Creator',
    description: 'Created 5+ bounties with no disputes',
    icon: 'shield'
  },
  {
    id: 'badge3',
    name: 'Swift Worker',
    description: 'Completed 3+ bounties before deadline',
    icon: 'zap'
  }
];