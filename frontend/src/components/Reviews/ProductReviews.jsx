import React, { useState, useMemo } from 'react';
import reviewsData from '../../data/reviews.json';

const StarRating = ({ rating, size = 16, color = '#FFB800' }) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg 
          key={star} 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill={star <= rating ? color : '#E5E5E5'} 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProductReviews({ productSlug }) {
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  
  const reviewsPerPage = 5;

  const productReviews = useMemo(() => {
    // 1. Exact Match
    if (reviewsData[productSlug] && reviewsData[productSlug].length > 0) {
      return reviewsData[productSlug];
    }
    
    // 2. Fuzzy Match by keyword
    const slugStr = String(productSlug).toLowerCase();
    
    if (slugStr.includes('combo') || slugStr.includes('sachets combo')) {
      return reviewsData['10-sachets-combo'] || Object.values(reviewsData)[0] || [];
    }
    if (slugStr.includes('chocolate')) return reviewsData['chocolate-10-sachets'] || [];
    if (slugStr.includes('vanilla')) return reviewsData['vanilla-10-sachets'] || [];
    if (slugStr.includes('rose')) return reviewsData['rose-10-sachets'] || [];
    if (slugStr.includes('butterscotch')) return reviewsData['butterscotch-10-sachets'] || [];
    
    // 3. Absolute Fallback
    return Object.values(reviewsData)[0] || [];
  }, [productSlug]);

  // Calculations
  const totalReviews = productReviews.length;
  const averageRating = totalReviews > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;
    
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach(r => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });

  // Sorting
  const sortedReviews = useMemo(() => {
    const arr = [...productReviews];
    if (sortBy === 'highest') {
      arr.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      arr.sort((a, b) => a.rating - b.rating);
    } else {
      // Recent (already sorted by date in dataset, but we ensure it here)
      arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return arr;
  }, [productReviews, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const currentReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage, 
    currentPage * reviewsPerPage
  );

  if (totalReviews === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Customer Reviews</h2>
      </div>

      <div style={styles.statsContainer}>
        {/* Overall Rating */}
        <div style={styles.overallStats}>
          <div style={styles.avgRatingDisplay}>
            <StarRating rating={Math.round(averageRating)} size={28} />
            <span style={styles.avgText}>{averageRating}/5</span>
          </div>
          <p style={styles.basedOnText}>Based on {totalReviews} reviews</p>
        </div>

        {/* Breakdown */}
        <div style={styles.breakdownContainer}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star];
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} style={styles.breakdownRow}>
                <span style={styles.starLabel}>{star}★</span>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${percent}%` }} />
                </div>
                <span style={styles.countLabel}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div style={styles.actionContainer}>
          <button style={styles.writeReviewBtn} onClick={() => setShowModal(true)}>
            Write a Review
          </button>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.sortContainer}>
        <span style={styles.sortLabel}>Sort:</span>
        <select 
          value={sortBy} 
          onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
          style={styles.sortSelect}
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      <div style={styles.divider} />

      <div style={styles.reviewsList}>
        {currentReviews.map(review => (
          <div key={review.id} style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <div style={styles.reviewerInfo}>
                <div style={styles.avatar}>
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={styles.reviewerNameRow}>
                    <span style={styles.name}>{review.name}</span>
                    {review.verified && (
                      <span style={styles.verifiedBadge}>✔ Verified Purchase</span>
                    )}
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
              </div>
              <span style={styles.date}>{review.date}</span>
            </div>
            <h4 style={styles.reviewTitle}>{review.title}</h4>
            <p style={styles.reviewComment}>{review.comment}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              style={{
                ...styles.pageBtn,
                backgroundColor: currentPage === idx + 1 ? 'var(--dark-color)' : '#FFF',
                color: currentPage === idx + 1 ? '#FFF' : 'var(--dark-color)',
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Write a Review</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input type="text" style={styles.input} placeholder="Your Name" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Rating</label>
              <select style={styles.input}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input type="text" style={styles.input} placeholder="Summary of your review" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Comment</label>
              <textarea style={{...styles.input, height: '100px'}} placeholder="What did you like about this product?" />
            </div>
            <div style={styles.modalActions}>
              <button style={styles.submitBtn} onClick={() => setShowModal(false)}>Submit</button>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '4rem 0',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'var(--font-sans)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-heading)',
    color: 'var(--dark-color)',
    letterSpacing: '-0.02em',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
    backgroundColor: '#FAF7F2',
    padding: '2.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(43, 26, 18, 0.08)',
  },
  overallStats: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  avgRatingDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  avgText: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: 'var(--dark-color)',
  },
  basedOnText: {
    fontSize: '0.9rem',
    color: '#666',
  },
  breakdownContainer: {
    flex: 1,
    minWidth: '250px',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  breakdownRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  starLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
    width: '24px',
  },
  barTrack: {
    flex: 1,
    height: '10px',
    backgroundColor: '#EBEBEB',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: '5px',
  },
  countLabel: {
    fontSize: '0.85rem',
    color: '#666',
    width: '24px',
    textAlign: 'right',
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  writeReviewBtn: {
    padding: '1rem 2rem',
    backgroundColor: 'var(--dark-color)',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(43, 26, 18, 0.08)',
    margin: '2rem 0',
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
  sortLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
  },
  sortSelect: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #D9D9D9',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#FFF',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  reviewCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingBottom: '2.5rem',
    borderBottom: '1px dotted rgba(43, 26, 18, 0.15)',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#E8DDBF',
    color: 'var(--dark-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  reviewerNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '4px',
  },
  name: {
    fontWeight: '700',
    fontSize: '1.05rem',
    color: 'var(--dark-color)',
  },
  verifiedBadge: {
    fontSize: '0.75rem',
    color: '#0D7044',
    backgroundColor: '#E8F5E9',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: '600',
  },
  date: {
    fontSize: '0.85rem',
    color: '#888',
  },
  reviewTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--dark-color)',
  },
  reviewComment: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#444',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '3rem',
  },
  pageBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(43, 26, 18, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: '2.5rem',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    fontFamily: 'var(--font-heading)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.2rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #D9D9D9',
    fontSize: '1rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  submitBtn: {
    flex: 1,
    padding: '1rem',
    backgroundColor: 'var(--dark-color)',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '1rem',
    backgroundColor: '#FFF',
    color: 'var(--dark-color)',
    border: '1px solid var(--dark-color)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
