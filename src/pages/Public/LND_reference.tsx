import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Brain, TrendingUp, CheckCircle, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// ============================================
// EASY CONFIGURATION SECTION - EDIT HERE
// ============================================

// Course Categories Configuration
const courseCategories = [
  {
    id: 'technical',
    name: 'Technical Skills',
    icon: 'BookOpen',
    color: 'from-indigo-500 to-purple-600',
    description: 'Master cutting-edge technical competencies'
  },
  {
    id: 'soft',
    name: 'Soft Skills',
    icon: 'Users',
    color: 'from-blue-500 to-blue-600',
    description: 'Enhance interpersonal and leadership abilities'
  },
  {
    id: 'ai',
    name: 'AI & Innovation',
    icon: 'Brain',
    color: 'from-purple-600 to-indigo-500',
    description: 'Leverage AI for business transformation'
  },
  {
    id: 'competency',
    name: 'Competency Development',
    icon: 'TrendingUp',
    color: 'from-blue-600 to-blue-500',
    description: 'Build core professional competencies'
  }
];

// Courses Configuration
const courses = [
  // Technical Skills
  {
    category: 'technical',
    title: 'Advanced Data Analytics with Python',
    duration: '3 Days',
    level: 'Intermediate',
    hrdcClaimable: true,
    description: 'Master data analysis techniques using Python, pandas, and visualization libraries. Learn to extract insights from complex datasets and create compelling data stories.',
    highlights: [
      'Data manipulation with Pandas',
      'Statistical analysis fundamentals',
      'Data visualization with Matplotlib & Seaborn',
      'Real-world case studies'
    ]
  },
  {
    category: 'technical',
    title: 'Micrsoft Excel with VBA',
    duration: '2 Days',
    level: 'Intermediate',
    hrdcClaimable: true,
    description: 'Master Excel techniques using Visual Basic Application. Learn to build basic functionalities with Excel for day to day tasks.',
    highlights: [
      'Programing fundamentals',
      'Visual basic programming',
      'Use case for Excel VBA',
      'Real-world case studies'
    ]
  },
  {
    category: 'technical',
    title: 'Cloud Computing Essentials (AWS/Azure)',
    duration: '2 Days',
    level: 'Beginner',
    hrdcClaimable: true,
    description: 'Understand cloud infrastructure, deployment models, and best practices for migrating applications to the cloud.',
    highlights: [
      'Cloud architecture fundamentals',
      'AWS/Azure core services',
      'Cost optimization strategies',
      'Security best practices'
    ]
  },
  {
    category: 'technical',
    title: 'Cybersecurity Fundamentals for Business',
    duration: '2 Days',
    level: 'Beginner',
    hrdcClaimable: true,
    description: 'Protect your organization from cyber threats with practical security measures and risk management strategies.',
    highlights: [
      'Threat landscape overview',
      'Network security basics',
      'Incident response procedures',
      'Compliance requirements'
    ]
  },
  // Soft Skills
  {
    category: 'soft',
    title: 'Effective Leadership in the Digital Age',
    duration: '2 Days',
    level: 'All Levels',
    hrdcClaimable: true,
    description: 'Develop leadership skills essential for managing teams in modern, technology-driven workplaces.',
    highlights: [
      'Leadership styles and adaptability',
      'Remote team management',
      'Change management strategies',
      'Building high-performance cultures'
    ]
  },
  {
    category: 'soft',
    title: 'Strategic Communication & Presentation Skills',
    duration: '2 Days',
    level: 'All Levels',
    hrdcClaimable: true,
    description: 'Master the art of persuasive communication and deliver impactful presentations that drive action.',
    highlights: [
      'Audience analysis techniques',
      'Storytelling for business',
      'Visual presentation design',
      'Handling difficult questions'
    ]
  },
  {
    category: 'soft',
    title: 'Emotional Intelligence for Professionals',
    duration: '1 Day',
    level: 'All Levels',
    hrdcClaimable: true,
    description: 'Enhance workplace relationships and performance through improved emotional awareness and management.',
    highlights: [
      'Self-awareness development',
      'Empathy and social skills',
      'Conflict resolution',
      'Stress management techniques'
    ]
  },
  // AI & Innovation
  {
    category: 'ai',
    title: 'AI in Business: Practical Applications',
    duration: '2 Days',
    level: 'Beginner',
    hrdcClaimable: true,
    description: 'Discover how to leverage AI tools and technologies to drive efficiency, innovation, and competitive advantage in your organization.',
    highlights: [
      'AI fundamentals for business leaders',
      'Use cases across industries',
      'ChatGPT and Generative AI applications',
      'AI implementation roadmap'
    ]
  },
  {
    category: 'ai',
    title: 'Prompt Engineering & AI Tool Mastery',
    duration: '1 Day',
    level: 'Beginner',
    hrdcClaimable: true,
    description: 'Learn to craft effective prompts and maximize productivity using AI assistants like ChatGPT, Claude, and specialized tools.',
    highlights: [
      'Advanced prompt engineering techniques',
      'AI tool selection and comparison',
      'Workflow automation with AI',
      'Ethical AI usage guidelines'
    ]
  },
  {
    category: 'ai',
    title: 'Machine Learning for Business Analysts',
    duration: '3 Days',
    level: 'Intermediate',
    hrdcClaimable: true,
    description: 'Understand ML concepts and learn to identify opportunities for ML implementation in business processes.',
    highlights: [
      'ML algorithms overview',
      'Predictive analytics applications',
      'Model evaluation basics',
      'Business case development'
    ]
  },
  // Competency Development
  {
    category: 'competency',
    title: 'Project Management Professional (PMP) Prep',
    duration: '5 Days',
    level: 'Intermediate',
    hrdcClaimable: true,
    description: 'Comprehensive preparation for PMP certification covering PMBOK framework and best practices.',
    highlights: [
      'PMBOK 7th Edition coverage',
      'Agile and hybrid approaches',
      'Risk and stakeholder management',
      'Practice exams and simulations'
    ]
  },
  {
    category: 'competency',
    title: 'Business Process Optimization',
    duration: '2 Days',
    level: 'Intermediate',
    hrdcClaimable: true,
    description: 'Learn to analyze, redesign, and optimize business processes for maximum efficiency and value.',
    highlights: [
      'Process mapping techniques',
      'Lean Six Sigma principles',
      'Performance metrics design',
      'Change implementation strategies'
    ]
  },
  {
    category: 'competency',
    title: 'Financial Acumen for Non-Finance Managers',
    duration: '2 Days',
    level: 'Beginner',
    hrdcClaimable: true,
    description: 'Develop essential financial literacy to make better business decisions and communicate effectively with finance teams.',
    highlights: [
      'Reading financial statements',
      'Budgeting and forecasting',
      'ROI and financial metrics',
      'Cost-benefit analysis'
    ]
  },
  {
    category: 'technical',
    title: 'e-Invoice for Small Businesses',
    duration: '1 Days',
    level: 'Beginner',
    hrdcClaimable: true,
    description: 'Develop essential knowledge on e-invoice for LHDN submisstion to ensure compliance to regulation.',
    highlights: [
      'Understanding e-invoice',
      'Compliance and regulations',
      'Impact to business',
      'Implementing e-invoice'
    ]
  }

];

