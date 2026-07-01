import React, { useState } from 'react';
import PreOrderModal from '../components/PreOrderModal';

const GIFTS = [
  {
    id: 'g1',
    name: 'The Grand Assorted Pack',
    subtitle: 'Sensory Celebration',
    price: '₹1,899',
    img: '/assets/combo-pack.jpeg',
    features: ['Contains all 4 signature flavours', 'Custom gold leaf packaging', 'Includes signature wooden tea scoop'],
  },
  {
    id: 'g2',
    name: 'Festival Gifting Box',
    subtitle: 'Limited Festive Edition',
    price: '₹2,499',
    img: '/assets/combo-individual.jfif',
    features: ['24 Assorted sachets', 'Custom festive packaging art', 'Handcrafted ceramic mug included'],
  },
  {
    id: 'g3',
    name: 'Atelier Corporate Chest',
    subtitle: 'Ultimate Executive Luxury',
    price: '₹4,500',
    img: '/assets/combo-pack.jpeg',
    features: ['Premium walnut wood presentation box', 'Stainless steel micro-infuser', 'Luxury collection catalog card'],
  },
];

export default function GiftCollection() {
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [preOrderProduct, setPreOrderProduct] = useState(null);
  React.useEffect(() => {
    document.title = "Gifting Collection | MOVITEA";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore MOVITEA's premium curated gift chests and boxes. Perfect for corporate gifting, wedding collections, and seasonal celebrations.");
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContent}>
          <span style={styles.subtitle}>GIFTING BY MOVITEA</span>
          <h1 style={styles.title}>The Art of Giving</h1>
          <p style={styles.desc}>
            Elevate corporate milestones, wedding celebrations, and festival gifting with our premium curated tea chests. Designed to leave a lasting impression of sophisticated taste.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={styles.gridSection}>
        <div className="container" style={styles.grid}>
          {GIFTS.map((gift) => (
            <div key={gift.id} style={styles.card}>
              <div style={styles.imgWrapper}>
                <img src={gift.img} alt={gift.name} style={styles.giftImg} />
              </div>
              <div style={styles.info}>
                <span style={styles.cardSubtitle}>{gift.subtitle}</span>
                <h2 style={styles.cardTitle}>{gift.name}</h2>
                <span style={styles.price}>{gift.price}</span>
                
                <ul style={styles.featureList}>
                  {gift.features.map((feat, index) => (
                    <li key={index} style={styles.featureItem}>
                      <span style={styles.bullet}>&bull;</span> {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setPreOrderProduct({ id: gift.id, name: gift.name });
                    setIsPreOrderModalOpen(true);
                  }}
                  className="luxury-btn"
                  style={styles.addBtn}
                >
                  PRE-ORDER
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Gifting Inquiry */}
      <section style={styles.inquirySection}>
        <div className="container" style={styles.inquiryContainer}>
          <span style={styles.subtitle}>BESPOKE SERVICE</span>
          <h2 style={styles.inquiryTitle}>Corporate & Custom Gifting</h2>
          <p style={styles.inquiryText}>
            For custom branding, bulk corporate orders, or wedding gift registries, our gifting atelier offers bespoke customization. Let us co-create the perfect sensory box for your brand.
          </p>
          <form style={styles.form} onSubmit={(e) => { e.preventDefault(); alert("Inquiry submitted. Our concierge team will reach out in 24 hours."); }}>
            <div style={styles.formGrid}>
              <input type="text" placeholder="Full Name" style={styles.input} required />
              <input type="email" placeholder="Work Email" style={styles.input} required />
              <input type="text" placeholder="Quantity (Min 50)" style={styles.input} required />
              <button type="submit" className="luxury-btn">Submit Inquiry</button>
            </div>
          </form>
        </div>
      </section>

      <PreOrderModal 
        isOpen={isPreOrderModalOpen}
        onClose={() => setIsPreOrderModalOpen(false)}
        product={preOrderProduct}
      />
    </div>
  );
}

const styles = {
  page: {
    paddingTop: 'var(--header-height)',
    backgroundColor: '#FAF7F2',
  },
  heroSection: {
    padding: '8rem 0 4rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '5rem',
  },
  desc: {
    fontSize: '1.15rem',
    lineHeight: '1.7',
  },
  gridSection: {
    padding: '4rem 0 8rem',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6rem',
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    alignItems: 'center',
    gap: '5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '6rem',
  },
  imgWrapper: {
    width: '100%',
    height: '380px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftImg: {
    height: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 30px rgba(43, 26, 18, 0.1))',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.2rem',
  },
  cardSubtitle: {
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    color: 'var(--primary-color)',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '3rem',
    lineHeight: '1.2',
  },
  price: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
  },
  featureList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    margin: '0.5rem 0',
  },
  featureItem: {
    fontSize: '1rem',
    color: 'var(--text-light)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  bullet: {
    color: 'var(--primary-color)',
    fontSize: '1.2rem',
  },
  addBtn: {
    marginTop: '1rem',
  },
  inquirySection: {
    backgroundColor: 'var(--cream-color)',
    padding: '8rem 0',
  },
  inquiryContainer: {
    maxWidth: '800px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  inquiryTitle: {
    fontSize: '3rem',
  },
  inquiryText: {
    fontSize: '1.1rem',
  },
  form: {
    width: '100%',
    marginTop: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '1rem',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    padding: '1.15rem 1.5rem',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    width: '100%',
  },
};

// Add responsive styles
const styleSheetGifting = document.createElement('style');
styleSheetGifting.innerText = `
  @media (max-width: 900px) {
    div[style*="gridSection"] div[style*="gridTemplateColumns"] {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: 3rem !important;
      padding-bottom: 4rem !important;
    }
    div[style*="gridSection"] div[style*="info"] {
      align-items: center !important;
    }
    div[style*="formGrid"] {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
  }
`;
document.head.appendChild(styleSheetGifting);
