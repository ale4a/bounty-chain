import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Command } from '../types';
import { useBounty } from './BountyContext';
import { useUser } from './UserContext';

interface AIContextType {
  processCommand: (input: string) => Promise<string>;
  recentCommands: Command[];
  isProcessing: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentCommands, setRecentCommands] = useState<Command[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const bountyContext = useBounty();
  const userContext = useUser();

  const processCommand = async (input: string): Promise<string> => {
    setIsProcessing(true);
    
    // Create a new command
    const newCommand: Command = {
      input,
      type: determineCommandType(input),
      processed: false
    };
    
    try {
      // In a real app, this would send the command to an AI service
      // For demo purposes, we'll simulate processing with simple pattern matching
      let response = '';
      
      // Wait a bit to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (input.toLowerCase().includes('create a bounty')) {
        // Extract basic details using regex (very simplified)
        const titleMatch = input.match(/for\s+(?:a|an)\s+(.*?)(?:with|having|of|for|$)/i);
        const rewardMatch = input.match(/reward\s+of\s+([0-9.]+)\s*(?:eth|ethereum)/i);
        
        const title = titleMatch ? titleMatch[1].trim() : 'New Task';
        const reward = rewardMatch ? parseFloat(rewardMatch[1]) : 0.5;
        
        if (userContext.user) {
          const newBounty = await bountyContext.createBounty({
            title,
            description: `Created via Nebula AI: "${input}"`,
            reward,
            status: 'open',
            creatorId: userContext.user.id,
            tags: ['generated', 'nebula-ai'],
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
          });
          
          response = `Created a new bounty: "${title}" with a reward of ${reward} ETH. The bounty ID is ${newBounty.id}.`;
        } else {
          response = "You need to be logged in to create bounties.";
        }
      } else if (input.toLowerCase().includes('check') && input.toLowerCase().includes('status')) {
        // Check status of bounties
        if (userContext.user) {
          const createdBounties = bountyContext.loadBountiesForUser(userContext.user.id, 'creator');
          const workingBounties = bountyContext.loadBountiesForUser(userContext.user.id, 'worker');
          
          response = `You have ${createdBounties.length} created bounties and ${workingBounties.length} bounties you're working on.\n\n`;
          
          if (createdBounties.length > 0) {
            response += "Created bounties:\n";
            createdBounties.forEach(b => {
              response += `- ${b.title} (${b.status})\n`;
            });
            response += "\n";
          }
          
          if (workingBounties.length > 0) {
            response += "Working bounties:\n";
            workingBounties.forEach(b => {
              response += `- ${b.title} (${b.status})\n`;
            });
          }
        } else {
          response = "You need to be logged in to check bounty status.";
        }
      } else if ((input.toLowerCase().includes('approve') || input.toLowerCase().includes('accept')) && 
                 input.toLowerCase().includes('bounty')) {
        // Extract bounty ID using regex (very simplified)
        const idMatch = input.match(/bounty\s+(?:id\s+)?([a-z0-9]+)/i);
        
        if (idMatch && userContext.user) {
          const bountyId = idMatch[1];
          const bounty = bountyContext.loadBounty(bountyId);
          
          if (bounty && bounty.creatorId === userContext.user.id) {
            if (bounty.status === 'pending-review') {
              await bountyContext.updateBountyStatus(bountyId, 'completed');
              response = `Approved bounty "${bounty.title}". The reward of ${bounty.reward} ETH will be released to the worker.`;
            } else {
              response = `Cannot approve bounty "${bounty.title}" because it's not in the pending review state.`;
            }
          } else {
            response = `You either don't have permission to approve this bounty, or the bounty ID is invalid.`;
          }
        } else {
          response = "Please specify a valid bounty ID and ensure you're logged in.";
        }
      } else {
        response = "I'm not sure how to process that command. Try asking me to create a bounty, check status, or approve a submission.";
      }
      
      // Update the command as processed
      newCommand.processed = true;
      setRecentCommands(prev => [newCommand, ...prev].slice(0, 10)); // Keep last 10 commands
      
      setIsProcessing(false);
      return response;
    } catch (error) {
      console.error("Error processing command:", error);
      setIsProcessing(false);
      return "Sorry, I encountered an error processing your command. Please try again.";
    }
  };

  const determineCommandType = (input: string): Command['type'] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('create')) return 'create';
    if (lowerInput.includes('update') || lowerInput.includes('change')) return 'update';
    if (lowerInput.includes('check') || lowerInput.includes('status')) return 'check';
    if (lowerInput.includes('approve') || lowerInput.includes('accept')) return 'approve';
    if (lowerInput.includes('reject') || lowerInput.includes('decline')) return 'reject';
    
    return 'other';
  };

  return (
    <AIContext.Provider
      value={{
        processCommand,
        recentCommands,
        isProcessing
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};