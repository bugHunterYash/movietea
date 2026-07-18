import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';

// Fallback products in case API fails
const FALLBACK_PRODUCTS = [
  {
    id: 'combo',
    name: 'Assorted Atelier Combo Box',
    category: 'combos',
    price: 349,
    mrp: 429,
    saveAmount: 80,
    img: '/assets/combo-pack.jpeg',
    tag: 'First Order Offer',
    desc: 'Our flagship curated gift box containing all 4 core flavours.',
  },
  {
    id: 'vanilla',
    name: 'Vanilla Orchid Tea',
    category: 'flavours',
    price: 199,
    mrp: 269,
    savePercent: 26,
    img: '/assets/vanilla.jpeg',
    tag: 'New',
    desc: 'Infused with premium whole Madagascar vanilla beans.',
  },
  {
    id: 'chocolate',
    name: 'Cacao Reserve Tea',
    category: 'flavours',
    price: 199,
    mrp: 269,
    savePercent: 26,
    img: '/assets/chocolate.jpeg',
    tag: 'Best Seller',
    desc: 'Fine cocoa husks combined with single-origin black tea.',
  },
  {
    id: 'rose',
    name: 'Rose Atelier Tea',
    category: 'flavours',
    price: 219,
    mrp: 269,
    savePercent: 18,
    img: '/assets/rose.jpeg',
    tag: 'Signature Blend',
    desc: 'Organic rose petals infused with premium black tea.',
  },
  {
    id: 'butterscotch',
    name: 'Toasted Butterscotch Tea',
    category: 'flavours',
    price: 219,
    mrp: 269,
    savePercent: 18,
    img: '/assets/butterscotch.jpeg',
    tag: 'Limited Edition',
    desc: 'Sweet toasted sugar glaze and buttery caramel notes.',
  },
];

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48" style={{ marginRight: '8px', flexShrink: 0 }}>
    <linearGradient id="grad1" x1="21.241" x2="3.541" y1="39.241" y2="21.541" gradientUnits="userSpaceOnUse"><stop offset=".108" stopColor="#0d7044"></stop><stop offset=".433" stopColor="#11945a"></stop></linearGradient><path fill="url(#grad1)" d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019  c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019 C18.627,42.193,17.373,42.193,16.599,41.42z"></path><linearGradient id="grad2" x1="-15.77" x2="26.403" y1="43.228" y2="43.228" gradientTransform="rotate(134.999 21.287 38.873)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#2ac782"></stop><stop offset="1" stopColor="#21b876"></stop></linearGradient><path fill="url(#grad2)" d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019 c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019 C11.807,36.627,11.807,35.373,12.58,34.599z"></path>
  </svg>
);

const flavorStyles = {
  chocolate: { bg: '#F5EBE6', badge: '#5C3826', badgeText: '#FFF' },
  vanilla: { bg: '#FDF8EC', badge: '#D4A373', badgeText: '#FFF' },
  rose: { bg: '#FCEEF1', badge: '#C46B7B', badgeText: '#FFF' },
  butterscotch: { bg: '#FDF3E3', badge: '#CFA052', badgeText: '#FFF' },
  default: { bg: '#FFFFFF', badge: '#2B1A12', badgeText: '#FFF' }
};



const getFlavorStyle = (name) => {
  const n = name.toLowerCase();
  if (n.includes('chocolate') || n.includes('cacao')) return flavorStyles.chocolate;
  if (n.includes('vanilla')) return flavorStyles.vanilla;
  if (n.includes('rose')) return flavorStyles.rose;
  if (n.includes('butterscotch')) return flavorStyles.butterscotch;
  return flavorStyles.default;
};

