import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// ============================================
// EASY CONFIGURATION SECTION - EDIT HERE
// ============================================

// Course Categories Configuration
const courseCategories = Object.freeze([
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
]);

// Courses Configuration
const courses = Object.freeze([
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

]);

// ============================================
// END OF CONFIGURATION SECTION
// ============================================

const iconMap = {
  BookOpen: '📚',
  Users: '👥', 
  Brain: '🧠',
  TrendingUp: '📈'
};



const CourseCard = ({ course }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{course.title}</h3>
      <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>{course.description}</p>
      <div style={{ fontSize: '0.8rem', color: '#888' }}>
        Duration: {course.duration} | Level: {course.level}
        {course.hrdcClaimable && <span style={{ color: '#007bff', marginLeft: '10px' }}>HRDC Claimable</span>}
      </div>
    </div>
  );
};

const LearningDevelopmentPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  // Static mobile check - no state updates
  const isMobile = window.innerWidth < 768;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const searchFilteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f4ff, white, #f0f4ff)' }}>
      {/* Simple Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: '1rem 5%',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img 
            src="AmazingCubeFullLogo.png"
            alt="Amazing Cube"
            style={{ height: '40px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '20px'
            }}
          >
            Back to Home
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ paddingTop: '80px', padding: '80px 20px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: isMobile ? '2rem' : '3rem', 
            textAlign: 'center', 
            marginBottom: '1rem',
            color: '#1a1a1a'
          }}>
            Learning & Development
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#5a5a6a',
            fontSize: isMobile ? '1rem' : '1.25rem',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            Empowering organizations through world-class corporate training programs designed for the modern workforce
          </p>
          
          {/* HRDC Banner - CSS Background Images */}
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '15px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                backgroundImage: 'url(hrd_claimable.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                marginRight: '10px'
              }}></div>
              <div style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                backgroundImage: 'url(hrd_tp.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}></div>
            </div>
            <h3 style={{
              color: '#856404',
              margin: '0 0 10px 0',
              fontSize: '1.2rem'
            }}>
              HRDC Certified Training Provider
            </h3>
            <p style={{
              color: '#856404',
              margin: '0',
              fontSize: '0.9rem'
            }}>
              All eligible courses are claimable under HRD Corp scheme.
            </p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setActiveCategory('all')}
                style={{
                  padding: '0.5rem 1rem',
                  border: activeCategory === 'all' ? 'none' : '1px solid #ccc',
                  background: activeCategory === 'all' ? '#667eea' : 'white',
                  color: activeCategory === 'all' ? 'white' : '#333',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                All Courses
              </button>
              {courseCategories.map((category) => {
                const IconEmoji = iconMap[category.icon];
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: activeCategory === category.id ? 'none' : '1px solid #ccc',
                      background: activeCategory === category.id ? '#667eea' : 'white',
                      color: activeCategory === category.id ? 'white' : '#333',
                      borderRadius: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    {IconEmoji} {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {searchFilteredCourses.map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDevelopmentPage;