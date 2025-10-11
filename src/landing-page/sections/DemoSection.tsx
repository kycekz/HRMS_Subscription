import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatBubble from '../ui/ChatBubble';
import Button from '../ui/Button';
import { Send } from 'lucide-react';

interface DemoMessage {
  text: string;
  isAI: boolean;
  isTyping?: boolean;
}

const DemoSection: React.FC = () => {
  const [messages, setMessages] = useState<DemoMessage[]>([
    { text: 'Hi there! I\'m your PayrollGPT assistant. How can I help you today?', isAI: true },
  ]);
  const [currentDemo, setCurrentDemo] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const demoConversations = [
    {
      userMessage: 'Calculate overtime for November',
      responses: [
        { text: 'I\'ll calculate the overtime for November. Let me gather that data...', isAI: true },
        { text: 'For November, I found 187.5 hours of overtime across 14 employees. The total overtime cost is $8,437.50. Would you like to see the breakdown by department?', isAI: true },
      ],
    },
    {
      userMessage: 'Add new employee to marketing team',
      responses: [
        { text: 'I\'ll help you add a new employee to the marketing team. What\'s their name and start date?', isAI: true },
        { text: 'Thanks! I\'ve created a profile for Sarah Johnson in the marketing department. I\'ve also sent her an email with onboarding instructions and added her to the next payroll cycle. Is there anything else you need to set up for Sarah?', isAI: true },
      ],
    },
    {
      userMessage: 'Generate tax reports for Q4',
      responses: [
        { text: 'I\'ll generate the tax reports for Q4. This will include federal, state, and local tax calculations. One moment please...', isAI: true },
        { text: 'I\'ve generated all Q4 tax reports. The total tax liability is $427,892.45. I\'ve prepared the filing documents and saved them to your secure document storage. Would you like me to schedule these for filing?', isAI: true },
      ],
    },
  ];

  const runDemo = (index: number) => {
    if (currentDemo !== null) return;
    
    setCurrentDemo(index);
    const demo = demoConversations[index];
    
    // Add user message
    setMessages(prev => [...prev, { text: demo.userMessage, isAI: false }]);
    
    // Add AI typing indicator after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, { text: '', isAI: true, isTyping: true }]);
      
      // Replace with first response after a delay
      setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { text: demo.responses[0].text, isAI: true };
          return newMessages;
        });
        
        // Add second response after another delay
        setTimeout(() => {
          setMessages(prev => [...prev, { text: demo.responses[1].text, isAI: true }]);
          setCurrentDemo(null);
        }, 3000);
      }, 2000);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || currentDemo !== null) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isAI: false }]);
    setInputValue('');
    
    // Add AI typing indicator
    setTimeout(() => {
      setMessages(prev => [...prev, { text: '', isAI: true, isTyping: true }]);
      
      // Replace with response after a delay
      setTimeout(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            text: 'I understand you want to know more about PayrollGPT. This is a demo interface, but in the real product, I would provide detailed information about your request. Would you like to try one of our demo conversations instead?', 
            isAI: true 
          };
          return newMessages;
        });
      }, 2000);
    }, 1000);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-blue-800 to-deep-blue-900 dark:from-deep-blue-900/95 dark:to-deep-blue-900/80" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See PayrollGPT in Action</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Experience how simple payroll management can be with conversational AI
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-deep-blue-800/50 p-4 border-b border-white/10">
              <h3 className="text-white font-medium">PayrollGPT Assistant</h3>
            </div>
            
            <div className="p-4 h-96 overflow-y-auto flex flex-col">
              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  message={message.text}
                  isAI={message.isAI}
                  isTyping={message.isTyping}
                />
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-electric-cyan/50"
                disabled={currentDemo !== null}
              />
              <Button
                type="submit"
                variant="primary"
                icon={<Send size={18} />}
                disabled={currentDemo !== null}
              />
            </form>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
              <h3 className="text-white font-medium mb-4">Try These Examples</h3>
              <div className="space-y-3">
                {demoConversations.map((demo, index) => (
                  <button
                    key={index}
                    onClick={() => runDemo(index)}
                    disabled={currentDemo !== null}
                    className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {demo.userMessage}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
              <h3 className="text-white font-medium mb-2">Live Metrics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Processing Speed</span>
                    <span>10x faster</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-electric-cyan h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Accuracy Rate</span>
                    <span>99.9%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-electric-cyan h-2 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Time Saved</span>
                    <span>37 hrs/week</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-electric-cyan h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;