import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api/client';

export default function PreOrderModal({ isOpen, onClose, product }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state
      setIsSuccess(false);
      
      // Auto-fill if user is logged in
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.name) setName(user.name);
          if (user.phone) setPhone(user.phone);
        } catch (e) {
          console.error('Failed to parse user from local storage');
        }
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/preorders', {
        productId: product.id,
        name,
        phone,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to submit pre-order:', error);
      alert('Failed to submit pre-order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={styles.overlay}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          style={styles.modal}
        >
          <button onClick={onClose} style={styles.closeBtn}>✕</button>

          {!isSuccess ? (
            <div style={styles.content}>
              <h2 style={styles.title}>Pre-Order</h2>
              <p style={styles.subtitle}>
                Register your interest for <strong>{product?.name}</strong>
              </p>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    required
                    style={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mobile Number</label>
                  <input
                    type="tel"
                    required
                    style={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your mobile number"
                  />
                </div>

                <button 
                  type="submit" 
                  style={styles.submitBtn} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Pre-Order'}
                </button>
              </form>
            </div>
          ) : (
            <div style={styles.successContent}>
              <h2 style={styles.title}>🎉 Thank You!</h2>
              <p style={styles.successText}>
                Thank you for your interest in MOVITEA.
              </p>
              <p style={styles.successText}>
                Your pre-order has been successfully registered.
              </p>
              <p style={styles.successText}>
                We'll notify you as soon as this product becomes available.
              </p>
              <button onClick={onClose} style={styles.continueBtn}>
                Continue Exploring
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(43, 26, 18, 0.6)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#FAF7F2',
    padding: '3rem 2.5rem',
    borderRadius: '12px',
    position: 'relative',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    border: '1px solid #EAEAEA',
  },
  closeBtn: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#8A7A6B',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.2rem',
    color: '#2B1A12',
    margin: '0 0 0.5rem 0',
    fontWeight: '300',
    textAlign: 'center',
  },
  subtitle: {
    color: '#8A7A6B',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#2B1A12',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '500',
  },
  input: {
    padding: '1rem',
    border: '1px solid #D1C7BD',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    color: '#2B1A12',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: '#2B1A12',
    color: '#FFFFFF',
    padding: '1rem',
    border: 'none',
    borderRadius: '8px',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease',
  },
  successContent: {
    textAlign: 'center',
    padding: '1rem 0',
  },
  successText: {
    color: '#5C4B37',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    margin: '0.5rem 0',
  },
  continueBtn: {
    backgroundColor: 'transparent',
    color: '#2B1A12',
    border: '1px solid #2B1A12',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    marginTop: '2rem',
    transition: 'all 0.3s ease',
  }
};
