import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ComboPackShowcase({ onShopClick }) {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      
      {/* Top Wavy Divider (Matches WhyMovitea Yellow #FFDF40) */}
      <svg 
        viewBox="0 0 1440 120" 
        style={{ ...styles.wave, top: 0, transform: 'rotate(180deg)' }}
        preserveAspectRatio="none"
      >
        <path fill="#FFDF40" d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,70.4L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
      </svg>

      <div style={styles.content}>
        <h2 style={styles.headline}>
          INTRODUCING INDIA'S<br/>
          PREMIER FLAVOURED<br/>
          TEA COMPANY
        </h2>
        
        <p style={styles.subtext}>
          Crafted over months of tasting, 4+ premium blends, and a community of over<br/>
          10 thousand <strong style={styles.highlight}>Tea Lovers</strong> later... here we are! But guess what?<br/>
          This is just the beginning.
        </p>

        <button 
          style={styles.btn} 
          onClick={onShopClick}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          KNOW MORE {'>'}
        </button>
      </div>

      {/* Bottom Wavy Divider (Matches Reviews Dark #1A1A1A) */}
      <svg 
        viewBox="0 0 1440 120" 
        style={{ ...styles.wave, bottom: -1 }}
        preserveAspectRatio="none"
      >
        <path fill="#1A1A1A" d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,70.4L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
      </svg>

    </section>
  );
}

const styles = {
  section: {
    backgroundColor: '#9BEA9A', // Vibrant Green
    position: 'relative',
    padding: '12rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '120px',
    zIndex: 10,
  },
  content: {
    position: 'relative',
    zIndex: 20,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '900px',
  },
  headline: {
    fontFamily: "'Anton', var(--font-heading)",
    fontSize: '6rem',
    fontWeight: '900',
    color: '#0F5132', // Deep forest green
    lineHeight: '1.05',
    letterSpacing: '0.02em',
    marginBottom: '2rem',
    textTransform: 'uppercase',
  },
  subtext: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.1rem',
    color: '#146C43',
    lineHeight: '1.6',
    fontWeight: '500',
    marginBottom: '3rem',
  },
  highlight: {
    backgroundColor: '#0F5132',
    color: '#9BEA9A',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
  },
  btn: {
    backgroundColor: '#C5DF29', // Neon greenish-yellow button
    color: '#0F5132',
    fontFamily: "'Anton', var(--font-heading)",
    fontSize: '1.3rem',
    padding: '1rem 3rem',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'transform 0.2s ease',
    boxShadow: '0 8px 20px rgba(15, 81, 50, 0.2)',
  }
};

// Add responsive layout adjustments
if (typeof document !== 'undefined') {
  const styleSheetGreen = document.createElement('style');
  styleSheetGreen.innerText = `
    @media (max-width: 1024px) {
      h2[style*="font-size: 6rem"] {
        font-size: 4rem !important;
      }
    }
    @media (max-width: 600px) {
      h2[style*="font-size: 6rem"], h2[style*="font-size: 4rem"] {
        font-size: 2.8rem !important;
      }
      p[style*="font-size: 1.1rem"] {
        font-size: 0.95rem !important;
      }
    }
  `;
  document.head.appendChild(styleSheetGreen);
}
