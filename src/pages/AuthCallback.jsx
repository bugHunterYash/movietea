import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Clean up the URL by redirecting to home
      navigate('/');
    } else {
      // Handle failure
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.text}>Authenticating...</h2>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF7F2',
  },
  text: {
    fontFamily: 'var(--font-sans)',
    color: 'var(--primary-color)',
    fontSize: '1.2rem',
  }
};
