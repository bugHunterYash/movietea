import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Leaf, Star, Clock, Sun, Heart } from 'lucide-react';

export default function About() {
  React.useEffect(() => {
    document.title = "Our Story | MOVITEA";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Discover the story of MOVITEA. Handcrafted single-estate Darjeeling and Assam tea blends infused with Kannauj Rose, Madagascar Vanilla, and roasted Kerala Cacao.");
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerFadeUp = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div style={styles.page}>
      {/* Editorial Hero */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroGrid}>
          <div style={styles.leftTitleCol}>
            <span style={styles.eyebrow}>THE ATELIER MANIFESTO</span>
            <h1 style={styles.mainEditorialTitle}>Tea, Reimagined.</h1>
            <p style={styles.storyQuote}>
              &ldquo;We do not make tea to quench thirst. We craft it to create a space of quiet pause in a loud world.&rdquo;
            </p>
          </div>
          <div style={styles.cupContainer}>
            <div style={styles.steamOverlay}>
              <svg viewBox="0 0 100 100" style={styles.aboutSteam}>
                <motion.path
                  d="M50 80 Q 45 50 55 30 T 50 10"
                  fill="none"
                  stroke="rgba(197, 107, 31, 0.2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{
                    d: [
                      "M50 80 Q 45 50 55 30 T 50 10",
                      "M48 80 Q 53 45 47 25 T 52 10",
                      "M50 80 Q 45 50 55 30 T 50 10"
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </div>
            <img src="/images/combo_new.png" alt="MOVITEA Collection" style={styles.aboutHeroImg} />
          </div>
        </div>
      </section>

      {/* NEW Premium Brand Story Section */}
      <section style={styles.brandStorySection}>
        <div className="container">
          
          {/* Section 1: Why Choose */}
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeUp}
            style={styles.storyHeader}
          >
            <h2 style={styles.storyTitle}>Why Choose MOVITEA?</h2>
            <p style={styles.storySubtitle}>Crafted for people who believe every cup should be an experience.</p>
          </motion.div>

          <motion.div 
            className="feature-cards-grid" 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={staggerFadeUp}
          >
            {[
              { title: 'Dessert Inspired Flavours', desc: 'Indulge in signature flavours like Chocolate, Vanilla, Rose and Butterscotch that transform every cup into a delightful dessert-inspired experience.', icon: <Coffee size={20} strokeWidth={1.5} color="#D4AF37" /> },
              { title: 'No Added Sugar', desc: 'Rich flavour without added sugar, making every sip indulgent yet refreshingly balanced.', icon: <Leaf size={20} strokeWidth={1.5} color="#D4AF37" /> },
              { title: 'Premium Ingredients', desc: 'Only carefully selected premium tea leaves and quality ingredients are used to ensure exceptional aroma and taste.', icon: <Star size={20} strokeWidth={1.5} color="#D4AF37" /> },
              { title: 'Ready in 60 Seconds', desc: 'Just pour hot water, stir, and enjoy café-quality flavoured tea anywhere.', icon: <Clock size={20} strokeWidth={1.5} color="#D4AF37" /> },
              { title: 'Anytime Comfort', desc: 'Perfect for busy mornings, evening relaxation, office breaks or gifting someone special.', icon: <Sun size={20} strokeWidth={1.5} color="#D4AF37" /> },
              { title: 'Crafted for Tea Lovers', desc: 'Designed for people looking for something beyond ordinary tea—a modern tea experience with unforgettable flavour.', icon: <Heart size={20} strokeWidth={1.5} color="#D4AF37" /> }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeUp} style={styles.featureCard} className="feature-card-hover">
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={fadeUp}
          >
            <p style={styles.quoteText}>
              "MOVITEA isn't just another cup of tea.<br />It's a flavourful experience in every sip."
            </p>
          </motion.div>

          {/* Section 2: Mission & Vision */}
          <div className="mission-vision-container">
            <motion.div 
              initial={{ opacity: 0, x: -40 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }} 
              viewport={{ once: true, margin: "-50px" }} 
              className="mv-block"
            >
              <h3 style={styles.mvTitle}>Our Mission</h3>
              <p style={styles.mvText}>To build a modern tea brand that challenges convention through innovation, exceptional flavour, and customer-first experiences while making premium flavoured tea accessible to every household.</p>
            </motion.div>
            
            <div className="mv-divider"></div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }} 
              viewport={{ once: true, margin: "-50px" }} 
              className="mv-block"
            >
              <h3 style={styles.mvTitle}>Our Vision</h3>
              <p style={styles.mvText}>To lead the future of tea by creating a globally recognized Indian brand that brings innovation, quality, and unforgettable flavour to millions of cups every day.</p>
            </motion.div>
          </div>

          {/* Premium Trust Strip */}
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={fadeUp} 
            className="trust-strip"
          >
            <span>Premium Ingredients</span>
            <span style={styles.trustBullet}>•</span>
            <span>No Added Sugar</span>
            <span style={styles.trustBullet}>•</span>
            <span>Ready in 60 Seconds</span>
            <span style={styles.trustBullet}>•</span>
            <span>Made in India</span>
            <span style={styles.trustBullet}>•</span>
            <span>Loved by Tea Lovers</span>
          </motion.div>

          {/* Ending Banner */}
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={fadeUp} 
            style={styles.endingBanner}
          >
            <h2 style={styles.endingTitle}>Every Cup Tells A Story</h2>
            <p style={styles.endingSubtitle}>Discover a collection designed for every mood, every season, and every tea lover.</p>
            <button 
              style={styles.endingBtn} 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Explore Collection &rarr;
            </button>
          </motion.div>

        </div>
      </section>

      {/* Heritage & Indian Tea Sourcing */}
      <section style={styles.heritageSection}>
        <div className="container" style={styles.heritageGrid}>
          <div>
            <span style={styles.eyebrow}>TERROIR & HERITAGE</span>
            <h2 style={styles.sectionTitle}>Sourced from the foothills of Darjeeling and estates of Assam.</h2>
          </div>
          <div style={styles.storyContent}>
            <p style={styles.storyParagraph}>
              India’s tea heritage is one of the finest in the world, yet modern convenience has reduced it to dust-grade teabags and artificial syrups. At MOVITEA, we source our black tea leaves from select single-estate gardens in Darjeeling and Assam, where mist, altitude, and soil create an incomparable flavor base.
            </p>
            <p style={styles.storyParagraph}>
              We honor the traditional orthodox methods of tea processing, pairing full-bodied CTC and orthodox leaves with authentic botanical distillations. It is a bridge between age-old Indian tea culture and contemporary luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section style={styles.founderSection}>
        <div className="container" style={styles.founderGrid}>
          <div style={styles.founderImageCol}>
            <img src="/assets/review-1.jfif" alt="Vinit, Founder of MOVITEA" style={styles.founderImg} />
          </div>
          <div style={styles.founderTextCol}>
            <span style={styles.eyebrow}>A MESSAGE FROM THE FOUNDER</span>
            <h2 style={styles.founderTitle}>The Ritual of Pauz</h2>
            
            <p style={styles.storyParagraph}>
              Tea has always been more than just a beverage. It is a moment of comfort, a pause in a busy day, and a ritual that brings people together.
            </p>
            
            <p style={styles.storyParagraph}>
              When we created MOVITEA, we asked ourselves a simple question: Why should tea always taste the same?
            </p>
            
            <p style={styles.storyParagraph}>
              That question inspired us to reimagine the tea experience with exciting flavours like Butterscotch, Rose, Vanilla, and Chocolate while keeping preparation simple and convenient. Our goal was to create a tea that feels familiar yet surprisingly different—something that delights with every sip.
            </p>
            
            <p style={styles.storyParagraph}>
              At MOVITEA, we believe great taste should never come at the cost of quality. That’s why our products are crafted with carefully selected ingredients, zero added sugar, and a commitment to delivering a unique tea experience.
            </p>

            <p style={styles.storyParagraph}>
              Whether you’re starting your morning, taking a break during the day, or unwinding in the evening, we hope MOVITEA becomes a small but meaningful part of your daily routine.
            </p>

            <p style={styles.storyParagraph}>
              Thank you for being a part of our journey.
            </p>
            
            <div style={styles.signatureBlock}>
              <span style={styles.regards}>Warm regards,</span>
              <span style={styles.signatureName}>Vinit</span>
              <span style={styles.signatureTitle}>Founder, MOVITEA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Narrative & Ingredients */}
      <section style={styles.ingredientsSection}>
        <div className="container">
          <span style={styles.eyebrowCentred}>CURATED BOTANICALS</span>
          <h2 style={styles.sectionTitleCentred}>The Quality Narrative</h2>
          
          <div style={styles.ingredientsFlex}>
            <div style={styles.ingredientBlock}>
              <img src="/assets/rose.jpeg" alt="Rose Buds" style={styles.ingImg} />
              <div style={styles.ingText}>
                <h3>Kannauj Rose Petals</h3>
                <p style={styles.ingDesc}>
                  Hand-picked during the early spring bloom in Kannauj, famous for traditional Indian attar, providing a soft, aromatic floral perfume.
                </p>
              </div>
            </div>

            <div style={styles.ingredientBlock}>
              <img src="/assets/vanilla.jpeg" alt="Vanilla Pods" style={styles.ingImg} />
              <div style={styles.ingText}>
                <h3>Madagascar Bourbon Vanilla</h3>
                <p style={styles.ingDesc}>
                  Real cured vanilla pods providing a natural, round sweetness and silky texture without a single gram of added white sugar.
                </p>
              </div>
            </div>

            <div style={styles.ingredientBlock}>
              <img src="/assets/chocolate.jpeg" alt="Cocoa Husks" style={styles.ingImg} />
              <div style={styles.ingText}>
                <h3>Roasted Kerala Cacao</h3>
                <p style={styles.ingDesc}>
                  Single-origin cacao husks roasted gently to release rich chocolate aromatics that fuse perfectly with robust Assam black tea.
                </p>
              </div>
            </div>

            <div style={styles.ingredientBlock}>
              <img src="/assets/butterscotch.jpeg" alt="Butterscotch" style={styles.ingImg} />
              <div style={styles.ingText}>
                <h3>Toasted Butterscotch</h3>
                <p style={styles.ingDesc}>
                  Rich, buttery caramel notes fused beautifully with premium tea leaves, offering a luxurious, dessert-like warmth without artificial syrups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Process Visualization */}
      <section style={styles.processSection}>
        <div className="container">
          <span style={styles.eyebrowCentred}>VISUAL CHRONOLOGY</span>
          <h2 style={styles.sectionTitleCentred}>The Art of the Steep</h2>
          
          <div style={styles.processSteps}>
            <div style={styles.step}>
              <span style={styles.stepNumber}>01</span>
              <div>
                <h4 style={styles.stepTitle}>Estate Harvesting</h4>
                <p style={styles.stepDesc}>Leaves are plucked by hand at sunrise during prime flushing periods to capture maximum cellular oil concentration.</p>
              </div>
            </div>
            
            <div style={styles.step}>
              <span style={styles.stepNumber}>02</span>
              <div>
                <h4 style={styles.stepTitle}>Botanical Distillation</h4>
                <p style={styles.stepDesc}>Rose, vanilla, and spice elements undergo low-temperature steam extraction to preserve delicate aromatic molecules.</p>
              </div>
            </div>

            <div style={styles.step}>
              <span style={styles.stepNumber}>03</span>
              <div>
                <h4 style={styles.stepTitle}>Micro-Encapsulation</h4>
                <p style={styles.stepDesc}>The natural extracts are blended directly into the tea particles, enabling them to dissolve instantly in hot water without residues.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

