import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { preordersAPI } from '../../utils/api';

const PRODUCTS = [
  {
    id: "10-sachets-combo",
    name: "Assorted Atelier Combo Box",
    reviews: 84,
    features: ["4 Premium Flavours", "Zero Sugar", "100% Natural"],
    price: 349,
    originalPrice: 429,
    discount: "18% OFF",
    image: "/assets/combo-pack.jpeg",
    borderColor: "#C5A376"
  },
  {
    id: "rose-10-sachets",
    name: "Rose Atelier Flavoured Tea",
    reviews: 62,
    features: ["Real Rose Petals", "Zero Sugar", "Relaxing Aroma"],
    price: 219,
    originalPrice: 269,
    discount: "18% OFF",
    image: "/assets/rose.jpeg",
    borderColor: "#E8B5C3"
  },
  {
    id: "vanilla-10-sachets",
    name: "Vanilla Orchid Flavoured Tea",
    reviews: 124,
    features: ["Madagascar Vanilla", "Zero Sugar", "Smooth Finish"],
    price: 199,
    originalPrice: 269,
    discount: "26% OFF",
    image: "/assets/vanilla.jpeg",
    borderColor: "#E8DDBF"
  },
  {
    id: "chocolate-10-sachets",
    name: "Chocolate Reserve Flavoured Tea",
    reviews: 95,
    features: ["Roasted Cacao", "Zero Sugar", "Bold Depth"],
    price: 199,
    originalPrice: 269,
    discount: "26% OFF",
    image: "/assets/chocolate.jpeg",
    borderColor: "#4A2416"
  }
];

export default function ProductGrid({ onShopClick }) {
  const [showPreorderModal, setShowPreorderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShowPreorderModal(true);
  };

  const handlePreorderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await preordersAPI.create({
        productId: selectedProduct.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: window.location.pathname
      });
      alert(`Pre-order submitted successfully! Your reference ID is ${response.referenceId}. We'll be in touch soon.`);
      setShowPreorderModal(false);
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to submit pre-order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Title Section */}
      <div style={styles.headerContainer}>
        <h2 className="premium-headline">
          Ridiculously Tasty Infusions.<br/>
          <span className="premium-subheadline">Pick Your Tea.</span>
        </h2>
      </div>

      {/* Grid Section */}
      <div className="container" style={styles.gridContainer}>
        {PRODUCTS.map((prod, index) => (
          <motion.div 
            key={prod.id} 
            style={{ ...styles.card, borderColor: prod.borderColor }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="goat-product-card"
          >
            {/* Image Box */}
            <div style={styles.imageBox}>
              <img src={prod.image} alt={prod.name} style={styles.productImage} />
            </div>

            {/* Content Area */}
            <div style={styles.contentArea}>
              
              {/* Reviews */}
              <div style={styles.reviewRow}>
                <div style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#FDB827" color="#FDB827" />
                  ))}
                </div>
                <span style={styles.reviewText}>{prod.reviews} reviews</span>
              </div>

              {/* Title */}
              <h3 style={styles.productTitle}>{prod.name}</h3>

              {/* Features */}
              <div style={styles.featuresList}>
                {prod.features.map((feature, i) => (
                  <div key={i} style={styles.featureItem}>
                    <div style={styles.checkCircle}>
                      <Check size={10} strokeWidth={4} color="#FFF" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price Row */}
              <div style={styles.priceRow}>
                <span style={styles.currentPrice}>₹{prod.price}</span>
                <span style={styles.originalPrice}>₹{prod.originalPrice}</span>
                <span style={styles.discountBadge}>{prod.discount}</span>
              </div>

              {/* Add to Cart Button */}
              <button style={styles.addToCartBtn} onClick={() => handleAddToCart(prod)} className="goat-add-btn">
                ADD TO CART
              </button>

            </div>
          </motion.div>
        ))}
      </div>

      {showPreorderModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <button style={modalStyles.closeBtn} onClick={() => setShowPreorderModal(false)}>×</button>
            <h3 style={modalStyles.title}>Thank You for Your Interest</h3>
            <p style={modalStyles.message}>
              Due to exceptional demand, we are currently pausing immediate shipments to ensure our quality standards remain uncompromised. You can still secure your {selectedProduct?.name || 'selection'} by joining our pre-order waitlist.
            </p>
            <form style={modalStyles.form} onSubmit={handlePreorderSubmit}>
              <input type="text" placeholder="Full Name" required style={modalStyles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email Address" required style={modalStyles.input} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Phone Number" required style={modalStyles.input} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <button type="submit" style={modalStyles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Pre-order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#FAF7F2',
    padding: '2.5rem',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    fontFamily: 'var(--font-sans)',
  },
  closeBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '1.5rem',
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#1A1A1A',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#4A3E38',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid #D1C7BD',
    fontSize: '1rem',
    fontFamily: 'inherit',
    backgroundColor: '#FFF',
  },
  submitBtn: {
    marginTop: '0.5rem',
    padding: '1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#FDB827',
    color: '#1A1A1A',
    fontWeight: '800',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#FAF7F2',
    paddingTop: '6rem',
    paddingBottom: '4rem',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '3rem',
    padding: '0 1rem',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '4px solid #111',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '10px 10px 0px #111',
  },
  imageBox: {
    width: '100%',
    height: '280px',
    backgroundColor: '#F9F9F9',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))',
  },
  contentArea: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  reviewRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.8rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  reviewText: {
    fontSize: '0.8rem',
    color: '#4A3E38',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
  },
  productTitle: {
    fontSize: '1.1rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: '1rem',
    lineHeight: '1.3',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexGrow: 1,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#4A3E38',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
  },
  checkCircle: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#8B7355',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.2rem',
  },
  currentPrice: {
    fontSize: '1.2rem',
    fontWeight: '800',
    fontFamily: 'var(--font-sans)',
    color: '#1A1A1A',
  },
  originalPrice: {
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: 'var(--font-sans)',
    color: '#888',
    textDecoration: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#E53935', // Red badge
    color: '#FFF',
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '4px',
    marginLeft: 'auto',
  },
  addToCartBtn: {
    width: '100%',
    backgroundColor: '#FDB827', // Goat Yellow
    color: '#1A1A1A', // Dark text on yellow
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '800',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

// Add interactive styling
if (typeof document !== 'undefined') {
  const styleSheetProductGrid = document.createElement('style');
  styleSheetProductGrid.innerText = `
    .goat-add-btn:hover {
      background-color: #ECA315 !important;
    }
    .goat-product-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .goat-product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0px 15px 30px rgba(0,0,0,0.08) !important;
    }
  `;
  document.head.appendChild(styleSheetProductGrid);
}
