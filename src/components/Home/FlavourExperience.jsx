import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Sparkles, Flame, Flower2, Heart } from 'lucide-react';

const FLAVOURS = [
  {
    id: 'rose',
    name: 'Rose Tea',
    tagline: 'Delicate floral perfume in a cup',
    description: 'Steeped in organic rose petals and hand-picked buds, this blend offers a soothing aroma and soft pink notes that linger elegantly.',
    bg: '#F4D3DC', // soft blush pink
    textColor: '#2B1A12',
    img: '/assets/rose.jpeg',
    floatingItems: [Leaf, Sparkles, Leaf, Sparkles, Leaf],
  },
  {
    id: 'chocolate',
    name: 'Chocolate Tea',
    tagline: 'Rich, dark, and deeply comforting',
    description: 'A decadent union of premium cocoa husks and single-origin black tea. Velvety smooth, dark chocolate aroma, and a warm body.',
    bg: '#2B1A12', // deep cocoa brown
    textColor: '#FAF7F2',
    img: '/assets/chocolate.jpeg',
    floatingItems: [Heart, Sparkles, Heart, Sparkles, Heart],
  },
  {
    id: 'vanilla',
    name: 'Vanilla Tea',
    tagline: 'Silky smooth, warm orchid essence',
    description: 'Infused with real Madagascar vanilla beans. Creamy, subtle sweetness, with a golden warmth that wraps you in pure comfort.',
    bg: '#FAF7F2', // creamy ivory
    textColor: '#2B1A12',
    img: '/assets/vanilla.jpeg',
    floatingItems: [Flower2, Sparkles, Flower2, Sparkles, Flower2],
  },
  {
    id: 'butterscotch',
    name: 'Butterscotch Tea',
    tagline: 'Golden caramel and rich buttery warmth',
    description: 'Indulge in sweet toasted sugar notes, rich butteriness, and a smooth caramel glaze that transforms every sip into pure luxury.',
    bg: '#D0853E', // warm caramel
    textColor: '#FAF7F2',
    img: '/assets/butterscotch.jpeg',
    floatingItems: [Flame, Sparkles, Flame, Sparkles, Flame],
  },
];

export default function FlavourExperience({ onSelectProduct }) {
  return (
    <section style={styles.experienceContainer}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionSubtitle}>SENSORY EXPERIENCE</span>
        <h2 style={styles.sectionTitle}>The Flavour Atelier</h2>
        <p style={styles.sectionDesc}>
          Crafted with the precision of luxury perfumery, each blend is designed to engage all five senses.
        </p>
      </div>

      <div style={styles.slidesWrapper}>
        {FLAVOURS.map((flavor, index) => (
          <FlavourSlide
            key={flavor.id}
            flavor={flavor}
            index={index}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </section>
  );
}

function FlavourSlide({ flavor, index, onSelectProduct }) {
  const slideRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: slideRef,
    offset: ['start end', 'end start'],
  });

  // Scale and opacity effects based on scroll position
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0.95, 1, 1, 0.95]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <div ref={slideRef} style={{ ...styles.slide, backgroundColor: flavor.bg, color: flavor.textColor }}>
      {/* Floating elements animation */}
      <div style={styles.floatingContainer}>
        {flavor.floatingItems.map((IconComponent, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.floatingItem,
              left: `${15 + i * 18}%`,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              rotate: [0, i % 2 === 0 ? 25 : -25, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            <IconComponent size={i % 2 === 0 ? 24 : 16} strokeWidth={1.5} style={{ opacity: 0.25 }} />
          </motion.div>
        ))}
      </div>

      <motion.div style={{ ...styles.slideInner, opacity, scale }}>
        <div className="container" style={styles.gridContainer}>
          {/* Text Content */}
          <div style={styles.textSide}>
            <span style={{ ...styles.tagline, color: flavor.textColor === '#FAF7F2' ? 'rgba(250, 247, 242, 0.7)' : 'rgba(43, 26, 18, 0.7)' }}>
              {flavor.tagline}
            </span>
            <h3 style={{ ...styles.flavorName, color: flavor.textColor }}>{flavor.name}</h3>
            <p style={{ ...styles.flavorDesc, color: flavor.textColor === '#FAF7F2' ? 'rgba(250, 247, 242, 0.85)' : 'rgba(43, 26, 18, 0.85)' }}>
              {flavor.description}
            </p>
            <button
              onClick={() => onSelectProduct(flavor.id)}
              style={{
                ...styles.exploreBtn,
                color: flavor.textColor,
                borderColor: flavor.textColor,
              }}
            >
              Discover Blend
            </button>
          </div>

          {/* Product Image Side */}
          <div style={styles.imageSide}>
            <div style={styles.imageWrapper}>
              <motion.img
                src={flavor.img}
                alt={flavor.name}
                style={{ ...styles.flavorImg, y: imageY }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  experienceContainer: {
    backgroundColor: 'var(--bg-color)',
    paddingTop: '6rem',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
  },
  sectionSubtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: '3.5rem',
  },
  sectionDesc: {
    maxWidth: '550px',
    fontSize: '1.1rem',
  },
  slidesWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  slide: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '4rem 0',
  },
  floatingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  },
  floatingItem: {
    position: 'absolute',
    top: '30%',
    opacity: 0.6,
  },
  slideInner: {
    width: '100%',
    zIndex: 2,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    alignItems: 'center',
    gap: '4rem',
  },
  textSide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  tagline: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600',
  },
  flavorName: {
    fontSize: '4.5rem',
    fontWeight: '300',
    lineHeight: '1',
  },
  flavorDesc: {
    fontSize: '1.15rem',
    lineHeight: '1.7',
    maxWidth: '450px',
  },
  exploreBtn: {
    background: 'none',
    border: '1px solid',
    padding: '1rem 2rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  imageSide: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    maxWidth: '380px',
    height: '380px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flavorImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))',
  },
};

// Add responsive styles for Flavour Slide
const styleSheetFlavour = document.createElement('style');
styleSheetFlavour.innerText = `
  @media (max-width: 900px) {
    div[style*="minHeight"] div[style*="gridTemplateColumns"] {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: 3rem !important;
    }
    div[style*="minHeight"] div[style*="textSide"] {
      align-items: center !important;
    }
    div[style*="minHeight"] h3[style*="flavorName"] {
      font-size: 3rem !important;
    }
    div[style*="minHeight"] div[style*="imageWrapper"] {
      max-width: 260px !important;
      height: 260px !important;
    }
  }
`;
document.head.appendChild(styleSheetFlavour);
