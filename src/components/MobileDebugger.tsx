import React, { useState, useEffect } from 'react';

const MobileDebugger = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Capture console errors
    const originalError = console.error;
    console.error = (...args) => {
      setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalError(...args);
    };

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      setLogs(prev => [...prev, `JS ERROR: ${event.message} at ${event.filename}:${event.lineno}`]);
    };

    window.addEventListener('error', handleError);

    return () => {
      console.error = originalError;
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '12px'
        }}
      >
        🐛
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      zIndex: 9999,
      padding: '20px',
      overflow: 'auto',
      fontSize: '12px'
    }}>
      <button
        onClick={() => setIsVisible(false)}
        style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}
      >
        Close
      </button>
      <h3>Debug Info:</h3>
      <p>Screen: {window.innerWidth}x{window.innerHeight}</p>
      <p>User Agent: {navigator.userAgent}</p>
      <h4>Errors:</h4>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: '5px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          {log}
        </div>
      ))}
    </div>
  );
};

export default MobileDebugger;