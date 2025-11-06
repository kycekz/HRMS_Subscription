import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { supabasewebsite } from '../lib/supabasewebsite';

interface ConnectionStatus {
  saas: 'checking' | 'connected' | 'failed';
  website: 'checking' | 'connected' | 'failed';
}

export const SupabaseHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    saas: 'checking',
    website: 'checking'
  });

  const checkConnections = async () => {
    setStatus({ saas: 'checking', website: 'checking' });

    // Test SaaS database connection
    try {
      const { error: saasError } = await supabase.from('muser_tbl').select('count').limit(1).maybeSingle();
      setStatus(prev => ({ 
        ...prev, 
        saas: saasError ? 'failed' : 'connected' 
      }));
    } catch {
      setStatus(prev => ({ ...prev, saas: 'failed' }));
    }

    // Test Website database connection
    try {
      const { error: websiteError } = await supabasewebsite.from('messages').select('count').limit(1).maybeSingle();
      setStatus(prev => ({ 
        ...prev, 
        website: websiteError ? 'failed' : 'connected' 
      }));
    } catch {
      setStatus(prev => ({ ...prev, website: 'failed' }));
    }
  };

  useEffect(() => {
    checkConnections();
  }, []);

  const getStatusColor = (connectionStatus: string) => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (connectionStatus: string) => {
    switch (connectionStatus) {
      case 'connected': return '✓';
      case 'failed': return '✗';
      default: return '⟳';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Database Health Check</h3>
        <button
          onClick={checkConnections}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3">
        <div className={`flex items-center justify-between p-3 rounded border ${getStatusColor(status.saas)}`}>
          <div>
            <span className="font-medium">SaaS Database</span>
            <div className="text-sm opacity-75">Tenant data & authentication</div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(status.saas)}</span>
            <span className="text-sm font-medium capitalize">{status.saas}</span>
          </div>
        </div>

        <div className={`flex items-center justify-between p-3 rounded border ${getStatusColor(status.website)}`}>
          <div>
            <span className="font-medium">Website Database</span>
            <div className="text-sm opacity-75">Public enquiries & forms</div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(status.website)}</span>
            <span className="text-sm font-medium capitalize">{status.website}</span>
          </div>
        </div>
      </div>
    </div>
  );
};