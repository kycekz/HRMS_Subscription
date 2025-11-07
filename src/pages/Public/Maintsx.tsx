import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface HomepageProps {
  onNavigate?: (path: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenLogin, setIsDropdownOpenLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const handleSolutionClick = (solution: string) => {
    setIsDropdownOpen(false);
    if (solution === 'HRMS') {
      handleNavigate('/subscription');
    } else if (solution === 'AI Chatbot') {
      handleNavigate('/ai-chatbot');
    } else if (solution === 'Analytic Solution') {
      handleNavigate('/Business_Intelligent');
    } else if (solution === 'Learning & Development') {
      handleNavigate('/learning');
    }
  };

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: '#ffffff',
      color: '#1a1a1a',
      overflowX: 'hidden' as const,
      minHeight: '100vh',
      position: 'relative' as const,
    },
    bgGradient: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 50%, #f8f9ff 100%)',
      zIndex: -2,
    },
    bgPattern: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
      zIndex: -1,
    },
    nav: {
      position: 'fixed' as const,
      top: 0,
      width: '100%',
      padding: '1.5rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: scrolled ? '0 2px 20px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.03)',
      transition: 'box-shadow 0.3s',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      height: '50px',
      cursor: 'pointer',
    },
    logoImg: {
      height: '50px',
      width: 'auto',
    },
    navLinks: {
      display: 'flex',
      gap: '2.5rem',
      alignItems: 'center',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navItem: {
      color: '#1a1a1a',
      textDecoration: 'none',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'color 0.3s',
    },
    dropdown: {
      position: 'relative' as const,
    },
    dropdownToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#1a1a1a',
      fontWeight: 500,
      cursor: 'pointer',
    },
    dropdownMenu: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      marginTop: '1rem',
      background: 'white',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      minWidth: '200px',
      opacity: isDropdownOpen ? 1 : 0,
      visibility: isDropdownOpen ? 'visible' as const : 'hidden' as const,
      transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all 0.3s',
    },
    dropdownItem: {
      padding: '1rem 1.5rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    btnLogin: {
      padding: '0.6rem 1.8rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    hero: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8rem 5% 4rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    heroCube: {
      position: 'absolute' as const,
      right: '10%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '300px',
      height: '300px',
      perspective: '1000px',
    },
    heroContent: {
      maxWidth: '1200px',
      textAlign: 'center' as const,
      position: 'relative' as const,
      zIndex: 10,
    },
    h1: {
      fontSize: '4.5rem',
      fontWeight: 800,
      lineHeight: 1.1,
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #667eea 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      fontSize: '1.5rem',
      color: '#5a5a6a',
      marginBottom: '3rem',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    ctaButtons: {
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
    btnPrimary: {
      padding: '1rem 2.5rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
    },
    btnSecondary: {
      padding: '1rem 2.5rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: 'white',
      color: '#667eea',
      border: '2px solid #667eea',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    },
    features: {
      padding: '6rem 5%',
      maxWidth: '1400px',
      margin: '0 auto',
      background: 'white',
    },
    sectionTitle: {
      textAlign: 'center' as const,
      fontSize: '3rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: '#1a1a1a',
    },
    sectionSubtitle: {
      textAlign: 'center' as const,
      color: '#5a5a6a',
      fontSize: '1.2rem',
      marginBottom: '4rem',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2.5rem',
    },
    featureCard: {
      background: 'white',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '20px',
      padding: '2.5rem',
      transition: 'all 0.3s',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
    },
    featureIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      marginBottom: '1.5rem',
    },
    stats: {
      padding: '6rem 5%',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '3rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    statItem: {
      textAlign: 'center' as const,
    },
    statNumber: {
      fontSize: '3.5rem',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: '#5a5a6a',
      fontSize: '1.1rem',
    },
    ctaSection: {
      padding: '8rem 5%',
      textAlign: 'center' as const,
      background: 'white',
    },
    footer: {
      padding: '4rem 5% 3rem',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      textAlign: 'center' as const,
      color: '#5a5a6a',
      background: '#fafbff',
    },
    footerLogo: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGradient}></div>
      <div style={styles.bgPattern}></div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <img 
            style={styles.logoImg}
            src="AmazingCubeFullLogo.png" // Use relative path for Vercel compatibility
            alt="Amazing Cube"
          />
        </div>
        <ul style={styles.navLinks}>
          <li style={styles.dropdown}>
            <div 
              style={styles.dropdownToggle}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Solutions <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem' }}>▼</span>
            </div>
            <div style={styles.dropdownMenu}>
              <div 
                style={styles.dropdownItem}
                onClick={() => handleSolutionClick('HRMS')}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                HRMS
              </div>
              <div 
                style={styles.dropdownItem}
                onClick={() => { setIsDropdownOpen(false); handleNavigate('/wip'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                CRM AI Chatbot
              </div>
              <div 
                style={styles.dropdownItem}
                onClick={() => { setIsDropdownOpen(false); handleNavigate('/Business_Intelligent'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Analytic Solution
              </div>
              <div 
                style={styles.dropdownItem}
                onClick={() => { setIsDropdownOpen(false); handleNavigate('/learning'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Learning & Development
              </div>
            </div>
          </li>
          <li>
            <a href="#features" style={styles.navItem} onClick={(e) => smoothScroll(e, '#features')}>
              Features
            </a>
          </li>
          <li>
            <a href="#about" style={styles.navItem}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" style={styles.navItem} onClick={(e) => smoothScroll(e, '#contact')}>
              Contact
            </a>
          </li>
          <li style={styles.dropdown}>
            <div 
              style={{ ...styles.btnLogin, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setIsDropdownOpenLogin(!isDropdownOpenLogin)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              Login <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem' }}>▼</span>
            </div>
            <div style={{
              ...styles.dropdownMenu,
              minWidth: '160px',
              marginTop: '0.5rem',
              left: 0,
              opacity: isDropdownOpenLogin ? 1 : 0,
              visibility: isDropdownOpenLogin ? 'visible' : 'hidden',
              transform: isDropdownOpenLogin ? 'translateY(0)' : 'translateY(-10px)',
            }}>
              <div 
                style={styles.dropdownItem}
                //onClick={() => { setIsDropdownOpenLogin(false); handleNavigate('/login-business'); }}
                onClick={() => { setIsDropdownOpenLogin(false); window.open('https://hrms.amazingcube.com.my', '_blank'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Business
              </div>
              <div 
                style={styles.dropdownItem}
                onClick={() => { setIsDropdownOpenLogin(false); window.open('https://ess.amazingcube.com.my', '_blank'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Employee
              </div>
              <div 
                style={styles.dropdownItem}
                onClick={() => { setIsDropdownOpenLogin(false); handleNavigate('/login-community'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Community
              </div>
            </div>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroCube}>
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'rotateCube 12s infinite linear',
          }}>
            <style>{`
              @keyframes rotateCube {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
              }
            `}</style>
            {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
              <div key={face} style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                background: 'rgba(102, 126, 234, 0.03)',
                backdropFilter: 'blur(10px)',
                transform: 
                  face === 'front' ? 'translateZ(150px)' :
                  face === 'back' ? 'rotateY(180deg) translateZ(150px)' :
                  face === 'right' ? 'rotateY(90deg) translateZ(150px)' :
                  face === 'left' ? 'rotateY(-90deg) translateZ(150px)' :
                  face === 'top' ? 'rotateX(90deg) translateZ(150px)' :
                  'rotateX(-90deg) translateZ(150px)',
              }} />
            ))}
          </div>
        </div>
        <div style={styles.heroContent}>
          <h1 style={styles.h1}>Transform Your Business with Intelligent AI Solutions</h1>
          <p style={styles.subtitle}>
            Empower your enterprise with cutting-edge AI systems that automate workflows, 
            enhance decision-making, and drive unprecedented growth.
          </p>
{/*}
          <div style={styles.ctaButtons}>
            <button 
              style={styles.btnPrimary} 
              onClick={() => handleNavigate('/get-started')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
              }}
            >
              Get Started
            </button>
            <button 
              style={styles.btnSecondary} 
              onClick={() => handleNavigate('/demo')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.background = '#f8f9ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'white';
              }}
            >
              Watch Demo
            </button>
          </div>
*/}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features} id="features">
        <h2 style={styles.sectionTitle}>Powerful AI Solutions</h2>
        <p style={styles.sectionSubtitle}>
          Comprehensive business intelligence tools designed for modern enterprises
        </p>
        
        <div style={styles.featuresGrid}>
          {[
            { icon: '🧠', title: 'Intelligent Automation', desc: 'Streamline operations with AI-powered automation that learns and adapts to your business processes in real-time.' },
            { icon: '📊', title: 'Predictive Analytics', desc: 'Make data-driven decisions with advanced analytics that forecast trends and identify opportunities before they emerge.' },
            { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-level encryption and compliance with international standards ensure your data remains protected at all times.' },
            { icon: '⚡', title: 'Real-Time Processing', desc: 'Lightning-fast AI processing capabilities handle millions of transactions and queries simultaneously.' },
            { icon: '🔄', title: 'Seamless Integration', desc: 'Connect effortlessly with your existing tech stack through our robust API and integration framework.' },
            { icon: '📈', title: 'Scalable Infrastructure', desc: 'Grow without limits on our cloud-native platform that scales automatically with your business needs.' },
          ].map((feature, idx) => (
            <div 
              key={idx} 
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>{feature.title}</h3>
              <p style={{ color: '#5a5a6a', lineHeight: 1.7 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statsGrid}>
          {[
            { number: '99.9%', label: 'Uptime Guarantee' },
            { number: '500+', label: 'Enterprise Clients' },
            { number: '10M+', label: 'Daily Transactions' },
            { number: '24/7', label: 'Expert Support' },
          ].map((stat, idx) => (
            <div key={idx} style={styles.statItem}>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection} id="contact">
        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#1a1a1a' }}>
          Ready to Transform Your Business?
        </h2>
        <p style={{ fontSize: '1.3rem', color: '#5a5a6a', marginBottom: '3rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          Join hundreds of forward-thinking companies leveraging AI to revolutionize their 
          operations and accelerate growth.
        </p>
        <div style={styles.ctaButtons}>
          <button style={styles.btnPrimary} onClick={() => handleNavigate('/contact')}>
            Schedule a Demo
          </button>
          <button style={styles.btnSecondary} onClick={() => handleNavigate('/contact')}>
            Contact Sales
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>
          <img 
            style={{ width: "180px", height: "auto" }}
            src="AmazingCubeFullLogo.png" // Use relative path for Vercel compatibility
            alt="Amazing Cube"
          />
        </div>
        <p>&copy; 2025 Amazing Cube. All rights reserved. | Empowering businesses through intelligent automation.</p>
      </footer>
    </div>
  );
};

export default Homepage;