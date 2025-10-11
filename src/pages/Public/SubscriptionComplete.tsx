import React from 'react';
import { CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';

const SubscriptionComplete = ({ subscriptionInfo, paymentInfo }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
        <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
        <h1 className="text-3xl font-bold mb-2">Welcome to Malaysian HRMS!</h1>
        <p className="text-gray-700 mb-6">Your subscription is complete. You can now log in and start using the application.</p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Application Login URL</h2>
          <a href="https://hrms-ess.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-lg">hrms-ess.vercel.app</a>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Scan to Login</h2>
          <QRCode value="https://hrms-ess.vercel.app" size={128} />
        </div>

        <div className="mb-6 text-left">
          <h2 className="text-lg font-semibold mb-2">Subscription Information</h2>
          <div className="bg-gray-100 rounded p-4">
            <p><span className="font-medium">Plan:</span> {subscriptionInfo?.planName}</p>
            <p><span className="font-medium">Company:</span> {subscriptionInfo?.companyName}</p>
            <p><span className="font-medium">Admin Email:</span> {subscriptionInfo?.adminEmail}</p>
            <p><span className="font-medium">Employees:</span> {subscriptionInfo?.maxEmployees}</p>
            <p><span className="font-medium">Billing Cycle:</span> {subscriptionInfo?.billingCycle}</p>
          </div>
        </div>

        <div className="mb-6 text-left">
          <h2 className="text-lg font-semibold mb-2">Payment Information (Invoice)</h2>
          <div className="bg-gray-100 rounded p-4">
            <p><span className="font-medium">Invoice No:</span> {paymentInfo?.invoiceNo}</p>
            <p><span className="font-medium">Amount:</span> RM{paymentInfo?.amount}</p>
            <p><span className="font-medium">Date:</span> {paymentInfo?.date}</p>
            <p><span className="font-medium">Status:</span> {paymentInfo?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionComplete;
