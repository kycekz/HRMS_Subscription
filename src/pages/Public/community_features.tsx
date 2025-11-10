import { ImageWithFallback } from './figma/ImageWithFallback';
import { MessageSquare, BookMarked, Lightbulb, Users, Award, Globe } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Community Discussions',
      description: 'Engage in meaningful conversations with experts and peers in your field of interest.',
      color: 'blue'
    },
    {
      icon: BookMarked,
      title: 'Resource Library',
      description: 'Access a curated collection of articles, guides, and learning materials.',
      color: 'green'
    },
    {
      icon: Lightbulb,
      title: 'Knowledge Sharing',
      description: 'Share your expertise and learn from others in a collaborative environment.',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Connect with industry professionals and thought leaders in your domain.',
      color: 'purple'
    },
    {
      icon: Award,
      title: 'Skill Recognition',
      description: 'Earn badges and recognition for your contributions to the community.',
      color: 'red'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Join a diverse, worldwide network of learners and knowledge sharers.',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' }
    };
    return colors[color];
  };

  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            Everything You Need to Learn and Share
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to discover knowledge, 
            connect with experts, and contribute to a thriving learning community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            const Icon = feature.icon;
            
            return (
              <div key={index} className="group">
                <div className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Image Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1585909694668-0a6e0ddbfe8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbm93bGVkZ2UlMjBzaGFyaW5nfGVufDF8fHx8MTc2Mjc1MDMyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Knowledge sharing"
              className="w-full h-auto"
            />
          </div>
          
          <div>
            <h2 className="text-gray-900 mb-4">
              Learn From the Best
            </h2>
            <p className="text-gray-600 mb-6">
              Our community is built on the principle of collective intelligence. Whether you're 
              a beginner seeking guidance or an expert wanting to share your knowledge, you'll 
              find your place here.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <div className="text-gray-900">Peer-to-peer learning</div>
                  <div className="text-gray-600">Learn directly from community members</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <div className="text-gray-900">Verified resources</div>
                  <div className="text-gray-600">Access quality-checked materials and guides</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <div className="text-gray-900">Active mentorship</div>
                  <div className="text-gray-600">Get guidance from experienced mentors</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