const styles = {
  page: {
    paddingTop: 'var(--header-height)',
    backgroundColor: '#FAF7F2',
  },
  heroSection: {
    padding: '8rem 0 6rem',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    alignItems: 'center',
    gap: '5rem',
  },
  leftTitleCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  eyebrow: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.2em',
    color: 'var(--primary-color)',
    textTransform: 'uppercase',
  },
  eyebrowCentred: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.2em',
    color: 'var(--primary-color)',
    textTransform: 'uppercase',
    display: 'block',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  mainEditorialTitle: {
    fontSize: '6.5rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
    lineHeight: '0.95',
    fontWeight: '300',
    letterSpacing: '-0.03em',
  },
  storyQuote: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.6rem',
    lineHeight: '1.6',
    color: 'var(--text-light)',
    fontStyle: 'italic',
    fontWeight: '400',
    marginTop: '1.5rem',
    maxWidth: '520px',
  },
  cupContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  steamOverlay: {
    position: 'absolute',
    top: '-70px',
    width: '120px',
    height: '140px',
    zIndex: 2,
  },
  aboutSteam: {
    width: '100%',
    height: '100%',
  },
  aboutHeroImg: {
    width: '100%',
    maxWidth: '380px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 40px rgba(43,26,18,0.1))',
  },
  heritageSection: {
    padding: '8rem 0',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: '#F6F3EB',
  },
  heritageGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6rem',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: '3.6rem',
    lineHeight: '1.1',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
    fontWeight: '300',
  },
  sectionTitleCentred: {
    fontSize: '4.2rem',
    lineHeight: '1.1',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: '5rem',
  },
  storyContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  storyParagraph: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: 'var(--text-light)',
  },
  storyParagraphSpecial: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.35rem',
    lineHeight: '1.7',
    color: 'var(--dark-color)',
    fontStyle: 'italic',
  },
  founderSection: {
    padding: '8rem 0',
  },
  founderGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: '6rem',
    alignItems: 'center',
  },
  founderImageCol: {
    height: '520px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
  },
  founderImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  founderTextCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  founderTitle: {
    fontSize: '4.5rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
    lineHeight: '1',
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    marginTop: '1.5rem',
  },
  regards: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.05rem',
    fontStyle: 'italic',
    color: 'var(--text-light)',
  },
  signatureName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2rem',
    color: 'var(--dark-color)',
    fontWeight: '400',
    lineHeight: '1.2',
  },
  signatureTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--primary-color)',
  },
  ingredientsSection: {
    padding: '8rem 0',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid var(--border-color)',
  },
  ingredientsFlex: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
  },
  ingredientBlock: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '4rem',
    alignItems: 'center',
    paddingBottom: '4rem',
    borderBottom: '1px solid rgba(43,26,18,0.06)',
  },
  ingImg: {
    width: '100%',
    height: '240px',
    objectFit: 'contain',
    border: '1px solid var(--border-color)',
    backgroundColor: '#FFFFFF',
    padding: '1rem',
  },
  ingText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    h3: {
      fontSize: '2.2rem',
      fontFamily: 'var(--font-serif)',
    },
  },
  ingDesc: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.05rem',
    lineHeight: '1.75',
  },
  processSection: {
    padding: '8rem 0',
    backgroundColor: '#F6F3EB',
    borderTop: '1px solid var(--border-color)',
  },
  processSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  step: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '2.5rem',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--primary-color)',
    borderBottom: '1px solid var(--primary-color)',
    paddingBottom: '4px',
    lineHeight: '1',
  },
  stepTitle: {
    fontSize: '1.8rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
    marginBottom: '0.6rem',
  },
  stepDesc: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.05rem',
    lineHeight: '1.7',
    color: 'var(--text-light)',
  },
  brandStorySection: {
    backgroundColor: '#F8F4ED',
    padding: '8rem 0',
    color: '#2B1A12',
  },
  storyHeader: {
    textAlign: 'center',
    marginBottom: '5rem',
  },
  storyTitle: {
    fontSize: '3.5rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    marginBottom: '1rem',
  },
  storySubtitle: {
    fontSize: '1.2rem',
    fontFamily: 'var(--font-story)',
    color: 'rgba(43, 26, 18, 0.7)',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(43, 26, 18, 0.05)',
    borderRadius: '16px',
    padding: '2.5rem',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  },
  featureIcon: {
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '400',
    marginBottom: '0.8rem',
  },
  featureDesc: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'rgba(43, 26, 18, 0.65)',
  },
  quoteText: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '2rem',
    textAlign: 'center',
    lineHeight: '1.4',
    margin: '6rem auto',
    maxWidth: '800px',
    color: '#D4AF37',
  },
  mvTitle: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    marginBottom: '1.5rem',
  },
  mvText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: 'rgba(43, 26, 18, 0.75)',
  },
  trustBullet: {
    color: '#D4AF37',
    margin: '0 1rem',
  },
  endingBanner: {
    textAlign: 'center',
    marginTop: '6rem',
    padding: '4rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '24px',
  },
  endingTitle: {
    fontSize: '3rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    marginBottom: '1rem',
  },
  endingSubtitle: {
    fontSize: '1.1rem',
    color: 'rgba(43, 26, 18, 0.6)',
    marginBottom: '2rem',
  },
  endingBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '1.25rem 3rem',
    backgroundColor: '#2B1A12',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  }
};

