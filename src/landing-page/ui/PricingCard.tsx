import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from './Button';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText?: string;
  delay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  ctaText = 'Get Started',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative flex flex-col h-full p-6 bg-white/5 dark:bg-deep-blue-900/40 backdrop-blur-lg border border-white/20 dark:border-white/5 rounded-2xl ${isPopular ? 'ring-2 ring-electric-cyan' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-electric-cyan text-white text-sm font-medium py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}
      
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-white">{price}</span>
          {price !== 'Custom' && <span className="text-white/70 ml-1">/month</span>}
        </div>
        <p className="text-white/70 mb-4">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 ${feature.included ? 'bg-electric-cyan/20 text-electric-cyan' : 'bg-white/10 text-white/40'}`}>
              <Check size={12} />
            </span>
            <span className={`ml-2 text-sm ${feature.included ? 'text-white/90' : 'text-white/50 line-through'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto">
        <Button
          variant={isPopular ? 'primary' : 'glass'}
          withGlow={isPopular}
          className="w-full"
        >
          {ctaText}
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingCard;