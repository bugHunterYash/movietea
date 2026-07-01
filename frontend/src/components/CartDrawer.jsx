import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShieldCheck, Truck, Gift, Sparkles } from 'lucide-react';
import { PRICING, FEES } from '../utils/pricing';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  const navigate = useNavigate();
  const standardSubtotal = cartItems.reduce((acc, item) => {
    const price = PRICING[item.id]?.sale || item.price;
    return acc + price * item.quantity;
  }, 0);

  const firstOrderSubtotal = cartItems.reduce((acc, item) => {
    const price = PRICING[item.id]?.firstOrder || (item.price * 0.5);
    return acc + price * item.quantity;
  }, 0);

  const totalSavings = standardSubtotal - firstOrderSubtotal;
  const isFreeShipping = firstOrderSubtotal >= FEES.freeShippingMin;
  const shippingCharge = isFreeShipping ? 0 : FEES.shipping;
  const grandTotal = firstOrderSubtotal + FEES.platform + shippingCharge;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={styles.overlay}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={styles.drawer}
          >
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerTitleRow}>
                <h2 style={styles.title}>Your Collection</h2>
                {cartItems.length > 0 && (
                  <span style={styles.welcomeBadge}>
                    <Sparkles size={12} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} />
                    First Order Special
                  </span>
                )}
              </div>
              <button onClick={onClose} style={styles.closeBtn}>
                <X size={24} strokeWidth={1.5} color="var(--dark-color)" />
              </button>
            </div>

            {/* Items List */}
            <div style={styles.itemsList}>
              {cartItems.length === 0 ? (
                <div style={styles.emptyCart}>
                  <p>Your bag is currently empty.</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const pricingInfo = PRICING[item.id];
                  const originalPrice = pricingInfo?.sale || item.price;
                  const discountedPrice = pricingInfo?.firstOrder || (item.price * 0.5);
                  
                  return (
                    <div key={item.id} style={styles.itemRow}>
                      <img src={item.img} alt={item.name} style={styles.itemImg} />
                      <div style={styles.itemInfo}>
                        <h4 style={styles.itemName}>{item.name}</h4>
                        <div style={styles.itemPriceRow}>
                          <span style={styles.itemDiscountPrice}>₹{discountedPrice}</span>
                          <span style={styles.itemOriginalPrice}>₹{originalPrice}</span>
                        </div>
                        
                        {/* Quantity Selector */}
                        <div style={styles.quantityContainer}>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtn}>
                            <Minus size={12} />
                          </button>
                          <span style={styles.qtyCount}>{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtn}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <button onClick={() => onRemoveItem(item.id)} style={styles.removeBtn} aria-label="Remove item">
                        <Trash2 size={16} strokeWidth={1.5} color="var(--text-light)" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sticky Floating Savings Calculator */}
            {cartItems.length > 0 && totalSavings > 0 && (
              <div style={styles.savingsCalculator}>
                <div style={styles.savingsContent}>
                  <Gift size={16} color="var(--primary-color)" />
                  <span style={styles.savingsText}>
                    You save <strong>₹{totalSavings}</strong> on your first order
                  </span>
                </div>
              </div>
            )}

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div style={styles.footer}>
                <div style={styles.summaryBreakdown}>
                  <div style={styles.breakdownRow}>
                    <span>Items Subtotal (Standard)</span>
                    <span style={styles.standardText}>₹{standardSubtotal}</span>
                  </div>
                  <div style={styles.breakdownRow}>
                    <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>First Order Discount (50% OFF)</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>-₹{totalSavings}</span>
                  </div>
                  <div style={styles.breakdownRow}>
                    <span>Platform Fee</span>
                    <span>₹{FEES.platform}</span>
                  </div>
                  <div style={styles.breakdownRow}>
                    <span>Shipping Fee</span>
                    <span>{isFreeShipping ? 'FREE' : `₹${FEES.shipping}`}</span>
                  </div>
                  {!isFreeShipping && (
                    <div style={styles.shippingHelper}>
                      Add <strong>₹{FEES.freeShippingMin - firstOrderSubtotal}</strong> more for Free Shipping
                    </div>
                  )}
                </div>

                <div style={styles.separator} />

                <div style={styles.summaryRow}>
                  <span>Total Amount</span>
                  <span style={styles.subtotalPrice}>₹{grandTotal}</span>
                </div>

                {/* Trust Badges */}
                <div style={styles.trustRow}>
                  <span style={styles.trustItem}><Truck size={14} /> Free delivery above ₹499</span>
                  <span style={styles.trustItem}><ShieldCheck size={14} /> Secure Checkout</span>
                  <span style={styles.trustItem}><Gift size={14} /> Premium Packaging</span>
                  <span style={styles.trustItem}>✓ Platform fee ₹7 only</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  className="luxury-btn"
                  style={styles.checkoutBtn}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000000',
    zIndex: 10000,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '450px',
    maxWidth: '100vw',
    height: '100vh',
    backgroundColor: '#FAF7F2',
    boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
    zIndex: 10001,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid var(--border-color)',
  },
  header: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  title: {
    fontSize: '1.6rem',
    fontFamily: 'var(--font-serif)',
  },
  welcomeBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  closeBtn: {
    padding: '0.5rem',
  },
  itemsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  emptyCart: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-light)',
    fontSize: '1rem',
  },
  itemRow: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
    borderBottom: '1px solid rgba(43,26,18,0.05)',
    paddingBottom: '1.25rem',
  },
  itemImg: {
    width: '70px',
    height: '70px',
    objectFit: 'contain',
    backgroundColor: 'var(--cream-color)',
    padding: '0.5rem',
    borderRadius: '4px',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1,
  },
  itemName: {
    fontSize: '1.05rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
  },
  itemPriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  itemDiscountPrice: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
  },
  itemOriginalPrice: {
    fontSize: '0.82rem',
    color: '#888',
    textDecoration: 'line-through',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    width: 'fit-content',
  },
  qtyBtn: {
    padding: '0.2rem 0.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyCount: {
    fontSize: '0.8rem',
    fontFamily: 'var(--font-sans)',
    padding: '0 0.4rem',
    minWidth: '20px',
    textAlign: 'center',
  },
  removeBtn: {
    padding: '0.5rem',
    cursor: 'pointer',
  },
  savingsCalculator: {
    backgroundColor: '#F3E8D3',
    padding: '0.75rem 2rem',
    borderTop: '1px solid rgba(197, 107, 31, 0.15)',
    borderBottom: '1px solid rgba(197, 107, 31, 0.15)',
    zIndex: 10,
  },
  savingsContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  savingsText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    color: 'var(--dark-color)',
  },
  footer: {
    padding: '1.5rem 2rem 2rem 2rem',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  summaryBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    fontFamily: 'var(--font-sans)',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  standardText: {
    textDecoration: 'line-through',
    color: '#888',
  },
  shippingHelper: {
    fontSize: '0.75rem',
    color: 'var(--primary-color)',
    marginTop: '0.2rem',
  },
  separator: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '0.25rem 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-sans)',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
    alignItems: 'baseline',
  },
  subtotalPrice: {
    color: 'var(--dark-color)',
    fontSize: '1.4rem',
    fontWeight: '700',
  },
  trustRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    fontSize: '0.72rem',
    color: '#666',
    margin: '0.25rem 0',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  checkoutBtn: {
    width: '100%',
  },
};
