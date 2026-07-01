import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRICING, FEES } from '../utils/pricing';
import { ShieldCheck, Truck, CreditCard, UploadCloud, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ordersAPI, promosAPI } from '../utils/api';

export default function Checkout({ cartItems, clearCart, user }) {
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
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address1: user?.address1 || '',
    address2: user?.address2 || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoId, setPromoId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [screenshotName, setScreenshotName] = useState('');
  const [orderStep, setOrderStep] = useState('form'); // 'form', 'payment', 'complete'
  const [loading, setLoading] = useState(false);

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

  const applyPromo = async () => {
    try {
      const result = await promosAPI.validate(promoCode);
      if (result.valid) {
        setPromoDiscount(result.discountAmount);
        setPromoApplied(true);
        setPromoId(result.id);
        alert(`Promo Code ${result.code} applied! Enjoy ₹${result.discountAmount} off.`);
      }
    } catch (error) {
      alert(error.message || 'Invalid Promo Code');
    }
  };

  const handleScreenshotChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
      setScreenshotUploaded(true);
      setScreenshotName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (orderStep === 'form') {
      setOrderStep('payment');
      return;
    }

    if (orderStep === 'payment') {
      if (!screenshotUploaded && paymentMethod === 'upi') {
        alert('Please upload a screenshot of your payment transfer for verification.');
        return;
      }

      setLoading(true);
      try {
        // Create order items from cart
        const items = cartItems.map(item => ({
          productId: item.dbProductId || item.id,
          name: item.name,
          price: PRICING[item.id]?.firstOrder || (item.price * 0.5),
          quantity: item.quantity
        }));

        const orderData = {
          items,
          totalAmount: grandTotal,
          paymentMethod: paymentMethod.toUpperCase(),
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          promoCodeId: promoId
        };

        await ordersAPI.create(orderData, screenshotFile);
        setOrderStep('complete');
        clearCart();
      } catch (error) {
        console.error('Order creation failed:', error);
        alert('Failed to place order. Please try again.');
      } finally {
        setLoading(false);
      }
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
              <h3 style={styles.sectionHeader}>Select Payment Method</h3>
              
              <div style={styles.paymentSelector}>
                <div
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    ...styles.paymentOption,
                    borderColor: paymentMethod === 'upi' ? 'var(--primary-color)' : 'var(--border-color)',
                  }}
                >
                  <CreditCard size={18} />
                  <span>UPI / Bank Transfer (Recommended)</span>
                </div>
                <div
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    ...styles.paymentOption,
                    borderColor: paymentMethod === 'cod' ? 'var(--primary-color)' : 'var(--border-color)',
                  }}
                >
                  <Truck size={18} />
                  <span>Cash on Delivery</span>
                </div>
              </div>

              {paymentMethod === 'upi' ? (
                <div style={styles.upiDetails}>
                  <h4 style={styles.upiTitle}>UPI Transfer Info</h4>
                  <p style={styles.upiDesc}>Please send the exact amount of <strong>₹{grandTotal}</strong> to our verified merchant ID:</p>
                  <div style={styles.upiAddressBox}>
                    <span>movitea@upi</span>
                  </div>

                  {/* QR Code Display */}
                  <div style={styles.qrContainer}>
                    <div style={styles.qrPlaceholder}>
                      <svg viewBox="0 0 100 100" style={styles.qrCode}>
                        {/* Simple QR code representation */}
                        <rect x="10" y="10" width="25" height="25" fill="#2B1A12"/>
                        <rect x="65" y="10" width="25" height="25" fill="#2B1A12"/>
                        <rect x="10" y="65" width="25" height="25" fill="#2B1A12"/>
                        <rect x="15" y="15" width="15" height="15" fill="#FAF7F2"/>
                        <rect x="70" y="15" width="15" height="15" fill="#FAF7F2"/>
                        <rect x="15" y="70" width="15" height="15" fill="#FAF7F2"/>
                        <rect x="18" y="18" width="9" height="9" fill="#2B1A12"/>
                        <rect x="73" y="18" width="9" height="9" fill="#2B1A12"/>
                        <rect x="18" y="73" width="9" height="9" fill="#2B1A12"/>
                        <rect x="40" y="10" width="5" height="5" fill="#2B1A12"/>
                        <rect x="50" y="10" width="5" height="5" fill="#2B1A12"/>
                        <rect x="40" y="20" width="5" height="5" fill="#2B1A12"/>
                        <rect x="45" y="15" width="5" height="5" fill="#2B1A12"/>
                        <rect x="55" y="20" width="5" height="5" fill="#2B1A12"/>
                        <rect x="40" y="40" width="20" height="20" fill="#2B1A12"/>
                        <rect x="45" y="45" width="10" height="10" fill="#FAF7F2"/>
                        <rect x="48" y="48" width="4" height="4" fill="#2B1A12"/>
                        <rect x="10" y="40" width="5" height="5" fill="#2B1A12"/>
                        <rect x="20" y="45" width="5" height="5" fill="#2B1A12"/>
                        <rect x="30" y="40" width="5" height="5" fill="#2B1A12"/>
                        <rect x="65" y="40" width="5" height="5" fill="#2B1A12"/>
                        <rect x="75" y="45" width="5" height="5" fill="#2B1A12"/>
                        <rect x="85" y="40" width="5" height="5" fill="#2B1A12"/>
                        <rect x="40" y="65" width="5" height="5" fill="#2B1A12"/>
                        <rect x="50" y="70" width="5" height="5" fill="#2B1A12"/>
                        <rect x="65" y="65" width="5" height="5" fill="#2B1A12"/>
                        <rect x="75" y="75" width="5" height="5" fill="#2B1A12"/>
                        <rect x="85" y="85" width="5" height="5" fill="#2B1A12"/>
                      </svg>
                    </div>
                    <p style={styles.qrText}>Scan to pay ₹{grandTotal}</p>
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
              ) : (
                <p style={styles.codDesc}>You will pay cash when the premium container arrives at your doorstep.</p>
              )}

              <div style={styles.verificationAlert}>
                <ShieldCheck size={18} />
                <div>
                  <strong>Manual Verification Notice</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>
                    After completing payment, our team will verify the transaction and confirm your order.
                  </p>
                </div>
              </div>

              <button type="submit" className="luxury-btn" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : `Place Order — ₹${grandTotal}`}
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
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
  },
  qrPlaceholder: {
    width: '150px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: '100%',
    height: '100%',
  },
  qrText: {
    fontSize: '0.8rem',
    color: '#8A7A6B',
    margin: 0,
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
};
