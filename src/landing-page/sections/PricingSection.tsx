import React from 'react';
import { motion } from 'framer-motion';
import PricingCard from '../ui/PricingCard';

const PricingSection: React.FC = () => {
  const pricingPlans = [
    {
      title: 'Starter',
      price: '$49',
      description: 'Perfect for small businesses just getting started with AI payroll',
      features: [
        { text: 'Up to 50 employees', included: true },
        { text: 'Basic AI assistant', included: true },
        { text: 'Email support', included: true },
        { text: 'Standard reports', included: true },
        { text: 'Advanced AI features', included: false },
        { text: 'Phone + chat support', included: false },
        { text: 'Custom integrations', included: false },
        { text: 'White-label option', included: false },
      ],
      isPopular: false,
      ctaText: 'Start Free Trial',
    },
    {
      title: 'Professional',
      price: '$149',
      description: 'Ideal for growing businesses that need more advanced features',
      features: [
        { text: 'Up to 200 employees', included: true },
        { text: 'Advanced AI features', included: true },
        { text: 'Phone + chat support', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Multi-department support', included: true },
        { text: 'Dedicated success manager', included: false },
        { text: 'Custom AI training', included: false },
      ],
      isPopular: true,
      ctaText: 'Start Free Trial',
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with complex payroll requirements',
      features: [
        { text: 'Unlimited employees', included: true },
        { text: 'White-label option', included: true },
        { text: 'Dedicated success manager', included: true },
        { text: 'Custom AI training', included: true },
        { text: 'Enterprise SLAs', included: true },
        { text: 'Advanced security features', included: true },
        { text: 'Custom reporting', included: true },
        { text: 'Priority support', included: true },
      ],
      isPopular: false,
      ctaText: 'Contact Sales',
    },
  ];

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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              ctaText={plan.ctaText}
              delay={0.1 * index}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 text-sm">
            All plans include core features: AI-powered payroll processing, tax calculations, employee self-service, and basic reporting.
            <br />
            Need a custom solution? <a href="#" className="text-electric-cyan hover:underline">Contact our sales team</a> for a personalized quote.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;