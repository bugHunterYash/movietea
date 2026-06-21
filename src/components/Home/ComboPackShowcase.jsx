import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ComboPackShowcase({ onShopClick }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress to sachet offsets
  const roseX = useTransform(scrollYProgress, [0.0, 0.9], [0, -180]);
  const roseRotate = useTransform(scrollYProgress, [0.0, 0.9], [0, -15]);

  const chocolateX = useTransform(scrollYProgress, [0.0, 0.9], [0, 180]);
  const chocolateRotate = useTransform(scrollYProgress, [0.0, 0.9], [0, 15]);

  const vanillaY = useTransform(scrollYProgress, [0.0, 0.9], [0, -180]);
  const vanillaRotate = useTransform(scrollYProgress, [0.0, 0.9], [0, -8]);

  const butterscotchY = useTransform(scrollYProgress, [0.0, 0.9], [0, 180]);
  const butterscotchRotate = useTransform(scrollYProgress, [0.0, 0.9], [0, 8]);

  const opacity = useTransform(scrollYProgress, [0.0, 0.25], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.0, 0.25], [0.8, 1]);

  return (
    <div ref={sectionRef} style={styles.outerContainer}>
      <div style={styles.stickyContainer}>
        <div className="container" style={styles.content}>
          <div style={styles.textColumn}>
            <span style={styles.subtitle}>COMBO PACK</span>
            <h2 style={styles.title}>The Assorted Atelier Box</h2>
            <p style={styles.desc}>
              Why settle for one when you can experience them all? Our flagship gift box features a curated selection of Rose, Chocolate, Vanilla, and Butterscotch blends.
            </p>
            <button className="luxury-btn" onClick={onShopClick} style={styles.btn}>
              Purchase Combo Box &mdash; ₹1,899
            </button>
          </div>

          <div style={styles.showcaseColumn}>
            <div style={styles.interactiveArea}>
              {/* Pinned center image: Combo packet */}
              <div style={styles.centerBoxWrapper}>
                <img
                  src="/assets/combo-pack.jpeg"
                  alt="MOVITEA Gifting Box"
                  style={styles.comboPacketImg}
                />
              </div>

              {/* Sliding Sachets */}
              {/* Rose Sachet - slides Left */}
              <motion.div
                style={{
                  ...styles.sachet,
                  ...styles.roseSachet,
                  x: roseX,
                  rotate: roseRotate,
                  opacity,
                  scale,
                }}
              >
                <div style={styles.sachetInner}>
                  <img src="/assets/rose.jpeg" alt="Rose" style={styles.sachetMiniImg} />
                  <span style={styles.sachetLabel}>Rose</span>
                </div>
              </motion.div>

              {/* Chocolate Sachet - slides Right */}
              <motion.div
                style={{
                  ...styles.sachet,
                  ...styles.chocolateSachet,
                  x: chocolateX,
                  rotate: chocolateRotate,
                  opacity,
                  scale,
                }}
              >
                <div style={styles.sachetInner}>
                  <img src="/assets/chocolate.jpeg" alt="Chocolate" style={styles.sachetMiniImg} />
                  <span style={styles.sachetLabel}>Chocolate</span>
                </div>
              </motion.div>

              {/* Vanilla Sachet - slides Up */}
              <motion.div
                style={{
                  ...styles.sachet,
                  ...styles.vanillaSachet,
                  y: vanillaY,
                  rotate: vanillaRotate,
                  opacity,
                  scale,
                }}
              >
                <div style={styles.sachetInner}>
                  <img src="/assets/vanilla.jpeg" alt="Vanilla" style={styles.sachetMiniImg} />
                  <span style={styles.sachetLabel}>Vanilla</span>
                </div>
              </motion.div>

              {/* Butterscotch Sachet - slides Down */}
              <motion.div
                style={{
                  ...styles.sachet,
                  ...styles.butterscotchSachet,
                  y: butterscotchY,
                  rotate: butterscotchRotate,
                  opacity,
                  scale,
                }}
              >
                <div style={styles.sachetInner}>
                  <img src="/assets/butterscotch.jpeg" alt="Butterscotch" style={styles.sachetMiniImg} />
                  <span style={styles.sachetLabel}>Butterscotch</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    height: '160vh', // scroll distance to trigger sliding
    backgroundColor: '#FAF7F2',
    position: 'relative',
  },
  stickyContainer: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    alignItems: 'center',
    gap: '4rem',
    width: '100%',
  },
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '600',
  },
  title: {
    fontSize: '3.5rem',
  },
  desc: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    maxWidth: '460px',
  },
  btn: {
    marginTop: '1rem',
  },
  showcaseColumn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '500px',
    position: 'relative',
  },
  interactiveArea: {
    position: 'relative',
    width: '320px',
    height: '320px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBoxWrapper: {
    width: '280px',
    height: '280px',
    zIndex: 10,
    position: 'relative',
    filter: 'drop-shadow(0 20px 40px rgba(43, 26, 18, 0.12))',
  },
  comboPacketImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  sachet: {
    position: 'absolute',
    width: '100px',
    height: '130px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
  },
  sachetInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sachetMiniImg: {
    width: '65px',
    height: '65px',
    objectFit: 'contain',
  },
  sachetLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  roseSachet: {
    backgroundColor: '#E8B5C3',
    color: '#2B1A12',
    zIndex: 5,
  },
  chocolateSachet: {
    backgroundColor: '#4A2416',
    color: '#FAF7F2',
    zIndex: 5,
  },
  vanillaSachet: {
    backgroundColor: '#E8DDBF',
    color: '#2B1A12',
    zIndex: 4,
  },
  butterscotchSachet: {
    backgroundColor: '#C56B1F',
    color: '#FAF7F2',
    zIndex: 4,
  },
};

// Add responsive styles
const styleSheetCombo = document.createElement('style');
styleSheetCombo.innerText = `
  @media (max-width: 900px) {
    div[style*="outerContainer"] div[style*="gridTemplateColumns"] {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: 3rem !important;
      padding-top: 4rem !important;
    }
    div[style*="outerContainer"] div[style*="textColumn"] {
      align-items: center !important;
    }
    div[style*="outerContainer"] div[style*="showcaseColumn"] {
      height: 380px !important;
    }
    div[style*="outerContainer"] div[style*="interactiveArea"] {
      width: 240px !important;
      height: 240px !important;
    }
    div[style*="outerContainer"] div[style*="centerBoxWrapper"] {
      width: 200px !important;
      height: 200px !important;
    }
    div[style*="outerContainer"] div[style*="sachet"] {
      width: 80px !important;
      height: 100px !important;
    }
  }
`;
document.head.appendChild(styleSheetCombo);
