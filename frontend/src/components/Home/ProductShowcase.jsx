import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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
    accentColor: '#E297A7',
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
    accentColor: '#D0853E',
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
    accentColor: '#CBB296',
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
    accentColor: '#FAF7F2',
    desc: 'Indulge in sweet toasted sugar notes, rich buttery warmth, and a smooth caramel glaze that transforms every sip into pure luxury.',
  },
];

export default function ProductShowcase({ onSelectProduct }) {
  const containerRef = useRef(null);
  const slidesRef = useRef([]);

  useGSAP(() => {
    const slides = slidesRef.current;
    if (!slides || slides.length === 0) return;

    // Set initial states for elements
    const dots = containerRef.current.querySelectorAll('.indicator-dot');
    slides.forEach((slide, index) => {
      const img = slide.querySelector('.slide-img-wrapper');
      const textCol = slide.querySelector('.slide-text-col');
      const subtitle = slide.querySelector('.slide-subtitle');
      const title = slide.querySelector('.slide-title');
      const desc = slide.querySelector('.slide-desc');
      const price = slide.querySelector('.slide-price-row');
      const cta = slide.querySelector('.slide-cta-wrapper');

      if (index === 0) {
        // First slide starts visible
        gsap.set(slide, { opacity: 1, pointerEvents: 'auto', zIndex: 10 });
        gsap.set(img, { opacity: 1, scale: 1, rotate: 0, y: 0 });
        gsap.set([subtitle, title, desc, price, cta], { opacity: 1, y: 0 });
        if (dots[index]) gsap.set(dots[index], { opacity: 1, scale: 1.4 });
      } else {
        // Other slides start hidden
        gsap.set(slide, { opacity: 0, pointerEvents: 'none', zIndex: 1 });
        gsap.set(img, { opacity: 0, scale: 0.85, rotate: -8, y: 50 });
        gsap.set([subtitle, title, desc, price, cta], { opacity: 0, y: 30 });
        if (dots[index]) gsap.set(dots[index], { opacity: 0.3, scale: 1 });
      }
    });

    // Create the master timeline linked to ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%', // 400vh to 500vh scroll depth
        pin: true,
        scrub: 1.2,
        snap: {
          snapTo: [0, 0.333, 0.666, 1.0],
          delay: 0.1,
          duration: { min: 0.2, max: 0.5 },
          ease: 'power2.inOut',
        },
      },
    });

    // We build transitions between successive slides
    // Total duration of timeline is 3 (Rose at 0, Cacao at 1, Vanilla at 2, Butterscotch at 3)
    const duration = 1;

    for (let i = 0; i < slides.length - 1; i++) {
      const currentSlide = slides[i];
      const nextSlide = slides[i + 1];
      const nextBgColor = SHOWCASE_PRODUCTS[i + 1].bgColor;
      const nextTextColor = SHOWCASE_PRODUCTS[i + 1].textColor;

      const currImg = currentSlide.querySelector('.slide-img-wrapper');
      const currTextItems = currentSlide.querySelectorAll('.slide-subtitle, .slide-title, .slide-desc, .slide-price-row, .slide-cta-wrapper');

      const nextImg = nextSlide.querySelector('.slide-img-wrapper');
      const nextSubtitle = nextSlide.querySelector('.slide-subtitle');
      const nextTitle = nextSlide.querySelector('.slide-title');
      const nextDesc = nextSlide.querySelector('.slide-desc');
      const nextPrice = nextSlide.querySelector('.slide-price-row');
      const nextCta = nextSlide.querySelector('.slide-cta-wrapper');

      const startTime = i * duration;
      const transitionTime = startTime + 0.5;

      // 1. Transition CURRENT slide out
      tl.to(currImg, {
        opacity: 0,
        scale: 1.15,
        rotate: 8,
        y: -40,
        ease: 'power2.inOut',
        duration: 0.5,
      }, transitionTime)
      .to(currTextItems, {
        opacity: 0,
        y: -30,
        stagger: 0.05,
        ease: 'power2.inOut',
        duration: 0.4,
      }, transitionTime)
      .set(currentSlide, { pointerEvents: 'none', zIndex: 1 }, transitionTime + 0.5)

      // Animate active dot indicators
      if (dots[i]) {
        tl.to(dots[i], { opacity: 0.3, scale: 1, duration: 0.4, ease: 'power2.inOut' }, transitionTime);
      }
      if (dots[i + 1]) {
        tl.to(dots[i + 1], { opacity: 1, scale: 1.4, duration: 0.4, ease: 'power2.inOut' }, transitionTime);
      }

      // 2. Morph the parent background color
      tl.to(containerRef.current, {
        backgroundColor: nextBgColor,
        color: nextTextColor,
        duration: 0.5,
        ease: 'power2.inOut',
      }, transitionTime)

      // 3. Transition NEXT slide in
      .set(nextSlide, { pointerEvents: 'auto', zIndex: 10 }, transitionTime + 0.2)
      .to(nextSlide, {
        opacity: 1,
        duration: 0.2,
      }, transitionTime + 0.2)
      .to(nextImg, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: 0,
        ease: 'power2.out',
        duration: 0.55,
      }, transitionTime + 0.3)
      .to([nextSubtitle, nextTitle, nextDesc, nextPrice, nextCta], {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        ease: 'power2.out',
        duration: 0.5,
      }, transitionTime + 0.3);
    }
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      style={{
        ...styles.showcaseWrapper,
        backgroundColor: SHOWCASE_PRODUCTS[0].bgColor,
        color: SHOWCASE_PRODUCTS[0].textColor,
      }}
    >
      {/* Intro Header */}
      <div style={styles.introHeader}>
        <span style={styles.headerSubtitle}>THE COLLECTION</span>
        <h2 style={styles.headerTitle}>The Atelier Series</h2>
      </div>

      {/* Slide Container (Viewport Bound) */}
      <div style={styles.viewportContainer}>
        {SHOWCASE_PRODUCTS.map((prod, index) => (
          <div
            key={prod.id}
            ref={(el) => (slidesRef.current[index] = el)}
            style={styles.slide}
            className={`slide-item slide-${prod.id}`}
          >
            {/* Split Grid */}
            <div style={styles.slideGrid}>
              {/* Left Column: Details */}
              <div className="slide-text-col" style={styles.leftCol}>
                <span className="slide-subtitle" style={styles.cardSubtitle}>
                  {prod.subtitle}
                </span>

                <h3 className="slide-title" style={styles.cardTitle}>
                  {prod.name}
                </h3>

                <p className="slide-desc" style={styles.cardDesc}>
                  {prod.desc}
                </p>

                <div className="slide-price-row" style={styles.priceRow}>
                  <span style={styles.cardPrice}>₹{prod.price}</span>
                  <span
                    style={{
                      ...styles.cardMrp,
                      opacity: 0.6,
                    }}
                  >
                    ₹{prod.mrp}
                  </span>
                  <span
                    className="discount-tag"
                    style={{
                      ...styles.cardSave,
                      borderColor: 'currentColor',
                    }}
                  >
                    Save {prod.savePercent}%
                  </span>
                </div>

                <div className="slide-cta-wrapper" style={styles.cardFooter}>
                  <button
                    onClick={() => onSelectProduct(prod.id)}
                    className="atelier-btn"
                    style={{
                      ...styles.ctaButton,
                      borderColor: 'currentColor',
                      color: 'inherit',
                    }}
                  >
                    Explore Details &rarr;
                  </button>
                </div>
              </div>

              {/* Right Column: Image */}
              <div style={styles.rightCol}>
                <div className="slide-img-wrapper" style={styles.imageWrapper}>
                  <img
                    src={prod.img}
                    alt={prod.name}
                    style={styles.cardImg}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom status indicator / custom dots */}
      <div style={styles.slideIndicator}>
        {SHOWCASE_PRODUCTS.map((prod, index) => (
          <div
            key={`dot-${prod.id}`}
            style={{
              ...styles.indicatorDot,
              backgroundColor: 'currentColor',
            }}
            className="indicator-dot"
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  showcaseWrapper: {
    height: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '3rem 0',
    transition: 'background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  introHeader: {
    paddingLeft: 'max(2rem, calc((100vw - var(--container-max-width)) / 2 + 2rem))',
    zIndex: 20,
    pointerEvents: 'none',
  },
  headerSubtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.2em',
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: '2.8rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    marginTop: '0.3rem',
  },
  viewportContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
  slide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '4rem',
    width: '100%',
    maxWidth: 'var(--container-max-width)',
    margin: '0 auto',
    padding: '0 2rem',
    height: '100%',
    alignItems: 'center',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
    maxWidth: '560px',
  },
  rightCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  cardSubtitle: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '3.8rem',
    fontFamily: 'var(--font-serif)',
    lineHeight: '1.1',
    fontWeight: '300',
  },
  cardDesc: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.15rem',
    lineHeight: '1.7',
    fontWeight: '400',
    opacity: 0.9,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  cardPrice: {
    fontSize: '1.8rem',
    fontWeight: '700',
  },
  cardMrp: {
    fontSize: '1.2rem',
    textDecoration: 'line-through',
  },
  cardSave: {
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.6rem',
    border: '1px solid',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  imageWrapper: {
    width: '100%',
    maxWidth: '440px',
    height: '440px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImg: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.15))',
  },
  cardFooter: {
    marginTop: '1rem',
  },
  ctaButton: {
    background: 'transparent',
    border: '1px solid',
    padding: '0.8rem 2rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
  },
  slideIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    zIndex: 20,
    pointerEvents: 'none',
  },
  indicatorDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    opacity: 0.3,
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  },
};

