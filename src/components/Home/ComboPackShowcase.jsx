import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function ComboPackShowcase({ onShopClick }) {
  const containerRef = useRef(null);
  const compositionRef = useRef(null);
  const pricingPanelRef = useRef(null);
  const introHeadlineRef = useRef(null);
  const introSubtextRef = useRef(null);

  useGSAP(() => {
    // Select elements within container
    const introHeadline = introHeadlineRef.current;
    const introSubtext = introSubtextRef.current;
    const composition = compositionRef.current;
    const pricingPanel = pricingPanelRef.current;
    const box = composition.querySelector('.combo-box-hero');
    const rose = composition.querySelector('.card-rose');
    const chocolate = composition.querySelector('.card-chocolate');
    const vanilla = composition.querySelector('.card-vanilla');
    const butterscotch = composition.querySelector('.card-butterscotch');

    const highlightRose = composition.querySelector('.highlight-rose');
    const highlightChocolate = composition.querySelector('.highlight-chocolate');
    const highlightVanilla = composition.querySelector('.highlight-vanilla');
    const highlightButterscotch = composition.querySelector('.highlight-butterscotch');

    // 1. Initial positions
    // Intro texts start visible
    gsap.set([introHeadline, introSubtext], { opacity: 1, y: 0 });

    // Combo box centered
    gsap.set(box, { scale: 1, zIndex: 20 });

    // Sachet cards hidden behind the box
    gsap.set([rose, chocolate, vanilla, butterscotch], {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 0,
      scale: 0.8,
      zIndex: 10,
    });

    // Highlights hidden
    gsap.set([highlightRose, highlightChocolate, highlightVanilla, highlightButterscotch], {
      opacity: 0,
      y: 15,
    });

    // Pricing panel hidden at bottom
    gsap.set(pricingPanel, {
      opacity: 0,
      y: 80,
      pointerEvents: 'none',
    });

    // 2. Build single Master Timeline linked to ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=240%', // Compressed scroll duration to prevent empty scroll areas
        pin: true,
        scrub: 1.0,
        onRefresh: (self) => {
          console.log("[DEBUG] ComboPack ScrollTrigger Refresh - Start:", self.start, "End:", self.end, "PinSpacing:", self.pinSpacing);
        }
      },
    });

    // Timeline Sequence (Total duration: 7.4s)

    // --- SECTION 1: Intro Fades Out ---
    tl.to([introHeadline, introSubtext], {
      opacity: 0,
      y: -30,
      stagger: 0.08,
      duration: 1.0,
      ease: 'power2.inOut',
    }, 0)
      .to(box, {
        scale: 1.03,
        duration: 1.0,
        ease: 'power2.inOut',
      }, 0);

    // --- SECTION 2: Flavors Discoverability (Slide Out and Return) ---

    // Rose slides left-up and returns
    tl.to(rose, {
      x: -320,
      y: -120,
      rotate: -12,
      opacity: 1,
      scale: 1.05,
      duration: 0.8,
      ease: 'power2.out',
    }, 1.0)
    .to(rose, {
      x: -320,
      y: -120,
      duration: 0.2, // brief hold
    }, 1.8)
    .to(rose, {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'power2.in',
    }, 2.0);

    // Chocolate slides right-down and returns
    tl.to(chocolate, {
      x: 320,
      y: 150,
      rotate: 12,
      opacity: 1,
      scale: 1.05,
      duration: 0.8,
      ease: 'power2.out',
    }, 2.6)
    .to(chocolate, {
      x: 320,
      y: 150,
      duration: 0.2, // brief hold
    }, 3.4)
    .to(chocolate, {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'power2.in',
    }, 3.6);

    // Vanilla slides right-up and returns
    tl.to(vanilla, {
      x: 320,
      y: -120,
      rotate: -5,
      opacity: 1,
      scale: 1.05,
      duration: 0.8,
      ease: 'power2.out',
    }, 4.2)
    .to(vanilla, {
      x: 320,
      y: -120,
      duration: 0.2, // brief hold
    }, 5.0)
    .to(vanilla, {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'power2.in',
    }, 5.2);

    // Butterscotch slides left-down and returns
    tl.to(butterscotch, {
      x: -320,
      y: 150,
      rotate: 5,
      opacity: 1,
      scale: 1.05,
      duration: 0.8,
      ease: 'power2.out',
    }, 5.8)
    .to(butterscotch, {
      x: -320,
      y: 150,
      duration: 0.2, // brief hold
    }, 6.6)
    .to(butterscotch, {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'power2.in',
    }, 6.8);

    // --- SECTION 3: Final Composition Reveal (All 4 surround the box) ---
    tl.to(rose, {
      x: -300,
      y: -100,
      rotate: -8,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.2)',
    }, 7.4)
    .to(chocolate, {
      x: 300,
      y: 150,
      rotate: 8,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.2)',
    }, 7.4)
    .to(vanilla, {
      x: 300,
      y: -100,
      rotate: -3,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.2)',
    }, 7.4)
    .to(butterscotch, {
      x: -300,
      y: 150,
      rotate: 3,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.2)',
    }, 7.4)

      // Reveal text benefits surrounding cards
      .to([highlightRose, highlightChocolate, highlightVanilla, highlightButterscotch], {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
      }, 7.8);

    // --- SECTION 4: Reveal pricing (Shrink composition and slide up panel) ---
    tl.to(composition, {
      scale: 0.72,
      y: -100,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 8.6)
      .to([rose, chocolate, vanilla, butterscotch, highlightRose, highlightChocolate, highlightVanilla, highlightButterscotch], {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 8.6)
      .to(pricingPanel, {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'power2.out',
      }, 8.8);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={styles.outerContainer}>
      <div style={styles.stickyContainer}>

        {/* SECTION 1: Intro Headline */}
        <div ref={introHeadlineRef} style={styles.introHeadline}>
          <span style={styles.subtitle}>THE ATELIER EXPERIENCE</span>
          <h2 style={styles.title} className="combo-title">Experience<br />Every Mood</h2>
        </div>

        {/* SECTION 1: Intro Subtext */}
        <div ref={introSubtextRef} className="intro-subtext" style={styles.introSubtext}>
          <span style={styles.flavorList} className="combo-flavor-list">Rose &bull; Chocolate &bull; Vanilla &bull; Butterscotch</span>
          <p style={styles.premiumSubtext}>One Premium Tea Experience</p>
        </div>

        {/* Interactive Composition Area */}
        <div ref={compositionRef} style={styles.compositionArea} className="combo-composition">
          {/* Supporting flavor card components */}
          {/* Rose - Left */}
          <div className="sachet-card card-rose combo-sachet" style={{ ...styles.sachet, ...styles.roseSachet }}>
            <img src="/assets/rose.jpeg" alt="Rose Blend" style={styles.sachetImg} />
            <span style={styles.sachetName} className="combo-sachet-name">Rose Atelier</span>
          </div>

          {/* Chocolate - Right */}
          <div className="sachet-card card-chocolate combo-sachet" style={{ ...styles.sachet, ...styles.chocolateSachet }}>
            <img src="/assets/chocolate.jpeg" alt="Cacao Blend" style={styles.sachetImg} />
            <span style={styles.sachetName} className="combo-sachet-name">Cacao Reserve</span>
          </div>

          {/* Vanilla - Top */}
          <div className="sachet-card card-vanilla combo-sachet" style={{ ...styles.sachet, ...styles.vanillaSachet }}>
            <img src="/assets/vanilla.jpeg" alt="Vanilla Blend" style={styles.sachetImg} />
            <span style={styles.sachetName} className="combo-sachet-name">Vanilla Orchid</span>
          </div>

          {/* Butterscotch - Bottom */}
          <div className="sachet-card card-butterscotch combo-sachet" style={{ ...styles.sachet, ...styles.butterscotchSachet }}>
            <img src="/assets/butterscotch.jpeg" alt="Butterscotch Blend" style={styles.sachetImg} />
            <span style={styles.sachetName} className="combo-sachet-name">Butterscotch</span>
          </div>

          {/* Center Box Hero */}
          <div className="combo-box-hero" style={styles.boxHero}>
            <img
              src="/images/combo_new.png"
              alt="MOVITEA Assorted Box"
              style={styles.boxImg}
            />
          </div>

          {/* SECTION 3: Highlight Benefits */}
          <div className="highlight-text highlight-rose" style={styles.highlightRoseText}>
            <h4>Premium Ingredients</h4>
            <p>Handpicked floral rose buds</p>
          </div>

          <div className="highlight-text highlight-chocolate" style={styles.highlightChocolateText}>
            <h4>Zero Added Sugar</h4>
            <p>100% natural cacao infusion</p>
          </div>

          <div className="highlight-text highlight-vanilla" style={styles.highlightVanillaText}>
            <h4>4 Signature Flavours</h4>
            <p>A mood for every occasion</p>
          </div>

          <div className="highlight-text highlight-butterscotch" style={styles.highlightButterscotchText}>
            <h4>Just Add Hot Water</h4>
            <p>Simple luxury in minutes</p>
          </div>

        </div>

        {/* SECTION 4: Pricing Panel */}
        <div ref={pricingPanelRef} style={styles.pricingPanel}>
          <div style={styles.pricingCard} className="combo-pricing-card">
            <div style={styles.pricingHeader}>
              <span style={styles.tag}>LIMITED EDITION</span>
              <h3 style={styles.pricingTitle} className="combo-pricing-title">Assorted Atelier Combo Box</h3>
            </div>

            <div style={styles.priceContainer}>
              <div style={styles.mainPriceCol}>
                <span style={styles.priceLabel}>First Order Price</span>
                <span style={styles.specialPrice} className="combo-special-price">₹219</span>
              </div>
              <div style={styles.strikePriceCol}>
                <span style={styles.originalLabel}>Standard Price</span>
                <span style={styles.strikePrice}>₹349 <span style={styles.mrpStruck}>₹429</span></span>
              </div>
            </div>

            <div style={styles.deliveryBadge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Free Delivery Above ₹499</span>
            </div>

            <button onClick={onShopClick} className="purchase-btn" style={styles.purchaseBtn}>
              Purchase Combo Box &mdash; ₹219
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    height: '100vh', // Uses standard viewport bound; spacing is handled via GSAP pinSpacing
    backgroundColor: '#FAF7F2',
    position: 'relative',
    borderTop: '1px dashed rgba(197, 107, 31, 0.15)', // Visual debugger outline to verify section boundaries
    borderBottom: '1px dashed rgba(197, 107, 31, 0.15)',
  },
  stickyContainer: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  introHeadline: {
    position: 'absolute',
    top: '7vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    zIndex: 30,
    pointerEvents: 'none',
  },
  subtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.25em',
    color: 'var(--primary-color)',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '4.2rem',
    fontFamily: 'var(--font-serif)',
    lineHeight: '1.05',
    fontWeight: '300',
    color: '#2B1A12',
  },
  introSubtext: {
    position: 'absolute',
    bottom: '7vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    zIndex: 30,
    pointerEvents: 'none',
    fontFamily: 'var(--font-sans)',
  },
  flavorList: {
    fontSize: '1.05rem',
    fontWeight: '400',
    letterSpacing: '0.08em',
    color: '#5c4b37',
  },
  premiumSubtext: {
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--primary-color)',
    marginTop: '0.3rem',
  },
  compositionArea: {
    position: 'relative',
    width: '560px',
    height: '560px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  boxHero: {
    width: '280px',
    height: '280px',
    zIndex: 25,
    position: 'relative',
    filter: 'drop-shadow(0 25px 50px rgba(43, 26, 18, 0.18))',
  },
  boxImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '16px',
  },
  sachet: {
    position: 'absolute',
    width: '120px',
    height: '155px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    padding: '1rem',
  },
  sachetImg: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
  },
  sachetName: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: '0.4rem',
  },
  roseSachet: {
    backgroundColor: '#F4D3DC',
    color: '#2B1A12',
  },
  chocolateSachet: {
    backgroundColor: '#4A2B1D', // Lighter brown for contrast
    color: '#FFFFFF',
    border: '1px solid #D0853E',
  },
  vanillaSachet: {
    backgroundColor: '#FAF7F2',
    color: '#2B1A12',
  },
  butterscotchSachet: {
    backgroundColor: '#D0853E',
    color: '#FAF7F2',
  },
  // Highlights surrounding the composition
  highlightRoseText: {
    position: 'absolute',
    left: '-240px',
    textAlign: 'right',
    maxWidth: '200px',
    zIndex: 35,
  },
  highlightChocolateText: {
    position: 'absolute',
    right: '-240px',
    textAlign: 'left',
    maxWidth: '200px',
    zIndex: 35,
  },
  highlightVanillaText: {
    position: 'absolute',
    top: '-80px',
    textAlign: 'center',
    width: '280px',
    zIndex: 35,
  },
  highlightButterscotchText: {
    position: 'absolute',
    bottom: '-80px',
    textAlign: 'center',
    width: '280px',
    zIndex: 35,
  },
  pricingPanel: {
    position: 'absolute',
    bottom: '5vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 40,
  },
  pricingCard: {
    width: '540px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(43, 26, 18, 0.08)',
    borderRadius: '24px',
    padding: '2.2rem',
    boxShadow: '0 30px 60px rgba(43, 26, 18, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  pricingHeader: {
    textAlign: 'center',
  },
  pricingTitle: {
    fontSize: '1.6rem',
    fontFamily: 'var(--font-serif)',
    marginTop: '0.4rem',
    fontWeight: '300',
  },
  tag: {
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-sans)',
  },
  priceContainer: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    borderTop: '1px solid rgba(43, 26, 18, 0.08)',
    borderBottom: '1px solid rgba(43, 26, 18, 0.08)',
    padding: '1.2rem 0',
  },
  mainPriceCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: '#D0853E',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-sans)',
  },
  specialPrice: {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#2B1A12',
    fontFamily: 'var(--font-sans)',
  },
  strikePriceCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  originalLabel: {
    fontSize: '0.75rem',
    color: '#8A7A6B',
    fontFamily: 'var(--font-sans)',
  },
  strikePrice: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#8A7A6B',
    fontFamily: 'var(--font-sans)',
  },
  mrpStruck: {
    textDecoration: 'line-through',
    fontSize: '0.95rem',
    opacity: 0.6,
  },
  deliveryBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#5c4b37',
    fontWeight: '500',
    fontFamily: 'var(--font-sans)',
  },
  purchaseBtn: {
    backgroundColor: '#2B1A12',
    color: '#FAF7F2',
    border: 'none',
    borderRadius: '12px',
    padding: '1.1rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    fontFamily: 'var(--font-sans)',
  },
};

