import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Compass, Leaf, Heart } from 'lucide-react';
import { PRICING } from '../utils/pricing';

const FLAVOUR_DETAILS = {
  rose: {
    name: 'Rose Atelier Tea',
    subtitle: 'Floral & Gentle',
    img: '/assets/rose.jpeg',
    bg: '#F4D3DC', // soft blush pink
    primaryColor: '#C56B1F',
    textColor: '#2B1A12',
    accentColor: '#E8B5C3',
    price: PRICING.rose.sale,
    mrp: PRICING.rose.mrp,
    description: 'A beautiful botanical infusion featuring tender organic rose buds and delicate petals blended with premium hand-selected black tea. Designed to deliver a relaxing floral scent and a clean, mildly sweet taste that lingers on the palate.',
    ingredients: [
      { name: 'Organic Rose Buds', source: 'Sourced from Kannauj, India' },
      { name: 'Darjeeling Black Tea', source: 'Single-estate premium leaves' },
      { name: 'Rosehip Extracts', source: 'Naturally rich in antioxidants' }
    ],
    tasteProfile: {
      Sweetness: 45,
      Creaminess: 20,
      'Floral Notes': 95,
      Richness: 50
    }
  },
  chocolate: {
    name: 'Cacao Reserve Tea',
    subtitle: 'Bold & Decadent',
    img: '/assets/chocolate.jpeg',
    bg: '#2B1A12', // deep cocoa brown
    primaryColor: '#C56B1F',
    textColor: '#FAF7F2',
    accentColor: '#4A2416',
    price: PRICING.chocolate.sale,
    mrp: PRICING.chocolate.mrp,
    description: 'A luxurious dark blend uniting premium roasted cacao husks and high-grade single-origin black tea. Velvety smooth body, deep chocolate aroma, and a warm, slightly woody finish. Perfect as a guilt-free dessert tea.',
    ingredients: [
      { name: 'Roasted Cacao Husks', source: 'Sourced from Kerala, India' },
      { name: 'Assam CTC Black Tea', source: 'Full-bodied malty base' },
      { name: 'Vanilla Bean Powder', source: 'For natural rich depth' }
    ],
    tasteProfile: {
      Sweetness: 30,
      Creaminess: 65,
      'Floral Notes': 10,
      Richness: 90
    }
  },
  vanilla: {
    name: 'Vanilla Orchid Tea',
    subtitle: 'Silky & Comforting',
    img: '/assets/vanilla.jpeg',
    bg: '#FAF7F2', // creamy ivory
    primaryColor: '#C56B1F',
    textColor: '#2B1A12',
    accentColor: '#E8DDBF',
    price: PRICING.vanilla.sale,
    mrp: PRICING.vanilla.mrp,
    description: 'Infused with real Madagascar bourbon vanilla bean pods. A creamy, comforting blend with a smooth vanilla aroma and a naturally round sweetness. Pairs beautifully with hot milk or as a standalone aromatic brew.',
    ingredients: [
      { name: 'Madagascar Vanilla Pods', source: 'Authentic bourbon vanilla' },
      { name: 'Orthodox Black Tea', source: 'Whole leaf high-grown tea' },
      { name: 'Sweet Clover extracts', source: 'For botanical sweetness' }
    ],
    tasteProfile: {
      Sweetness: 60,
      Creaminess: 85,
      'Floral Notes': 30,
      Richness: 70
    }
  },
  butterscotch: {
    name: 'Toasted Butterscotch Tea',
    subtitle: 'Golden & Indulgent',
    img: '/assets/butterscotch.jpeg',
    bg: '#D0853E', // warm caramel
    primaryColor: '#2B1A12',
    textColor: '#FAF7F2',
    accentColor: '#C56B1F',
    price: PRICING.butterscotch.sale,
    mrp: PRICING.butterscotch.mrp,
    description: 'Indulge in sweet toasted sugar notes, rich buttery warmth, and a smooth caramel glaze. We have captured the essence of classic butterscotch and combined it with premium black tea for an unforgettable sensory ritual.',
    ingredients: [
      { name: 'Toasted Sugar Extracts', source: 'Crafted natural caramelization' },
      { name: 'CTC Premium Black Tea', source: 'Rich, robust tea base' },
      { name: 'Natural Butter Flavouring', source: 'Dairy-free, allergen-safe extract' }
    ],
    tasteProfile: {
      Sweetness: 75,
      Creaminess: 80,
      'Floral Notes': 15,
      Richness: 85
    }
  }
};

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const productId = id || 'butterscotch';
  const flavor = FLAVOUR_DETAILS[productId] || FLAVOUR_DETAILS.butterscotch;

  useEffect(() => {
    document.title = `${flavor.name} | MOVITEA`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", `Indulge in ${flavor.name} - ${flavor.subtitle}. ${flavor.description}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [productId, flavor.name, flavor.subtitle, flavor.description]);

  return (
    <div style={{ ...styles.page, backgroundColor: flavor.bg, color: flavor.textColor }}>
      {/* Section 1: Hero Showcase */}
      <section style={styles.showcaseSection}>
        <div className="container" style={styles.showcaseGrid}>
          <div style={styles.imageCol}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
              style={styles.imgWrapper}
            >
              <img src={flavor.img} alt={flavor.name} style={styles.mainImg} />
            </motion.div>
          </div>

          <div style={styles.infoCol}>
            <span style={{ ...styles.subtitle, color: flavor.primaryColor }}>{flavor.subtitle}</span>
            <h1 style={{ ...styles.title, color: flavor.textColor }}>{flavor.name}</h1>
            
            <div style={styles.priceContainer}>
              <span style={{ ...styles.price, color: flavor.textColor }}>₹{flavor.price}</span>
              <span style={{ ...styles.mrp, color: flavor.textColor === '#FAF7F2' ? 'rgba(250,247,242,0.6)' : 'rgba(43,26,18,0.6)' }}>₹{flavor.mrp}</span>
              <span style={styles.saveBadge}>Save {Math.round((1 - flavor.price / flavor.mrp) * 100)}%</span>
            </div>
            
            <p style={{ ...styles.desc, color: flavor.textColor === '#FAF7F2' ? 'rgba(250, 247, 242, 0.85)' : 'var(--text-light)' }}>{flavor.description}</p>

            {/* Elegant cream-colored offer card */}
            <div style={styles.offerBox}>
              <div style={styles.offerTitleRow}>
                <span style={styles.offerBadge}>
                  <Sparkles size={12} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                  First Order Special
                </span>
                <span style={styles.offerTitle}>Get 50% OFF on your first order</span>
              </div>
              <div style={styles.offerDetails}>
                <div style={styles.offerDetailItem}>
                  <span>This Flavor:</span>
                  <strong>₹{flavor.price} &rarr; ₹{productId === 'rose' || productId === 'butterscotch' ? 109 : 99}</strong>
                </div>
                <div style={styles.offerDetailItem}>
                  <span>Combo Pack (20 Sachets):</span>
                  <strong>₹349 &rarr; ₹219</strong>
                </div>
                <div style={styles.offerDetailItem}>
                  <span>Single Flavours:</span>
                  <strong>From ₹99</strong>
                </div>
                <div style={styles.offerDetailItem}>
                  <span>Free delivery on orders above ₹499</span>
                </div>
              </div>
            </div>

            <div style={styles.badgeRow}>
              <div style={styles.badge}>
                <Leaf size={16} color="var(--primary-color)" />
                <span>100% Organic</span>
              </div>
              <div style={styles.badge}>
                <Heart size={16} color="var(--primary-color)" />
                <span>Zero Added Sugar</span>
              </div>
            </div>

            <div style={styles.trustSection}>
              <div style={styles.trustItem}>✓ Free delivery above ₹499</div>
              <div style={styles.trustItem}>✓ Secure checkout</div>
              <div style={styles.trustItem}>✓ Premium packaging</div>
              <div style={styles.trustItem}>✓ Platform fee ₹7 only</div>
            </div>

            <button
              onClick={() => onAddToCart({ id: productId, name: flavor.name, price: flavor.price, img: flavor.img })}
              style={{ ...styles.addCartBtn, backgroundColor: flavor.primaryColor }}
            >
              Add to Collection
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Ingredients Breakdown */}
      <section style={styles.ingredientsSection}>
        <div className="container">
          <span style={styles.sectionSubtitle}>COMPOSITION</span>
          <h2 style={styles.sectionTitle}>Raw Ingredients</h2>
          <div style={styles.ingredientsGrid}>
            {flavor.ingredients.map((ing, i) => (
              <div key={i} style={styles.ingCard}>
                <div style={styles.ingIcon}>
                  <Sparkles size={20} color="var(--primary-color)" />
                </div>
                <h3>{ing.name}</h3>
                <p>{ing.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Taste Profile (Animated Bars) */}
      <section style={styles.tasteSection}>
        <div className="container" style={styles.tasteGrid}>
          <div>
            <span style={styles.sectionSubtitle}>SENSORY SCALES</span>
            <h2 style={styles.tasteTitle}>Taste Profile</h2>
            <p style={styles.tasteDesc}>
              Our master blenders map every batch across critical flavor indices to guarantee consistency and balance.
            </p>
          </div>

          <div style={styles.barsContainer}>
            {Object.entries(flavor.tasteProfile).map(([key, value]) => (
              <TasteBar key={key} label={key} percentage={value} primaryColor={flavor.primaryColor} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How to Make (Timeline) */}
      <section style={styles.brewSection}>
        <div className="container">
          <span style={styles.sectionSubtitle}>PREPARATION</span>
          <h2 style={styles.sectionTitle}>The 30-Second Ritual</h2>
          
          <div style={styles.timeline}>
            <div style={styles.timelineItem}>
              <div style={styles.timelineBullet}>1</div>
              <div style={styles.timelineContent}>
                <h3>Add Hot Water</h3>
                <p>Pour 150ml of freshly boiled hot water (or milk) into your favorite porcelain cup.</p>
              </div>
            </div>
            <div style={styles.timelineItem}>
              <div style={styles.timelineBullet}>2</div>
              <div style={styles.timelineContent}>
                <h3>Stir Well</h3>
                <p>Add one scoop of MOVITEA and stir gently for 10-15 seconds until completely dissolved.</p>
              </div>
            </div>
            <div style={styles.timelineItem}>
              <div style={styles.timelineBullet}>3</div>
              <div style={styles.timelineContent}>
                <h3>Enjoy the Essence</h3>
                <p>Inhale the rich botanical aromatics first, then take a slow sip of comfort.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TasteBar({ label, percentage, primaryColor }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start({ width: `${percentage}%` });
    }
  }, [controls, inView, percentage]);

  return (
    <div ref={ref} style={styles.barItem}>
      <div style={styles.barHeader}>
        <span style={styles.barLabel}>{label}</span>
        <span style={styles.barPercent}>{percentage}%</span>
      </div>
      <div style={styles.barTrack}>
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ ...styles.barFill, backgroundColor: primaryColor }}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    paddingTop: 'var(--header-height)',
    minHeight: '100vh',
    transition: 'background-color 0.6s ease',
  },
  showcaseSection: {
    padding: '6rem 0',
  },
  showcaseGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    alignItems: 'center',
    gap: '5rem',
  },
  imageCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgWrapper: {
    width: '100%',
    maxWidth: '420px',
    height: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 25px 40px rgba(43, 26, 18, 0.12))',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    fontWeight: '600',
  },
  title: {
    fontSize: '4.5rem',
    fontWeight: '300',
    lineHeight: '1.1',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.8rem',
    marginTop: '0.5rem',
  },
  price: {
    fontFamily: 'var(--font-sans)',
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--dark-color)',
  },
  mrp: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.2rem',
    textDecoration: 'line-through',
  },
  saveBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: '700',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--white)',
    padding: '0.2rem 0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  offerBox: {
    backgroundColor: '#FAF7F2',
    border: '1px solid var(--border-color)',
    padding: '1.25rem',
    marginTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  offerTitleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  offerBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  offerTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    fontWeight: '500',
    color: 'var(--dark-color)',
  },
  offerDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-light)',
  },
  offerDetailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(43,26,18,0.05)',
    paddingBottom: '0.25rem',
  },
  trustSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem',
    marginTop: '1.5rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.82rem',
    color: 'var(--text-light)',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  desc: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.1rem',
    lineHeight: '1.75',
    marginTop: '1rem',
  },
  badgeRow: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
    color: 'var(--dark-color)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
  },
  addCartBtn: {
    border: 'none',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '1.25rem 3rem',
    color: 'var(--white)',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 0.9,
    },
  },
  ingredientsSection: {
    padding: '8rem 0',
    backgroundColor: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'block',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  sectionTitle: {
    fontSize: '3.5rem',
    textAlign: 'center',
    marginBottom: '5rem',
  },
  ingredientsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '3rem',
  },
  ingCard: {
    backgroundColor: '#FAF7F2',
    padding: '3rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid var(--border-color)',
  },
  ingIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--cream-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasteSection: {
    padding: '8rem 0',
  },
  tasteGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '6rem',
    alignItems: 'center',
  },
  tasteTitle: {
    fontSize: '3rem',
    marginBottom: '1.5rem',
  },
  tasteDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
  },
  barsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  barItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  barHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  barLabel: {
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  barPercent: {
    color: 'var(--text-light)',
  },
  barTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(43, 26, 18, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
  },
  brewSection: {
    padding: '8rem 0',
    backgroundColor: '#FFFFFF',
  },
  timeline: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '3rem',
    position: 'relative',
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.5rem',
  },
  timelineBullet: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--dark-color)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
};

// Add responsive styles
const styleSheetDetails = document.createElement('style');
styleSheetDetails.innerText = `
  @media (max-width: 950px) {
    div[style*="showcaseGrid"] {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: 3rem !important;
    }
    div[style*="infoCol"] {
      align-items: center !important;
    }
    div[style*="ingredientsGrid"] {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }
    div[style*="tasteGrid"] {
      grid-template-columns: 1fr !important;
      gap: 4rem !important;
    }
    div[style*="timeline"] {
      grid-template-columns: 1fr !important;
      gap: 3rem !important;
    }
  }
`;
document.head.appendChild(styleSheetDetails);
