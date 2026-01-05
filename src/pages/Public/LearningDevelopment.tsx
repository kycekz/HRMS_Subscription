import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Users, Brain, TrendingUp, CheckCircle, Clock, Award, ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';


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

const iconMap: Record<string, LucideIcon> = {
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

const LearningDevelopment = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const searchFilteredCourses = useMemo(() => {
    const filtered = activeCategory === 'all' 
      ? courses 
      : courses.filter(course => course.category === activeCategory);
    
    if (!searchTerm) return filtered;
    
    const searchLower = searchTerm.toLowerCase();
    return filtered.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.highlights.some(highlight => highlight.toLowerCase().includes(searchLower))
    );
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      <Navigation />

      {/* Content */}
      <div style={{ paddingTop: '100px', padding: '100px 20px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            textAlign: 'center', 
            marginBottom: '1rem',
            color: '#1a1a1a'
          }}>
            Learning & Development
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#5a5a6a',
            fontSize: '1.25rem',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            Empowering organizations through world-class corporate training programs designed for the modern workforce
          </p>

          {/* HRDC Certification Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-y border-orange-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center border-2 border-orange-300">
                      <img src="HRDCorp_Claimable.webp" alt="HRDC Claimable" className="h-16 w-16 object-contain" />
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
          
          <div style={{ marginBottom: '4rem', marginTop: '4rem' }}>
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
              {courseCategories.map((category) => (
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
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
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
        </div>
      </div>
    </div>
  );
};

export default LearningDevelopment;