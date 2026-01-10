
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle, Share2, ArrowLeft, Loader, MapPin, RefreshCw, LayoutDashboard, BarChart3, CheckSquare } from 'lucide-react';
import { supabasewebsite } from '../../lib/supabasewebsite';

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
  trainer_id: string;
  custom_branding_color?: string;
  thumbnail_url?: string;
}

interface ExtendedCourse extends Course {
    trainerEmail?: string;
    trainerName?: string;
    trainerId?: string;
    courseDetails?: string;
    customBrandingColor?: string;
    thumbnailUrl?: string;
    deliveryType?: string;
    hrdcClaimable?: boolean;
}

const PublicCoursePage: React.FC = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ExtendedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Analytics Tracking
  useEffect(() => {
    if (courseId) {
        const trackView = async () => {
            try {
                // Fire and forget - don't block the UI waiting for the counter
                await supabasewebsite.rpc('increment_course_view', { course_id: courseId });
            } catch (err) {
                // Silently fail if the analytics function hasn't been created in DB yet
                console.warn("Analytics tracking failed (Function might not exist yet)");
            }
        };
        trackView();
    }
  }, [courseId]);

  useEffect(() => {
    let isMounted = true;

    // Check Authentication Status
    const checkAuth = async () => {
        // For this environment, assume not logged in
        if (isMounted) setIsLoggedIn(false);
    };
    checkAuth();

    const fetchCourse = async () => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timed out')), 10000)
            );

            // Use supabasewebsite for fetching details
            const courseQuery = supabasewebsite
                .from('courses')
                .select('*, profiles(full_name, email)')
                .eq('id', courseId)
                .maybeSingle();

            const { data, error } = await Promise.race([courseQuery, timeoutPromise]) as any;

            if (error) throw error;

            if (isMounted && data) {
                setCourse({
                    ...data,
                    trainerId: data.trainer_id,
                    trainerName: data.profiles?.full_name || 'Trainer',
                    trainerEmail: data.profiles?.email,
                    courseDetails: data.course_details,
                    customBrandingColor: data.custom_branding_color,
                    thumbnailUrl: data.thumbnail_url,
                    deliveryType: data.delivery_type,
                    hrdcClaimable: data.hrdc_claimable,
                    level: data.level
                });
            }
        } catch (err: any) {
            console.error("Critical error fetching course page:", err);
            if (isMounted) setErrorMsg(err.message || "Failed to load course");
        } finally {
            if (isMounted) setLoading(false);
        }
    };
    fetchCourse();
    return () => { isMounted = false; };
  }, [courseId]);

  const handleShare = async () => {
    if (!course) return;
    const shareData = {
      title: course.title,
      text: `Check out this course: ${course.title} by ${course.trainerName}`,
      url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert('Course link copied to clipboard!');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
  };

  // Restore list styles for the public view if using rich text
  const displayStyles = `
    .course-details-view ul { list-style-type: disc; padding-left: 1.5em; margin: 0.5em 0; }
    .course-details-view ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
    .course-details-view li { margin-bottom: 0.25em; }
    .course-details-view p { margin-bottom: 0.75em; }
    .course-details-view strong, .course-details-view b { font-weight: 700; }
    .course-details-view em, .course-details-view i { font-style: italic; }
    .course-details-view h3 { font-size: 1.25em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.5em; color: #111827; }
  `;

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cube-600 mb-4"></div>
              <div className="text-gray-500 font-medium">Loading course...</div>
          </div>
      );
  }

  if (errorMsg) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
              <div className="text-red-500 mb-2 font-medium">Unable to load course</div>
              <div className="text-gray-500 text-sm mb-4">{errorMsg}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-sm"
              >
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </button>
              <Link to="/" className="text-cube-600 hover:underline mt-6 block text-sm">Return Home</Link>
          </div>
      );
  }

  if (!course) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                    <h2 className="text-2xl font-bold text-gray-900">Course Not Found</h2>
                    <p className="text-gray-500 mt-2">The course you are looking for does not exist or has been removed.</p>
                    <Link to="/" className="text-cube-600 hover:underline mt-4 block">Return Home</Link>
                </div>
            </div>
        </div>
    );
  }

  // Use the trainer's custom brand color or default to cube color
  const brandColor = course.customBrandingColor || '#0ea5e9';

  const handleEnroll = () => {
    if (!course.trainerEmail) {
        alert("Trainer email not available. Please try again later.");
        return;
    }
    const subject = encodeURIComponent(`Enrollment Enquiry: ${course.title}`);
    const body = encodeURIComponent(`Hi ${course.trainerName},\n\nI am interested in enrolling in your course "${course.title}".\n\nPlease let me know the next steps.`);
    window.location.href = `mailto:${course.trainerEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{displayStyles}</style>

      {/* Navigation Bar for Public View */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center text-gray-500 text-sm">
             <Link to="/learning-development" className="flex items-center hover:text-gray-900 mr-4">
                 <ArrowLeft className="w-4 h-4 mr-1" /> Back to Courses
             </Link>
             
             <span className="hidden sm:inline text-gray-400">|</span>
             <span className="hidden sm:inline ml-4 font-semibold text-gray-900">
                Course Details
             </span>
        </div>
      </div>

      {/* Brand Bar */}
      <div className="shadow-sm py-4 px-6 md:px-12 flex justify-between items-center bg-white" style={{ borderTop: `4px solid ${brandColor}`}}>
        <div className="flex items-center space-x-4">
             <span className="font-bold text-xl text-gray-800 tracking-tight">{course.trainerName} Academy</span>
        </div>
        <button 
            onClick={handleShare}
            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center"
        >
            <Share2 className="w-4 h-4 mr-2" /> Share
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gray-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <span style={{ color: brandColor }} className="font-bold tracking-wide uppercase text-sm mb-2 block">
                    {course.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                    {course.title}
                </h1>
                
                {/* Meta Data Row */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-600 mb-6">
                    <span className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                         <Clock className="w-4 h-4 mr-2 text-gray-400" /> {course.duration}
                    </span>
                    <span className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                         <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {course.deliveryType || 'Remote'}
                    </span>
                    <span className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                         <BarChart3 className="w-4 h-4 mr-2 text-gray-400" /> {course.level || 'All Level'}
                    </span>
                </div>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {course.description}
                </p>
                
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={handleEnroll}
                            style={{ backgroundColor: brandColor }} 
                            className="px-8 py-4 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition transform hover:-translate-y-1 flex items-center justify-center min-w-[200px]"
                        >
                            Enroll Now for ${course.price}
                        </button>
                        <button className="px-8 py-4 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                            Download Syllabus
                        </button>
                    </div>
                    
                    {course.hrdcClaimable && (
                        <div className="flex items-center text-green-700 font-bold bg-green-50 px-3 py-2 rounded-lg border border-green-200 w-fit mt-1">
                            <CheckSquare className="w-5 h-5 mr-2" />
                            <span>HRDC Claimable Course</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="relative">
                <div style={{ backgroundColor: brandColor }} className="absolute -inset-4 rounded-xl opacity-20 blur-lg transform rotate-2"></div>
                <img src={course.thumbnailUrl} alt={course.title} className="relative rounded-xl shadow-2xl w-full object-cover transform transition hover:scale-105 duration-500" />
            </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        {course.courseDetails ? (
           <>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Course Curriculum & Details</h2>
              <div 
                  className="text-gray-700 course-details-view text-lg leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: course.courseDetails }}
              />
           </>
        ) : (
            <>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">What You Will Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-start">
                            <CheckCircle style={{ color: brandColor }} className="w-6 h-6 mr-3 flex-shrink-0" />
                            <p className="text-gray-700">Detailed learning objective #{i} for this specific module.</p>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12 px-6 text-center">
          <p className="opacity-70">
              &copy; {new Date().getFullYear()} {course.trainerName}. Powered by <a href="https://community.amazingcube.com.my" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:underline">Amaze Community</a>.
          </p>
      </div>
    </div>
  );
};

export default PublicCoursePage;
