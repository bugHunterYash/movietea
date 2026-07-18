import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CAMPAIGN_SLIDES = [
  {
    id: 1,
    image: "/images/loader1.webp"
  },
  {
    id: 2,
    image: "/images/loader2.webp"
  },
  {
    id: 3,
    image: "/images/loader3.webp"
  }
];

export default function Hero({ onShopClick }) {
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? CAMPAIGN_SLIDES.length - 1 : prev - 1));
  };

  const goToSlide = (idx, e) => {
    e.stopPropagation();
    setCurrent(idx);
  };

  const handleBannerClick = () => {
    if (onShopClick) onShopClick();
  };

  return (
    <div style={styles.wrapper}>
      <section style={styles.heroSection} onClick={handleBannerClick} className="hero-slider-section">
        
        {/* Hidden Spacer Image to dictate container height dynamically based on aspect ratio */}
        <img 
          src={CAMPAIGN_SLIDES[0].image} 
          alt="spacer" 
          style={{ width: '100%', height: 'auto', visibility: 'hidden', display: 'block' }} 
        />

        {/* Slides */}
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            style={styles.slideContainer}
          >
            {/* Background Image */}
            <motion.img 
              src={CAMPAIGN_SLIDES[current].image} 
              alt="Campaign Banner"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={styles.bgImage}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button onClick={prevSlide} style={{...styles.navBtn, left: '2rem'}} className="hero-nav-btn" aria-label="Previous Campaign">
          <ChevronLeft size={36} strokeWidth={1.5} color="#FFF" />
        </button>
        <button onClick={nextSlide} style={{...styles.navBtn, right: '2rem'}} className="hero-nav-btn" aria-label="Next Campaign">
          <ChevronRight size={36} strokeWidth={1.5} color="#FFF" />
        </button>

        {/* Pagination Dots */}
        <div style={styles.paginationContainer}>
          {CAMPAIGN_SLIDES.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => goToSlide(idx, e)}
              style={{
                ...styles.dot,
                backgroundColor: current === idx ? '#FFF' : 'rgba(255,255,255,0.3)',
                transform: current === idx ? 'scale(1)' : 'scale(0.8)'
              }}
              className="hero-dot-btn"
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        
      </section>

      {/* Trust Bar below Hero */}
      <div style={styles.trustBar}>
        <div style={styles.trustItem}>100% Natural Ingredients</div>
        <div style={styles.trustDot} />
        <div style={styles.trustItem}>Zero Added Sugar</div>
        <div style={styles.trustDot} />
        <div style={styles.trustItem}>Made in India</div>
        <div style={styles.trustDot} />
        <div style={styles.trustItem}>Premium Tea Leaves</div>
        <div style={styles.trustDot} />
        <div style={styles.trustItem}>Fast Shipping</div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '110px',
  },
  heroSection: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FAF7F2',
    cursor: 'pointer',
    display: 'block',
  },
  slideContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    zIndex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  contentContainer: {
    position: 'relative',
    zIndex: 10,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  textContent: {
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    alignItems: 'flex-start',
    paddingTop: 'calc(var(--header-height) + 20px)',
  },
  headline: {
    fontSize: '5.5rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    lineHeight: '1.05',
    letterSpacing: '-0.02em',
    textShadow: '0px 10px 30px rgba(0,0,0,0.2)',
  },
  ctaBtn: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '0.9rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '1.25rem 2.5rem',
    backgroundColor: '#FFF',
    color: '#1A120E',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 15px 30px rgba(0,0,0,0.15)',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '1rem',
    opacity: 0.5,
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: '2.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'center',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.4s ease',
  },
  trustBar: {
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderBottom: '1px solid rgba(43, 26, 18, 0.08)',
    padding: '1.2rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  trustItem: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#4A3E38',
  },
  trustDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#C5A376',
  }
};

// Add interactive styling
if (typeof document !== 'undefined') {
  const styleSheetHero = document.createElement('style');
  styleSheetHero.innerText = `
    .campaign-cta-btn:hover {
      background-color: var(--primary-color) !important;
      color: #FFF !important;
      transform: translateY(-2px);
      box-shadow: 0 20px 40px rgba(197, 107, 31, 0.3) !important;
    }
    
    .hero-nav-btn:hover {
      opacity: 1 !important;
      transform: translateY(-50%) scale(1.1) !important;
    }
    
    .hero-dot-btn:hover {
      background-color: #FFF !important;
      opacity: 0.8;
    }

    /* Keep the hover state of the entire hero section clean */
    .hero-slider-section:hover .hero-nav-btn {
      opacity: 0.8;
    }

    @media (max-width: 1024px) {
      .campaign-headline {
        font-size: 4rem !important;
      }
      div[style*="textContent"] {
        padding-left: 2rem;
      }
    }
    
    @media (max-width: 768px) {
      .campaign-headline {
        font-size: 3rem !important;
      }
      div[style*="textContent"] {
        padding-left: 0;
        align-items: center;
        text-align: center;
      }
      div[style*="heroSection"] {
        height: 75vh !important;
      }
      .hero-nav-btn {
        display: none !important;
      }
      div[style*="trustBar"] {
        gap: 1rem !important;
        flex-direction: column !important;
        text-align: center !important;
      }
      div[style*="trustDot"] {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleSheetHero);
}
