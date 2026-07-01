import React from 'react';

const REVIEWS = [
  {
    name: 'Aishwarya R.',
    role: 'Connoisseur',
    quote: 'Movitea has completely transformed my mornings. The Rose Flavour is subtle, pure, and absolutely divine. Worth every rupee.',
    rating: 5,
    img: '/assets/review-1.jfif',
  },
  {
    name: 'Kabir S.',
    role: 'Tea Enthusiast',
    quote: 'The Toasted Butterscotch smells like a luxury Parisian patisserie. The creaminess without added sugar is wizardry.',
    rating: 5,
    img: '/assets/review-1.jfif',
  },
  {
    name: 'Meera G.',
    role: 'Wellness Designer',
    quote: 'I love how clean it is. Just hot water and you get this rich, deep cacao chocolate tea that feels like pure indulgence.',
    rating: 5,
    img: '/assets/review-1.jfif',
  },
  {
    name: 'Rohan M.',
    role: 'Creative Director',
    quote: 'Beautiful brand, premium packaging, but most importantly: taste is 10/10. The vanilla pods add a silky texture that default teas lack.',
    rating: 5,
    img: '/assets/review-1.jfif',
  },
];

export default function Reviews() {
  // Double the reviews to create a seamless infinite loop
  const duplicatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section style={styles.reviewsSection}>
      <div className="container" style={styles.header}>
        <span style={styles.subtitle}>TESTIMONIALS</span>
        <h2 style={styles.title}>The Journal of Taste</h2>
      </div>

      <div style={styles.marqueeContainer}>
        <div style={styles.marqueeTrack} className="marquee-track">
          {duplicatedReviews.map((rev, index) => (
            <div key={index} style={styles.reviewCard}>
              <div style={styles.cardTop}>
                <div style={styles.avatarWrapper}>
                  <img src={rev.img} alt={rev.name} style={styles.avatarImg} />
                </div>
                <div>
                  <h4 style={styles.reviewerName}>{rev.name}</h4>
                  <span style={styles.reviewerRole}>{rev.role}</span>
                </div>
                <div style={styles.rating}>
                  {'★'.repeat(rev.rating)}
                </div>
              </div>
              <p style={styles.quote}>&ldquo;{rev.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  reviewsSection: {
    backgroundColor: '#FAF7F2',
    padding: '8rem 0',
    overflow: 'hidden',
    borderTop: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '600',
  },
  title: {
    fontSize: '3.5rem',
  },
  marqueeContainer: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)',
  },
  marqueeTrack: {
    display: 'flex',
    gap: '2.5rem',
    width: 'max-content',
    animation: 'marquee 25s linear infinite',
  },
  reviewCard: {
    width: '420px',
    backgroundColor: 'var(--cream-color)',
    border: '1px solid var(--border-color)',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    boxShadow: '0 4px 20px rgba(43, 26, 18, 0.02)',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatarWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid var(--primary-color)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  reviewerName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
    fontFamily: 'var(--font-serif)',
  },
  reviewerRole: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-light)',
  },
  rating: {
    marginLeft: 'auto',
    color: 'var(--primary-color)',
    fontSize: '1rem',
    letterSpacing: '2px',
  },
  quote: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: 'var(--dark-color)',
    fontStyle: 'italic',
    fontWeight: '300',
  },
};

// Add keyframes stylesheet
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
  @media (max-width: 600px) {
    .marquee-track > div {
      width: 320px !important;
      padding: 1.5rem !important;
    }
  }
`;
document.head.appendChild(styleSheetMarquee);
