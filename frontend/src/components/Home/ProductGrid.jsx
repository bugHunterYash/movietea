import React from 'react';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PRODUCTS = [
  {
    id: 1,
    name: "Assorted Atelier Combo Box",
    reviews: 84,
    features: ["4 Premium Flavours", "Zero Sugar", "100% Natural"],
    price: 569,
    originalPrice: 700,
    discount: "18% OFF",
    image: "/assets/combo-pack.jpeg",
    borderColor: "#C5A376"
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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
              <button style={styles.addToCartBtn} onClick={onShopClick} className="goat-add-btn">
                ADD TO CART
              </button>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
    border: '1px solid', // Color overridden inline
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 8px 24px rgba(0,0,0,0.04)',
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
