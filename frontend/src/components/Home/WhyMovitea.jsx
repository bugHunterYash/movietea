import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Coffee, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BENEFITS = [
  {
    icon: Leaf,
    title: 'ZERO ADDED SUGAR',
    desc: 'Sweetened naturally by flavor botanicals, never artificial sugars.',
  },
  {
    icon: ShieldCheck,
    title: 'PREMIUM INGREDIENTS',
    desc: 'Single-origin tea leaves, authentic spice extracts and real flowers.',
  },
  {
    icon: Coffee,
    title: 'BREWS IN 30 SECONDS',
    desc: 'The ultimate luxury convenience. Just add hot water and stir.',
  },
  {
    icon: MapPin,
    title: 'MADE IN INDIA',
    desc: 'Crafted for Indian tastebuds, with natural goodness at heart.',
  }
];

export default function WhyMovitea() {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      <div className="container" style={styles.container}>
        
        {/* Intro Headline */}
        <div style={styles.intro}>
          <h2 style={styles.headline}>
            WHY<br/>
            <span style={styles.headlineHighlight}>MOVITEA!</span>
          </h2>
        </div>

        {/* 4-Column Grid */}
        <div style={styles.gridContainer}>
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                style={styles.card}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div style={styles.iconWrapper}>
                  <Icon size={56} strokeWidth={2} color="#1A120E" />
                </div>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemDesc}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.button 
          style={styles.ctaBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/shop')}
        >
          DEEP DIVE INTO MOVITEA!
        </motion.button>

      </div>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: '#FFDF40', // Vibrant Too Yumm Yellow
    padding: '6rem 0 8rem 0',
    width: '100%',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  intro: {
    textAlign: 'center',
    marginBottom: '5rem',
  },
  headline: {
    fontFamily: "'Anton', var(--font-heading)",
    fontSize: '5.5rem',
    fontWeight: '900',
    color: '#FFDF40', // Same as bg to make it look hollow, or use white
    lineHeight: '1.1',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    /* 3D Outline Effect */
    WebkitTextStroke: '3px #1A120E',
    textShadow: '6px 6px 0px #1A120E',
  },
  headlineHighlight: {
    color: '#FFFFFF',
    WebkitTextStroke: '3px #1A120E',
    textShadow: '6px 6px 0px #1A120E',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '3rem',
    width: '100%',
    marginBottom: '4rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#FFF',
    border: '4px solid #111',
    boxShadow: '10px 10px 0px #111',
    padding: '2rem 1rem',
  },
  iconWrapper: {
    marginBottom: '1.5rem',
  },
  itemTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#1A120E',
    marginBottom: '1rem',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
  },
  itemDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#3E2723',
    lineHeight: '1.5',
  },
  ctaBtn: {
    backgroundColor: '#1A120E',
    color: '#FFFFFF',
    fontFamily: 'var(--font-heading)',
    fontWeight: '700',
    fontSize: '1rem',
    letterSpacing: '0.05em',
    padding: '1.2rem 2.5rem',
    border: '3px solid #111',
    boxShadow: '8px 8px 0px #111',
    borderRadius: '8px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    boxShadow: '0 10px 25px rgba(26, 18, 14, 0.2)',
  }
};

// Add responsive layout adjustments and Anton font
if (typeof document !== 'undefined') {
  // Import Anton font for the headline
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Anton&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const styleSheet = document.createElement('style');
  styleSheet.innerText = `
    @media (max-width: 1024px) {
      div[style*="gridTemplateColumns: repeat(4"] {
        grid-template-columns: repeat(2, 1fr) !important;
        row-gap: 4rem !important;
      }
      h2[style*="font-size: 5rem"] {
        font-size: 4rem !important;
      }
    }
    @media (max-width: 600px) {
      div[style*="gridTemplateColumns: repeat(2"] {
        grid-template-columns: 1fr !important;
      }
      h2[style*="font-size: 5rem"], h2[style*="font-size: 4rem"] {
        font-size: 3rem !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

