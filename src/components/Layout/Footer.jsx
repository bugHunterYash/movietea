import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.topRow}>
          {/* Brand Info */}
          <div style={styles.columnLarge}>
            <img src="/assets/logo.jfif" alt="MOVITEA" style={styles.footerLogo} />
            <p style={styles.brandDesc}>
              A modern tea atelier dedicated to craft, flavor, and sensory elegance. Elevating your daily ritual one steep at a time.
            </p>
          </div>

          {/* Links Column 1 */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Atelier</h4>
            <div style={styles.linksList}>
              <button onClick={() => handleNavClick('/')} style={styles.footerLink}>Home</button>
              <button onClick={() => handleNavClick('/about')} style={styles.footerLink}>About Us</button>
              <button onClick={() => handleNavClick('/shop')} style={styles.footerLink}>Shop Tea</button>
              <button onClick={() => handleNavClick('/bulk-orders')} style={styles.footerLink}>Bulk Orders</button>
            </div>
          </div>

          {/* Links Column 2 */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Flavours</h4>
            <div style={styles.linksList}>
              <button onClick={() => handleNavClick('/product/rose')} style={styles.footerLink}>Rose Tea</button>
              <button onClick={() => handleNavClick('/product/vanilla')} style={styles.footerLink}>Vanilla Tea</button>
              <button onClick={() => handleNavClick('/product/butterscotch')} style={styles.footerLink}>Butterscotch Tea</button>
              <button onClick={() => handleNavClick('/product/chocolate')} style={styles.footerLink}>Chocolate Tea</button>
            </div>
          </div>

          {/* Newsletter */}
          <div style={styles.columnNewsletter}>
            <h4 style={styles.colTitle}>Newsletter</h4>
            <p style={styles.newsletterText}>Subscribe to receive editorial content, product launch updates, and private sales.</p>
            <form style={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your Email Address" style={styles.inputField} required />
              <button type="submit" style={styles.submitBtn}>Join</button>
            </form>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <p style={styles.copyText}>&copy; {currentYear} MOVITEA. All Rights Reserved.</p>
          <div style={styles.socials}>
            <a href="#instagram" style={styles.socialLink}>Instagram</a>
            <a href="#pinterest" style={styles.socialLink}>Pinterest</a>
            <a href="#twitter" style={styles.socialLink}>Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--cream-color)',
    paddingTop: '6rem',
    paddingBottom: '3rem',
    borderTop: '1px solid var(--border-color)',
    marginTop: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
  },
  topRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr',
    gap: '2.5rem',
  },
  columnLarge: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  footerLogo: {
    height: '40px',
    alignSelf: 'flex-start',
    mixBlendMode: 'multiply',
  },
  brandDesc: {
    maxWidth: '300px',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    fontWeight: '300',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  colTitle: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: '600',
    color: 'var(--dark-color)',
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    alignItems: 'flex-start',
  },
  footerLink: {
    fontSize: '0.9rem',
    color: 'var(--text-light)',
    fontWeight: '300',
    textAlign: 'left',
    transition: 'var(--transition-fast)',
    borderBottom: '1px solid transparent',
    paddingBottom: '2px',
  },
  columnNewsletter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  newsletterText: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    maxWidth: '320px',
  },
  subscribeForm: {
    display: 'flex',
    borderBottom: '1px solid var(--dark-color)',
    paddingBottom: '0.5rem',
    maxWidth: '320px',
  },
  inputField: {
    flex: 1,
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--dark-color)',
  },
  submitBtn: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: '600',
    color: 'var(--dark-color)',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '2.5rem',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  copyText: {
    fontSize: '0.85rem',
  },
  socials: {
    display: 'flex',
    gap: '1.5rem',
  },
  socialLink: {
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    borderBottom: '1px solid transparent',
  },
};

// Add responsive media query support
const styleSheetFooter = document.createElement('style');
styleSheetFooter.innerText = `
  @media (max-width: 900px) {
    footer div[style*="gridTemplateColumns"] {
      grid-template-columns: 1fr 1fr !important;
      gap: 3rem !important;
    }
  }
  @media (max-width: 600px) {
    footer div[style*="gridTemplateColumns"] {
      grid-template-columns: 1fr !important;
      gap: 2.5rem !important;
    }
  }
`;
document.head.appendChild(styleSheetFooter);
