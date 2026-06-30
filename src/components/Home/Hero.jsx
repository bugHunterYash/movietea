import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getProducts } from '../../utils/db';

export default function Hero({ onShopClick }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const allProducts = getProducts();
  const heroProducts = [
    allProducts.find(p => p.id === 'hero_combo'),
    allProducts.find(p => p.id === 'choc_100'),
    allProducts.find(p => p.id === 'van_jar'),
    allProducts.find(p => p.id === 'combo_10'),
    allProducts.find(p => p.id === 'rose_10'),
    allProducts.find(p => p.id === 'combo_jar'),
  ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const currentProduct = heroProducts[currentIndex] || heroProducts[0];

  // Monitor scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll animations for sachets emerging from behind the box
  const roseX = useTransform(scrollYProgress, [0, 0.8], [0, -300]);
  const roseY = useTransform(scrollYProgress, [0, 0.8], [0, -120]);
  const roseRotate = useTransform(scrollYProgress, [0, 0.8], [0, -25]);

  const chocolateX = useTransform(scrollYProgress, [0, 0.8], [0, 300]);
  const chocolateY = useTransform(scrollYProgress, [0, 0.8], [0, 120]);
  const chocolateRotate = useTransform(scrollYProgress, [0, 0.8], [0, 25]);

  const vanillaY = useTransform(scrollYProgress, [0, 0.8], [0, -320]);
  const vanillaRotate = useTransform(scrollYProgress, [0, 0.8], [0, -10]);

  const butterscotchY = useTransform(scrollYProgress, [0, 0.8], [0, 320]);
  const butterscotchRotate = useTransform(scrollYProgress, [0, 0.8], [0, 15]);

  const sachetOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0, 1, 1]);
  
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const rotateX = -mousePos.y * 12;
  const rotateY = mousePos.x * 12;

  return (
    <section ref={containerRef} style={styles.heroSection} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Background Subtle Gradient & Steam */}
      <div style={styles.heroBg} />
      
      {/* Steam SVG Animation */}
      <div style={styles.steamContainer}>
        <svg viewBox="0 0 100 100" style={styles.steamSvg}>
          <motion.path
            d="M30 80 Q 25 50 35 30 T 30 10"
            fill="none"
            stroke="rgba(197, 107, 31, 0.15)"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
               d: [
                 "M30 80 Q 25 50 35 30 T 30 10",
                 "M35 80 Q 30 60 25 40 T 35 10",
                 "M30 80 Q 25 50 35 30 T 30 10"
               ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M50 80 Q 55 55 45 35 T 50 10"
            fill="none"
            stroke="rgba(197, 107, 31, 0.12)"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
               d: [
                 "M50 80 Q 55 55 45 35 T 50 10",
                 "M45 80 Q 40 50 55 30 T 45 10",
                 "M50 80 Q 55 55 45 35 T 50 10"
               ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </div>

      <div className="container" style={styles.container}>
        {/* Left: Typography */}
        <div style={styles.leftCol}>
          <div style={styles.titleContainer}>
            <motion.div
              style={styles.badge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              🎉 First Order Special
            </motion.div>
            <motion.span 
              style={styles.subtitle}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Modern Tea Atelier
            </motion.span>
            
            <h1 style={styles.title}>
              <span className="split-word-container">
                <motion.span
                  style={styles.titleSpan}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  NOT YOUR
                </motion.span>
              </span>
              <br />
              <span className="split-word-container">
                <motion.span
                  style={styles.titleSpan}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.5 }}
                >
                  REGULAR TEA
                </motion.span>
              </span>
            </h1>
          </div>

          <motion.p
            style={styles.desc}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Organic ingredients. Zero added sugar. Crafted around authentic luxury packaging and premium flavours.
          </motion.p>

          <motion.div
            style={styles.priceContainer}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div style={styles.priceRow}>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={`name-${currentIndex}`} 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }} 
                  transition={{ duration: 0.3 }}
                  style={{ ...styles.priceLabel, display: 'inline-block' }}
                >
                  {currentProduct.name}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={`sell-${currentIndex}`} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  style={{ ...styles.priceReal, display: 'inline-block' }}
                >
                  ₹{currentProduct.sellingPrice}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={`base-${currentIndex}`} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  style={{ ...styles.priceMrp, display: 'inline-block' }}
                >
                  ₹{currentProduct.basePrice}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={`save-${currentIndex}`} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  style={{ ...styles.saveBadge, display: 'inline-block' }}
                >
                  Save ₹{currentProduct.basePrice - currentProduct.sellingPrice}
                </motion.span>
              </AnimatePresence>
            </div>
            <div style={styles.firstOrderOfferRow}>
              <span style={styles.firstOrderOfferLabel}>First Order Price:</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={`first-${currentIndex}`} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  style={{ ...styles.firstOrderPrice, display: 'inline-block' }}
                >
                  ₹{Math.floor(currentProduct.sellingPrice * 0.7)}
                </motion.span>
              </AnimatePresence>
              <span style={styles.percentOffBadge}>30% OFF Applied</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button className="luxury-btn" onClick={onShopClick}>
              Explore Collection
            </button>
          </motion.div>
        </div>

        {/* Right: Interactive Product Pack & Emerging Sachets */}
        <div style={styles.rightCol}>
          <div
            style={{
              ...styles.interactiveGroup,
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
          >
            {/* Main Box - rotating product images */}
            <motion.div
              style={styles.mainBoxWrapper}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <div style={styles.productShadow} />
              <AnimatePresence mode="wait">
                <motion.img
                  key={`img-${currentIndex}`}
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  style={{ ...styles.boxImg, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                  initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Emerging Flavours */}
            {/* Rose sachet - emerges left/up */}
            <motion.div
              style={{
                ...styles.sachet,
                x: roseX,
                y: roseY,
                rotate: roseRotate,
                opacity: sachetOpacity,
              }}
            >
              <img src="/assets/rose.jpeg" alt="Rose" style={styles.sachetImg} />
              <span style={styles.sachetLabel}>Rose</span>
            </motion.div>

            {/* Chocolate sachet - emerges right/down */}
            <motion.div
              style={{
                ...styles.sachet,
                x: chocolateX,
                y: chocolateY,
                rotate: chocolateRotate,
                opacity: sachetOpacity,
              }}
            >
              <img src="/assets/chocolate.jpeg" alt="Chocolate" style={styles.sachetImg} />
              <span style={styles.sachetLabel}>Chocolate</span>
            </motion.div>

            {/* Vanilla sachet - emerges up */}
            <motion.div
              style={{
                ...styles.sachet,
                y: vanillaY,
                rotate: vanillaRotate,
                opacity: sachetOpacity,
              }}
            >
              <img src="/assets/vanilla.jpeg" alt="Vanilla" style={styles.sachetImg} />
              <span style={styles.sachetLabel}>Vanilla</span>
            </motion.div>

            {/* Butterscotch sachet - emerges down */}
            <motion.div
              style={{
                ...styles.sachet,
                y: butterscotchY,
                rotate: butterscotchRotate,
                opacity: sachetOpacity,
              }}
            >
              <img src="/assets/butterscotch.jpeg" alt="Butterscotch" style={styles.sachetImg} />
              <span style={styles.sachetLabel}>Butterscotch</span>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

const styles = {
  heroSection: {
    minHeight: '120vh', // Slightly longer to allow scroll trigger space
    display: 'flex',
    alignItems: 'center',
    paddingTop: 'var(--header-height)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FAF7F2',
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 75% 50%, rgba(243, 232, 211, 0.4) 0%, rgba(250, 247, 242, 0) 60%)',
    zIndex: 1,
  },
  steamContainer: {
    position: 'absolute',
    right: '10%',
    bottom: '10%',
    width: '35%',
    height: '50%',
    zIndex: 2,
    pointerEvents: 'none',
  },
  steamSvg: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    alignItems: 'center',
    gap: '3rem',
    zIndex: 3,
    position: 'relative',
    width: '100%',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAF7F2',
    color: 'var(--primary-color)',
    border: '1px solid var(--primary-color)',
    padding: '0.4rem 0.8rem',
    borderRadius: '30px',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-sans)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  priceContainer: {
    backgroundColor: 'var(--cream-color)',
    padding: '1.25rem 1.5rem',
    borderLeft: '3px solid var(--primary-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    maxWidth: '480px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  priceLabel: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--dark-color)',
  },
  priceReal: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '700',
    fontSize: '1.2rem',
    color: 'var(--dark-color)',
  },
  priceMrp: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    color: '#888',
    textDecoration: 'line-through',
  },
  saveBadge: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--white)',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '0.2rem 0.5rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  firstOrderOfferRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  firstOrderOfferLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    color: 'var(--text-light)',
  },
  firstOrderPrice: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '800',
    fontSize: '1.3rem',
    color: 'var(--primary-color)',
  },
  percentOffBadge: {
    border: '1px dashed var(--primary-color)',
    color: 'var(--primary-color)',
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.1rem 0.4rem',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '500',
  },
  title: {
    fontSize: '5.2rem',
    lineHeight: '1.05',
    color: 'var(--dark-color)',
    fontWeight: '300',
  },
  titleSpan: {
    display: 'inline-block',
  },
  desc: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.2rem',
    lineHeight: '1.8',
    maxWidth: '480px',
    color: 'var(--text-light)',
  },
  rightCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '750px',
    position: 'relative',
  },
  interactiveGroup: {
    width: '640px',
    height: '640px',
    position: 'relative',
    transition: 'transform 0.2s ease-out',
    transformStyle: 'preserve-3d',
  },
  mainBoxWrapper: {
    width: '100%',
    height: '100%',
    zIndex: 10,
    position: 'relative',
  },
  boxImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  productShadow: {
    position: 'absolute',
    bottom: '-10px',
    left: '10%',
    width: '80%',
    height: '25px',
    background: 'radial-gradient(ellipse at center, rgba(43, 26, 18, 0.2) 0%, rgba(250, 247, 242, 0) 70%)',
    zIndex: -1,
  },
  sachet: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '320px',
    height: '320px',
    zIndex: 5,
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
  },
  sachetImg: {
    width: '100%',
    height: '80%',
    objectFit: 'contain',
  },
  sachetLabel: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    color: 'var(--dark-color)',
  },
};

