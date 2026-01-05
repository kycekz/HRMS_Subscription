import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
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
    navigate(path);
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

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: '1.5rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 1000,
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: scrolled ? '0 2px 20px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.03)',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '50px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <img 
          style={{ height: '50px', width: 'auto' }}
          src="AmazingCubeFullLogo.png"
          alt="Amazing Cube"
        />
      </div>
      <ul style={{
        display: 'flex',
        gap: '2.5rem',
        alignItems: 'center',
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}>
        <li style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#1a1a1a',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Solutions <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem' }}>▼</span>
          </div>
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '1rem',
            background: 'white',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            minWidth: '200px',
            opacity: isDropdownOpen ? 1 : 0,
            visibility: isDropdownOpen ? 'visible' : 'hidden',
            transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.3s',
          }}>
            <div 
              style={{ padding: '1rem 1.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => handleSolutionClick('HRMS')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              HRMS
            </div>
            <div 
              style={{ padding: '1rem 1.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => { setIsDropdownOpen(false); handleNavigate('/Business_Intelligent'); }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Analytic Solution
            </div>
            <div 
              style={{ padding: '1rem 1.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => { setIsDropdownOpen(false); handleNavigate('/learning'); }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Learning & Development
            </div>
          </div>
        </li>
        <li>
          <a style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleNavigate('/community')}>
            Community
          </a>
        </li>
        <li>
          <a style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
            About
          </a>
        </li>
        <li>
          <a style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleNavigate('/contact')}>
            Contact
          </a>
        </li>
        <li style={{ position: 'relative' }}>
          <div 
            style={{
              padding: '0.6rem 1.8rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={() => setIsDropdownOpenLogin(!isDropdownOpenLogin)}
          >
            Login <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem' }}>▼</span>
          </div>
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.5rem',
            background: 'white',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            minWidth: '160px',
            opacity: isDropdownOpenLogin ? 1 : 0,
            visibility: isDropdownOpenLogin ? 'visible' : 'hidden',
            transform: isDropdownOpenLogin ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.3s',
          }}>
            <div 
              style={{ padding: '1rem 1.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => { setIsDropdownOpenLogin(false); window.open('https://hrms.amazingcube.com.my', '_blank'); }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Business
            </div>
            <div 
              style={{ padding: '1rem 1.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => { setIsDropdownOpenLogin(false); window.open('https://ess.amazingcube.com.my', '_blank'); }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Employee
            </div>
            <div 
              style={{ padding: '1rem 1.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => { setIsDropdownOpenLogin(false); handleNavigate('/community_login'); }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Community
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;