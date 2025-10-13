import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    background: '#ffffff',
    color: '#1a1a1a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.08)',
    padding: '4rem 3rem',
    textAlign: 'center' as const,
    maxWidth: '480px',
    margin: '0 auto',
  },
  h1: {
    fontSize: '3rem',
    fontWeight: 800,
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#5a5a6a',
    marginBottom: '2.5rem',
  },
  btn: {
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: '50px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.15)',
    marginTop: '2rem',
    transition: 'all 0.3s',
  },
};

const Wip: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Coming Soon</h1>
        <p style={styles.subtitle}>This feature is under development.<br />Please check back later!</p>
        <button style={styles.btn} onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default Wip;
