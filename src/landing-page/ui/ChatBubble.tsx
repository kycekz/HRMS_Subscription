import React from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  isAI?: boolean;
  isTyping?: boolean;
  delay?: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isAI = false,
  isTyping = false,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${isAI
          ? 'bg-deep-blue-800/80 text-white rounded-tl-none'
          : 'bg-electric-cyan text-deep-blue-900 rounded-tr-none'
        }`}
      >
        {isTyping ? (
          <div className="flex space-x-2 items-center h-6">
            <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div>{message}</div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;