// Add responsive media query styles for Hero
if (typeof document !== 'undefined') {
  const styleSheetHero = document.createElement('style');
  styleSheetHero.innerText = `
    @media (max-width: 1024px) {
      section {
        min-height: auto !important;
        padding-bottom: 6rem !important;
      }
      section > div[style*="gridTemplateColumns"] {
        grid-template-columns: 1fr !important;
        text-align: center !important;
        padding-top: 3rem !important;
        gap: 4rem !important;
      }
      section h1[style*="fontSize"] {
        font-size: 3.5rem !important;
      }
      section div[style*="leftCol"] {
        align-items: center !important;
      }
      section p[style*="desc"] {
        text-align: center !important;
      }
      section div[style*="rightCol"] {
        height: 480px !important;
      }
      section div[style*="interactiveGroup"] {
        width: 320px !important;
        height: 320px !important;
      }
      section div[style*="sachet"] {
        width: 160px !important;
        height: 160px !important;
        top: 25% !important;
        left: 25% !important;
      }
      section span[style*="sachetLabel"] {
        font-size: 0.85rem !important;
      }
    }
    @media (max-width: 480px) {
      section h1[style*="fontSize"] {
        font-size: 2.8rem !important;
      }
      section div[style*="interactiveGroup"] {
        width: 260px !important;
        height: 260px !important;
      }
      section div[style*="sachet"] {
        width: 130px !important;
        height: 130px !important;
      }
    }
  `;
  document.head.appendChild(styleSheetHero);
}

