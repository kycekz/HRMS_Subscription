import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './community_imagewithfallback';
import { MessageSquare, BookMarked, Lightbulb, Users, Award, Globe, Search, BookOpen, Library, Rocket} from 'lucide-react';

const Community: React.FC = () => {
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

  const handleGoogleSignIn = () => {
    alert('Google Sign-In would be triggered here!\n\nIntegration steps:\n1. Set up Google OAuth in your backend\n2. Use Google Sign-In JavaScript library\n3. Handle authentication callback\n4. Create user session');
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
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <img 
            style={styles.logoImg}
            src="AmazingCubeFullLogo.png"
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
            <a style={styles.navItem} onClick={() => handleNavigate('/community')}>
              Community
            </a>
          </li>
          <li>
            <a href="#about" style={styles.navItem}>
              About
            </a>
          </li>
          <li>
            <a style={styles.navItem} onClick={() => handleNavigate('/contact')}>
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

      {/* Hero Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '120px 20px 40px' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Connect, Learn, and Grow Together
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#5a5a6a', lineHeight: 1.6 }}>
            Join our vibrant community platform where knowledge seekers and experts come together.
          </p>
          <p style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 40px', color: '#666', lineHeight: 1.8 }}>
            Discover resources, share insights, and build meaningful connections with like-minded individuals.
          </p>
          
          {/* Join Us Button */}
          <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => handleNavigate('/community_login')}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              Join us now
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '24rem', margin: '0 auto' }}>
            <div>
              <div style={{ color: '#667eea', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>10K+</div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>Members</div>
            </div>
            <div>
              <div style={{ color: '#667eea', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>5K+</div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>Resources</div>
            </div>
            <div>
              <div style={{ color: '#667eea', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>50+</div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>Topics</div>
            </div>
          </div>

        </div>




        {/* Hero Grid with Image and Auth Form */}
        <div style={{ display: 'grid', alignItems: 'start', marginBottom: '5rem' }}>
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', justifyContent: 'center' }}>
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1691849098270-c32749424a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2MjY2OTE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Community collaboration"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
            
            {/* Floating Cards */}
            <div style={{
              position: 'absolute',
              top: '-1rem',
              left: '-1rem',
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search size={20} color="#16a34a" />
              </div>
              <div>
                <div style={{ color: '#1a1a1a', fontWeight: '600', fontSize: '0.875rem' }}>Search Knowledge</div>
                <div style={{ color: '#666', fontSize: '0.75rem' }}>Find answers instantly</div>
              </div>
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '-1rem',
              right: '-1rem',
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: '#e9d5ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={20} color="#9333ea" />
              </div>
              <div>
                <div style={{ color: '#1a1a1a', fontWeight: '600', fontSize: '0.875rem' }}>Share Resources</div>
                <div style={{ color: '#666', fontSize: '0.75rem' }}>Contribute to the community</div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Features Section */}
        <div style={{ padding: '5rem 0', background: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem' }}>
              Everything You Need to Learn and Share
            </h2>
            <p style={{ color: '#666', maxWidth: '32rem', margin: '0 auto' }}>
              Our platform provides all the tools and features you need to discover knowledge, 
              connect with experts, and contribute to a thriving learning community.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '5rem' }}>
            {[
              { icon: Library, title: 'Learn at Your Pace', desc: 'Access high-quality courses on HR management, business development, career advancement, and more. Learn anytime, anywhere with our flexible platform.', color: '#6366f1' },
              { icon: MessageSquare, title: 'Community Discussions', desc: 'Engage in meaningful conversations with experts and peers in your field of interest.', color: '#3b82f6' },
              { icon: BookMarked, title: 'Resource Library', desc: 'Access a curated collection of articles, guides, and learning materials.', color: '#10b981' },
              { icon: Lightbulb, title: 'Knowledge Sharing', desc: 'Share your expertise and learn from others in a collaborative environment.', color: '#f59e0b' },
              { icon: Users, title: 'Expert Network', desc: 'Connect with industry professionals and thought leaders in your domain, and build meaningful relationships that accelerate your career growth.', color: '#8b5cf6' },
              { icon: Award, title: 'Skill Recognition', desc: 'Earn badges and recognition for your contributions to the community.', color: '#ef4444' },
              { icon: Rocket, title: 'Career Advancement', desc: 'Stay ahead with industry trends, best practices, and expert insights that help you advance in your career or business.', color: '#ef4444' },
              { icon: Globe, title: 'Global Community', desc: 'Join a diverse, worldwide network of learners and knowledge sharers.', color: '#6366f1' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: `${feature.color}15`,
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <Icon size={24} color={feature.color} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '15px', color: '#333' }}>{feature.title}</h3>
                  <p style={{ color: '#666', lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Learn From the Best Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
            <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1585909694668-0a6e0ddbfe8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbm93bGVkZ2UlMjBzaGFyaW5nfGVufDF8fHx8MTc2Mjc1MDMyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Knowledge sharing"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            
            <div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem' }}>
                Learn From the Best
              </h2>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                Our community is built on the principle of collective intelligence. Whether you're 
                a beginner seeking guidance or an expert wanting to share your knowledge, you'll 
                find your place here.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Peer-to-peer learning', desc: 'Learn directly from community members' },
                  { title: 'Verified resources', desc: 'Access quality-checked materials and guides' },
                  { title: 'Active mentorship', desc: 'Get guidance from experienced mentors' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      background: '#dcfce7',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.125rem'
                    }}>
                      <div style={{ width: '0.5rem', height: '0.5rem', background: '#16a34a', borderRadius: '50%' }}></div>
                    </div>
                    <div>
                      <div style={{ color: '#1a1a1a', fontWeight: '600' }}>{item.title}</div>
                      <div style={{ color: '#666', fontSize: '0.875rem' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Choose Your Journey Section */}
          <div style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)', borderRadius: '30px', border: '1px solid rgba(0, 0, 0, 0.08)', margin: '5rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem' }}>Choose Your Journey</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{
                background: 'white',
                borderRadius: '25px',
                padding: '3rem',
                boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', textAlign: 'center' }}>🎯</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>Join as a Learner</h3>
                <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '2rem', textAlign: 'center' }}>
                  Start your learning journey today and unlock your potential with courses designed by industry experts.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'Access to all course materials',
                    'Interactive learning experience', 
                    'Progress tracking & certificates',
                    'Community discussion forums',
                    'Lifetime access to purchased courses'
                  ].map((benefit, idx) => (
                    <li key={idx} style={{ color: '#555', marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#667eea', fontWeight: 'bold' }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '25px',
                padding: '3rem',
                boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', textAlign: 'center' }}>👨🏫</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>Become a Trainer</h3>
                <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '2rem', textAlign: 'center' }}>
                  Share your expertise, build your brand, and earn while making a difference in people's careers.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'Create and publish your own courses',
                    'Earn revenue from your content',
                    'Build your professional brand',
                    'Analytics dashboard for insights',
                    'Support from our team'
                  ].map((benefit, idx) => (
                    <li key={idx} style={{ color: '#555', marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#667eea', fontWeight: 'bold' }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;