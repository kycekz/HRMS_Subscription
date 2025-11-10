import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const community_login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  //const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (error || success) {
      setError('');
      setSuccess('');
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Placeholder for form submission implementation
      console.log('Form submitted with data:', formData);
      // Add your own authentication logic here

      setSuccess(`Welcome back, ${validUser.muser_first_name || validUser.muser_email}! Redirecting...`);


      navigate('/');

    } catch (err) {
      console.error('Login exception:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {

    }
  };
  
  return (
    <div className="min-h-screen flex">


      {/* Left Panel - Login Form */}
      <div className="w-1/2 bg-white p-12 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="login-header mb-8">
                        <h2 className="login-title text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
                        <p className="login-subtitle text-gray-600">Sign in or create your account</p>
                    </div>

                    {success && (
                        <div className="success-message bg-green-50 text-green-800 p-3 rounded-md mb-4">
                            {success}
                        </div>
                    )}
                    
                    {error && (
                        <div className="error-message bg-red-50 text-red-800 p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <form className="login-form" onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <div className="social-login mb-6">
                            <button 
                                type="button" 
                                className="social-btn w-full flex items-center justify-center gap-3 mb-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"

                                disabled={loading}
                            >
                                <svg className="social-icon w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </button>

                            <button 
                                type="button" 
                                className="social-btn w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                <svg className="social-icon w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#f25022" d="M0 0h11v11H0z"/>
                                    <path fill="#00a4ef" d="M13 0h11v11H13z"/>
                                    <path fill="#7fba00" d="M0 13h11v11H0z"/>
                                    <path fill="#ffb900" d="M13 13h11v11H13z"/>
                                </svg>
                                Continue with Microsoft
                            </button>
                        </div>

                        <div className="divider flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="password-toggle relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options flex justify-between items-center mb-6">
                            <label className="remember-me flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                    disabled={loading}
                                />
                                <span className="text-gray-700 text-sm">Remember me</span>
                            </label>
                            <a href="#" className="forgot-password text-blue-600 hover:text-blue-800 text-sm">
                                Forgot?
                            </a>
                        </div>

                        <button 
                            type="submit" 
                            className={`login-btn w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="signup-link text-center mt-6 text-gray-600">
                        New here? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            navigate('/community_signup');
                        }} className="text-blue-600 hover:text-blue-800">Create an account</a>
                    </div>
                    
                    <hr className="my-4 border-gray-300" />

                    <div className="divider text-xs">
                        <span className="divider-text">By continuing, you agree to Amazing Cube's Terms of Service and Privacy Policy.</span>
                    </div>

                </div>
            </div>


      {/* Right Panel - Marketing Content */}
      <div className="w-1/2 bg-gray-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-12">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-gray-800 font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-semibold">Amaze Community</span>
            </div>
          </div>
          {/* Main Content */}
          <div className="max-w-md">
            <h2 className="text-3xl font-light mb-4">
              Ready to Get Started?
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Join a thriving community of learners and experts sharing knowledge, building skills, and advancing careers. 
                Whether you're looking to learn from industry leaders or share your expertise, this is your platform to grow.
              </p>
              <p>
                Join thousands of professionals already growing with us
              </p>
              <div className="flex items-center space-x-2">
                <span>So why wait?</span>
                <button className="text-blue-400 hover:text-blue-300 underline font-medium">
                  Find out more today!
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500 rounded-full opacity-10"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-green-500 rounded-full opacity-10"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-purple-500 rounded-full opacity-10"></div>
      </div>
    </div>
  );
};

export default community_login;