import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group hover:scale-105 transition-all duration-300 bg-white/10 dark:bg-deep-blue-900/40 backdrop-blur-lg border border-white/20 dark:border-white/5 rounded-2xl p-8 h-full"
    >
      <div className="group-hover:rotate-12 transition-transform duration-300">
        <Icon className="h-12 w-12 text-electric-cyan mb-4" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80 dark:text-white/70">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;