import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Compass, Leaf, Heart } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { PRICING } from '../utils/pricing';
import ProductImageGallery from '../components/Shop/ProductImageGallery';
import ProductReviews from '../components/Reviews/ProductReviews';
import { getProductImages } from '../utils/imageMapper';

const FLAVOUR_DETAILS = {
  rose: {
    name: 'Rose Atelier Tea',
    subtitle: 'Floral & Gentle',
    img: '/assets/rose.jpeg',
    bg: '#F4D3DC',
    primaryColor: '#C56B1F',
    textColor: '#2B1A12',
    accentColor: '#E8B5C3',
    price: PRICING.rose.sale,
    mrp: PRICING.rose.mrp,
    description: 'A beautiful botanical infusion featuring tender organic rose buds and delicate petals blended with premium hand-selected black tea.',
    ingredients: [
      { name: 'Organic Rose Buds', source: 'Sourced from Kannauj, India' },
      { name: 'Darjeeling Black Tea', source: 'Single-estate premium leaves' },
      { name: 'Rosehip Extracts', source: 'Naturally rich in antioxidants' }
    ],
    tasteProfile: { Sweetness: 45, Creaminess: 20, 'Floral Notes': 95, Richness: 50 }
  },
  chocolate: {
    name: 'Cacao Reserve Tea',
    subtitle: 'Bold & Decadent',
    img: '/assets/chocolate.jpeg',
    bg: '#2B1A12',
    primaryColor: '#C56B1F',
    textColor: '#FAF7F2',
    accentColor: '#4A2416',
    price: PRICING.chocolate.sale,
    mrp: PRICING.chocolate.mrp,
    description: 'A luxurious dark blend uniting premium roasted cacao husks and high-grade single-origin black tea.',
    ingredients: [
      { name: 'Roasted Cacao Husks', source: 'Sourced from Kerala, India' },
      { name: 'Assam CTC Black Tea', source: 'Full-bodied malty base' },
      { name: 'Vanilla Bean Powder', source: 'For natural rich depth' }
    ],
    tasteProfile: { Sweetness: 30, Creaminess: 65, 'Floral Notes': 10, Richness: 90 }
  },
  vanilla: {
    name: 'Vanilla Orchid Tea',
    subtitle: 'Silky & Comforting',
    img: '/assets/vanilla.jpeg',
    bg: '#FAF7F2',
    primaryColor: '#C56B1F',
    textColor: '#2B1A12',
    accentColor: '#E8DDBF',
    price: PRICING.vanilla.sale,
    mrp: PRICING.vanilla.mrp,
    description: 'Infused with real Madagascar bourbon vanilla bean pods. A creamy, comforting blend with a smooth vanilla aroma.',
    ingredients: [
      { name: 'Madagascar Vanilla Pods', source: 'Authentic bourbon vanilla' },
      { name: 'Orthodox Black Tea', source: 'Whole leaf high-grown tea' },
      { name: 'Sweet Clover extracts', source: 'For botanical sweetness' }
    ],
    tasteProfile: { Sweetness: 60, Creaminess: 85, 'Floral Notes': 30, Richness: 70 }
  },
  butterscotch: {
    name: 'Toasted Butterscotch Tea',
    subtitle: 'Golden & Indulgent',
    img: '/assets/butterscotch.jpeg',
    bg: '#D0853E',
    primaryColor: '#2B1A12',
    textColor: '#FAF7F2',
    accentColor: '#C56B1F',
    price: PRICING.butterscotch.sale,
    mrp: PRICING.butterscotch.mrp,
    description: 'Indulge in sweet toasted sugar notes, rich buttery warmth, and a smooth caramel glaze.',
    ingredients: [
      { name: 'Toasted Sugar Extracts', source: 'Crafted natural caramelization' },
      { name: 'CTC Premium Black Tea', source: 'Rich, robust tea base' },
      { name: 'Natural Butter Flavouring', source: 'Dairy-free, allergen-safe extract' }
    ],
    tasteProfile: { Sweetness: 75, Creaminess: 80, 'Floral Notes': 15, Richness: 85 }
  }
};

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [showPreorderForm, setShowPreorderForm] = useState(false);
  const [preorderData, setPreorderData] = useState({ name: '', phone: '' });
  const [preorderStatus, setPreorderStatus] = useState('idle');
  const [queueNumber, setQueueNumber] = useState(0);

  const handlePreorderSubmit = (e) => {
    e.preventDefault();
    setQueueNumber(Math.floor(Math.random() * 6000) + 1);
    setPreorderStatus('submitted');
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getBySlug(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const getFlavorBase = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('chocolate') || n.includes('cacao')) return FLAVOUR_DETAILS.chocolate;
    if (n.includes('vanilla')) return FLAVOUR_DETAILS.vanilla;
    if (n.includes('rose')) return FLAVOUR_DETAILS.rose;
    return FLAVOUR_DETAILS.butterscotch;
  };

  const flavorBase = getFlavorBase(product?.name || '');

  const displayData = product ? {
    id: product.slug,
    name: product.name,
    subtitle: product.shortDesc || flavorBase.subtitle,
    img: product.image || '/images/Final.png',
    price: product.discountPrice || product.price,
    mrp: product.price,
    description: product.desc || flavorBase.description,
    bg: flavorBase.bg,
    primaryColor: flavorBase.primaryColor,
    textColor: '#2B1A12',
    accentColor: flavorBase.accentColor,
    ingredients: flavorBase.ingredients,
    tasteProfile: flavorBase.tasteProfile
  } : flavorBase;

  useEffect(() => {
    if (displayData) {
      document.title = `${displayData.name} | MOVITEA`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `Indulge in ${displayData.name} - ${displayData.subtitle}. ${displayData.description}`);
      }
    }
  }, [displayData]);

  if (loading) {
    return (
      <div style={{...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{...styles.page, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h2>Product Not Found</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      onAddToCart({ 
        id: displayData.id, 
        dbProductId: product.id, 
        name: displayData.name, 
        price: displayData.price, 
        img: displayData.img 
      });
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.showcaseSection}>
        <div className="container" style={styles.showcaseGrid}>
          
          <div style={{ ...styles.imageBlock, backgroundColor: displayData.bg }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
              style={styles.imgWrapper}
            >
              <ProductImageGallery 
                images={getProductImages(displayData.id, displayData.name)}
                productName={displayData.name}
                mode="details"
              />
            </motion.div>
          </div>

          <div style={styles.infoCol}>
            <div style={styles.ratingRow}>
               <span style={{color: '#FFB800', fontSize: '1.2rem', letterSpacing: '2px'}}>★★★★★</span>
               <span style={{fontSize: '0.85rem', color: '#666', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer'}}>183 reviews</span>
            </div>

            <h1 style={styles.title}>{displayData.name}</h1>
            <span style={styles.subtitle}>{displayData.subtitle}</span>
            
            <p style={styles.desc}>{displayData.description}</p>
            
            <div style={styles.priceContainer}>
              <span style={styles.price}>₹{displayData.price}</span>
              {displayData.mrp > displayData.price && (
                <span style={styles.mrp}>₹{displayData.mrp}</span>
              )}
            </div>

            {preorderStatus === 'submitted' ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={styles.successMessage}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FFF', boxShadow: '0 4px 15px rgba(197, 107, 31, 0.3)' }}>
                    <Sparkles size={24} />
                  </div>
                  <h3 style={{color: 'var(--dark-color)', margin: 0, fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em'}}>Pre-order Confirmed</h3>
                </div>
                <p style={{fontSize: '1.05rem', color: '#555', lineHeight: '1.7', fontFamily: 'var(--font-sans)', margin: 0}}>
                  Thank you, <b style={{color: 'var(--dark-color)'}}>{preorderData.name}</b>. Your spot is officially secured.<br/><br/>
                  There are currently <b style={{color: 'var(--primary-color)', fontSize: '1.2rem'}}>{queueNumber}</b> people ahead of you in the queue. We will notify you at <b>{preorderData.phone}</b> the moment it's ready to ship!
                </p>
              </motion.div>
            ) : showPreorderForm ? (
              <form onSubmit={handlePreorderSubmit} style={styles.preorderForm}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required 
                  value={preorderData.name}
                  onChange={(e) => setPreorderData({...preorderData, name: e.target.value})}
                  style={styles.formInput} 
                />
                <input 
                  type="tel" 
                  placeholder="Your Phone Number" 
                  required 
                  value={preorderData.phone}
                  onChange={(e) => setPreorderData({...preorderData, phone: e.target.value})}
                  style={styles.formInput} 
                />
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button type="submit" style={styles.submitPreorderBtn}>CONFIRM PRE-ORDER</button>
                  <button type="button" onClick={() => setShowPreorderForm(false)} style={styles.cancelBtn}>CANCEL</button>
                </div>
              </form>
            ) : (
              <div style={styles.actionRow}>
                <div style={styles.quantitySelector}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>-</button>
                  <span style={styles.qtyNumber}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={styles.qtyBtn}>+</button>
                </div>
                <button
                  onClick={() => setShowPreorderForm(true)}
                  style={styles.addCartBtn}
                >
                  PRE-ORDER NOW
                </button>
              </div>
            )}

            <div style={styles.benefitsBox}>
               <div style={styles.benefitsHeader}>Benefits</div>
               <div style={styles.benefitsGrid}>
                  <div style={styles.benefitItem}>✓ Premium Quality</div>
                  <div style={styles.benefitItem}>✓ Zero Refined Sugar</div>
                  <div style={styles.benefitItem}>✓ Natural Flavours</div>
                  <div style={styles.benefitItem}>✓ Organic Ingredients</div>
               </div>
            </div>

            <div style={styles.trustSection}>
              <div style={styles.trustItem}>
                <span style={styles.trustIcon}>🛍️</span> Trusted by 50,000+ customers
              </div>
              <div style={styles.trustItem}>
                <span style={styles.trustIcon}>🚚</span> Free Shipping Above ₹499
              </div>
              <div style={styles.trustItem}>
                <span style={styles.trustIcon}>🔒</span> Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.ingredientsSection}>
        <div className="container">
          <span style={styles.sectionSubtitle}>COMPOSITION</span>
          <h2 style={styles.sectionTitle}>Raw Ingredients</h2>
          <div style={styles.ingredientsGrid}>
            {displayData.ingredients.map((ing, i) => (
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
            {Object.entries(displayData.tasteProfile).map(([key, value]) => (
              <TasteBar key={key} label={key} percentage={value} primaryColor={displayData.primaryColor} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <ProductReviews productSlug={displayData.id} />
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
    paddingTop: 'calc(var(--header-height) + 2rem)',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
  },
  spinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid var(--primary-color)',
    animation: 'spin 1s linear infinite',
  },
  showcaseSection: {
    paddingBottom: '4rem',
  },
  showcaseGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'flex-start',
  },
  imageBlock: {
    width: '100%',
    height: '650px',
    borderRadius: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
  },
  imgWrapper: {
    width: '100%',
    height: '100%',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.15))',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '1rem 0',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '3.2rem',
    fontWeight: '900',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    color: '#000',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#666',
    marginBottom: '1.5rem',
  },
  desc: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: '#444',
    marginBottom: '2rem',
    maxWidth: '90%',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '1rem',
    marginBottom: '2rem',
  },
  price: {
    fontFamily: 'var(--font-sans)',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#000',
  },
  mrp: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.1rem',
    color: '#999',
    textDecoration: 'line-through',
  },
  actionRow: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '2.5rem',
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #D9D9D9',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    width: '120px',
  },
  qtyBtn: {
    fontSize: '1.5rem',
    color: '#333',
    fontWeight: '300',
  },
  qtyNumber: {
    fontSize: '1.1rem',
    fontWeight: '600',
    fontFamily: 'var(--font-sans)',
  },
  addCartBtn: {
    flex: 1,
    backgroundColor: '#FFB800',
    color: '#1A1A1A',
    border: 'none',
    borderRadius: '6px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '700',
    fontSize: '0.95rem',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  preorderForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2.5rem',
    backgroundColor: '#FAF7F2',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    maxWidth: '500px',
  },
  formInput: {
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
  },
  submitPreorderBtn: {
    flex: 1,
    padding: '1rem',
    backgroundColor: 'var(--dark-color)',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    color: 'var(--dark-color)',
    border: '1px solid var(--dark-color)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  successMessage: {
    marginBottom: '2.5rem',
    background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EBE6 100%)',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid rgba(197, 107, 31, 0.15)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    maxWidth: '500px',
    position: 'relative',
    overflow: 'hidden',
  },
  benefitsBox: {
    backgroundColor: '#FDF6E8',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '2rem',
  },
  benefitsHeader: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#333',
    borderBottom: '1px dotted #D0C6B5',
    paddingBottom: '0.5rem',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  benefitItem: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    color: '#444',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  trustSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  trustIcon: {
    fontSize: '1.2rem',
  },
  ingredientsSection: {
    padding: '6rem 0',
    backgroundColor: '#FAF7F2',
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
    marginBottom: '4rem',
    fontFamily: 'var(--font-heading)',
  },
  ingredientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  ingCard: {
    backgroundColor: '#FFFFFF',
    padding: '3rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
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
    padding: '6rem 0',
  },
  tasteGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '5rem',
    alignItems: 'center',
  },
  tasteTitle: {
    fontSize: '3rem',
    marginBottom: '1.5rem',
    fontFamily: 'var(--font-heading)',
  },
  tasteDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#444',
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
    color: '#666',
  },
  barTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: '#F0F0F0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
  }
};

const styleSheetDetails = document.createElement('style');
styleSheetDetails.innerText = `
  @media (max-width: 950px) {
    div[style*="showcaseGrid"] {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }
    div[style*="imageBlock"] {
      height: 450px !important;
    }
    div[style*="tasteGrid"] {
      grid-template-columns: 1fr !important;
      gap: 3rem !important;
    }
    div[style*="infoCol"] {
      padding: 0 !important;
    }
  }
`;
document.head.appendChild(styleSheetDetails);
