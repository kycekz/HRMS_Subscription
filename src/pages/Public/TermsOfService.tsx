import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="/AmazeCubeLogo.png"
                alt="Amaze HRMS Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-semibold text-gray-900">Amaze HRMS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: 28 October 2025</p>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              By signing up, accessing, or using this platform ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organization, you confirm that you are authorized to accept these Terms on behalf of that organization.
            </p>
            <p className="mb-6 text-gray-700 leading-relaxed">
              If you do not agree to these Terms, you may not use the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              The Service is a cloud-based Human Resource Management System (HRMS) designed to manage employee information, payroll, leave, and related HR processes. The Service is provided by Amazing Cube Sdn Bhd ("the Company", "we", "our", "us").
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Use of Service</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You may not:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Use the Service for fraudulent, abusive, or illegal activities;</li>
              <li>Attempt to gain unauthorized access to the Service;</li>
              <li>Reverse engineer, copy, or resell the Service without written consent.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Ownership</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              All data entered by your organization, including employee records and payroll data, remain the property of your organization. We act as a data processor under the Personal Data Protection Act (PDPA) 2010, and process your data solely for providing and maintaining the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Subscription & Payment</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Access to certain features may require a paid subscription. Subscription fees, billing cycles, and renewal terms will be stated during purchase. All fees are non-refundable except where required by law.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Suspension and Termination</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account if:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>You breach these Terms;</li>
              <li>Your subscription payment fails;</li>
              <li>Your usage threatens the security or stability of our systems.</li>
            </ul>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Upon termination, access to your account and data may be disabled, but you may request data export within 30 days before deletion.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimer</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, error-free, or fully secure operation of the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Data Protection</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We comply with the Malaysian Personal Data Protection Act 2010 (PDPA). Please refer to our Privacy Policy for details on how we collect, use, and protect your personal data.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Modifications</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We may update these Terms from time to time. Continued use of the Service after such updates constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Malaysia. Any disputes shall be subject to the exclusive jurisdiction of the Malaysian courts.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="mb-2 text-gray-700 leading-relaxed">
              If you have questions about these Terms, please contact:
            </p>
            <p className="text-gray-700">📧 admin@amazingcube.com.my</p>
            <p className="text-gray-700">🏢 Amazing Cube Sdn Bhd</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;