import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Users, Brain, TrendingUp, CheckCircle, Clock, Award, ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { supabasewebsite } from '../../lib/supabasewebsite';

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

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Users,
  Brain,
  TrendingUp
};

interface Course {
  id: string;
  title: string;
  description: string;
  course_details: string;
  duration: string;
  category: string;
  level: string;
  hrdc_claimable: boolean;
  price: number;
  delivery_type: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = React.memo(({ course }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    window.open(`/course/${course.id}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-500 group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
          {course.hrdc_claimable && (
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
          onClick={handleViewDetails}
          className="flex items-center text-indigo-600 hover:text-purple-600 font-semibold text-sm transition-colors"
        >
          <ChevronDown className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );
});

const LearningDevelopment = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get unique categories from courses
  const availableCategories = useMemo(() => {
    const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
    return categories.sort();
  }, [courses]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses from database...');
        const { data, error } = await supabasewebsite
          .from('courses')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });
        
        console.log('Supabase response:', { data, error });
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Courses fetched:', data?.length || 0);
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to show empty state instead of loading forever
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const searchFilteredCourses = useMemo(() => {
    const filtered = activeCategory === 'all' 
      ? courses 
      : courses.filter(course => course.category === activeCategory);
    
    if (!searchTerm) return filtered;
    
    const searchLower = searchTerm.toLowerCase();
    return filtered.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      (course.course_details && course.course_details.toLowerCase().includes(searchLower))
    );
  }, [activeCategory, searchTerm, courses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
        <Navigation />
        <div className="flex items-center justify-center" style={{ paddingTop: '200px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

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
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: activeCategory === category ? 'none' : '1px solid #ccc',
                    background: activeCategory === category ? '#667eea' : 'white',
                    color: activeCategory === category ? 'white' : '#333',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  {category}
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
                {activeCategory === 'all' ? 'All Courses' : activeCategory}
              </h2>
              <span className="text-gray-600 font-medium">
                {searchFilteredCourses.length} {searchFilteredCourses.length === 1 ? 'course' : 'courses'} available
              </span>
            </div>
            
            {searchFilteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {courses.length === 0 ? 'No courses available' : 'No courses match your search'}
                </h3>
                <p className="text-gray-500">
                  {courses.length === 0 
                    ? 'Courses will be added soon. Please check back later.' 
                    : 'Try adjusting your search terms or category filter.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchFilteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDevelopment;