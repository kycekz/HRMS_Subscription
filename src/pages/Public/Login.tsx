import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMultiTenantAuth } from '../../hooks/useMultiTenantAuth';
import { verifyPassword as verifyPasswordUtil, upgradePasswordHashIfNeeded } from '../../utils/passwords';

const MultiTenantLogin = () => {
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
  const { login } = useAuth();
  const { loadForEmail } = useMultiTenantAuth();

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
  

  const handleSubmit = async () => {
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
      // Find user by email across tenants
      const { data: users, error: userError } = await supabase
        .from('muser_tbl')
        .select(`
          muser_id, muser_email, muser_password_hash, muser_first_name, muser_last_name,
          muser_role, muser_system_role, muser_is_active, muser_home_tentid, muser_login_count, muser_failed_login_attempts,
          mtent_tbl!inner(mtent_tentid, mtent_name, mtent_subdomain)
        `)
        .eq('muser_email', email)
        .eq('muser_is_active', true);

      if (userError) {
        console.error('Login query error:', userError);
        setError('Unable to login right now. Please try again later.');
        setLoading(false);
        return;
      }

      if (!users || users.length === 0) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Verify password
      let validUser, verifyTag: 'bcrypt-ok' | 'legacy-base64' | 'legacy-plain' | 'fail' = 'fail';
      for (const u of users) {
        const tag = await verifyPasswordUtil(password, u.muser_password_hash);
        if (tag !== 'fail') {
          validUser = u;
          verifyTag = tag;
          break;
        }
      }
      if (!validUser) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Normalize tenant data shape (array or object)
      const rawTenant = validUser.mtent_tbl;
      const tenantArray = Array.isArray(rawTenant) ? rawTenant : (rawTenant ? [rawTenant] : []);
      if (tenantArray.length === 0) {
        console.error('No tenant linked to user record', validUser);
        setError('Your account has no tenant access. Please contact admin.');
        setLoading(false);
        return;
      }

      // Build accessible tenants list from all matching rows
      const accessibleTenants = users.map((u: any) => {
        const tRaw = u.mtent_tbl;
        const tArr = Array.isArray(tRaw) ? tRaw : (tRaw ? [tRaw] : []);
        const t = tArr[0];
        return {
          tenant_id: t?.mtent_tentid,
          tenant_name: t?.mtent_name,
          subdomain: t?.mtent_subdomain,
          role: u.muser_role
        };
      }).filter(t => t.tenant_id);

      const primaryTenant = tenantArray[0];

      // Upgrade password hash if needed (non-blocking)
      await upgradePasswordHashIfNeeded(validUser.muser_id, validUser.muser_password_hash, password, verifyTag);

      // Update login tracking (non-blocking)
      void supabase
        .from('muser_tbl')
        .update({
          muser_last_login: new Date().toISOString(),
          muser_login_count: (validUser.muser_login_count ?? 0) + 1,
          muser_failed_login_attempts: 0
        })
        .eq('muser_id', validUser.muser_id);

      // Persist session via AuthContext
      login({
        id: validUser.muser_id,
        email: validUser.muser_email,
        name: `${validUser.muser_first_name} ${validUser.muser_last_name}`.trim(),
        role: validUser.muser_role,
        tenant_id: primaryTenant.mtent_tentid,
        tenant_name: primaryTenant.mtent_name,
        accessible_tenants: accessibleTenants,
        muser_system_role: validUser.muser_system_role
      });

      setSuccess(`Welcome back, ${validUser.muser_first_name || validUser.muser_email}! Redirecting...`);

      // Initialize multi-tenant context before navigating
      try {
        await loadForEmail(validUser.muser_email);
      } catch {}

      navigate('/');

    } catch (err) {
      console.error('Login exception:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">Log in</h1>
            <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
          </div>
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          {/* Login Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              />
            </div>
            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {/* Forgot Password Link */}
            <div className="text-right">
              <button 
                type="button"
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Forgot my password
              </button>
            </div>
            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Log in'
              )}
            </button>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            {/* Alternative Login */}
            <button
              type="button"
              className="w-full py-3 px-4 border border-blue-300 rounded-md text-blue-600 font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Sign in with a passkey
            </button>
            {/* Help Text */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>If you don't know what your login details are,</p>
              <p>please speak to your payroll administrator.</p>
            </div>
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
              <span className="text-xl font-semibold">Malaysian HRMS</span>
            </div>
          </div>
          {/* Main Content */}
          <div className="max-w-md">
            <h2 className="text-3xl font-light mb-4">
              No Account? No Problem!
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Reach out to one of our experts at Malaysian HRMS to walk you through 
                how our Payroll solution will best suit your needs.
              </p>
              <p>
                Our team will walk you through your requirements and help you get 
                set up so you can start using Payroll seamlessly with Malaysian HRMS.
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

export default MultiTenantLogin;