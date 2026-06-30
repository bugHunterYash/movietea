import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRICING, FEES } from '../utils/pricing';
import { ShieldCheck, Truck, CreditCard, UploadCloud, ChevronLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Checkout({ cartItems, setCartItems }) {
  React.useEffect(() => {
    document.title = "Checkout Secured | MOVITEA";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Secure checkout page for your MOVITEA selection. Enter your details to complete the purchase of premium organic tea blends.");
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [screenshotName, setScreenshotName] = useState('');
  const [orderStep, setOrderStep] = useState('form'); // 'form', 'payment', 'complete'

  const standardSubtotal = cartItems.reduce((acc, item) => {
    const price = PRICING[item.id]?.sale || item.price;
    return acc + price * item.quantity;
  }, 0);

  const firstOrderSubtotal = cartItems.reduce((acc, item) => {
    const price = PRICING[item.id]?.firstOrder || (item.price * 0.5);
    return acc + price * item.quantity;
  }, 0);

  const totalSavings = standardSubtotal - firstOrderSubtotal;
  const subtotalAfterPromo = Math.max(0, firstOrderSubtotal - promoDiscount);
  const isFreeShipping = subtotalAfterPromo >= FEES.freeShippingMin;
  const shippingCharge = isFreeShipping ? 0 : FEES.shipping;
  const grandTotal = subtotalAfterPromo + FEES.platform + shippingCharge;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'TEA50') {
      setPromoDiscount(50);
      setPromoApplied(true);
      alert('Promo Code TEA50 applied! Enjoy ₹50 off.');
    } else {
      alert('Invalid Promo Code. Try "TEA50".');
    }
  };

  const handleScreenshotChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotUploaded(true);
      setScreenshotName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderStep === 'form') {
      setOrderStep('payment');
    } else if (orderStep === 'payment') {
      if (!screenshotUploaded && paymentMethod === 'upi') {
        alert('Please upload a screenshot of your payment transfer for verification.');
        return;
      }
      setOrderStep('complete');
      // Clear cart
      setCartItems([]);
    }
  };

  if (cartItems.length === 0 && orderStep !== 'complete') {
    return (
      <div style={styles.emptyContainer}>
        <h2 style={styles.emptyTitle}>Your Bag is Empty</h2>
        <p style={styles.emptyDesc}>Choose from our premium blends to begin your sensory journey.</p>
        <button onClick={() => navigate('/shop')} className="luxury-btn">Shop Blends</button>
      </div>
    );
  }

  if (orderStep === 'complete') {
    return (
      <div style={styles.successContainer}>
        <CheckCircle2 size={64} color="var(--primary-color)" strokeWidth={1.2} />
        <h2 style={styles.successTitle}>Order Received</h2>
        <p style={styles.successDesc}>
          Thank you for choosing MOVITEA. Our concierge team is verifying your payment. 
          You will receive an order confirmation email shortly.
        </p>
        <div style={styles.verificationNote}>
          <ShieldCheck size={16} color="var(--primary-color)" />
          <span>Manual Verification Notice: Our team is checking your transaction screenshot.</span>
        </div>
        <button onClick={() => navigate('/')} className="luxury-btn">Return to Atelier</button>
      </div>
    );
  }

  return (
    <div style={styles.checkoutPage}>
      <div className="container" style={styles.checkoutContainer}>
        
        {/* Left Column: Form / Payment Details */}
        <form onSubmit={handleSubmit} style={styles.checkoutForm}>
          {orderStep === 'payment' && (
            <button type="button" onClick={() => setOrderStep('form')} style={styles.backBtn}>
              <ChevronLeft size={16} /> Back to Details
            </button>
          )}

          <h1 style={styles.pageTitle}>
            {orderStep === 'form' ? 'Delivery Details' : 'Payment Secure'}
          </h1>

          {orderStep === 'form' ? (
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeader}>Customer Details</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="yourname@domain.com"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <h3 style={styles.sectionHeader}>Delivery Address</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Address Line 1 *</label>
                  <input
                    type="text"
                    name="address1"
                    required
                    value={formData.address1}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Flat / House no, Building name"
                  />
                </div>
                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Address Line 2</label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Area, Street, Sector"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="City"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="State"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="6-digit postal code"
                  />
                </div>
              </div>

              <button type="submit" className="luxury-btn" style={styles.submitBtn}>
                Proceed To Payment <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={styles.formSection}>
              <h3 style={styles.sectionHeader}>Payment Details</h3>
              <div style={styles.upiDetails}>
                  <div style={styles.qrCard}>
                    <div style={styles.secureBadgeWrapper}>
                      <Lock size={12} color="#15803d" />
                      <span style={styles.secureBadgeText}>Secure Payment</span>
                    </div>
                    <h4 style={styles.qrHeading}>Scan & Pay</h4>
                    <div style={styles.qrCodeWrapper}>
                      <QRCodeSVG 
                        value={`upi://pay?pa=vinitsharmatafs@okhdfcbank&pn=MOVITEA&am=${grandTotal}&cu=INR&tn=Order Payment`} 
                        size={260} 
                        bgColor="#ffffff"
                        fgColor="#111111"
                        level="Q"
                      />
                    </div>
                    <div style={styles.qrAmountBox}>
                      <span>₹{grandTotal}</span>
                    </div>
                    <p style={styles.qrFooterText}>Open any UPI app to pay</p>
                  </div>

                  <div style={styles.uploadBox}>
                    <label style={styles.uploadLabel}>
                      <UploadCloud size={24} color="var(--primary-color)" />
                      <span>{screenshotUploaded ? `Uploaded: ${screenshotName}` : 'Upload Payment Screenshot'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

              <div style={styles.verificationAlert}>
                <ShieldCheck size={18} />
                <div>
                  <strong>Manual Verification Notice</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>
                    After completing payment, our team will verify the transaction and confirm your order.
                  </p>
                </div>
              </div>

              <button type="submit" className="luxury-btn" style={styles.submitBtn}>
                Place Order &mdash; ₹{grandTotal}
              </button>
            </div>
          )}
        </form>

        {/* Right Column: Order Summary */}
        <div style={styles.orderSummary}>
          <h3 style={styles.summaryTitle}>Your Selection</h3>
          
          <div style={styles.itemsList}>
            {cartItems.map((item) => {
              const pricingInfo = PRICING[item.id];
              const discountedPrice = pricingInfo?.firstOrder || (item.price * 0.5);
              return (
                <div key={item.id} style={styles.itemRow}>
                  <img src={item.img} alt={item.name} style={styles.itemImg} />
                  <div style={styles.itemMeta}>
                    <span style={styles.itemName}>{item.name}</span>
                    <span style={styles.itemQty}>Qty: {item.quantity}</span>
                  </div>
                  <span style={styles.itemPrice}>₹{discountedPrice * item.quantity}</span>
                </div>
              );
            })}
          </div>

          {/* Promo Section */}
          <div style={styles.promoSection}>
            <input
              type="text"
              placeholder="Promo Code (TEA50)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              style={styles.promoInput}
            />
            <button type="button" onClick={applyPromo} disabled={promoApplied} style={styles.promoBtn}>
              {promoApplied ? 'Applied' : 'Apply'}
            </button>
          </div>

          {/* Breakdown */}
          <div style={styles.breakdown}>
            <div style={styles.breakdownRow}>
              <span>Subtotal (Standard)</span>
              <span style={styles.strikeText}>₹{standardSubtotal}</span>
            </div>
            <div style={styles.breakdownRow}>
              <span style={{ color: 'var(--primary-color)' }}>First Order (50% OFF)</span>
              <span style={{ color: 'var(--primary-color)' }}>-₹{totalSavings}</span>
            </div>
            {promoApplied && (
              <div style={styles.breakdownRow}>
                <span style={{ color: 'var(--primary-color)' }}>Promo Discount</span>
                <span style={{ color: 'var(--primary-color)' }}>-₹{promoDiscount}</span>
              </div>
            )}
            <div style={styles.breakdownRow}>
              <span>Platform Fee</span>
              <span>₹{FEES.platform}</span>
            </div>
            <div style={styles.breakdownRow}>
              <span>Shipping Fee</span>
              <span>{isFreeShipping ? 'FREE' : `₹${FEES.shipping}`}</span>
            </div>
            
            <div style={styles.line} />
            
            <div style={styles.grandTotalRow}>
              <span>Total Amount</span>
              <span style={styles.grandPrice}>₹{grandTotal}</span>
            </div>
          </div>

          <div style={styles.trustInfo}>
            <ShieldCheck size={14} />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  checkoutPage: {
    backgroundColor: '#FAF7F2',
    minHeight: '100vh',
    paddingTop: 'calc(var(--header-height) + 2rem)',
    paddingBottom: '6rem',
  },
  checkoutContainer: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '4rem',
    alignItems: 'start',
  },
  checkoutForm: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    padding: '3rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#8A7A6B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    alignSelf: 'flex-start',
  },
  pageTitle: {
    fontSize: '2.4rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    color: '#2B1A12',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8rem',
  },
  sectionHeader: {
    fontSize: '1.15rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    color: '#2B1A12',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  inputGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#5c4b37',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '0.85rem 1rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.92rem',
    color: '#2B1A12',
    fontFamily: 'var(--font-sans)',
    backgroundColor: '#FAF7F2',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  submitBtn: {
    width: '100%',
    marginTop: '1rem',
  },
  orderSummary: {
    backgroundColor: '#FAF7F2',
    border: '1px solid var(--border-color)',
    padding: '2.5rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8rem',
  },
  summaryTitle: {
    fontSize: '1.4rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '400',
    color: '#2B1A12',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '1px solid rgba(43,26,18,0.05)',
    paddingBottom: '1rem',
  },
  itemImg: {
    width: '56px',
    height: '56px',
    objectFit: 'contain',
    backgroundColor: 'rgba(43,26,18,0.03)',
    borderRadius: '4px',
    padding: '0.25rem',
  },
  itemMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    flex: 1,
  },
  itemName: {
    fontSize: '0.95rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '400',
    color: '#2B1A12',
  },
  itemQty: {
    fontSize: '0.78rem',
    color: '#8A7A6B',
  },
  itemPrice: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2B1A12',
  },
  promoSection: {
    display: 'flex',
    gap: '0.8rem',
  },
  promoInput: {
    flex: 1,
    padding: '0.85rem 1rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  promoBtn: {
    backgroundColor: '#2B1A12',
    color: '#FAF7F2',
    padding: '0 1.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: 'none',
    cursor: 'pointer',
  },
  breakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    fontSize: '0.88rem',
    color: '#5c4b37',
    fontFamily: 'var(--font-sans)',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  strikeText: {
    textDecoration: 'line-through',
    opacity: 0.6,
  },
  line: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '0.4rem 0',
  },
  grandTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.15rem',
    fontWeight: '600',
    color: '#2B1A12',
  },
  grandPrice: {
    fontSize: '1.45rem',
    fontWeight: '700',
  },
  trustInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: '#8A7A6B',
  },
  paymentSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.1rem 1.4rem',
    border: '1px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  upiDetails: {
    backgroundColor: '#FAF7F2',
    border: '1px solid var(--border-color)',
    padding: '1.5rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    textAlign: 'center',
  },
  upiTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2B1A12',
  },
  upiDesc: {
    fontSize: '0.85rem',
    color: '#5c4b37',
  },
  upiAddressBox: {
    padding: '0.75rem 2rem',
    border: '2px dashed var(--primary-color)',
    backgroundColor: '#FFFFFF',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: 'var(--primary-color)',
    letterSpacing: '0.05em',
  },
  uploadBox: {
    width: '100%',
    marginTop: '0.5rem',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1.5rem',
    backgroundColor: '#FFFFFF',
    border: '1px dashed var(--border-color)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#8A7A6B',
    transition: 'background-color 0.3s',
  },
  verificationAlert: {
    display: 'flex',
    gap: '0.8rem',
    backgroundColor: 'rgba(197, 107, 31, 0.08)',
    border: '1px solid rgba(197, 107, 31, 0.2)',
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    color: '#C56B1F',
    fontSize: '0.9rem',
    alignItems: 'center',
  },
  codDesc: {
    fontSize: '0.9rem',
    color: '#5c4b37',
    fontStyle: 'italic',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
    padding: '2rem',
    gap: '1rem',
  },
  emptyTitle: {
    fontSize: '2.4rem',
    fontFamily: 'var(--font-serif)',
  },
  emptyDesc: {
    fontSize: '1.05rem',
    color: '#8A7A6B',
    maxWidth: '400px',
    marginBottom: '1rem',
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    textAlign: 'center',
    padding: '3rem',
    gap: '1.5rem',
  },
  successTitle: {
    fontSize: '3rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    color: '#2B1A12',
  },
  successDesc: {
    fontSize: '1.15rem',
    color: '#5c4b37',
    maxWidth: '560px',
    lineHeight: '1.6',
  },
  verificationNote: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#F3E8D3',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '0.82rem',
    color: '#2B1A12',
    fontWeight: '600',
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
    border: '1px solid rgba(0,0,0,0.05)',
    position: 'relative'
  },
  secureBadgeWrapper: {
    marginBottom: '12px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    padding: '4px 8px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  secureBadgeText: {
    fontSize: '0.65rem',
    fontWeight: '600',
    color: '#15803d',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  },
  qrHeading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    fontFamily: 'var(--font-serif)',
    color: '#111111',
    margin: '10px 0 20px 0'
  },
  qrCodeWrapper: {
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #eaeaea'
  },
  qrAmountBox: {
    marginTop: '20px',
    backgroundColor: '#FAF7F2',
    padding: '10px 24px',
    borderRadius: '30px',
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-serif)'
  },
  qrFooterText: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '15px',
    marginBottom: '0'
  }
};
