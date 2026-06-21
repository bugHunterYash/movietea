import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SHOWCASE_PRODUCTS = [
  {
    id: 'rose',
    name: 'Rose Atelier',
    subtitle: 'Atelier Blend No. 01',
    img: '/assets/rose.jpeg',
    price: 219,
    mrp: 269,
    savePercent: 18,
    bgColor: '#F4D3DC', // soft blush pink
    textColor: '#2B1A12',
    desc: 'Steeped in hand-picked rose petals and delicate buds, this infusion offers a relaxing floral perfume and soft blush pink notes that linger on the palate.',
  },
  {
    id: 'chocolate',
    name: 'Cacao Reserve',
    subtitle: 'Atelier Blend No. 02',
    img: '/assets/chocolate.jpeg',
    price: 199,
    mrp: 269,
    savePercent: 26,
    bgColor: '#2B1A12', // deep cocoa brown
    textColor: '#FAF7F2',
    desc: 'A decadent union of premium roasted cacao husks and single-origin black tea, with a velvety smooth body and bold cocoa depth.',
  },
  {
    id: 'vanilla',
    name: 'Vanilla Orchid',
    subtitle: 'Atelier Blend No. 03',
    img: '/assets/vanilla.jpeg',
    price: 199,
    mrp: 269,
    savePercent: 26,
    bgColor: '#FAF7F2', // creamy ivory
    textColor: '#2B1A12',
    desc: 'Infused with premium whole Madagascar vanilla beans, delivering a warm, comforting aroma and naturally smooth mouthfeel.',
  },
  {
    id: 'butterscotch',
    name: 'Toasted Butterscotch',
    subtitle: 'Atelier Blend No. 04',
    img: '/assets/butterscotch.jpeg',
    price: 219,
    mrp: 269,
    savePercent: 18,
    bgColor: '#D0853E', // warm caramel
    textColor: '#FAF7F2',
    desc: 'Indulge in sweet toasted sugar notes, rich buttery warmth, and a smooth caramel glaze that transforms every sip into pure luxury.',
  },
];

export default function ProductShowcase({ onSelectProduct }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Map scroll progress to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-56%']);

  return (
    <div ref={containerRef} style={styles.scrollWrapper}>
      {/* Sticky Inner Container */}
      <div style={styles.stickyContainer}>
        <div className="container" style={styles.showcaseIntro}>
          <span style={styles.subtitle}>THE COLLECTION</span>
          <h2 style={styles.title}>The Atelier Series</h2>
        </div>

        {/* Horizontal Moving Row */}
        <motion.div style={{ ...styles.cardRow, x }} className="card-row-slider">
          {SHOWCASE_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod.id)}
              style={{
                ...styles.productCard,
                backgroundColor: prod.bgColor,
                color: prod.textColor,
                borderColor: prod.textColor === '#FAF7F2' ? 'rgba(250,247,242,0.1)' : 'rgba(43,26,18,0.1)',
              }}
            >
              {/* Left Column: Storytelling info */}
              <div style={styles.leftGridCol}>
                <span style={{
                  ...styles.cardSubtitle,
                  color: prod.textColor === '#FAF7F2' ? 'rgba(250,247,242,0.7)' : 'rgba(43,26,18,0.7)'
                }}>
                  {prod.subtitle}
                </span>
                
                <h3 style={{ ...styles.cardTitle, color: prod.textColor }}>{prod.name}</h3>
                
                <p style={{
                  ...styles.cardDesc,
                  color: prod.textColor === '#FAF7F2' ? 'rgba(250,247,242,0.85)' : 'rgba(43,26,18,0.85)'
                }}>
                  {prod.desc}
                </p>

                <div style={styles.priceRow}>
                  <span style={{ ...styles.cardPrice, color: prod.textColor }}>₹{prod.price}</span>
                  <span style={{ ...styles.cardMrp, color: prod.textColor === '#FAF7F2' ? 'rgba(250,247,242,0.6)' : 'rgba(43,26,18,0.6)' }}>₹{prod.mrp}</span>
                  <span style={{ ...styles.cardSave, color: prod.textColor, borderColor: prod.textColor }}>Save {prod.savePercent}%</span>
                </div>

                <div style={styles.cardFooter}>
                  <span
                    className="luxury-link"
                    style={{
                      ...styles.footerLink,
                      color: prod.textColor,
                      '--link-color': prod.textColor, // custom property for styling
                    }}
                  >
                    Explore Details &rarr;
                  </span>
                </div>
              </div>

              {/* Right Column: Imagery */}
              <div style={styles.rightGridCol}>
                <div style={styles.imageContainer}>
                  <img src={prod.img} alt={prod.name} style={styles.cardImg} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  scrollWrapper: {
    height: '170vh',
    position: 'relative',
    backgroundColor: 'var(--bg-color)',
  },
  stickyContainer: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 'var(--header-height)',
  },
  showcaseIntro: {
    marginBottom: '3rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '3.6rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
  },
  cardRow: {
    display: 'flex',
    gap: '3rem',
    paddingLeft: 'max(2rem, calc((100vw - var(--container-max-width)) / 2 + 2rem))',
    paddingRight: '6rem',
    cursor: 'pointer',
    width: 'fit-content',
  },
  productCard: {
    width: '760px',
    height: '460px',
    flexShrink: 0,
    border: '1px solid',
    padding: '3rem',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  leftGridCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
    gap: '1.2rem',
  },
  rightGridCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  cardSubtitle: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600',
    fontFamily: 'var(--font-sans)',
  },
  cardTitle: {
    fontSize: '2.8rem',
    fontFamily: 'var(--font-serif)',
    lineHeight: '1.1',
    fontWeight: '300',
  },
  cardDesc: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.05rem',
    lineHeight: '1.65',
    fontWeight: '400',
  },
  priceRow: {
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  cardPrice: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.45rem',
    fontWeight: '700',
  },
  cardMrp: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.05rem',
    textDecoration: 'line-through',
  },
  cardSave: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.72rem',
    fontWeight: '600',
    padding: '0.2rem 0.5rem',
    border: '1px solid',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  imageContainer: {
    width: '100%',
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImg: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.12))',
  },
  cardFooter: {
    marginTop: '1rem',
  },
  footerLink: {
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
};

// Add interactive styles using CSS rule injection
const styleSheetShowcase = document.createElement('style');
styleSheetShowcase.innerText = `
  .card-row-slider > div {
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .card-row-slider > div:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 25px 50px rgba(43, 26, 18, 0.08) !important;
  }
  .card-row-slider > div:hover img {
    transform: scale(1.04) rotate(1deg);
  }
  .card-row-slider span.luxury-link::after {
    background-color: currentColor !important;
  }
  @media (max-width: 900px) {
    .card-row-slider > div {
      width: 580px !important;
      height: 400px !important;
      grid-template-columns: 1fr 1fr !important;
      padding: 2rem !important;
      gap: 1.5rem !important;
    }
    .card-row-slider h3 {
      font-size: 2rem !important;
    }
    .card-row-slider p {
      font-size: 0.95rem !important;
    }
  }
  @media (max-width: 600px) {
    .card-row-slider > div {
      width: 320px !important;
      height: auto !important;
      grid-template-columns: 1fr !important;
      padding: 1.5rem !important;
      gap: 2rem !important;
    }
    .card-row-slider img {
      height: 200px !important;
    }
  }
`;
document.head.appendChild(styleSheetShowcase);
