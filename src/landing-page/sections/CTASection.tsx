import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const CTASection: React.FC = () => {
  const benefits = [
    'No credit card required',
    '14-day free trial',
    'Cancel anytime',
    'Full feature access',
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue-900 via-deep-blue-800 to-electric-cyan/30 animate-gradient-xy">
        <div className="absolute inset-0 bg-[url('/src/assets/images/grid.svg')] opacity-10" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-electric-cyan/20 to-blue-600/20 rounded-2xl blur-xl -z-10 opacity-70"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">Transform Your Payroll Today</h2>
              <p className="text-white/80 mb-6">
                Join hundreds of companies already saving time and reducing errors with PayrollGPT's revolutionary AI-powered system.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-center text-white/90"
                  >
                    <CheckCircle2 className="h-5 w-5 text-electric-cyan mr-2 flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" withGlow icon={<ArrowRight size={18} />} iconPosition="right">
                  Start Free Trial
                </Button>
                <Button variant="glass" size="lg">
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative hidden md:block"
            >
              {/* Testimonial card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-electric-cyan flex items-center justify-center text-white font-bold text-lg">
                    AC
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-medium">Alex Chen</h4>
                    <p className="text-white/70 text-sm">CFO, TechNova Inc.</p>
                  </div>
                </div>
                <p className="text-white/90 italic mb-4">
                  "PayrollGPT has completely transformed how we handle payroll. What used to take our team days now takes minutes, with even better accuracy. The ROI was immediate and substantial."
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Stats card */}
              <div className="absolute -bottom-4 -right-4 bg-deep-blue-800/90 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-white/70 text-xs">Time Saved</p>
                    <p className="text-white font-bold text-xl">37 hrs/week</p>
                  </div>
                  <div className="h-10 w-px bg-white/20"></div>
                  <div>
                    <p className="text-white/70 text-xs">Error Reduction</p>
                    <p className="text-white font-bold text-xl">98.7%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;