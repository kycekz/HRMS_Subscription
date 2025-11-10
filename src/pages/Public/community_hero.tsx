import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, Users, BookOpen } from 'lucide-react';
import { AuthForm } from './AuthForm';

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" />
          <span className="text-gray-900">KnowledgeHub</span>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-gray-900 mb-6">
            Connect, Learn, and Grow Together
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Join our vibrant community platform where knowledge seekers and experts come together. 
            Discover resources, share insights, and build meaningful connections with like-minded individuals.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="text-blue-600 mb-1">10K+</div>
              <div className="text-gray-600">Members</div>
            </div>
            <div>
              <div className="text-blue-600 mb-1">5K+</div>
              <div className="text-gray-600">Resources</div>
            </div>
            <div>
              <div className="text-blue-600 mb-1">50+</div>
              <div className="text-gray-600">Topics</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-8 items-start">
          {/* Left: Picture */}
          <div className="relative order-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1691849098270-c32749424a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2MjY2OTE2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community collaboration"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-gray-900">Search Knowledge</div>
                <div className="text-gray-500">Find answers instantly</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-gray-900">Share Resources</div>
                <div className="text-gray-500">Contribute to the community</div>
              </div>
            </div>
          </div>

          {/* Right: Auth Form - Same vertical level as image */}
          <div className="order-2">
            <AuthForm />
          </div>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10"></div>
    </div>
  );
}
