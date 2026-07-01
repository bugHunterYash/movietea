import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client';
import PreOrderModal from '../components/PreOrderModal';

export default function Shop({ setSelectedProduct }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [preOrderProduct, setPreOrderProduct] = useState(null);

  useEffect(() => {
    document.title = "Shop Premium Blends | MOVITEA";
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        console.log("Fetched products:", res.data);
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Products is not an array:", res.data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (product) => {
    if (!product || !product.slug) return;
    setSelectedProduct(product.slug);
    navigate(`/product/${product.slug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const getSavingsPercent = (base, selling) => {
    if (!base || base <= selling) return 0;
    return Math.round(((base - selling) / base) * 100);
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div style={styles.shopPage}>
      <div className="container">
        {/* Header */}
        <div style={styles.shopHeader}>
          <h1 style={styles.title} className="shop-title">The Tea Shop</h1>
          <p style={styles.desc}>Pure ingredients, zero added sugar, premium flavor curation.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>Loading premium blends...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>No products found. Please check back later.</div>
        ) : (
          <motion.div 
            className="shop-product-grid"
            style={styles.productGrid}
            variants={containerVariants}
            initial="show"
            animate="show"
          >
            {products.map((prod) => {
              if (!prod) return null;
              const isCombo = prod.type === 'combo';
              const cardStyle = isCombo ? { ...styles.card, ...styles.comboCard } : styles.card;
              const tagText = isCombo ? prod.shortDesc : (prod.shortDesc || prod.tag);
              const tagStyle = isCombo ? { ...styles.cardTag, ...styles.comboTag } : styles.cardTag;
              const activePrice = prod.discountPrice || prod.price || 0;
              const savings = getSavingsPercent(prod.price, prod.discountPrice || prod.price);

              return (
                <motion.div 
                  key={prod.id || Math.random()} 
                  variants={itemVariants}
                  className={`shop-product-card ${isCombo ? 'combo-card-hover' : ''}`}
                  style={cardStyle}
                >
                  {tagText && <span style={tagStyle}>{tagText}</span>}
                  
                  <div style={styles.imgContainer} onClick={() => handleProductSelect(prod)}>
                    <img src={prod.image || '/assets/rose.jpeg'} alt={prod.name || 'Product'} style={styles.productImg} />
                  </div>

                  <div style={styles.info}>
                    <h3 
                      style={isCombo ? { ...styles.productName, ...styles.comboProductName } : styles.productName} 
                      onClick={() => handleProductSelect(prod)}
                    >
                      {prod.name || 'Premium Blend'}
                    </h3>
                    <p style={styles.productDesc}>{prod.desc || ''}</p>
                    
                    <div style={styles.priceRow}>
                      <div style={styles.priceContainer}>
                        <span style={styles.price}>₹{activePrice}</span>
                        {prod.discountPrice && prod.price > prod.discountPrice && (
                          <span style={styles.mrp}>₹{prod.price}</span>
                        )}
                        {savings > 0 && (
                          <span style={isCombo ? { ...styles.saveBadge, ...styles.comboSaveBadge } : styles.saveBadge}>
                            SAVE {savings}%
                          </span>
                        )}
                      </div>
                      
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleProductSelect(prod)}
                          style={isCombo ? { ...styles.exploreBtn, ...styles.comboExploreBtn } : styles.exploreBtn}
                        >
                          Explore
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreOrderProduct({ id: prod.id, name: prod.name });
                            setIsPreOrderModalOpen(true);
                          }}
                          style={isCombo ? { ...styles.addBtn, ...styles.comboAddBtn } : styles.addBtn}
                        >
                          PRE-ORDER
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <PreOrderModal 
        isOpen={isPreOrderModalOpen}
        onClose={() => setIsPreOrderModalOpen(false)}
        product={preOrderProduct}
      />
    </div>
  );
}

const styles = {
  shopPage: {
    paddingTop: 'calc(var(--header-height) + 3rem)',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
  },
  shopHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '4rem',
  },
  desc: {
    fontSize: '1.1rem',
    marginTop: '0.5rem',
  },
  productGrid: {
    display: 'grid',
    gap: '2rem',
    marginBottom: '8rem',
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
  comboCard: {
    border: '1px solid #D4AF37',
    backgroundColor: '#FAFAF8',
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
    zIndex: 2,
  },
  comboTag: {
    backgroundColor: '#2B1A12',
    color: '#D4AF37',
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
    width: '100%',
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
    fontSize: '1.4rem',
    fontFamily: 'var(--font-serif)',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  comboProductName: {
    fontSize: '1.6rem',
    color: '#2B1A12',
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
    gap: '1.2rem',
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
  comboSaveBadge: {
    backgroundColor: '#D4AF37',
    color: '#2B1A12',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.8rem',
  },
  exploreBtn: {
    flex: 1,
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    padding: '0.8rem 0.5rem',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--dark-color)',
    textAlign: 'center',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
  },
  addBtn: {
    flex: 1,
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    padding: '0.8rem 0.5rem',
    border: '1px solid var(--dark-color)',
    backgroundColor: 'var(--dark-color)',
    color: 'var(--bg-color)',
    textAlign: 'center',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
  },
  comboExploreBtn: {
    border: '1px solid #D4AF37',
  },
  comboAddBtn: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
    color: '#2B1A12',
  },
};

// Add interactive styling with hover scale, shadow and explicit grid responsive rules
const styleSheetShop = document.createElement('style');
styleSheetShop.innerText = `
  /* Responsive Product Grid Config */
  .shop-product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }
  .shop-title {
    font-size: 4rem;
  }
  @media (max-width: 1024px) {
    .shop-product-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .shop-title {
      font-size: 3rem !important;
    }
  }
  @media (max-width: 640px) {
    .shop-product-grid {
      grid-template-columns: 1fr !important;
    }
    .shop-title {
      font-size: 2.2rem !important;
    }
    .shop-product-card {
      padding: 1.5rem !important;
    }
    .shop-product-card .action-buttons {
      flex-direction: column;
    }
  }

  /* Hover Animations */
  .shop-product-card:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 30px rgba(0,0,0,0.06);
  }
  .shop-product-card:hover img {
    transform: scale(1.05);
  }
  .combo-card-hover:hover {
    box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
    border-color: #D4AF37;
  }
  .shop-product-card button:hover {
    opacity: 0.8;
  }
`;
document.head.appendChild(styleSheetShop);
