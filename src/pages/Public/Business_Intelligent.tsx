import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BISolutionProps {
  onNavigate?: (path: string) => void;
}

// AI Features Component
const AIFeaturesSection: React.FC = () => (
  <section style={{
    background: 'white',
    padding: 'clamp(60px, 10vw, 80px) 20px',
  }}>
    <h2 style={{
      textAlign: 'center',
      fontSize: 'clamp(2em, 4vw, 2.5em)',
      marginBottom: '20px',
      color: '#667eea',
      fontWeight: 700,
    }}>
      AI-Powered Intelligence
    </h2>
    <p style={{
      textAlign: 'center',
      color: '#718096',
      fontSize: 'clamp(1em, 2vw, 1.2em)',
      marginBottom: '50px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0 20px',
    }}>
      Leverage cutting-edge artificial intelligence to gain deeper insights, predict future trends, and identify issues before they impact your business
    </p>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* AI Feature 1: Natural Language Query */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>🤖 Ask AI Anything</h3>
          <p style={{ opacity: 0.9, fontSize: '0.95em' }}>Natural Language Query Interface</p>
        </div>
        <div style={{ padding: '25px', background: 'white' }}>
          <div style={{
            background: '#f7fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '1.5em' }}>💬</span>
            <div style={{ flex: 1, color: '#4a5568', fontStyle: 'italic', fontSize: '0.95em' }}>
              "Which region had the highest sales growth last quarter?"
            </div>
          </div>
          
          <div style={{
            background: 'white',
            border: '2px solid #667eea',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8em',
              marginBottom: '10px',
              fontWeight: 600,
            }}>
              AI Response
            </span>
            <div style={{ color: '#2d3748', lineHeight: 1.8, marginBottom: '15px', fontSize: '0.95em' }}>
              China region showed the highest sales growth at <strong>23.4%</strong> compared to Q2, driven primarily by increased demand in electronics and consumer goods categories.
            </div>
          </div>
        </div>
      </div>

      {/* AI Feature 2: Anomaly Detection */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>🔍 Anomaly Detection</h3>
          <p style={{ opacity: 0.9, fontSize: '0.95em' }}>Automatic Issue Identification & Root Cause</p>
        </div>
        <div style={{ padding: '25px', background: 'white' }}>
          <div style={{
            background: 'white',
            borderLeft: '4px solid #f56565',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginBottom: '15px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '0.95em' }}>
                ⚠️ Sales Drop - Europe
              </div>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.75em',
                fontWeight: 600,
                background: '#fed7d7',
                color: '#c53030',
              }}>
                CRITICAL
              </span>
            </div>
            <div style={{ fontSize: '0.85em', color: '#718096', lineHeight: 1.6 }}>
              Sales decreased by 18% in the last 7 days.
            </div>
            <div style={{
              background: '#f7fafc',
              padding: '10px',
              borderRadius: '6px',
              marginTop: '10px',
              fontSize: '0.85em',
              color: '#4a5568',
            }}>
              <span style={{ fontWeight: 600, color: '#667eea', display: 'block', marginBottom: '5px' }}>
                AI Root Cause:
              </span>
              Correlates with 23% competitor price reduction. Recommend immediate pricing review.
            </div>
          </div>

          <div style={{
            background: 'white',
            borderLeft: '4px solid #ed8936',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '0.95em' }}>
                📦 Inventory Spike - Product A
              </div>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.75em',
                fontWeight: 600,
                background: '#feebc8',
                color: '#c05621',
              }}>
                HIGH
              </span>
            </div>
            <div style={{ fontSize: '0.85em', color: '#718096', lineHeight: 1.6 }}>
              Stock levels 45% above threshold in China.
            </div>
            <div style={{
              background: '#f7fafc',
              padding: '10px',
              borderRadius: '6px',
              marginTop: '10px',
              fontSize: '0.85em',
              color: '#4a5568',
            }}>
              <span style={{ fontWeight: 600, color: '#667eea', display: 'block', marginBottom: '5px' }}>
                AI Insight:
              </span>
              Consider promotional campaign or redistribution to high-demand regions.
            </div>
          </div>
        </div>
      </div>

      {/* AI Feature 3: Predictive Analytics */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>📈 Predictive Analytics</h3>
          <p style={{ opacity: 0.9, fontSize: '0.95em' }}>AI-Powered Forecasting & Insights</p>
        </div>
        <div style={{ padding: '25px', background: 'white' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div style={{ fontSize: '1.1em', color: '#2d3748', fontWeight: 600 }}>
              30-Day Sales Forecast
            </div>
            <span style={{
              background: '#c6f6d5',
              color: '#22543d',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.85em',
              fontWeight: 600,
            }}>
              89% Confidence
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '10px',
              padding: '10px',
              background: '#f7fafc',
              borderRadius: '6px',
            }}>
              <span style={{ fontSize: '1.2em' }}>📊</span>
              <div style={{ flex: 1, fontSize: '0.9em', color: '#4a5568' }}>
                <strong>Projected Sales:</strong> $2.8M (+16.7%) with seasonal surge expected in weeks 4-5.
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '10px',
              padding: '10px',
              background: '#f7fafc',
              borderRadius: '6px',
            }}>
              <span style={{ fontSize: '1.2em' }}>⚠️</span>
              <div style={{ flex: 1, fontSize: '0.9em', color: '#4a5568' }}>
                <strong>Risk Alert:</strong> Europe likely to miss Q4 target by 8%. Recommend $45K marketing spend.
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '10px',
              padding: '10px',
              background: '#f7fafc',
              borderRadius: '6px',
            }}>
              <span style={{ fontSize: '1.2em' }}>💡</span>
              <div style={{ flex: 1, fontSize: '0.9em', color: '#4a5568' }}>
                <strong>Opportunity:</strong> China demand for Product C projected to surge 34%.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Key Features Component
