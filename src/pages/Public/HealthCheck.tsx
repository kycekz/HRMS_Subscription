import React from 'react';
import { SupabaseHealthCheck, ConnectionIndicator } from '../../components';

const HealthCheckPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Health Check</h1>
          <p className="text-gray-600">Monitor the status of both Supabase database connections.</p>
        </div>

        <div className="grid gap-6">
          <SupabaseHealthCheck />
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Connection Indicator Demo</h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Status:</span>
              <ConnectionIndicator showInProduction={true} />
              <span className="text-sm text-gray-500">(hover for details)</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Usage Instructions</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• <strong>SupabaseHealthCheck:</strong> Add to any page for debugging database connections</p>
              <p>• <strong>ConnectionIndicator:</strong> Add to header/footer for continuous monitoring</p>
              <p>• Both components are hidden in production by default (can be overridden)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckPage;