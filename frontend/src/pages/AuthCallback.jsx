import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setToken } from '../utils/api';
import { authAPI } from '../utils/api';

export default function AuthCallback({ setUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      
      if (token) {
        setToken(token);
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          navigate('/');
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div style={styles.callbackPage}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={styles.spinner}
      />
      <p style={styles.text}>Signing you in...</p>
    </div>
  );
}

const styles = {
  callbackPage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF7F2',
    gap: '1.5rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid var(--cream-color)',
    borderTopColor: 'var(--primary-color)',
  },
  text: {
    fontSize: '1rem',
    color: '#8A7A6B',
  },
};
