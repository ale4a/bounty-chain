import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Bounty, BountyStatus, ChatMessage } from '../types';
import { mockBounties, mockChatMessages } from '../data/mockData';

interface BountyContextType {
  bounties: Bounty[];
  chatMessages: ChatMessage[];
  loadBounty: (id: string) => Bounty | undefined;
  loadBountiesForUser: (userId: string, role: 'creator' | 'worker') => Bounty[];
  loadBountiesByStatus: (status: BountyStatus) => Bounty[];
  createBounty: (bounty: Omit<Bounty, 'id' | 'createdAt'>) => Promise<Bounty>;
  updateBountyStatus: (id: string, status: BountyStatus, workerId?: string) => Promise<Bounty | undefined>;
  applyToBounty: (bountyId: string, userId: string) => Promise<boolean>;
  getMessagesForBounty: (bountyId: string) => ChatMessage[];
  sendMessage: (bountyId: string, senderId: string, content: string) => Promise<ChatMessage>;
}

const BountyContext = createContext<BountyContextType | undefined>(undefined);

export const BountyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Load mock data
    setBounties(mockBounties);
    setChatMessages(mockChatMessages);
  }, []);

  const loadBounty = (id: string) => {
    return bounties.find(bounty => bounty.id === id);
  };

  const loadBountiesForUser = (userId: string, role: 'creator' | 'worker') => {
    if (role === 'creator') {
      return bounties.filter(bounty => bounty.creatorId === userId);
    } else {
      return bounties.filter(bounty => bounty.workerId === userId);
    }
  };

  const loadBountiesByStatus = (status: BountyStatus) => {
    return bounties.filter(bounty => bounty.status === status);
  };

  const createBounty = async (bountyData: Omit<Bounty, 'id' | 'createdAt'>) => {
    const newBounty: Bounty = {
      id: `bounty${bounties.length + 1}`,
      ...bountyData,
      createdAt: new Date().toISOString()
    };
    
    setBounties(prev => [...prev, newBounty]);
    return newBounty;
  };

  const updateBountyStatus = async (id: string, status: BountyStatus, workerId?: string) => {
    const updatedBounties = bounties.map(bounty => {
      if (bounty.id === id) {
        return {
          ...bounty,
          status,
          ...(workerId && { workerId })
        };
      }
      return bounty;
    });
    
    setBounties(updatedBounties);
    return updatedBounties.find(bounty => bounty.id === id);
  };

  const applyToBounty = async (bountyId: string, userId: string) => {
    // In a real app, this would create an application in the database
    // Here we'll just return success
    return true;
  };

  const getMessagesForBounty = (bountyId: string) => {
    return chatMessages.filter(msg => msg.bountyId === bountyId);
  };

  const sendMessage = async (bountyId: string, senderId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: `msg${chatMessages.length + 1}`,
      bountyId,
      senderId,
      content,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  return (
    <BountyContext.Provider
      value={{
        bounties,
        chatMessages,
        loadBounty,
        loadBountiesForUser,
        loadBountiesByStatus,
        createBounty,
        updateBountyStatus,
        applyToBounty,
        getMessagesForBounty,
        sendMessage
      }}
    >
      {children}
    </BountyContext.Provider>
  );
};

export const useBounty = (): BountyContextType => {
  const context = useContext(BountyContext);
  if (context === undefined) {
    throw new Error('useBounty must be used within a BountyProvider');
  }
  return context;
};