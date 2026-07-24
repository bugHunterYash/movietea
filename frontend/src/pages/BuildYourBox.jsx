import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

const PRODUCTS = [
  { id: 'rose', name: "Rose Atelier - BYOB", image: "/shop/100%20gm%20combo%20image%201.webp" },
  { id: 'chocolate', name: "Chocolate Reserve - BYOB", image: "/shop/100%20gm%20combo%20image%201.webp" },
  { id: 'vanilla', name: "Vanilla Orchid - BYOB", image: "/shop/100%20gm%20combo%20image%201.webp" },
  { id: 'butterscotch', name: "Toasted Butterscotch - BYOB", image: "/shop/100%20gm%20combo%20image%201.webp" }
];

const TARGET_ITEMS = 10;
const FIXED_PRICE = 1299;

export default function BuildYourBox() {
  const [quantities, setQuantities] = useState({
    rose: 0,
    chocolate: 0,
    vanilla: 0,
    butterscotch: 0
  });

  const navigate = useNavigate();

  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);
  const isComplete = totalSelected === TARGET_ITEMS;

  useEffect(() => {
    // Initial page load party popper
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFDF40', '#6FCF97', '#FF7F50', '#8A2BE2']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFDF40', '#6FCF97', '#FF7F50', '#8A2BE2']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleAdd = (id, e) => {
    if (totalSelected >= TARGET_ITEMS) return;

    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));

    // Small pop at button position
    if (e && e.clientX && e.clientY) {
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { x, y },
        colors: ['#FFDF40', '#E53935', '#4A90E2', '#50C878'],
        disableForReducedMotion: true
      });
    }
  };

  const handleRemove = (id) => {
    if (quantities[id] > 0) {
      setQuantities(prev => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Banner Section matching SVG Path design request */}
      <div style={styles.banner}>
        <div className="container" style={styles.bannerContent}>
          <h1 style={styles.bannerTitle}>Build Your Own Tea Box</h1>
          <p style={styles.bannerSubtitle}>Mix your favorite flavors and create a box that fits your routine.</p>
          <div style={styles.bannerHighlights}>
            <div style={styles.highlightItem}>
              <ShoppingBag size={24} color="#FFF" />
              <span>Choose {TARGET_ITEMS} Flavours</span>
            </div>
          </div>
        </div>
        {/* SVG Wave Divider */}
        <div style={styles.waveContainer}>
          <svg viewBox="0 0 1440 120" style={styles.waveSvg} preserveAspectRatio="none">
            <path
              fill="#FAF7F2"
              fillOpacity="1"
              d="M0,64L60,53.3C120,43,240,21,360,26.7C480,32,600,64,720,69.3C840,75,960,53,1080,42.7C1200,32,1320,32,1380,32L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container" style={styles.mainContent}>
        <div style={styles.stepHeader}>
          <h2 style={styles.stepTitle}>Grab Any {TARGET_ITEMS} at ₹{FIXED_PRICE}!!</h2>
          <div style={styles.stepDivider}>
            <span style={styles.stepLabel}>Step 1</span>
          </div>
          <div style={styles.progressText}>
            Select {TARGET_ITEMS - totalSelected} more pack{TARGET_ITEMS - totalSelected !== 1 && 's'}!
          </div>
        </div>

        <div style={styles.grid}>
          {PRODUCTS.map(product => {
            const count = quantities[product.id];
            return (
              <div key={product.id} style={styles.card}>
                <div style={styles.imageBox}>
                  <img src={product.image} alt={product.name} style={styles.productImage} />
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.productTitle}>{product.name}</h3>
                </div>
                
                {count === 0 ? (
                  <button 
                    style={styles.addToBoxBtn} 
                    onClick={(e) => handleAdd(product.id, e)}
                    disabled={totalSelected >= TARGET_ITEMS}
                  >
                    ADD TO BOX
                  </button>
                ) : (
                  <div style={styles.controlsRow}>
                    <button style={styles.controlBtn} onClick={() => handleRemove(product.id)}>
                      <Minus size={16} />
                    </button>
                    <span style={styles.countText}>{count} added</span>
                    <button 
                      style={styles.controlBtn} 
                      onClick={(e) => handleAdd(product.id, e)}
                      disabled={totalSelected >= TARGET_ITEMS}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <div style={styles.stickyBar}>
        <div className="container" style={styles.stickyContent}>
          <div style={styles.stickyInfo}>
            <div style={styles.selectedCount}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: isComplete ? '#50C878' : '#1A1A1A' }}>
                {totalSelected} / {TARGET_ITEMS}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '0.5rem' }}>Added</span>
            </div>
            <div style={styles.subtotalBlock}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Subtotal</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{FIXED_PRICE}</span>
            </div>
          </div>
          <button 
            style={{
              ...styles.checkoutBtn,
              backgroundColor: isComplete ? '#FDB827' : '#D1C7BD',
              color: isComplete ? '#1A1A1A' : '#888',
              cursor: isComplete ? 'pointer' : 'not-allowed'
            }}
            disabled={!isComplete}
            onClick={() => {
              if (isComplete) {
                alert("Proceeding to checkout with " + totalSelected + " items!");
              }
            }}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FAF7F2',
    minHeight: '100vh',
    paddingBottom: '120px', // Space for sticky bar
    paddingTop: 'var(--header-height, 75px)',
  },
  banner: {
    backgroundColor: '#304FFE', // A vibrant blue
    color: '#FFF',
    position: 'relative',
    paddingTop: '4rem',
  },
  bannerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 2rem 4rem 2rem',
  },
  bannerTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: '1rem',
    textTransform: 'uppercase',
    color: '#FFDF40'
  },
  bannerSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    maxWidth: '600px',
  },
  bannerHighlights: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem',
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  waveContainer: {
    position: 'absolute',
    bottom: '-1px',
    left: 0,
    width: '100%',
    overflow: 'hidden',
    lineHeight: 0,
  },
  waveSvg: {
    position: 'relative',
    display: 'block',
    width: 'calc(100% + 1.3px)',
    height: '60px',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 1.5rem',
  },
  stepHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  stepTitle: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 800,
    color: '#1A1A1A',
    marginBottom: '1.5rem',
  },
  stepDivider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    position: 'relative',
  },
  stepLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: 600,
    textTransform: 'uppercase',
    borderBottom: '1px solid #1A1A1A',
    paddingBottom: '0.2rem',
  },
  progressText: {
    backgroundColor: '#F3F0EB',
    padding: '0.8rem 2rem',
    display: 'inline-block',
    borderRadius: '4px',
    fontWeight: 600,
    color: '#4A3E38',
    marginTop: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #EBE6DF',
  },
  imageBox: {
    backgroundColor: '#F9F9F9',
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  productImage: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
  },
  cardContent: {
    padding: '1.2rem',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid #EBE6DF',
  },
  productTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1A1A1A',
    fontFamily: 'var(--font-sans)',
  },
  addToBoxBtn: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    border: 'none',
    fontWeight: 800,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F0EB',
    borderTop: '1px solid #EBE6DF',
  },
  controlBtn: {
    padding: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  countText: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#1A1A1A',
  },
  stickyBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#FFF',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    padding: '1rem 0',
    zIndex: 1000,
  },
  stickyContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  stickyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '3rem',
  },
  selectedCount: {
    display: 'flex',
    flexDirection: 'column',
  },
  subtotalBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  checkoutBtn: {
    padding: '1rem 3rem',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 800,
    fontSize: '1rem',
    transition: 'all 0.2s',
  }
};
