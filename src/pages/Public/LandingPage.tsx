import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

import HeroSection from '../../landing-page/sections/HeroSection';
import FeaturesSection from '../../landing-page/sections/FeaturesSection';
import DemoSection from '../../landing-page/sections/DemoSection';
import CapabilitiesSection from '../../landing-page/sections/CapabilitiesSection';
import PricingSection from '../../landing-page/sections/PricingSection';
import CTASection from '../../landing-page/sections/CTASection';
import FooterSection from '../../landing-page/sections/FooterSection';
import DarkModeToggle from '../../landing-page/ui/DarkModeToggle';

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-deep-blue-900 overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white">PayrollGPT</Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors duration-200">Features</a>
              <a href="#demo" className="text-white/80 hover:text-white transition-colors duration-200">Demo</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Resources</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              
              <Link 
                to="/login" 
                className="hidden md:block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              >
                Log In
              </Link>
              
              <Link 
                to="/subscription" 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        <HeroSection />
        
        <div id="features">
          <FeaturesSection />
        </div>
        
        <div id="demo">
          <DemoSection />
        </div>
        
        <CapabilitiesSection />
        
        <div id="pricing">
          <PricingSection />
        </div>
        
        <CTASection />
      </main>
      
      <FooterSection />
      
      {/* Floating chat widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button 
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300"
          aria-label="Chat with us"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage;