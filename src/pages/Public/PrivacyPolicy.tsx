import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: 28 October 2025</p>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data in compliance with the Personal Data Protection Act 2010 (PDPA) of Malaysia.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. What Data We Collect</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              We may collect the following categories of personal data:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>User information:</strong> Name, email, phone number, job title, organization name.</li>
              <li><strong>Employee information:</strong> IC number, address, bank details, salary data (if managed through the HRMS).</li>
              <li><strong>System information:</strong> Login credentials, device information, and usage logs.</li>
              <li><strong>Billing information:</strong> Payment details for subscription services.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Your data may be used for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Providing and maintaining the HRMS platform;</li>
              <li>Managing user accounts and authentication;</li>
              <li>Generating payroll, leave, and HR-related calculations;</li>
              <li>Communicating important updates and service notices;</li>
              <li>Complying with legal obligations under Malaysian law.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Disclosure of Personal Data</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              We do not sell or rent your personal data. However, we may share it with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Authorized service providers (e.g., cloud hosting, payment processors);</li>
              <li>Government or regulatory authorities, where required by law;</li>
              <li>Your organization, if you are an employee registered under their account.</li>
            </ul>
            <p className="mb-6 text-gray-700 leading-relaxed">
              All third parties are bound by confidentiality and data protection obligations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We retain personal data as long as your account is active or as required for legal and business purposes. When no longer needed, data will be securely deleted or anonymized.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data against unauthorized access, disclosure, or loss. This includes encryption, access controls, and regular system audits.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Under PDPA, you have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Access and obtain a copy of your personal data;</li>
              <li>Request correction of inaccurate data;</li>
              <li>Withdraw consent (subject to legal or contractual limitations);</li>
              <li>Inquire about data processing practices.</li>
            </ul>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Requests can be submitted to admin@amazingcube.com.my.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Data Transfers</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Your data may be stored or processed outside Malaysia (e.g., on secure cloud infrastructure). In such cases, we ensure adequate protection consistent with PDPA standards.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We use cookies and analytics tools to enhance user experience, track usage trends, and improve our Service. You can manage cookie preferences through your browser settings.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. Any material changes will be communicated via email or system notification.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="mb-2 text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact:
            </p>
            <p className="text-gray-700">📧 admin@amazingcube.com.my</p>
            <p className="text-gray-700">🏢 Amazing Cube Sdn Bhd</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;