// ============================================
// END OF CONFIGURATION SECTION
// ============================================

const iconMap = {
  BookOpen,
  Users,
  Brain,
  TrendingUp
};


interface Course {
  category: string;
  title: string;
  duration: string;
  level: string;
  hrdcClaimable: boolean;
  description: string;
  highlights: string[];
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = React.memo(({ course }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-500 group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
          {course.hrdcClaimable && (
            <span className="ml-3 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full whitespace-nowrap shadow-lg">
              HRDC Claimable
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1.5 text-indigo-600" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Award className="w-4 h-4 mr-1.5 text-indigo-600" />
            <span>{course.level}</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-indigo-600 hover:text-purple-600 font-semibold text-sm transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              View Details
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Key Highlights:</h4>
            <ul className="space-y-2">
              {course.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

const LearningDevelopmentPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenLogin, setIsDropdownOpenLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Add search term state
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
      handleNavigate('/Busienss_Intelligent');
    } else if (solution === 'Learning & Development') {
      handleNavigate('/learning');
    }
  };

  const styles = {
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

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  // Further filter by search term
  const searchFilteredCourses = filteredCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.highlights.some(highlight => highlight.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
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
            <a style={styles.navItem} onClick={() => handleNavigate('/#features')}>
              Features
            </a>
          </li>
          <li>
            <a style={styles.navItem}>
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

      {/* Add padding to account for fixed navigation */}
      <div className="pt-20">
        {/* Header Section */}
        <div className="relative overflow-hidden" style={{ background: 'white' }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4" style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #667eea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Learning & Development</h1>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: '#5a5a6a' }}>
                Empowering organizations through world-class corporate training programs designed for the modern workforce
              </p>
            </div>
          </div>
        </div>

        {/* HRDC Certification Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-y border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex gap-4">
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center border-2 border-orange-300">
                    <img src="hrd_claimable.png" alt="HRDC Claimable" className="h-16 w-16 object-contain" />
                  </div>
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center border-2 border-red-300">
                    <img src="hrd_tp.png" alt="HRDC Training Provider" className="h-16 w-16 object-contain" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">HRDC Certified Training Provider</h3>
                  <p className="text-gray-700">All our eligible courses are claimable under the HRD Corp scheme, helping you maximize your training investment.</p>
                </div>
              </div>
              <a 
                href="https://hrdcorp.gov.my/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 whitespace-nowrap hover:from-orange-600 hover:to-red-600"
              >
                Learn More About HRDC
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Training Categories</h2>
            <p className="text-center text-gray-600 text-lg mb-8">Choose your area of focus</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <button
                onClick={() => setActiveCategory('all')}
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  activeCategory === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-900 hover:shadow-lg border border-gray-200 hover:border-indigo-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">All</div>
                  <div className={`text-sm ${activeCategory === 'all' ? 'text-indigo-100' : 'text-gray-600'}`}>View All Courses</div>
                </div>
              </button>
              {courseCategories.map((category) => {
                const IconComponent = iconMap[category.icon];
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`p-6 rounded-2xl transition-all duration-300 ${
                      activeCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                        : 'bg-white text-gray-900 hover:shadow-lg border border-gray-200 hover:border-indigo-500'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <IconComponent className="w-8 h-8 mb-2" />
                      <div className="font-semibold text-center mb-1">{category.name}</div>
                      <div className={`text-xs text-center ${activeCategory === category.id ? 'text-white opacity-90' : 'text-gray-600'}`}>{category.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input - Added after category filter */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses by title, description, or keywords..."
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Course Listing */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {activeCategory === 'all' ? 'All Courses' : courseCategories.find(c => c.id === activeCategory)?.name}
              </h2>
              <span className="text-gray-600 font-medium">
                {searchFilteredCourses.length} {searchFilteredCourses.length === 1 ? 'course' : 'courses'} available
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchFilteredCourses.map((course) => (
                <CourseCard key={course.title} course={course} />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative overflow-hidden rounded-3xl p-12 text-white text-center shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-700">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Team?</h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Contact us today to discuss your training needs and discover how we can help your organization achieve its learning objectives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:scale-105"
                  onClick={() => handleNavigate('/contact')}
                >
                  Request Consultation
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300">
                  Download Course Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDevelopmentPage;