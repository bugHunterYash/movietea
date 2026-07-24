import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    let rawUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'https://movietea-ver8.onrender.com';
    if (rawUrl.endsWith('/')) rawUrl = rawUrl.slice(0, -1);
    if (!rawUrl.endsWith('/api')) rawUrl += '/api';
    window.location.href = `${rawUrl}/auth/google`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
      const payload = isLoginMode
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await api.post(endpoint, payload);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={styles.logoContainer}>
          <img src="/assets/logo.jfif" alt="MOVITEA" style={styles.logo} className="login-logo" />
        </div>

        <div style={styles.toggleContainer}>
          <button
            style={{ ...styles.toggleBtn, ...(isLoginMode ? styles.activeToggle : {}) }}
            onClick={() => setIsLoginMode(true)}
          >
            Sign In
          </button>
          <button
            style={{ ...styles.toggleBtn, ...(!isLoginMode ? styles.activeToggle : {}) }}
            onClick={() => setIsLoginMode(false)}
          >
            Create Account
          </button>
        </div>

        <h1 style={styles.title} className="login-title">{isLoginMode ? 'Welcome Back' : 'Join the Atelier'}</h1>
        <p style={styles.subtitle}>
          {isLoginMode
            ? 'Sign in to access your premium tea collection.'
            : 'Create an account to track orders and save your favorites.'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <AnimatePresence mode="wait">
            {!isLoginMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required={!isLoginMode}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={styles.dividerContainer}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine} />
        </div>

        <button style={styles.googleBtn} onClick={handleGoogleLogin}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={styles.googleIcon} />
          Continue with Google
        </button>

        <p style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
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
    padding: '2rem',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(243, 232, 211, 0.4) 0%, rgba(250, 247, 242, 0) 70%)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '3rem 3rem',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(43, 26, 18, 0.08)',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(220, 210, 195, 0.5)',
  },
  logoContainer: {
    marginBottom: '1.5rem',
  },
  logo: {
    height: '60px',
    mixBlendMode: 'multiply',
  },
  toggleContainer: {
    display: 'flex',
    backgroundColor: '#FAF7F2',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '2rem',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '0.85rem',
    color: '#8A7A6B',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    color: '#2B1A12',
    boxShadow: '0 2px 8px rgba(43, 26, 18, 0.05)',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.2rem',
    color: 'var(--dark-color)',
    marginBottom: '0.5rem',
    fontWeight: '400',
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-light)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '8px',
    border: '1px solid #EAEAEA',
    backgroundColor: '#FAF7F2',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    color: '#2B1A12',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  errorText: {
    color: '#C53030',
    fontSize: '0.85rem',
    textAlign: 'left',
    margin: 0,
  },
  submitBtn: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#2B1A12',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#EAEAEA',
  },
  dividerText: {
    padding: '0 1rem',
    color: '#8A7A6B',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DADCE0',
    borderRadius: '8px',
    color: '#3C4043',
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)',
  },
  googleIcon: {
    width: '18px',
    height: '18px',
  },
  footerText: {
    marginTop: '2rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    color: '#A0968C',
  }
};

// Add responsive styles for Login
const styleSheetLogin = document.createElement('style');
styleSheetLogin.innerText = `
  .login-card {
    padding: 3rem 3rem;
  }
  .login-title {
    font-size: 2.2rem;
  }
  @media (max-width: 640px) {
    .login-card {
      padding: 2rem 1.5rem !important;
      margin: 1rem;
    }
    .login-title {
      font-size: 1.8rem !important;
    }
    .login-logo {
      height: 50px !important;
    }
  }
`;
document.head.appendChild(styleSheetLogin);
