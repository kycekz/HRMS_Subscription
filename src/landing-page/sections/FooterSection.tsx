import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Shield, Lock } from 'lucide-react';
import DarkModeToggle from '../ui/DarkModeToggle';

const FooterSection: React.FC = () => {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Demo', href: '#' },
        { label: 'Integrations', href: '#' },
        { label: 'API', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Guides', href: '#' },
        { label: 'Webinars', href: '#' },
        { label: 'Case Studies', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Partners', href: '#' },
        { label: 'Legal', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'hello@payrollgpt.ai' },
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: MapPin, text: 'San Francisco, CA' },
  ];

  const securityBadges = [
    { icon: Shield, text: 'SOC 2 Compliant' },
    { icon: Lock, text: 'GDPR Compliant' },
  ];

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-deep-blue-900 dark:bg-deep-blue-900/95" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-white mr-3">PayrollGPT</h2>
              <DarkModeToggle />
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              Revolutionary AI-powered payroll system that simplifies complex processes through natural language conversations.
            </p>
            
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-electric-cyan hover:text-deep-blue-900 transition-colors duration-200"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center text-white/70">
                  <contact.icon size={16} className="mr-2 text-electric-cyan" />
                  <span>{contact.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-white/70 hover:text-electric-cyan transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
            {securityBadges.map((badge, index) => (
              <div key={index} className="flex items-center bg-white/5 rounded-full px-3 py-1">
                <badge.icon size={14} className="text-electric-cyan mr-1" />
                <span className="text-white/70 text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
          
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} PayrollGPT. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;