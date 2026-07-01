import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';

// Fallback products in case API fails
const FALLBACK_PRODUCTS = [
  {
    id: 'combo',
    name: 'Assorted Atelier Combo Box (20 Sachets)',
    category: 'combos',
    price: 349,
    mrp: 429,
    saveAmount: 80,
    img: '/assets/combo-pack.jpeg',
    tag: 'First Order Offer Available',
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
    tag: 'Rich & Bold',
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
    tag: 'Best Seller',
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
    tag: 'Indulgent',
    desc: 'Sweet toasted sugar glaze and buttery caramel notes.',
  },
];

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
      // Transform backend data to match frontend format
      const transformedProducts = data.map(p => ({
        id: p.slug,
        name: p.name,
        category: p.category === 'Atelier Box' ? 'combos' : p.category === 'Gifting Set' ? 'gifting' : 'flavours',
        price: p.discountPrice || p.price,
        mrp: p.price,
        saveAmount: p.price - (p.discountPrice || p.price),
        savePercent: Math.round(((p.price - (p.discountPrice || p.price)) / p.price) * 100),
        img: p.image || '/assets/logo.jfif',
        tag: p.featured ? 'Featured' : p.shortDesc,
        desc: p.desc || p.shortDesc,
        slug: p.slug,
        active: p.active,
        stock: p.stock,
      }));
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Use fallback products
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => p.category === activeFilter);

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
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

  return (
    <div style={styles.shopPage}>
      <div className="container">
        {/* Header */}
        <div style={styles.shopHeader}>
          <h1 style={styles.title}>The Tea Shop</h1>
          <p style={styles.desc}>Pure ingredients, zero added sugar, premium flavor curation.</p>
        </div>

        {/* Filter Navigation */}
        <div style={styles.filterBar}>
          {['all', 'flavours', 'combos', 'gifting'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              style={{
                ...styles.filterBtn,
                borderBottom: activeFilter === category ? '2px solid var(--dark-color)' : '2px solid transparent',
                color: activeFilter === category ? 'var(--dark-color)' : 'var(--text-light)',
                fontWeight: activeFilter === category ? '600' : '400',
              }}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={styles.productGrid}>
          {filteredProducts.map((prod) => (
            <div key={prod.id} style={styles.card} className="shop-product-card">
              {prod.tag && <span style={styles.cardTag}>{prod.tag}</span>}
              
              <div style={styles.imgContainer} onClick={() => handleProductSelect(prod.id)}>
                <img src={prod.img} alt={prod.name} style={styles.productImg} />
              </div>

              <div style={styles.info}>
                <h3 style={styles.productName} onClick={() => handleProductSelect(prod.id)}>{prod.name}</h3>
                <p style={styles.productDesc}>{prod.desc}</p>
                <div style={styles.priceRow}>
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>₹{prod.price}</span>
                    {prod.mrp && <span style={styles.mrp}>₹{prod.mrp}</span>}
                    {prod.saveAmount > 0 && (
                      <span style={styles.saveBadge}>
                        {prod.savePercent ? `Save ${prod.savePercent}%` : `Save ₹${prod.saveAmount}`}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleProductSelect(prod.id)}
                    style={styles.exploreBtn}
                  >
                    Explore Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  shopPage: {
    paddingTop: 'calc(var(--header-height) + 3rem)',
    paddingBottom: '8rem',
    backgroundColor: '#FFFFFF',
    minHeight: '80vh',
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
  },
  shopHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  title: {
    fontSize: '4rem',
  },
  desc: {
    fontSize: '1.1rem',
    marginTop: '0.5rem',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    marginBottom: '4rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1rem',
  },
  filterBtn: {
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '0.85rem',
    padding: '0.5rem 0',
    transition: 'var(--transition-fast)',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2.5rem',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EAEAEA',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  cardTag: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    backgroundColor: 'var(--cream-color)',
    color: 'var(--dark-color)',
    padding: '0.3rem 0.8rem',
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  imgContainer: {
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    overflow: 'hidden',
  },
  productImg: {
    height: '100%',
    objectFit: 'contain',
    transition: 'transform 0.5s ease',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: 'auto',
  },
  productName: {
    fontSize: '1.6rem',
    fontFamily: 'var(--font-serif)',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: 'var(--primary-color)',
    },
  },
  productDesc: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: '#666666',
  },
  priceRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '1rem',
    marginTop: '1rem',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.6rem',
  },
  price: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '700',
    fontSize: '1.25rem',
    color: 'var(--dark-color)',
  },
  mrp: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    color: '#888',
    textDecoration: 'line-through',
  },
  saveBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    fontWeight: '700',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--white)',
    padding: '0.15rem 0.4rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  exploreBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    padding: '0.8rem 1.2rem',
    border: '1px solid var(--dark-color)',
    backgroundColor: 'transparent',
    color: 'var(--dark-color)',
    textAlign: 'center',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
  },
};

// Add interactive styling with hover scale and shadow
const styleSheetShop = document.createElement('style');
styleSheetShop.innerText = `
  .shop-product-card:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 30px rgba(0,0,0,0.06);
  }
  .shop-product-card:hover img {
    transform: scale(1.05);
  }
  .shop-product-card button:hover {
    background-color: var(--dark-color) !important;
    color: var(--bg-color) !important;
  }
`;
document.head.appendChild(styleSheetShop);
