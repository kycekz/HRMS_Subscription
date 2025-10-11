import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, Layers, FileInput, Clock, MessageSquare, Wand2 } from 'lucide-react';

const CapabilitiesSection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-blue-900 to-deep-blue-800 dark:from-deep-blue-900/80 dark:to-deep-blue-900/95" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The AI Revolution in Payroll</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            See how PayrollGPT transforms complex payroll processes into simple conversations
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
          {/* Traditional Payroll */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Layers className="mr-2 text-red-400" size={24} />
              Traditional Payroll
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white/10 rounded-lg p-4 flex items-start">
                <Menu className="text-white/70 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium mb-1">Complex Menu Navigation</h4>
                  <p className="text-white/70 text-sm">Navigate through multiple screens and menus to find the right function</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 flex items-start">
                <FileInput className="text-white/70 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium mb-1">Manual Data Entry</h4>
                  <p className="text-white/70 text-sm">Tedious form filling and data input for each payroll cycle</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 flex items-start">
                <Clock className="text-white/70 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium mb-1">Hours of Manual Work</h4>
                  <p className="text-white/70 text-sm">Average 15+ hours per payroll cycle for a mid-sized company</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Arrow Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <div className="hidden lg:block w-full">
              <div className="relative h-40">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <ArrowRight className="text-electric-cyan" size={64} />
                </motion.div>
              </div>
            </div>
            
            <div className="lg:hidden py-6">
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="text-electric-cyan transform rotate-90" size={48} />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* PayrollGPT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-deep-blue-800/80 to-deep-blue-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-electric-cyan/30 via-blue-500/30 to-electric-cyan/30 animate-gradient-x -z-10"></div>
            
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Wand2 className="mr-2 text-electric-cyan" size={24} />
              PayrollGPT
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white/10 rounded-lg p-4 flex items-start">
                <MessageSquare className="text-electric-cyan mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium mb-1">Clean Chat Interface</h4>
                  <p className="text-white/70 text-sm">Simply type or speak your request in natural language</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 flex items-start relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-electric-cyan"></div>
                <div className="ml-3">
                  <h4 className="text-white font-medium mb-1">Voice Waveform</h4>
                  <div className="flex items-center space-x-1 h-6">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-electric-cyan rounded-full"
                        animate={{ height: [8, 16 + Math.random() * 12, 8] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 flex items-start">
                <Clock className="text-electric-cyan mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium mb-1">Minutes of Conversation</h4>
                  <p className="text-white/70 text-sm">Complete payroll tasks in 90% less time</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;