// Add responsive style tags
const styleSheetAboutRefined = document.createElement('style');
styleSheetAboutRefined.innerText = `
  @media (max-width: 950px) {
    div[style*="heroGrid"], div[style*="heritageGrid"], div[style*="founderGrid"] {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      gap: 3.5rem !important;
    }
    div[style*="leftTitleCol"], div[style*="founderTextCol"] {
      align-items: center !important;
    }
    div[style*="ingredientBlock"] {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
      text-align: center !important;
    }
    div[style*="ingredientBlock"] img {
      max-width: 320px;
      margin: 0 auto;
    }
    h1[style*="mainEditorialTitle"] {
      font-size: 4.2rem !important;
    }
    h2[style*="sectionTitleCentred"] {
      font-size: 3rem !important;
    }
  }

  /* Brand Story Styles */
  .feature-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  .feature-card-hover:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 20px 40px rgba(43, 26, 18, 0.08) !important;
  }
  .mission-vision-container {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 4rem;
    margin-bottom: 6rem;
  }
  .mv-block {
    flex: 1;
  }
  .mv-divider {
    width: 1px;
    background-color: rgba(43, 26, 18, 0.1);
  }
  .trust-strip {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(43, 26, 18, 0.7);
    padding: 3rem 0;
    border-top: 1px solid rgba(43, 26, 18, 0.1);
    border-bottom: 1px solid rgba(43, 26, 18, 0.1);
  }

  /* Responsive Brand Story */
  @media (max-width: 1024px) {
    .feature-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 768px) {
    .feature-cards-grid {
      grid-template-columns: 1fr;
    }
    .mission-vision-container {
      flex-direction: column;
      gap: 3rem;
      text-align: center;
    }
    .mv-divider {
      width: 100%;
      height: 1px;
      margin: 1rem 0;
    }
    .trust-strip {
      flex-direction: column;
      gap: 1.5rem;
    }
    .trust-strip span {
      display: block;
    }
    .trust-strip span:nth-child(even) {
      display: none; /* Hide the bullets on mobile stack */
    }
  }
`;
document.head.appendChild(styleSheetAboutRefined);
