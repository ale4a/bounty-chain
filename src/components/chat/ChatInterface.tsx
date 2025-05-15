import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Clock } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useBounty } from '../../context/BountyContext';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  bountyId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ bountyId }) => {
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const { getMessagesForBounty, sendMessage } = useBounty();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    setMessages(getMessagesForBounty(bountyId));
    
    // Poll for new messages (in a real app, this would be a WebSocket connection)
    const interval = setInterval(() => {
      setMessages(getMessagesForBounty(bountyId));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [bountyId, getMessagesForBounty]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    try {
      const newMessage = await sendMessage(bountyId, user.id, message);
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-3 border-b border-slate-200 bg-slate-50">
        <h3 className="font-medium text-slate-800">Chat</h3>
      </div>
      
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <Clock className="h-8 w-8 mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start the conversation by sending a message</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.senderId === user.id;
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  isCurrentUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  <p>{msg.content}</p>
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-slate-500'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2">
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 py-2 px-3 bg-slate-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 rounded-full ${
            message.trim() 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          } transition-colors`}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;