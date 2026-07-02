import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, Coffee, Store, Hotel, Building, Briefcase, GraduationCap, PartyPopper, CheckCircle2, Plus, Minus } from 'lucide-react';
import SEO from '../components/SEO';

// Form Validation Schema using Zod
const bulkOrderSchema = z.object({
  companyName: z.string().min(2, "Company Name is required"),
  contactPerson: z.string().min(2, "Contact Person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  gstNumber: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid Pincode is required"),
  businessType: z.string().min(1, "Please select a business type"),
  interestedProducts: z.array(z.string()).min(1, "Please select at least one product"),
  estimatedQuantity: z.string().min(1, "Please select an estimated quantity"),
  message: z.string().optional()
});

export default function BulkOrders() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(bulkOrderSchema),
    defaultValues: {
      interestedProducts: []
    }
  });

  const onSubmit = async (data) => {
    // Simulate backend API call
    console.log("Submitting bulk order data to /api/bulk-orders:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    reset();
    setIsSuccessModalOpen(true);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerFadeUp = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const businessTypes = [
    'Café', 'Office', 'Retail Store', 'Distributor', 'Hotel', 'Restaurant', 'Corporate', 'Other'
  ];

  const productOptions = [
    'Chocolate Tea', 'Vanilla Tea', 'Rose Tea', 'Butterscotch Tea',
    '10 Sachets', '100gm Packs', 'Premium Jars', 'Combo Packs'
  ];

  const quantityOptions = [
    '50+', '100+', '250+', '500+', '1000+', '5000+'
  ];

  const whoCanOrder = [
    { title: 'Offices', icon: <Building2 size={24} strokeWidth={1.5} /> },
    { title: 'Cafés', icon: <Coffee size={24} strokeWidth={1.5} /> },
    { title: 'Restaurants', icon: <Hotel size={24} strokeWidth={1.5} /> },
    { title: 'Hotels', icon: <Building size={24} strokeWidth={1.5} /> },
    { title: 'Corporate Gifting', icon: <Briefcase size={24} strokeWidth={1.5} /> },
    { title: 'Retail Stores', icon: <Store size={24} strokeWidth={1.5} /> },
    { title: 'Distributors', icon: <GraduationCap size={24} strokeWidth={1.5} /> },
    { title: 'Events & Weddings', icon: <PartyPopper size={24} strokeWidth={1.5} /> },
  ];

  const faqs = [
    { q: "What is the minimum order quantity?", a: "Our minimum order quantity for bulk pricing starts at 50 units (can be mixed across different flavours and sizes)." },
    { q: "Can I customize gift boxes?", a: "Yes, we offer custom branding, tailored ribbons, and personalized greeting cards for corporate gifting and wedding hampers." },
    { q: "Do you provide GST invoices?", a: "Absolutely. A proper GST invoice is provided with every bulk order, allowing you to claim input tax credit." },
    { q: "Can I become a distributor?", a: "Yes, we are actively looking for exclusive distribution partners across various states and cities. Please fill out the form and select 'Distributor'." },
    { q: "How quickly do you ship bulk orders?", a: "Standard bulk orders are dispatched within 48-72 hours. Customized gift boxes may take 5-7 business days depending on the volume." }
  ];

  return (
    <div style={styles.page}>
      <SEO 
        title="Bulk Tea Orders | MOVITEA"
        description="Order premium flavoured tea in bulk from MOVITEA. Corporate gifting, cafés, hotels, offices, distributors and wholesale tea orders across India."
      />

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContainer}>
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span style={styles.eyebrow}>B2B & WHOLESALE</span>
            <h1 style={styles.heroTitle}>Bulk Orders Made Simple</h1>
            <p style={styles.heroSubtitle}>
              Whether you're ordering for your office, café, corporate event, wedding, hotel, or retail business, MOVITEA offers premium flavoured tea solutions tailored to your needs.
            </p>
            <button 
              style={styles.ctaBtn} 
              onClick={() => document.getElementById('quote-form').scrollIntoView({ behavior: 'smooth' })}
            >
              Request a Quote
            </button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose MOVITEA */}
      <section style={styles.featuresSection}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Choose MOVITEA for Bulk Orders</h2>
          </motion.div>
          
          <motion.div 
            className="feature-cards-grid" 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerFadeUp}
          >
            {[
              { title: "Premium Quality", desc: "Only premium ingredients and carefully crafted flavours that leave a lasting impression." },
              { title: "Competitive Pricing", desc: "Exclusive wholesale pricing tiers offering substantial savings for bulk purchases." },
              { title: "Fast Fulfilment", desc: "Reliable, insured delivery across India ensuring your stock arrives fresh and on time." },
              { title: "Custom Solutions", desc: "Gift hampers, corporate gifting, café supply, and dedicated retail partnerships." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} style={styles.featureCard} className="hover-lift">
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who Can Order */}
      <section style={styles.whoSection}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Who Can Order?</h2>
          </motion.div>
          
          <motion.div 
            style={styles.iconGrid}
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerFadeUp}
          >
            {whoCanOrder.map((item, i) => (
              <motion.div key={i} variants={fadeUp} style={styles.iconCard}>
                <div style={styles.iconCircle}>{item.icon}</div>
                <h4 style={styles.iconTitle}>{item.title}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bulk Order Form */}
      <section id="quote-form" style={styles.formSection}>
        <div className="container">
          <div style={styles.formWrapper}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Request a Quote</h2>
              <p style={styles.formDesc}>Fill out the details below and our wholesale team will get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              
              <div style={styles.formGrid}>
                {/* Company & Contact */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Company/Business Name *</label>
                  <input {...register('companyName')} style={styles.input} placeholder="e.g. Acme Corp" />
                  {errors.companyName && <span style={styles.errorText}>{errors.companyName.message}</span>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Contact Person *</label>
                  <input {...register('contactPerson')} style={styles.input} placeholder="Full Name" />
                  {errors.contactPerson && <span style={styles.errorText}>{errors.contactPerson.message}</span>}
                </div>

                {/* Email & Phone */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input {...register('email')} type="email" style={styles.input} placeholder="name@company.com" />
                  {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <input {...register('phone')} type="tel" style={styles.input} placeholder="+91" />
                  {errors.phone && <span style={styles.errorText}>{errors.phone.message}</span>}
                </div>

                {/* GST & Business Type */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>GST Number (Optional)</label>
                  <input {...register('gstNumber')} style={styles.input} placeholder="Enter GSTIN" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Business Type *</label>
                  <select {...register('businessType')} style={styles.input}>
                    <option value="">Select Type</option>
                    {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {errors.businessType && <span style={styles.errorText}>{errors.businessType.message}</span>}
                </div>

                {/* Address */}
                <div style={styles.inputGroupFull}>
                  <div style={styles.tripleGrid}>
                    <div>
                      <label style={styles.label}>City *</label>
                      <input {...register('city')} style={styles.input} placeholder="City" />
                      {errors.city && <span style={styles.errorText}>{errors.city.message}</span>}
                    </div>
                    <div>
                      <label style={styles.label}>State *</label>
                      <input {...register('state')} style={styles.input} placeholder="State" />
                      {errors.state && <span style={styles.errorText}>{errors.state.message}</span>}
                    </div>
                    <div>
                      <label style={styles.label}>Pincode *</label>
                      <input {...register('pincode')} style={styles.input} placeholder="123456" />
                      {errors.pincode && <span style={styles.errorText}>{errors.pincode.message}</span>}
                    </div>
                  </div>
                </div>

                {/* Interested Products (Checkboxes) */}
                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Interested Products *</label>
                  <div style={styles.checkboxGrid}>
                    {productOptions.map(option => (
                      <label key={option} style={styles.checkboxLabel}>
                        <input type="checkbox" value={option} {...register('interestedProducts')} style={styles.checkbox} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.interestedProducts && <span style={styles.errorText}>{errors.interestedProducts.message}</span>}
                </div>

                {/* Quantity */}
                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Estimated Quantity *</label>
                  <select {...register('estimatedQuantity')} style={styles.input}>
                    <option value="">Select Quantity Range</option>
                    {quantityOptions.map(qty => <option key={qty} value={qty}>{qty}</option>)}
                  </select>
                  {errors.estimatedQuantity && <span style={styles.errorText}>{errors.estimatedQuantity.message}</span>}
                </div>

                {/* Message */}
                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Additional Requirements / Message</label>
                  <textarea {...register('message')} style={styles.textarea} placeholder="Tell us more about your requirement..."></textarea>
                </div>
              </div>

              <div style={styles.submitWrapper}>
                <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Request Bulk Quote'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <div className="container">
          <div style={styles.faqWrapper}>
            <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
            <div style={styles.accordionContainer}>
              {faqs.map((faq, index) => (
                <div key={index} style={styles.accordionItem}>
                  <button 
                    style={styles.accordionHeader} 
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span style={styles.accordionQ}>{faq.q}</span>
                    {expandedFaq === index ? <Minus size={20} color="#D4AF37" /> : <Plus size={20} color="#D4AF37" />}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={styles.accordionA}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section style={styles.contactStrip}>
        <div className="container" style={styles.stripGrid}>
          <div style={styles.stripItem}>
            <span style={styles.stripLabel}>Email</span>
            <span style={styles.stripValue}>movitea8@gmail.com</span>
          </div>
          <div style={styles.stripItem}>
            <span style={styles.stripLabel}>CALL US</span>
            <span style={styles.stripValue}>+91 9818501302</span>
          </div>
          <div style={styles.stripItem}>
            <span style={styles.stripLabel}>Business Hours</span>
            <span style={styles.stripValue}>Monday – Saturday<br/>10 AM – 7 PM</span>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div style={styles.modalOverlay}>
            <motion.div 
              style={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <CheckCircle2 size={60} color="#D4AF37" style={{ marginBottom: '1.5rem' }} />
              <h2 style={styles.modalTitle}>Thank You!</h2>
              <p style={styles.modalText}>
                Your bulk order inquiry has been received. Our team will review your requirements and contact you within 24 hours with pricing and product details.
              </p>
              <button style={styles.modalBtn} onClick={() => setIsSuccessModalOpen(false)}>
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#F8F4ED',
    minHeight: '100vh',
    paddingTop: 'var(--header-height)',
    color: '#2B1A12',
  },
  heroSection: {
    padding: '8rem 0 6rem 0',
    textAlign: 'center',
  },
  heroContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  eyebrow: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    color: '#D4AF37',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '1.5rem',
  },
  heroTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '4.5rem',
    fontWeight: '300',
    lineHeight: '1.1',
    marginBottom: '1.5rem',
  },
  heroSubtitle: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.25rem',
    lineHeight: '1.6',
    color: 'rgba(43, 26, 18, 0.7)',
    marginBottom: '3rem',
  },
  ctaBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '1.25rem 3.5rem',
    backgroundColor: '#2B1A12',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '3rem',
    fontWeight: '300',
  },
  featuresSection: {
    padding: '6rem 0',
    backgroundColor: '#FFFFFF',
  },
  featureCard: {
    backgroundColor: '#F8F4ED',
    padding: '3rem 2rem',
    borderRadius: '12px',
    border: '1px solid rgba(43, 26, 18, 0.05)',
  },
  featureTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: '400',
    marginBottom: '1rem',
    color: '#D4AF37',
  },
  featureDesc: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'rgba(43, 26, 18, 0.7)',
  },
  whoSection: {
    padding: '8rem 0',
  },
  iconGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
  },
  iconCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    padding: '2rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#F8F4ED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#D4AF37',
  },
  iconTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    fontWeight: '400',
  },
  formSection: {
    padding: '6rem 0 8rem 0',
  },
  formWrapper: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    padding: '4rem',
    borderRadius: '24px',
    boxShadow: '0 30px 60px rgba(43, 26, 18, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  formTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    fontWeight: '300',
    marginBottom: '1rem',
  },
  formDesc: {
    color: 'rgba(43, 26, 18, 0.6)',
    fontSize: '1.05rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  inputGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(43, 26, 18, 0.8)',
  },
  input: {
    padding: '1rem 1.25rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    border: '1px solid rgba(43, 26, 18, 0.15)',
    borderRadius: '8px',
    backgroundColor: '#FAFAF8',
    color: '#2B1A12',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    padding: '1rem 1.25rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    border: '1px solid rgba(43, 26, 18, 0.15)',
    borderRadius: '8px',
    backgroundColor: '#FAFAF8',
    color: '#2B1A12',
    outline: 'none',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'border-color 0.2s ease',
  },
  errorText: {
    color: '#E03131',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-sans)',
    marginTop: '0.25rem',
  },
  tripleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '2rem',
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    color: 'rgba(43, 26, 18, 0.8)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#D4AF37',
  },
  submitWrapper: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  submitBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '1.25rem 4rem',
    backgroundColor: '#D4AF37',
    color: '#2B1A12',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  faqSection: {
    padding: '6rem 0',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid rgba(43, 26, 18, 0.05)',
  },
  faqWrapper: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  faqTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  accordionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  accordionItem: {
    borderBottom: '1px solid rgba(43, 26, 18, 0.1)',
    paddingBottom: '1rem',
  },
  accordionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: '1rem 0',
    cursor: 'pointer',
    textAlign: 'left',
  },
  accordionQ: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    color: '#2B1A12',
  },
  accordionA: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.05rem',
    color: 'rgba(43, 26, 18, 0.7)',
    lineHeight: '1.6',
    paddingBottom: '1rem',
  },
  contactStrip: {
    backgroundColor: '#2B1A12',
    color: '#FFFFFF',
    padding: '4rem 0',
  },
  stripGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    textAlign: 'center',
  },
  stripItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  stripLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#D4AF37',
  },
  stripValue: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    opacity: 0.9,
    lineHeight: '1.5',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43, 26, 18, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: '4rem',
    borderRadius: '24px',
    maxWidth: '500px',
    textAlign: 'center',
  },
  modalTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    fontWeight: '300',
    marginBottom: '1rem',
  },
  modalText: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(43, 26, 18, 0.7)',
    marginBottom: '2rem',
  },
  modalBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '1rem 3rem',
    backgroundColor: '#2B1A12',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
  }
};

// Global CSS for Form interactions & responsiveness
const styleSheetBulk = document.createElement('style');
styleSheetBulk.innerText = `
  .feature-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(43, 26, 18, 0.08);
  }
  input:focus, select:focus, textarea:focus {
    border-color: #D4AF37 !important;
  }
  @media (max-width: 1024px) {
    .feature-cards-grid, div[style*="iconGrid"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    div[style*="formGrid"] {
      grid-template-columns: 1fr !important;
    }
    div[style*="inputGroupFull"] {
      grid-column: auto !important;
    }
  }
  @media (max-width: 768px) {
    h1[style*="heroTitle"] {
      font-size: 3rem !important;
    }
    .feature-cards-grid, div[style*="iconGrid"] {
      grid-template-columns: 1fr !important;
    }
    div[style*="tripleGrid"] {
      grid-template-columns: 1fr !important;
    }
    div[style*="checkboxGrid"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    div[style*="stripGrid"] {
      grid-template-columns: 1fr !important;
      gap: 3rem !important;
    }
    div[style*="formWrapper"] {
      padding: 2rem !important;
    }
  }
`;
document.head.appendChild(styleSheetBulk);
