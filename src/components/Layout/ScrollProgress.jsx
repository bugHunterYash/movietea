import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Smooth out the progress for the progress bar height
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track scroll position to determine if at bottom (e.g. > 95%)
  useEffect(() => {
    const handleScroll = () => {
      // document height - window height
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      
      const currentScroll = window.scrollY;
      const progress = currentScroll / scrollableHeight;
      
      // If we are within 5% of the bottom, show the BACK TO TOP indicator
      if (progress > 0.95) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also attach to resize to recalculate document height
    window.addEventListener('resize', handleScroll);
    
    // Initial check
    handleScroll(); 
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (isAtBottom) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className={`global-scroll-indicator ${isAtBottom ? 'scroll-clickable' : ''}`}
      onClick={scrollToTop}
    >
      <AnimatePresence mode="wait">
        {!isAtBottom ? (
          <motion.div 
            key="text-scroll"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            className="scroll-text"
          >
            SCROLL
          </motion.div>
        ) : (
          <motion.div 
            key="text-top"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.4 }}
            className="scroll-text"
          >
            TOP
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scroll-track">
        <motion.div 
          className="scroll-progress"
          style={{ scaleY }}
        />
      </div>

      <motion.div
        animate={{ 
          y: isAtBottom ? 0 : [0, 6, 0],
          rotate: isAtBottom ? 180 : 0 
        }}
        transition={{ 
          y: { duration: 2.8, repeat: isAtBottom ? 0 : Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.5, ease: 'easeInOut' }
        }}
        className="scroll-arrow"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 4L6 7.5L9.5 4" stroke="var(--primary-color)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  );
}

// Inject Global CSS for the Premium Scroll Progress Indicator
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  .global-scroll-indicator {
    position: fixed;
    bottom: 40px;
    right: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 9999;
    opacity: 0.75;
    transition: opacity 0.3s ease;
  }
  .scroll-clickable {
    cursor: pointer;
  }
  .scroll-clickable:hover {
    opacity: 1;
  }
  .scroll-text {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 7px;
    color: var(--primary-color);
    writing-mode: vertical-rl;
    text-transform: uppercase;
  }
  .scroll-track {
    width: 1px;
    height: 70px;
    background-color: rgba(197, 107, 31, 0.2);
    position: relative;
    overflow: hidden;
  }
  .scroll-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--primary-color);
    transform-origin: top;
  }
  .scroll-arrow {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .global-scroll-indicator {
      right: 30px;
      transform: scale(0.9);
    }
  }
  
  @media (max-width: 768px) {
    .global-scroll-indicator {
      right: 20px;
      bottom: 20px;
      gap: 0;
    }
    .scroll-text {
      display: none !important;
    }
    .scroll-track {
      height: 40px;
      margin-bottom: 8px;
    }
  }
`;
document.head.appendChild(styleSheet);
