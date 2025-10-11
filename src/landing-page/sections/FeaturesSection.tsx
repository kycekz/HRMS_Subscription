import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Eye, Cpu, BarChart3, Mic, Shield } from 'lucide-react';
import FeatureCard from '../ui/FeatureCard';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Natural Language Processing',
      description: 'Speak naturally: "Process this month\'s payroll for engineering team"',
    },
    {
      icon: Eye,
      title: 'Proactive Monitoring',
      description: 'AI watches your data 24/7, alerts you before issues arise',
    },
    {
      icon: Cpu,
      title: 'Smart Automation',
      description: 'Automates 90% of payroll tasks without human intervention',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Live insights into payroll costs, overtime, and compliance',
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Control everything with voice: "Show me Sarah\'s overtime this week"',
    },
    {
      icon: Shield,
      title: 'Compliance Guardian',
      description: 'Automatically stays updated with tax laws and regulations',
    },
  ];

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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful AI Features</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            PayrollGPT combines cutting-edge AI with deep payroll expertise to deliver a revolutionary experience
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;