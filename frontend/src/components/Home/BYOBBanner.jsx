import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BYOBBanner() {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      {/* Top SVG Wave Divider */}
      <div style={styles.topWaveContainer}>
        <svg viewBox="0 0 1440 120" style={styles.topWaveSvg} preserveAspectRatio="none">
          <path
            fill="#FAF7F2"
            fillOpacity="1"
            d="M0,64L60,53.3C120,43,240,21,360,26.7C480,32,600,64,720,69.3C840,75,960,53,1080,42.7C1200,32,1320,32,1380,32L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="container" style={styles.container}>
        <div style={styles.contentBox}>
          <h2 style={styles.title}>
            Build Your Own<br/>
            <span style={{ color: '#FFDF40' }}>Tea Box</span>
          </h2>
          <p style={styles.subtitle}>
            Mix your favorite flavors and create a box that fits your routine.
          </p>
          
          <div style={styles.featuresList}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span>Choose Multiple Flavours</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span>Fixed Price ₹1299</span>
            </div>
          </div>

          <motion.button 
            style={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/build-your-box')}
          >
            <span style={{ fontWeight: 800 }}>PICK 10</span>
            <span style={{ backgroundColor: '#1A1A1A', color: '#FFDF40', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginLeft: '10px' }}>
              ₹1299
            </span>
          </motion.button>
        </div>
        
        <div style={styles.imageBox}>
          {/* Using a placeholder combo image to match the banner aesthetic */}
          <img src="/shop/100%20gm%20combo%20image%201.webp" alt="Build Your Box" style={styles.image} />
        </div>
      </div>
      {/* Bottom SVG Wave Divider */}
      <div style={styles.bottomWaveContainer}>
        <svg viewBox="0 0 1440 120" style={styles.bottomWaveSvg} preserveAspectRatio="none">
          <path
            fill="#FFDF40"
            fillOpacity="1"
            d="M0,64L60,53.3C120,43,240,21,360,26.7C480,32,600,64,720,69.3C840,75,960,53,1080,42.7C1200,32,1320,32,1380,32L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: '#304FFE', // Vibrant Blue matching the reference
    width: '100%',
    padding: '6rem 0', // Equal padding for top and bottom waves
    position: 'relative',
  },
  topWaveContainer: {
    position: 'absolute',
    top: '-1px',
    left: 0,
    width: '100%',
    overflow: 'hidden',
    lineHeight: 0,
  },
  topWaveSvg: {
    position: 'relative',
    display: 'block',
    width: 'calc(100% + 1.3px)',
    height: '80px',
  },
  bottomWaveContainer: {
    position: 'absolute',
    bottom: '-1px',
    left: 0,
    width: '100%',
    overflow: 'hidden',
    lineHeight: 0,
  },
  bottomWaveSvg: {
    position: 'relative',
    display: 'block',
    width: 'calc(100% + 1.3px)',
    height: '80px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    gap: '4rem',
  },
  contentBox: {
    flex: 1,
    color: '#FFF',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    maxWidth: '500px',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '3rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  featureIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #FFF',
    fontSize: '0.9rem',
  },
  ctaButton: {
    backgroundColor: '#FFDF40',
    color: '#1A1A1A',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  imageBox: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '500px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
    borderRadius: '16px',
    border: '6px double #FFDF40',
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  }
};