// CSS Rules for animations & layouts
const styleSheetCombo = document.createElement('style');
styleSheetCombo.innerText = `
  .highlight-text h4 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #2B1A12;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.2rem;
  }
  .highlight-text p {
    font-size: 0.85rem;
    color: #5c4b37;
    margin: 0;
  }
  .purchase-btn:hover {
    background-color: #D0853E !important;
    transform: translateY(-2px);
  }
  .combo-title {
    font-size: 4.2rem;
  }
  .combo-composition {
    width: 560px;
    height: 560px;
  }
  .combo-box-hero {
    width: 280px;
    height: 280px;
  }
  .combo-sachet {
    width: 120px;
    height: 155px;
  }
  
  @media (max-width: 1024px) {
    .combo-title {
      font-size: 3rem !important;
    }
    .combo-composition {
      width: 400px !important;
      height: 400px !important;
    }
    .combo-box-hero {
      width: 200px !important;
      height: 200px !important;
    }
    .combo-sachet {
      width: 100px !important;
      height: 130px !important;
    }
    .highlight-rose {
      left: -160px !important;
    }
    .highlight-chocolate {
      right: -160px !important;
    }
  }
  @media (max-width: 768px) {
    .combo-title {
      font-size: 2.2rem !important;
    }
    .combo-composition {
      width: 300px !important;
      height: 300px !important;
    }
    .combo-box-hero {
      width: 160px !important;
      height: 160px !important;
    }
    .combo-sachet {
      width: 80px !important;
      height: 105px !important;
      padding: 0.4rem !important;
    }
    .combo-sachet img {
      width: 45px !important;
      height: 45px !important;
    }
    .combo-sachet-name {
      font-size: 0.6rem !important;
    }
    .highlight-text {
      display: none !important;
    }
    .combo-pricing-card {
      width: 90% !important;
      max-width: 400px !important;
      padding: 1.5rem !important;
    }
    .combo-pricing-title {
      font-size: 1.3rem !important;
    }
    .combo-special-price {
      font-size: 2rem !important;
    }
    .combo-flavor-list {
      font-size: 0.9rem !important;
    }
  }
  @media (max-width: 480px) {
    .combo-title {
      font-size: 1.8rem !important;
    }
    .combo-composition {
      width: 240px !important;
      height: 240px !important;
    }
    .combo-box-hero {
      width: 130px !important;
      height: 130px !important;
    }
    .combo-sachet {
      width: 65px !important;
      height: 85px !important;
    }
    .combo-sachet img {
      width: 35px !important;
      height: 35px !important;
    }
  }
`;
document.head.appendChild(styleSheetCombo);
