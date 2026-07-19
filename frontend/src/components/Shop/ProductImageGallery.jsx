import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductImageGallery({ images, productName, alt, mode = "shop" }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  // Fallback if images array is empty or malformed
  const validImages = Array.isArray(images) && images.length > 0 
    ? images 
    : ['/images/Final.png', '/images/Final.png'];

  const primaryImage = validImages[0];
  const secondaryImage = validImages[1] || primaryImage;

  // Handle magnifier mouse movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    // Preload secondary image
    if (mode === 'shop' && secondaryImage !== primaryImage) {
      const img = new Image();
      img.src = secondaryImage;
    }
  }, [mode, secondaryImage, primaryImage]);

  if (mode === 'shop') {
    return (
      <div 
        className="shop-gallery-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={styles.shopContainer}
      >
        <img 
          src={primaryImage} 
          alt={`${alt || productName} - Front View`}
          loading="lazy"
          decoding="async"
          style={{
            ...styles.shopImage,
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? 'scale(1.03)' : 'scale(1)'
          }}
          onError={(e) => { e.target.onerror = null; e.target.src = '/images/Final.png'; }}
        />
        <img 
          src={secondaryImage} 
          alt={`${alt || productName} - Lifestyle View`}
          loading="lazy"
          decoding="async"
          className="desktop-only-hover-img"
          style={{
            ...styles.shopHoverImage,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1.03)' : 'scale(1)'
          }}
          onError={(e) => { e.target.onerror = null; e.target.src = '/images/Final.png'; }}
        />
      </div>
    );
  }

  if (mode === 'details') {
    return (
      <div className="details-gallery-wrapper" style={styles.detailsWrapper}>
        
        {/* Desktop: Vertical Thumbnails */}
        <div className="details-thumbnails" style={styles.thumbnailsContainer}>
          {validImages.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              style={{
                ...styles.thumbBtn,
                borderColor: activeImageIndex === idx ? 'var(--dark-color)' : 'transparent',
                opacity: activeImageIndex === idx ? 1 : 0.6
              }}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} style={styles.thumbImg} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>

        {/* Main Image with Magnifier */}
        <div 
          className="details-main-image-container"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          style={styles.mainImageContainer}
        >
          <img 
            src={validImages[activeImageIndex]} 
            alt={`${alt || productName} - Detailed View`}
            style={{
              ...styles.mainImage,
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isHovered ? 'scale(1.8)' : 'scale(1)'
            }}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Mobile Swipe Indicators */}
        <div className="mobile-dots" style={styles.mobileDots}>
          {validImages.map((_, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.dot,
                backgroundColor: activeImageIndex === idx ? 'var(--dark-color)' : '#D6B58A'
              }} 
            />
          ))}
        </div>

      </div>
    );
  }

  return null;
}

const styles = {
  shopContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'opacity 0.3s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shopHoverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'opacity 0.3s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  
  detailsWrapper: {
    display: 'flex',
    gap: '2rem',
    width: '100%',
    height: '100%',
  },
  thumbnailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '80px',
    flexShrink: 0,
  },
  thumbBtn: {
    width: '80px',
    height: '80px',
    padding: '4px',
    backgroundColor: '#FFF',
    border: '2px solid transparent',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  mainImageContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '24px',
    backgroundColor: '#FFF',
    border: '1px solid rgba(43, 26, 18, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'crosshair',
    height: '500px', // Standardized height
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'transform 0.1s ease-out',
  },
  mobileDots: {
    display: 'none',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '1rem',
    width: '100%',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease',
  }
};

// Global styles for mobile handling
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = `
    @media (max-width: 768px) {
      .desktop-only-hover-img {
        display: none !important;
      }
      .shop-gallery-container img {
        opacity: 1 !important;
        transform: scale(1) !important;
      }
      
      .details-gallery-wrapper {
        flex-direction: column !important;
        gap: 1rem !important;
      }
      .details-thumbnails {
        flex-direction: row !important;
        width: 100% !important;
        overflow-x: auto !important;
        padding-bottom: 8px !important;
      }
      .details-main-image-container {
        height: 350px !important;
        border-radius: 16px !important;
        /* Disable zoom on mobile */
        pointer-events: none; 
      }
      .mobile-dots {
        display: flex !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
