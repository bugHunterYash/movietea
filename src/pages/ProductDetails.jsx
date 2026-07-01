import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Compass, Leaf, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import SEO from '../components/SEO';
import PreOrderModal from '../components/PreOrderModal';

const getVisuals = (flavour, category) => {
  const f = (flavour || '').toLowerCase();
  if (f.includes('rose')) return { bg: '#F4D3DC', primaryColor: '#C56B1F', textColor: '#2B1A12', accentColor: '#E8B5C3', subtitle: 'Floral & Gentle' };
  if (f.includes('chocolate')) return { bg: '#2B1A12', primaryColor: '#C56B1F', textColor: '#FAF7F2', accentColor: '#4A2416', subtitle: 'Bold & Decadent' };
  if (f.includes('vanilla')) return { bg: '#FAF7F2', primaryColor: '#C56B1F', textColor: '#2B1A12', accentColor: '#E8DDBF', subtitle: 'Silky & Comforting' };
  if (f.includes('butterscotch')) return { bg: '#D0853E', primaryColor: '#2B1A12', textColor: '#FAF7F2', accentColor: '#C56B1F', subtitle: 'Golden & Indulgent' };
  // Default for combos or others
  return { bg: '#FAFAF8', primaryColor: '#D4AF37', textColor: '#2B1A12', accentColor: '#E8DDBF', subtitle: 'Curated Collection' };
};

const getIngredients = (flavour) => {
  const f = (flavour || '').toLowerCase();
  if (f.includes('rose')) return [
    { name: 'Organic Rose Buds', source: 'Sourced from Kannauj, India' },
    { name: 'Darjeeling Black Tea', source: 'Single-estate premium leaves' },
    { name: 'Rosehip Extracts', source: 'Naturally rich in antioxidants' }
  ];
  if (f.includes('chocolate')) return [
    { name: 'Roasted Cacao Husks', source: 'Sourced from Kerala, India' },
    { name: 'Assam CTC Black Tea', source: 'Full-bodied malty base' },
    { name: 'Vanilla Bean Powder', source: 'For natural rich depth' }
  ];
  if (f.includes('vanilla')) return [
    { name: 'Madagascar Vanilla Pods', source: 'Authentic bourbon vanilla' },
    { name: 'Orthodox Black Tea', source: 'Whole leaf high-grown tea' },
    { name: 'Sweet Clover extracts', source: 'For botanical sweetness' }
  ];
  if (f.includes('butterscotch')) return [
    { name: 'Toasted Sugar Extracts', source: 'Crafted natural caramelization' },
    { name: 'CTC Premium Black Tea', source: 'Rich, robust tea base' },
    { name: 'Natural Butter Flavouring', source: 'Dairy-free, allergen-safe extract' }
  ];
  return [
    { name: 'Master Assortment', source: 'Handpicked reserve leaves' },
    { name: 'Botanical Extracts', source: '100% natural flavouring' },
    { name: 'Premium Black Tea', source: 'Single-estate luxury base' }
  ];
};

const getTasteProfile = (flavour) => {
  const f = (flavour || '').toLowerCase();
  if (f.includes('rose')) return { Sweetness: 45, Creaminess: 20, 'Floral Notes': 95, Richness: 50 };
  if (f.includes('chocolate')) return { Sweetness: 30, Creaminess: 65, 'Floral Notes': 10, Richness: 90 };
  if (f.includes('vanilla')) return { Sweetness: 60, Creaminess: 85, 'Floral Notes': 30, Richness: 70 };
  if (f.includes('butterscotch')) return { Sweetness: 75, Creaminess: 80, 'Floral Notes': 15, Richness: 85 };
  return { Sweetness: 60, Creaminess: 60, 'Floral Notes': 60, Richness: 80 }; // Balanced for combo
};

