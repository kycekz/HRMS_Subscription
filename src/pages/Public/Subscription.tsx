import React, { useState, useEffect } from 'react';
import { Check, X, Eye, EyeOff, Building, User, Mail, Phone, MapPin, CreditCard, Shield, Clock } from 'lucide-react';
//import { supabase, supabaseAdmin } from '../../AuthContext;
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

type PlanKey = 'trial' | 'basic' | 'professional' | 'enterprise';
interface Plan {
  id: PlanKey;
  name: string;
  displayName: string;
  priceMonthly: number;
  priceYearly: number;
  maxEmployees: number;
  features: string[];
  description: string;
  popular: boolean;
  trialOnly: boolean;
}
const plans: Record<PlanKey, Plan> = {
  trial: {
    id: 'trial',
    name: 'trial',
    displayName: '30-Day Trial',
    priceMonthly: 0,
    priceYearly: 0,
    maxEmployees: 5,
    features: ['employee_management', 'payroll', 'epf_socso_eis',  'basic_reports', 'attendance','leave','ess','free'],
    description: 'Perfect for testing our system. Suitable for start up small business',
    popular: false,
    trialOnly: true
  },
  basic: {
    id: 'basic',
    name: 'basic',
    displayName: 'Basic Plan',
    priceMonthly: 50,
    priceYearly: 540,
    maxEmployees: 10,
    features: ['employee_management', 'payroll', 'epf_socso_eis',  'basic_reports', 'attendance','leave','ess','bulk_upload','add_employee'],
    description: 'Essential features for small businesses',
    popular: true,
    trialOnly: false
  },
  professional: {
    id: 'professional',
    name: 'professional',
    displayName: 'Professional Plan',
    priceMonthly: 800,
    priceYearly: 8448,
    maxEmployees: 200,
    features: ['employee_management', 'payroll', 'epf_socso_eis',  'basic_reports', 'attendance','leave','ess', 'bulk_upload','expense_claims', 'roster'],
    description: 'Advanced tools for growing companies',
    popular: false,
    trialOnly: false
  },
  enterprise: {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Enterprise Plan',
    priceMonthly: 6000,
    priceYearly: 59760,
    maxEmployees: 9999,
    features: ['all_features', 'api_access', 'custom_reports', 'priority_support', 'white_label','ai','bi'],
    description: 'Complete solution for large organizations',
    popular: false,
    trialOnly: false
  }
};
const featureDescriptions: Record<string, string> = {
  payroll: 'Complete payroll processing',
  employee_management: 'Employee data management',
  basic_reports: 'Standard reporting suite',
  epf_socso_eis: 'EPF, SOCSO & EIS compliance',
  advanced_reports: 'Advanced analytics & reports',
  expense_claims: 'Expense claims management',
  bulk_upload: 'Bulk data import/export',
  custom_fields: 'Custom employee fields',
  all_features: 'All available features',
  api_access: 'REST API integration',
  custom_reports: 'Custom report builder',
  priority_support: 'Priority support',
  white_label: 'White label branding',
  attendance: 'Time & Attendance',
  leave: 'Leave management',
  roster: 'Roster management',
  ai:  'AI-powered Solution',
  bi : 'Business Intelligence',
  ess: 'Employee Self-Service',
  trial :'30-Day Trial',
  add_employee :'Add on employee at RM3 per month',
  free: 'Convert to free plan *T&C apply'
};

const SubscriptionSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    subdomain: '',
    adminEmail: '',
    phone: '',
    address: '',
    
    // Admin User Information
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    
    // Additional Details
    companyRegistrationName: '',
    positionTitle: '',
    
    // Agreement
    agreeTerms: false,
    agreePrivacy: false
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    // Only access checked if the event target is an input and type is checkbox
    const isCheckbox = type === 'checkbox' && 'checked' in e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Auto-generate subdomain from company name
    if (name === 'companyName') {
      let subdomain = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .slice(0, 48); // Max 48 chars to allow room for numbers if needed
      
      // Ensure it starts and ends with alphanumeric
      subdomain = subdomain.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      
      // Ensure minimum length of 3
      if (subdomain.length < 3) {
        subdomain = subdomain + '123'.slice(0, 3 - subdomain.length);
      }
      
      // Check against reserved words
      const reserved = ['www', 'api', 'admin', 'support', 'help', 'blog', 'mail', 'ftp'];
      if (reserved.includes(subdomain)) {
        subdomain = subdomain + '1';
      }
      
      setFormData(prev => ({
        ...prev,
        subdomain: subdomain
      }));
    }
    
    if (name === 'telephone') {
    }

    if (error) setError('');
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateStep = async (step: number) => {
    setError('');
    switch (step) {
      case 2:
        const { companyName, subdomain, adminEmail, phone } = formData;
        if (!companyName || !subdomain || !adminEmail || !phone) {
          setError('Please fill in all required company information.');
          return false;
        }
        if (!adminEmail.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
          setError('Please enter a valid email address.');
          return false;
        }
        if (subdomain.length < 3) {
          setError('Subdomain must be at least 3 characters long.');
          return false;
        }
        if (!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(subdomain)) {
          setError('Subdomain must start and end with letters/numbers, contain only lowercase letters, numbers, and hyphens.');
          return false;
        }
        if (!/^[0-9]{8,12}$/.test(phone)) {
          setError('Phone number must be 8-12 digits, numbers only.');
          return false;
        }
        if (formData.companyRegistrationName.length > 20) {
          setError('SSM registration name must be 20 characters or less.');
          return false;
        }
        const reserved = ['www', 'api', 'admin', 'support', 'help', 'blog', 'mail', 'ftp'];
        if (reserved.includes(subdomain)) {
          setError('This subdomain is reserved. Please choose a different one.');
          return false;
        }
        // Check for duplicate company name
        const { data: companyDup } = await supabase
          .from('mtent_tbl')
          .select('mtent_name')
          .eq('mtent_name', companyName)
          .maybeSingle();
        if (companyDup) {
          setError('A company with this name already exists.');
          return false;
        }
        // Check for duplicate admin email
        const { data: emailDup } = await supabase
          .from('mtent_tbl')
          .select('admin_email')
          .eq('admin_email', adminEmail)
          .maybeSingle();
        if (emailDup) {
          setError('This admin email is already registered.');
          return false;
        }
        return true;
        
      case 3:
        const { firstName, lastName, password, confirmPassword, agreeTerms, agreePrivacy } = formData;
        if (!firstName || !lastName || !password || !confirmPassword) {
          setError('Please fill in all admin user information.');
          return false;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return false;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return false;
        }
        if (!agreeTerms || !agreePrivacy) {
          setError('Please agree to the Terms of Service and Privacy Policy.');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Get selected plan details
      const selectedPlanData = plans[selectedPlan as PlanKey];
      
      // Use regular client for signup operations since RLS policies allow public INSERT
      const client = supabase;
      
      // First, get the plan ID from msplan_tbl
      const { data: planData, error: planError } = await client
        .from('msplan_tbl')
        .select('msplan_id')
        .eq('msplan_name', selectedPlan)
        .single();
      
      if (planError) {
        console.error('Plan lookup error:', planError);
        throw new Error('Failed to find subscription plan: ' + planError.message);
      }
      
      // Hash password (in production, use proper password hashing)
      const passwordHash = btoa(formData.password); // Simple base64 encoding - use bcrypt in production
      
      // Validate and clean subdomain before insert
      let cleanSubdomain = formData.subdomain.toLowerCase().trim();
      
      // Ensure it matches the constraint pattern
      if (!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(cleanSubdomain)) {
        // Fallback: create a simple subdomain from company name
        cleanSubdomain = formData.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .slice(0, 10) + Math.floor(Math.random() * 1000);
        
        // Ensure minimum length
        if (cleanSubdomain.length < 3) {
          cleanSubdomain = 'company' + Math.floor(Math.random() * 1000);
        }
      }
      
      console.log('Final subdomain:', cleanSubdomain);
      
      // Create tenant record
      const { data: tenantData, error: tenantError } = await client
        .from('mtent_tbl')
        .insert({
          mtent_name: formData.companyName,
          mtent_subdomain: cleanSubdomain,
          admin_email: formData.adminEmail,
          mtent_phone: formData.phone,
          mtent_addr: formData.address,
          mtent_splan_id: planData.msplan_id,
          mtent_splan: selectedPlan,
          mtent_sstatus: selectedPlan === 'trial' ? 'trial' : 'active',
          mtent_companyname: formData.companyRegistrationName || formData.companyName,
          mtent_position_title: formData.positionTitle
        })
        .select('mtent_tentid')
        .single();
      
      if (tenantError) {
        console.error('Tenant creation error:', tenantError);
        throw new Error('Failed to create company account: ' + tenantError.message);
      }
      
      // Create admin user record and return id
      const { data: userInsertData, error: userError } = await client
        .from('muser_tbl')
        .insert({
          muser_home_tentid: tenantData.mtent_tentid,
          muser_email: formData.adminEmail,
          muser_password_hash: passwordHash,
          muser_first_name: formData.firstName,
          muser_last_name: formData.lastName,
          muser_role: 'admin',
          muser_is_active: true,
          muser_email_verified: false
        })
        .select('muser_id')
        .single();
      
      if (userError) {
        console.error('User creation error:', userError);
        throw new Error('Failed to create admin user: ' + userError.message);
      }

      // Ensure home tenant access exists (trigger should create; fallback here)
      const createdUserId = userInsertData?.muser_id;
      const homeTenantId = tenantData.mtent_tentid;
      try {
        const { data: accessCheck } = await client
          .from('muta_tbl')
          .select('muta_utaid')
          .eq('muta_userid', createdUserId)
          .eq('muta_tenantid', homeTenantId)
          .eq('muta_accesstype', 'home')
          .maybeSingle();
        if (!accessCheck) {
          await client.from('muta_tbl').insert({
            muta_userid: createdUserId,
            muta_tenantid: homeTenantId,
            muta_accesstype: 'home',
            muta_accessrole: 'admin',
            muta_isactive: true,
            muta_grantedby: createdUserId
          });
        }
      } catch (e) {
        console.warn('Home access verification/creation warning:', e);
      }

      setSuccess('Account created successfully! Please check your email to verify your account.');
      // Prepare summary data
      const subscriptionInfo = {
        planName: selectedPlanData.displayName,
        companyName: formData.companyName,
        adminEmail: formData.adminEmail,
        maxEmployees: selectedPlanData.maxEmployees,
        billingCycle,
      };
      const paymentInfo = {
        invoiceNo: 'INV-' + Math.floor(Math.random() * 1000000),
        amount: getCurrentPrice(selectedPlanData),
        date: new Date().toLocaleDateString(),
        status: 'Paid',
      };
      // Redirect to SubscriptionComplete page
      setTimeout(() => {
        navigate('/subscription-complete', { state: { subscriptionInfo, paymentInfo } });
      }, 2000);
    } catch (err: Error |any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = (plan: Plan) => {
    return billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  };

  const getSavings = (plan: Plan) => {
    if (billingCycle === 'yearly' && plan.priceMonthly > 0) {
      const monthlyCost = plan.priceMonthly * 12;
      const yearlyCost = plan.priceYearly;
      return monthlyCost - yearlyCost;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/*
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              */}
                <img
                  src="/AmazeCubeLogo.png"                   // Path relative to /public folder
                  alt="Amaze HRMS Logo"
                  className="w-8 h-8 rounded-full object-cover"
                />
              <span className="text-xl font-semibold text-gray-900">Amaze HRMS</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xl text-gray-500">
                <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Plan</span>
                <span>→</span>
                <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Company</span>
                <span>→</span>
                <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Admin</span>
                <span>→</span>
                <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-2 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Plan Selection */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">Choose Your Plan</h1>
              <p className="text-gray-600">Select the perfect plan for your business needs</p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Yearly <span className="text-green-600 text-xs ml-1">(Save up to 17%)</span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.values(plans).map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-lg border-2 p-8 w-full cursor-pointer transition-all h-[40rem] flex flex-col justify-between ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-blue-100' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{ minWidth: '0' }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-blue-500 text-white text-xs font-medium px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.displayName}</h3>
                    <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        RM{getCurrentPrice(plan)}
                      </span>
                      {!plan.trialOnly && (
                        <span className="text-gray-500 text-sm">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                      {getSavings(plan) > 0 && (
                        <div className="text-green-600 text-xs mt-1">
                          Save RM{getSavings(plan)} yearly
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      Up to {plan.maxEmployees === 9999 ? 'Unlimited' : plan.maxEmployees} employees
                    </div>
                    
                    <div className="space-y-4 text-left">
                      {plan.features.slice(0, 10).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="h-5 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">
                            {featureDescriptions[feature] || feature}
                          </span>
                        </div>
                      ))}
                      {plan.features.length > 10 && (
                        <div className="text-sm text-blue-600">
                          +{plan.features.length - 10} more features
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Company Information */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">Company Information</h1>
              <p className="text-gray-600">Tell us about your company</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Company Sdn Bhd"
                    />
                  </div>
                </div>

                {/*
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subdomain *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="subdomain"
                      value={formData.subdomain}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="yourcompany"
                    />
                    <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md">
                      .hrms.com
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This will be your login URL</p>
                </div>
                */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="admin@yourcompany.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={e => {
                        // Only allow numbers
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData(prev => ({ ...prev, phone: value }));
                        if (error) setError('');
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="60123456789"
                      maxLength={12}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleAddressChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your company address in Malaysia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Official Company Registration Name
                  </label>
                  <input
                    type="text"
                    name="companyRegistrationName"
                    value={formData.companyRegistrationName}
                    onChange={e => {
                      // Limit to 20 characters
                      const value = e.target.value.slice(0, 20);
                      setFormData(prev => ({ ...prev, companyRegistrationName: value }));
                      if (error) setError('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="As per SSM registration"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Position/Title
                  </label>
                  <input
                    type="text"
                    name="positionTitle"
                    value={formData.positionTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="CEO, HR Manager, etc."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Continue
              </button>
               
            </div>
            
          </div>
        )}

        {/* Step 3: Admin User Setup */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">Admin User Setup</h1>
              <p className="text-gray-600">Create your administrator account</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}*
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    {' '}*
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Review & Complete
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Complete */}
        {currentStep === 4 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">Review & Complete</h1>
              <p className="text-gray-600">Please review your information before completing setup</p>
            </div>

            <div className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Plan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">{plans[selectedPlan as PlanKey].displayName}</p>
                    <p className="text-sm text-gray-500">{plans[selectedPlan as PlanKey].description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Up to {plans[selectedPlan as PlanKey].maxEmployees === 9999 ? 'Unlimited' : plans[selectedPlan as PlanKey].maxEmployees} employees
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      RM{getCurrentPrice(plans[selectedPlan as PlanKey])}
                    </p>
                    {!plans[selectedPlan as PlanKey].trialOnly && (
                      <p className="text-sm text-gray-500">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Company:</span> {formData.companyName}
                  </div>
                  {/*
                  <div>
                    <span className="font-medium text-gray-700">Subdomain:</span> {formData.subdomain}.hrms.com
                  </div>
                  */}
                  <div>
                    <span className="font-medium text-gray-700">Email:</span> {formData.adminEmail}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span> {formData.phone}
                  </div>
                </div>
              </div>

              {/* Admin Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Account</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span> {formData.firstName} {formData.lastName}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span> {formData.adminEmail}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Role:</span> Administrator
                  </div>
                  {formData.positionTitle && (
                    <div>
                      <span className="font-medium text-gray-700">Position:</span> {formData.positionTitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Trial Information */}
              {selectedPlan === 'trial' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="text-lg font-semibold text-yellow-800">30-Day Free Trial</h3>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your trial will start immediately and end in 30 days. You can upgrade to a paid plan at any time during your trial period.
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Security & Privacy</h4>
                    <p className="text-sm text-blue-700">
                      Your data is encrypted and stored securely in Malaysia. We comply with PDPA regulations and never share your information with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-8 py-3 rounded-md font-medium transition-all ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-gray-800 font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-semibold">Malaysian HRMS</span>
              </div>
              <p className="text-gray-300 text-sm">
                Comprehensive payroll and HR management solution designed specifically for Malaysian businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Payroll Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Employee Records</a></li>
                <li><a href="#" className="hover:text-white transition-colors">EPF/SOCSO/EIS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reports & Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PDPA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Malaysian HRMS. All rights reserved. Made with ❤️ in Malaysia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSignup;