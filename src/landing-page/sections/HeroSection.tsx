import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import FloatingElements from '../ui/FloatingElements';
import Button from '../ui/Button';
import StatCounter from '../ui/StatCounter';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue-900 via-deep-blue-800 to-electric-cyan/30 animate-gradient-xy">
        <div className="absolute inset-0 bg-[url('/src/assets/images/grid.svg')] opacity-10" />
        <FloatingElements />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Revolutionize Payroll with AI-Powered Conversations
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/80 mb-8 max-w-3xl mx-auto"
          >
            No more complex interfaces. Just talk to your payroll system like a human assistant and watch it handle everything automatically.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button variant="primary" size="lg" withGlow>
              Start Free Trial
            </Button>
            <Button variant="glass" size="lg" icon={<Play size={18} />}>
              Watch Demo
            </Button>
          </motion.div>
          
          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative max-w-3xl mx-auto mb-16"
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-white/70 text-sm">PayrollGPT Assistant</div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded-lg text-white/90 text-left">
                  <p className="text-electric-cyan font-medium mb-1">User</p>
                  <p>Process this month's payroll for the engineering team</p>
                </div>
                
                <div className="bg-deep-blue-800/50 p-3 rounded-lg text-white/90 text-left">
                  <p className="text-electric-cyan font-medium mb-1">PayrollGPT</p>
                  <p>I'll process the May payroll for the engineering team (12 employees). This includes regular hours, overtime, and the quarterly bonus. The total gross is $247,890. Should I proceed with the calculations and prepare for approval?</p>
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-electric-cyan/30 to-blue-600/30 rounded-2xl blur-xl -z-10 opacity-70"></div>
          </motion.div>
          
          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-white/90 text-lg"
          >
            <div className="flex items-center">
              <span className="font-bold mr-2">Trusted by </span>
              <StatCounter end={500} suffix="+ Companies" />
            </div>
            <div className="flex items-center">
              <StatCounter end={99.9} decimals={1} suffix="% Accuracy" />
            </div>
            <div className="flex items-center">
              <StatCounter end={10} suffix="x Faster Processing" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;