const KeyFeaturesSection: React.FC = () => (
  <section style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(60px, 10vw, 80px) 20px',
  }}>
    <h2 style={{
      textAlign: 'center',
      fontSize: 'clamp(2em, 4vw, 2.5em)',
      marginBottom: '50px',
      color: '#667eea',
      fontWeight: 700,
    }}>
      Comprehensive BI Capabilities
    </h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
    }}>
      {[
        { icon: '🌐', title: 'Centralized Analytics', desc: 'Integrate data from multiple regional ERP systems into one unified platform, eliminating data silos.' },
        { icon: '⚡', title: 'Real-Time Synchronization', desc: 'Access up-to-the-minute insights with automated data synchronization powered by AI-driven workflows.' },
        { icon: '🎯', title: 'Data Harmonization', desc: 'Overcome inconsistent data structures with intelligent mapping and AI-powered cleansing.' },
        { icon: '📊', title: 'Custom Dashboards', desc: 'Leverage bespoke visualizations delivering interactive insights tailored to your business needs.' },
      ].map((feature, index) => (
        <div key={index} style={{
          background: 'white',
          padding: '40px 30px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s',
          borderTop: '4px solid #667eea',
        }}>
          <span style={{ fontSize: '3em', marginBottom: '20px', display: 'block' }}>{feature.icon}</span>
          <h3 style={{ fontSize: '1.5em', marginBottom: '15px', color: '#667eea' }}>{feature.title}</h3>
          <p style={{ color: '#666', lineHeight: 1.8 }}>{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// Architecture Component
const ArchitectureSection: React.FC = () => (
  <section style={{
    background: 'white',
    padding: 'clamp(60px, 10vw, 80px) 20px',
  }}>
    <h2 style={{
      textAlign: 'center',
      fontSize: 'clamp(2em, 4vw, 2.5em)',
      marginBottom: '50px',
      color: '#667eea',
      fontWeight: 700,
    }}>
      Robust Architecture
    </h2>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1000px',
      margin: '0 auto',
      flexWrap: 'wrap',
      gap: '20px',
    }}>
      {[
        { title: 'Source Systems', desc: 'Regional ERPs & Data Sources' },
        { title: 'ETL Layer', desc: 'Extract, Transform, Load' },
        { title: 'Data Warehouse', desc: 'Centralized Repository' },
        { title: 'BI Dashboard', desc: 'Visual Insights' },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <div style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
            flex: 1,
            minWidth: '200px',
            border: '2px solid #667eea',
            transition: 'all 0.3s',
          }}>
            <h4 style={{ color: '#667eea', marginBottom: '10px', fontSize: '1.2em' }}>{item.title}</h4>
            <p style={{ color: '#4a5568', fontSize: '0.9em' }}>{item.desc}</p>
          </div>
          {index < 3 && (
            <div style={{
              fontSize: '2em',
              color: '#667eea',
              margin: '0 10px',
            }}>
              →
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </section>
);

// KPI Section Component
const KPISection: React.FC = () => (
  <section style={{
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: 'clamp(60px, 10vw, 80px) 20px',
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: 'clamp(2em, 4vw, 2.5em)',
        marginBottom: '40px',
        color: '#2d3748',
        fontWeight: 700,
      }}>
        Critical Performance Metrics
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px',
      }}>
        {[
          { icon: '📈', title: 'Sales Analytics', desc: 'Track performance by region, product line, and time period to identify growth opportunities' },
          { icon: '📦', title: 'Inventory Optimization', desc: 'Monitor turnover rates and reduce carrying costs with intelligent stock management' },
          { icon: '⚙️', title: 'Productivity Tracking', desc: 'Compare actual vs target performance to pinpoint efficiency improvements' },
          { icon: '💰', title: 'Profitability Analysis', desc: 'Visualize profit distribution across products, regions, and customer segments' },
        ].map((kpi, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 20px rgba(102,126,234,0.3)',
            transition: 'all 0.3s',
          }}>
            <h4 style={{ fontSize: '1.3em', marginBottom: '10px' }}>{kpi.icon} {kpi.title}</h4>
            <p style={{ opacity: 0.9, fontSize: '0.95em' }}>{kpi.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Tech Stack Component
const TechStackSection: React.FC = () => (
  <section style={{
    background: 'white',
    padding: 'clamp(60px, 10vw, 80px) 20px',
  }}>
    <h2 style={{
      textAlign: 'center',
      fontSize: 'clamp(2em, 4vw, 2.5em)',
      marginBottom: '50px',
      color: '#667eea',
      fontWeight: 700,
    }}>
      Modern Technology Stack
    </h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      {[
        { title: 'Cloud Storage', desc: 'AWS S3, Azure Blob, or Google Cloud for scalable data lake infrastructure' },
        { title: 'ETL & Automation', desc: 'Python, Node.js, and N8N for robust data pipelines and workflow automation' },
        { title: 'Custom BI Layer', desc: 'Vue.js, Tailwind CSS, and D3.js for highly interactive dashboard experiences' },
        { title: 'Database Solutions', desc: 'PostgreSQL and MongoDB for reliable structured and unstructured data storage' },
        { title: 'AI & Machine Learning', desc: 'Advanced AI models for predictive analytics, anomaly detection, and NLP' },
      ].map((tech, index) => (
        <div key={index} style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          borderLeft: '4px solid #667eea',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s',
        }}>
          <h4 style={{ color: '#667eea', marginBottom: '10px', fontSize: '1.2em' }}>{tech.title}</h4>
          <p style={{ color: '#4a5568', fontSize: '0.95em' }}>{tech.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// Benefits Component
const BenefitsSection: React.FC = () => (
  <section style={{
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: 'clamp(60px, 10vw, 80px) 20px',
  }}>
    <h2 style={{
      textAlign: 'center',
      fontSize: 'clamp(2em, 4vw, 2.5em)',
      marginBottom: '50px',
      color: '#2d3748',
      fontWeight: 700,
    }}>
      Why Choose Our Solution
    </h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      {[
        { icon: '🚀', title: 'Rapid Deployment', desc: 'Phased implementation approach with delivery in just 16 weeks, allowing for iterative feedback.' },
        { icon: '🔧', title: 'Flexible Integration', desc: 'Multiple ETL strategies including API integration, direct database access, and spreadsheet uploads.' },
        { icon: '🤖', title: 'AI-Powered Insights', desc: 'Leverage AI for automated data cleansing, anomaly detection, predictive forecasting, and natural language querying.' },
        { icon: '📱', title: 'Enterprise-Grade Quality', desc: 'Real-time data quality monitoring, comprehensive testing, and user training for reliable insights.' },
      ].map((benefit, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'start',
          gap: '20px',
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        }}>
          <span style={{
            fontSize: '2.5em',
            color: '#667eea',
            flexShrink: 0,
          }}>
            {benefit.icon}
          </span>
          <div>
            <h4 style={{ color: '#667eea', marginBottom: '10px', fontSize: '1.3em' }}>{benefit.title}</h4>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{benefit.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Main BISolution Component
const BISolution: React.FC<BISolutionProps> = ({ onNavigate }) => {
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
      handleNavigate('/bi-solution');
    } else if (solution === 'Learning & Development') {
      handleNavigate('/learning');
    }
  };

  const navStyles = {
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
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif' }}>
      {/* Navigation */}
      <nav style={navStyles.nav}>
        <div style={navStyles.logo} onClick={() => navigate('/')}>
          <img 
            style={navStyles.logoImg}
            src="AmazingCubeFullLogo.png"
            alt="Amazing Cube"
          />
        </div>
        <ul style={navStyles.navLinks}>
          <li style={navStyles.dropdown}>
            <div 
              style={navStyles.dropdownToggle}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Solutions <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem' }}>▼</span>
            </div>
            <div style={navStyles.dropdownMenu}>
              <div 
                style={navStyles.dropdownItem}
                onClick={() => handleSolutionClick('HRMS')}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                HRMS
              </div>
              <div 
                style={navStyles.dropdownItem}
                onClick={() => { setIsDropdownOpen(false); handleNavigate('/wip'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                CRM AI Chatbot
              </div>
              <div 
                style={navStyles.dropdownItem}
                onClick={() => { setIsDropdownOpen(false); handleNavigate('/bi-solution'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                BI Analytic Solution
              </div>
              <div 
                style={navStyles.dropdownItem}
                onClick={() => { setIsDropdownOpen(false); handleNavigate('/learning'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Learning & Development
              </div>
            </div>
          </li>
          <li>
            <a href="/#features" style={navStyles.navItem}>
              Features
            </a>
          </li>
          <li>
            <a href="/#about" style={navStyles.navItem}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" style={navStyles.navItem}>
              Contact
            </a>
          </li>
          <li style={navStyles.dropdown}>
            <div 
              style={{ ...navStyles.btnLogin, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
              ...navStyles.dropdownMenu,
              minWidth: '160px',
              marginTop: '0.5rem',
              left: 0,
              opacity: isDropdownOpenLogin ? 1 : 0,
              visibility: isDropdownOpenLogin ? 'visible' : 'hidden',
              transform: isDropdownOpenLogin ? 'translateY(0)' : 'translateY(-10px)',
            }}>
              <div 
                style={navStyles.dropdownItem}
                onClick={() => { setIsDropdownOpenLogin(false); window.open('https://hrms.amazingcube.com.my', '_blank'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Business
              </div>
              <div 
                style={navStyles.dropdownItem}
                onClick={() => { setIsDropdownOpenLogin(false); window.open('https://ess.amazingcube.com.my', '_blank'); }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Employee
              </div>
              <div 
                style={navStyles.dropdownItem}
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

      {/* BI Solution Content */}
      <div style={{ marginTop: '80px' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(\'data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>\')',
            opacity: 0.3,
          }}></div>
          
          <div style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            <h1 style={{
              fontSize: 'clamp(2em, 5vw, 3em)',
              marginBottom: '20px',
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}>
              AI-Powered Business Intelligence
            </h1>
            <p style={{
              fontSize: 'clamp(1em, 2.5vw, 1.3em)',
              marginBottom: '30px',
              opacity: 0.95,
            }}>
              Transform Your Global Operations with Unified Data Insights & Intelligent Analytics
            </p>
            <a 
              href="#contact" 
              style={{
                display: 'inline-block',
                padding: '15px 40px',
                background: 'white',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '1.1em',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              Get Started Today
            </a>
          </div>
        </section>

        {/* Dashboard Screenshot Section */}
        <section style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: 'clamp(40px, 10vw, 80px) 20px',
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(1.8em, 4vw, 2.5em)',
            marginBottom: '20px',
            color: '#2d3748',
            fontWeight: 700,
          }}>
            Powerful Interactive Dashboards
          </h2>
          
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            {/* Browser Header */}
            <div style={{
              background: '#2d3748',
              padding: '15px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
            </div>

            {/* Dashboard Content */}
            <div style={{
              background: '#f8f9fa',
              padding: 'clamp(20px, 5vw, 30px)',
            }}>
              {/* Dashboard Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '15px',
              }}>
                <div style={{
                  fontSize: 'clamp(1.2em, 3vw, 1.8em)',
                  color: '#2d3748',
                  fontWeight: 700,
                }}>
                  Global Performance Dashboard
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}>
                  <select style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #cbd5e0',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    color: '#4a5568',
                    cursor: 'pointer',
                  }}>
                    <option>All Regions</option>
                  </select>
                  <select style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #cbd5e0',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    color: '#4a5568',
                    cursor: 'pointer',
                  }}>
                    <option>Last 30 Days</option>
                  </select>
                </div>
              </div>

              {/* KPI Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}>
                {[
                  { label: 'Total Sales', value: '$2.4M', trend: '↑ 12.5%' },
                  { label: 'Inventory Turnover', value: '8.2x', trend: '↑ 5.3%' },
                  { label: 'Productivity', value: '92%', trend: '↑ 3.1%' },
                  { label: 'Forecast Accuracy', value: '87%', trend: '↑ 2.8%' },
                ].map((kpi, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  }}>
                    <div style={{
                      fontSize: '0.85em',
                      color: '#718096',
                      marginBottom: '8px',
                    }}>
                      {kpi.label}
                    </div>
                    <div style={{
                      fontSize: 'clamp(1.5em, 4vw, 2em)',
                      fontWeight: 700,
                      color: '#667eea',
                    }}>
                      {kpi.value}
                    </div>
                    <div style={{
                      fontSize: '0.85em',
                      color: '#48bb78',
                      marginTop: '5px',
                    }}>
                      {kpi.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {/* Bar Chart */}
                <div style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    fontSize: '1.1em',
                    color: '#2d3748',
                    marginBottom: '20px',
                    fontWeight: 600,
                  }}>
                    Sales by Region
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    height: '180px',
                    gap: '15px',
                    padding: '10px 0',
                  }}>
                    {[
                      { height: '85%', label: 'America' },
                      { height: '70%', label: 'Europe' },
                      { height: '95%', label: 'China' },
                      { height: '60%', label: 'Australia' },
                      { height: '55%', label: 'S. Africa' },
                    ].map((bar, index) => (
                      <div key={index} style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}>
                        <div style={{
                          width: '100%',
                          height: bar.height,
                          background: 'linear-gradient(to top, #667eea, #764ba2)',
                          borderRadius: '6px 6px 0 0',
                          transition: 'all 0.3s ease',
                        }}></div>
                        <div style={{
                          marginTop: '10px',
                          fontSize: '0.75em',
                          color: '#718096',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                        }}>
                          {bar.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    fontSize: '1.1em',
                    color: '#2d3748',
                    marginBottom: '20px',
                    fontWeight: 600,
                  }}>
                    Product Distribution
                  </div>
                  <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background: 'conic-gradient(#667eea 0deg 120deg, #764ba2 120deg 240deg, #48bb78 240deg 300deg, #ed8936 300deg 360deg)',
                    margin: '20px auto',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  }}></div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginTop: '15px',
                  }}>
                    {[
                      { color: '#667eea', label: 'Product A (33%)' },
                      { color: '#764ba2', label: 'Product B (33%)' },
                      { color: '#48bb78', label: 'Product C (17%)' },
                      { color: '#ed8936', label: 'Product D (17%)' },
                    ].map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.85em',
                      }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '3px',
                          background: item.color,
                        }}></div>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <AIFeaturesSection />

        {/* Key Features */}
        <KeyFeaturesSection />

        {/* Architecture */}
        <ArchitectureSection />

        {/* KPIs */}
        <KPISection />

        {/* Tech Stack */}
        <TechStackSection />

        {/* Benefits */}
        <BenefitsSection />

        {/* CTA Section */}
        <section id="contact" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: 'clamp(60px, 10vw, 80px) 20px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 'clamp(2em, 4vw, 2.5em)',
            marginBottom: '20px',
          }}>
            Ready to Transform Your Data?
          </h2>
          <p style={{
            fontSize: 'clamp(1em, 2vw, 1.2em)',
            marginBottom: '30px',
            opacity: 0.95,
          }}>
            Let's discuss how our AI-powered Business Intelligence solution can drive your business forward
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginTop: '30px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.1em',
            }}>
              <span>📧</span>
              <a href="mailto:enquiry@amazingcube.com.my" style={{ color: 'white', textDecoration: 'none' }}>
                enquiry@amazingcube.com.my
              </a>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.1em',
            }}>
              <span>📞</span>
              <a href="tel:+60162607076" style={{ color: 'white', textDecoration: 'none' }}>
                +60 16-260 7076
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BISolution;