export default function ProductDetails() {
  const { id } = useParams(); // The slug from the URL
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [visuals, setVisuals] = useState(null);
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setVisuals(getVisuals(res.data.flavorType, res.data.category));
      } catch (err) {
        setProduct('not_found');
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && product !== 'not_found') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [product]);

  if (product === 'not_found') {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem', minHeight: '80vh' }}>
        <h2>Product Not Found</h2>
        <p>Sorry, the product you are looking for does not exist.</p>
        <button onClick={() => navigate('/shop')} style={{ ...styles.addCartBtn, backgroundColor: 'var(--dark-color)', marginTop: '2rem' }}>Return to Shop</button>
      </div>
    );
  }

  if (!product || !visuals) return <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2' }}></div>;

  const activePrice = product.discountPrice || product.price;
  const savings = product.discountPrice && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isCombo = product.category?.includes('Combo');
  const ingredients = getIngredients(product.flavorType);
  const tasteProfile = getTasteProfile(product.flavorType);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": product.name,
        "image": `https://movitea.com${product.image}`,
        "description": product.desc,
        "brand": {
          "@type": "Brand",
          "name": "MOVITEA"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://movitea.com/product/${product.slug}`,
          "priceCurrency": "INR",
          "price": activePrice,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://movitea.com/" },
          { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://movitea.com/shop" },
          { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://movitea.com/product/${product.slug}` }
        ]
      }
    ]
  };

  return (
    <div style={{ ...styles.page, backgroundColor: visuals.bg, color: visuals.textColor }}>
      <SEO
        title={`${product.name} | MOVITEA Premium Flavoured Tea`}
        description={`Experience rich ${product.name} by MOVITEA. ${product.desc} Premium ingredients, no added sugar and ready in 60 seconds.`}
        image={product.image}
        structuredData={structuredData}
      />
      {/* Section 1: Hero Showcase */}
      <section style={styles.showcaseSection}>
        <div className="container details-showcase-grid" style={styles.showcaseGrid}>
          <div style={styles.imageCol}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={styles.imgWrapper}
            >
              <div style={styles.imageGlow} />
              <img src={product.image} alt={product.name} style={styles.mainImg} className="product-float" />
            </motion.div>
          </div>

          <div style={styles.infoCol} className="details-info-col">
            <div style={styles.breadcrumbs}>
              <Link to="/" className="breadcrumb-link" style={styles.breadcrumbLink}>HOME</Link>
              <span style={styles.breadcrumbSep}>/</span>
              <Link to="/shop" className="breadcrumb-link" style={styles.breadcrumbLink}>SHOP</Link>
              <span style={styles.breadcrumbSep}>/</span>
              <span style={styles.breadcrumbCurrent}>{product.name.toUpperCase()}</span>
            </div>

            <span style={{ ...styles.subtitle, color: visuals.primaryColor }}>
              {isCombo ? 'Premium Combo Collection' : visuals.subtitle}
            </span>
            <h1 style={{ ...styles.title, color: visuals.textColor }} className="details-title">{product.name}</h1>
            <div style={styles.priceContainer}>
              <span style={{ ...styles.price, color: visuals.textColor }}>₹{activePrice}</span>
              {product.discountPrice && product.price > product.discountPrice && (
                <span style={{ ...styles.mrp, color: visuals.textColor === '#FAF7F2' ? 'rgba(250,247,242,0.6)' : 'rgba(43,26,18,0.6)' }}>
                  ₹{product.price}
                </span>
              )}
              {savings > 0 && <span style={styles.saveBadge}>Save {savings}%</span>}
            </div>

            <p style={{ ...styles.desc, color: visuals.textColor === '#FAF7F2' ? 'rgba(250, 247, 242, 0.85)' : 'var(--text-light)' }}>
              {product.desc}
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
              <strong>Category:</strong> {product.category}
            </p>

            {/* Elegant cream-colored offer card */}
            <div style={styles.offerBox}>
              <div style={styles.offerTitleRow}>
                <span style={styles.offerBadge}>
                  <Sparkles size={12} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                  First Order Special
                </span>
                <span style={styles.offerTitle}>Get {savings > 0 ? 'extra discounts' : '50% OFF'} on your first order</span>
              </div>
              <div style={styles.offerDetails}>
                <div style={styles.offerDetailItem}>
                  <span>This {isCombo ? 'Collection' : 'Flavor'}:</span>
                  <strong>₹{activePrice} &rarr; ₹{Math.floor(activePrice * 0.7)}</strong>
                </div>
                <div style={styles.offerDetailItem}>
                  <span>Free delivery on orders above ₹499</span>
                </div>
              </div>
            </div>

            <div style={styles.badgeRow} className="details-badge-row">
              <div style={styles.badge}>
                <Leaf size={16} color={visuals.primaryColor} />
                <span>100% Organic</span>
              </div>
              <div style={styles.badge}>
                <Heart size={16} color={visuals.primaryColor} />
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
              onClick={() => setIsPreOrderModalOpen(true)}
              style={{ ...styles.addCartBtn, backgroundColor: visuals.primaryColor }}
            >
              PRE-ORDER
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Ingredients Breakdown */}
      <section style={styles.ingredientsSection}>
        <div className="container">
          <span style={styles.sectionSubtitle}>COMPOSITION</span>
          <h2 style={styles.sectionTitle} className="details-section-title">Raw Ingredients</h2>
          <div style={styles.ingredientsGrid} className="details-ingredients-grid">
            {ingredients.map((ing, i) => (
              <div key={i} style={styles.ingCard}>
                <div style={styles.ingIcon}>
                  <Sparkles size={20} color={visuals.primaryColor} />
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
        <div className="container details-taste-grid" style={styles.tasteGrid}>
          <div>
            <span style={styles.sectionSubtitle}>SENSORY SCALES</span>
            <h2 style={styles.tasteTitle} className="details-section-title">Taste Profile</h2>
            <p style={styles.tasteDesc}>
              Our master blenders map every batch across critical flavor indices to guarantee consistency and balance.
            </p>
          </div>

          <div style={styles.barsContainer}>
            {Object.entries(tasteProfile).map(([key, value]) => (
              <TasteBar key={key} label={key} percentage={value} primaryColor={visuals.primaryColor} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How to Make (Timeline) */}
      <section style={styles.brewSection}>
        <div className="container">
          <span style={styles.sectionSubtitle}>PREPARATION</span>
          <h2 style={styles.sectionTitle} className="details-section-title">The 30-Second Ritual</h2>
          
          <div style={styles.timeline} className="details-timeline">
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
                <h3>Enjoy the Experience</h3>
                <p>Take a moment for yourself and savor the rich, premium flavours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internal SEO Linking */}
      <section style={styles.internalLinksSection}>
        <div className="container" style={styles.internalLinksContainer}>
          <p>Looking for more?</p>
          <div style={styles.internalLinks}>
            <Link to="/shop" style={{ color: visuals.primaryColor, fontWeight: '600' }}>Explore All Products in our Shop</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/gift-collection" style={{ color: visuals.primaryColor, fontWeight: '600' }}>View our exclusive Gift Collection</Link>
          </div>
          <p style={{ marginTop: '1rem', opacity: 0.6, fontSize: '0.9rem' }}>
            <strong>MOVITEA – Premium Flavoured Tea</strong> crafted for the modern tea lover.
          </p>
        </div>
      </section>

      <PreOrderModal
        isOpen={isPreOrderModalOpen}
        onClose={() => setIsPreOrderModalOpen(false)}
        product={{ id: product.id, name: product.name }}
      />
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
    padding: '3rem 0 6rem 0',
  },
  showcaseGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    alignItems: 'flex-start',
    gap: '5rem',
  },
  imageCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'sticky',
    top: '120px',
  },
  imgWrapper: {
    width: '100%',
    maxWidth: '420px',
    height: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '120%',
    background: 'radial-gradient(circle, rgba(255,245,230,0.5) 0%, rgba(255,245,230,0) 70%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    maxHeight: '600px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 25px 40px rgba(43, 26, 18, 0.12))',
    position: 'relative',
    zIndex: 2,
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.15em',
    marginBottom: '1rem',
  },
  breadcrumbLink: {
    color: '#8A7A6B',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  breadcrumbSep: {
    color: 'rgba(138, 122, 107, 0.5)',
  },
  breadcrumbCurrent: {
    color: 'var(--dark-color)',
    fontWeight: '600',
    opacity: 0.8,
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
    width: '100%',
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
  },
  ingredientsSection: {
    padding: '8rem 0',
    backgroundColor: '#FFFFFF',
    color: 'var(--dark-color)',
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
    color: 'var(--dark-color)',
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

// Add responsive styles and hover effects
const styleSheetDetails = document.createElement('style');
styleSheetDetails.innerText = `
  .details-showcase-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 5rem;
    align-items: center;
  }
  .details-title {
    font-size: 4.5rem;
  }
  .details-ingredients-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
  }
  .details-taste-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 6rem;
    align-items: center;
  }
  .details-timeline {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
  }
  .details-section-title {
    font-size: 3.5rem;
  }

  @media (max-width: 950px) {
    .details-showcase-grid {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: 3rem !important;
      align-items: center !important;
    }
    div[style*="imageCol"] {
      position: relative !important;
      top: 0 !important;
      align-items: center !important;
    }
    .details-info-col {
      align-items: center !important;
    }
    .details-title {
      font-size: 3rem !important;
    }
    .details-ingredients-grid {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }
    .details-taste-grid {
      grid-template-columns: 1fr !important;
      gap: 4rem !important;
    }
    .details-timeline {
      grid-template-columns: 1fr !important;
      gap: 3rem !important;
    }
    div[style*="breadcrumbs"] {
      justify-content: flex-start !important;
      align-self: flex-start;
    }
  }
  .breadcrumb-link:hover {
    color: var(--dark-color) !important;
  }
  .product-float {
    transition: transform 0.4s ease-out, filter 0.4s ease-out !important;
  }
  .product-float:hover {
    transform: translateY(-5px) rotate(1deg) scale(1.02) !important;
    filter: drop-shadow(0 35px 50px rgba(43, 26, 18, 0.2)) !important;
  }
  @media (max-width: 640px) {
    .details-title {
      font-size: 2.2rem !important;
    }
    .details-section-title {
      font-size: 2rem !important;
    }
    .details-badge-row {
      justify-content: center;
    }
  }
  button[style*="addCartBtn"]:hover {
    opacity: 0.9 !important;
  }
`;
document.head.appendChild(styleSheetDetails);