export default function Shop({ onAddToCart, setSelectedProduct }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Shop Premium Blends | MOVITEA";
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      const transformedProducts = data.map(p => ({
        id: p.slug,
        name: p.name,
        category: p.category === 'Atelier Box' ? 'combos' : p.category === 'Gifting Set' ? 'gifting' : 'flavours',
        price: p.discountPrice || p.price,
        mrp: p.price,
        saveAmount: p.price - (p.discountPrice || p.price),
        savePercent: Math.round(((p.price - (p.discountPrice || p.price)) / p.price) * 100),
        img: encodeURI(p.image || '/images/Final.png'),
        tag: p.featured ? 'Featured' : p.shortDesc,
        desc: p.desc || p.shortDesc,
        slug: p.slug,
        active: p.active,
        stock: p.stock,
      }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => p.category === activeFilter);

  const handleProductSelect = (productId) => {
    if (setSelectedProduct) setSelectedProduct(productId);
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (loading) {
    return (
      <div style={styles.shopPage}>
        <div className="container">
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
          </div>
        </div>
      </div>
    );
  }

  // Categories for pills
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'combos', label: 'Combo' },
    { id: 'flavours', label: 'Flavours' },
    { id: 'gifting', label: 'Gifting' }
  ];

  return (
    <div style={styles.shopPage}>
      {/* Trust Strip */}
      <div style={styles.trustStrip}>
        <div style={styles.trustItem}><CheckIcon /> Zero Sugar</div>
        <div style={styles.trustItem}><CheckIcon /> Premium Ingredients</div>
        <div style={styles.trustItem}><CheckIcon /> Made in India</div>
        <div style={styles.trustItem}><CheckIcon /> Free Delivery Above ₹499</div>
      </div>

      <div className="container">
        {/* Header */}
        <div style={styles.shopHeader}>
          <h1 style={styles.title}>The Tea Shop</h1>
        </div>

        {/* Category Pills */}
        <div style={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              style={{
                ...styles.filterBtn,
                backgroundColor: activeFilter === cat.id ? 'var(--dark-color)' : '#F0EBE1',
                color: activeFilter === cat.id ? '#FFF' : 'var(--dark-color)',
                borderColor: activeFilter === cat.id ? 'var(--dark-color)' : 'transparent',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={styles.productGrid} className="shop-product-grid">
          {filteredProducts.map((prod, index) => {
            const fStyle = getFlavorStyle(prod.name);
            
            return (
              <React.Fragment key={prod.id}>
                <div style={{ ...styles.card, backgroundColor: fStyle.bg }} className="shop-product-card">
                  
                  {/* Badge */}
                  {prod.tag && (
                    <span style={{ ...styles.cardTag, backgroundColor: fStyle.badge, color: fStyle.badgeText }}>
                      {prod.tag}
                    </span>
                  )}
                  
                  {/* Image */}
                  <div style={styles.imgContainer} onClick={() => handleProductSelect(prod.id)}>
                    <img 
                      src={prod.img} 
                      alt={prod.name} 
                      className="product-image-anim" 
                      style={styles.productImg}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/Final.png'; }}
                    />
                  </div>

                  {/* Rating */}
                  <div style={styles.ratingRow}>
                    <span style={styles.stars}>★★★★★</span>
                    <span style={styles.reviewCount}>4.9 (183 reviews)</span>
                  </div>

                  {/* Info */}
                  <div style={styles.info}>
                    <h3 style={styles.productName} onClick={() => handleProductSelect(prod.id)}>{prod.name}</h3>
                    <p style={styles.subtitle}>Premium Flavoured Tea</p>
                    
                    <div style={styles.features}>
                      <div style={styles.featureItem}><CheckIcon /> Zero Sugar</div>
                      <div style={styles.featureItem}><CheckIcon /> Natural Ingredients</div>
                      <div style={styles.featureItem}><CheckIcon /> Premium Tea Leaves</div>
                    </div>

                    <div style={styles.priceRow}>
                      <span style={styles.price}>₹{prod.price}</span>
                      {prod.mrp && prod.mrp > prod.price && (
                        <span style={styles.mrp}>₹{prod.mrp}</span>
                      )}
                      {prod.saveAmount > 0 && (
                        <span style={styles.saveBadge}>
                          {prod.savePercent ? `20% OFF` : `Save ₹${prod.saveAmount}`}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleProductSelect(prod.id)}
                      className="premium-cta-btn"
                    >
                      Pre-Order Now
                    </button>
                  </div>
                </div>

                {/* Lifestyle Banner after every 6 products */}
                {(index + 1) % 6 === 0 && index !== filteredProducts.length - 1 && (
                  <div style={styles.lifestyleBanner} className="lifestyle-banner">
                    <h2 style={styles.bannerText}>Brew Happiness Every Morning ☕</h2>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  shopPage: {
    paddingTop: 'calc(var(--header-height) + 1.5rem)',
    paddingBottom: '8rem',
    backgroundColor: '#FFFDF8',
    minHeight: '100vh',
  },
  trustStrip: {
    backgroundColor: 'var(--dark-color)',
    color: '#FFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    padding: '0.8rem 2rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid var(--cream-color)',
    borderTopColor: 'var(--primary-color)',
    animation: 'spin 1s linear infinite',
  },
  shopHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '3.5rem',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '4rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '0.9rem',
    padding: '0.6rem 1.5rem',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
    cursor: 'pointer',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
  },
  card: {
    border: '2px solid #D6B58A',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
  },
  cardTag: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    padding: '0.4rem 1rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    borderRadius: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    zIndex: 2,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  imgContainer: {
    height: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '1rem',
    position: 'relative',
  },
  productImg: {
    height: '100%',
    objectFit: 'contain',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.15))',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  stars: {
    color: '#D4A373',
    fontSize: '1.2rem',
    letterSpacing: '2px',
  },
  reviewCount: {
    fontSize: '0.85rem',
    color: '#666',
    fontFamily: 'var(--font-sans)',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: 'auto',
  },
  productName: {
    fontSize: '1.8rem',
    fontFamily: 'var(--font-serif)',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#888',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
    marginTop: '-0.5rem',
    marginBottom: '0.5rem',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    marginBottom: '1rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: '#444',
    fontFamily: 'var(--font-sans)',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1.5rem',
  },
  price: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '700',
    fontSize: '1.4rem',
    color: 'var(--dark-color)',
  },
  mrp: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    color: '#999',
    textDecoration: 'line-through',
  },
  saveBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: '700',
    backgroundColor: '#E8B5C3',
    color: '#2B1A12',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  lifestyleBanner: {
    gridColumn: '1 / -1',
    backgroundColor: 'var(--cream-color)',
    borderRadius: '24px',
    padding: '4rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2rem 0',
    backgroundImage: 'linear-gradient(135deg, #F3E8D3 0%, #E8DDBF 100%)',
  },
  bannerText: {
    fontSize: '3rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
    textAlign: 'center',
  }
};

const styleSheetShop = document.createElement('style');
styleSheetShop.innerText = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
  
  .shop-product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(214, 181, 138, 0.25) !important;
  }
  
  .shop-product-card:hover .product-image-anim {
    transform: scale(1.08) rotate(3deg) !important;
  }
  
  .premium-cta-btn {
    width: 100%;
    padding: 1rem;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: linear-gradient(135deg, var(--dark-color) 0%, #4A2E20 100%);
    color: #FFF;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  
  .premium-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(43, 26, 18, 0.3);
    background: linear-gradient(135deg, #4A2E20 0%, var(--dark-color) 100%);
  }

  /* Responsive Padding */
  @media (max-width: 768px) {
    div[style*="padding: 0.8rem 2rem"] {
      gap: 1rem !important;
      justify-content: flex-start !important;
    }
  }
`;
document.head.appendChild(styleSheetShop);