// Add interactive styles using CSS rule injection
const styleSheetShowcase = document.createElement('style');
styleSheetShowcase.innerText = `
  .atelier-btn:hover {
    background-color: currentColor !important;
    transform: translateY(-2px);
  }
  
  /* Apply styles on active text color when button hover happens */
  .slide-rose .atelier-btn:hover {
    color: #F4D3DC !important;
  }
  .slide-chocolate .atelier-btn:hover {
    color: #2B1A12 !important;
  }
  .slide-vanilla .atelier-btn:hover {
    color: #FAF7F2 !important;
  }
  .slide-butterscotch .atelier-btn:hover {
    color: #D0853E !important;
  }
  
  @media (max-width: 900px) {
    .slide-item h3 {
      font-size: 2.8rem !important;
    }
    .slide-item p {
      font-size: 1rem !important;
    }
    .slide-img-wrapper {
      max-width: 320px !important;
      height: 320px !important;
    }
  }
  @media (max-width: 768px) {
    .slide-item > div {
      grid-template-columns: 1fr !important;
      grid-template-rows: auto auto !important;
      gap: 2rem !important;
      padding-top: 6rem !important;
    }
    .slide-text-col {
      align-items: center !important;
      text-align: center !important;
      max-width: 100% !important;
    }
    .slide-img-wrapper {
      height: 240px !important;
    }
  }
`;
document.head.appendChild(styleSheetShowcase);
