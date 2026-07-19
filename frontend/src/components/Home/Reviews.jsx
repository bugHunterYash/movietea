import React from 'react';

const REVIEWS = [
  {
    name: 'Yaksh Sangani',
    quote: 'Insane flavour I mean tea. This tea is amazing.',
    rating: 5,
    img: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Yaksh',
  },
  {
    name: 'Mehak Agarwal',
    quote: 'Rose Flavour is my go-to. 10/10 recommend for all tea lovers.',
    rating: 5,
    img: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mehak',
  },
  {
    name: 'Aryan Singh',
    quote: 'Found Movitea while looking for zero sugar options. Never looked back.',
    rating: 5,
    img: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aryan',
  },
  {
    name: 'Riya Saraf',
    quote: 'Binge-watching K-Dramas just got better - thanks to Vanilla Orchid!',
    rating: 5,
    img: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Riya',
  },
];

export default function Reviews() {
  // Double the reviews to create a seamless infinite loop
  const duplicatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section style={styles.reviewsSection}>
      <div className="container" style={styles.header}>
        <h2 style={styles.headline}>
          <span style={styles.headlineYellow}>MOVITEA!</span><br />
          <span style={styles.headlineWhite}>TRIED. TASTED. LOVED.</span>
        </h2>
      </div>

      <div style={styles.marqueeContainer}>
        <div style={styles.marqueeTrack} className="marquee-track">
          {duplicatedReviews.map((rev, index) => (
            <div key={index} style={styles.reviewCard}>

              {/* Top: Stars */}
              <div style={styles.rating}>
                {'★'.repeat(rev.rating)}
              </div>

              {/* Middle: Quote */}
              <p style={styles.quote}>"{rev.quote}"</p>

              {/* Bottom: Avatar and Name */}
              <div style={styles.cardBottom}>
                <div style={styles.avatarWrapper}>
                  <img src={rev.img} alt={rev.name} style={styles.avatarImg} />
                </div>
                <h4 style={styles.reviewerName}>{rev.name}</h4>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  reviewsSection: {
    backgroundColor: '#1A1A1A', // Dark theme matching the reference
    padding: '8rem 0',
    overflow: 'hidden',
  },
  header: {
    textAlign: 'center',
    marginBottom: '5rem',
  },
  headline: {
    fontFamily: "'Anton', var(--font-heading)",
    fontSize: '5rem',
    fontWeight: '900',
    lineHeight: '1.1',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  headlineYellow: {
    color: '#FFDF40',
    WebkitTextStroke: '2px #000',
    textShadow: '4px 4px 0px #000',
  },
  headlineWhite: {
    color: '#FFFFFF',
    WebkitTextStroke: '2px #000',
    textShadow: '4px 4px 0px #000',
  },
  marqueeContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    // Removed the gradient mask so it doesn't fade into dark background awkwardly
  },
  marqueeTrack: {
    display: 'flex',
    gap: '2.5rem',
    width: 'max-content',
    animation: 'marquee 25s linear infinite',
    padding: '1rem', // Give space for shadow
  },
  reviewCard: {
    width: '380px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  rating: {
    color: '#F97316', // Orange stars
    fontSize: '1.2rem',
    letterSpacing: '3px',
  },
  quote: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: '#1A120E',
    fontWeight: '500',
    fontFamily: 'var(--font-body)',
    flexGrow: 1,
  },
  cardBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  avatarWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#E5E7EB', // Fallback
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  reviewerName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1A120E',
    fontFamily: 'var(--font-body)',
  },
};

// Add keyframes stylesheet
if (typeof document !== 'undefined') {
  const styleSheetMarquee = document.createElement('style');
  styleSheetMarquee.innerText = `
    @keyframes marquee {
      0% {
        transform: translate3d(0, 0, 0);
      }
      100% {
        transform: translate3d(-50%, 0, 0);
      }
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }
    @media (max-width: 1024px) {
      h2[style*="font-size: 5rem"] {
        font-size: 3.5rem !important;
      }
    }
    @media (max-width: 600px) {
      h2[style*="font-size: 5rem"], h2[style*="font-size: 3.5rem"] {
        font-size: 2.5rem !important;
      }
      .marquee-track > div {
        width: 320px !important;
        padding: 2rem !important;
      }
    }
  `;
  document.head.appendChild(styleSheetMarquee);
}
