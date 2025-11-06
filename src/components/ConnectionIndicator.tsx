import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { supabasewebsite } from '../lib/supabasewebsite';

interface ConnectionIndicatorProps {
  checkInterval?: number; // minutes
  showInProduction?: boolean;
}

export const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({ 
  checkInterval = 5, 
  showInProduction = false 
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Hide in production unless explicitly enabled
  if (import.meta.env.PROD && !showInProduction) {
    return null;
  }

  const checkConnections = async () => {
    try {
      const [saasResult, websiteResult] = await Promise.allSettled([
        supabase.from('muser_tbl').select('count').limit(1).maybeSingle(),
        supabasewebsite.from('messages').select('count').limit(1).maybeSingle()
      ]);

      const saasOk = saasResult.status === 'fulfilled' && !saasResult.value.error;
      const websiteOk = websiteResult.status === 'fulfilled' && !websiteResult.value.error;
      
      setIsConnected(saasOk && websiteOk);
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnections();
    const interval = setInterval(checkConnections, checkInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkInterval]);

  if (isConnected === null) return null;

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap z-10">
          Database: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      )}
    </div>
  );
};