import React, { useEffect } from 'react';
import SEO from '../../components/SEO';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={styles.page}>
      <SEO 
        title="Privacy Policy | MOVITEA"
        description="Learn how MOVITEA collects, uses, and protects your personal information."
      />
      <div className="container" style={styles.container}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <div style={styles.content}>
          <section className="legal-section">
            <h2>1. Information Collected</h2>
            <p>
              When you visit MOVITEA, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Google Login Data</h2>
            <p>
              If you choose to log in using Google Sign-In, we collect your basic profile information such as your name, email address, and profile picture provided by Google. This information is solely used for authenticating your account and providing a personalized experience.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Cookies and Analytics</h2>
            <p>
              We use cookies to improve your browsing experience, analyze site traffic, and understand where our audience is coming from. Our analytics tools help us optimize our website to better serve you.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Payment Information</h2>
            <p>
              <strong>Your payment information is never stored on MOVITEA servers.</strong> All payment transactions are processed securely through our trusted third-party payment gateways, which adhere to strict PCI-DSS compliance standards.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Data Protection</h2>
            <p>
              We employ industry-standard security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We limit access to your personal data to those employees and partners who have a business need to know.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Third-Party Services</h2>
            <p>
              We may share your information with trusted third-party services for the purposes of fulfilling orders (e.g., shipping partners) and sending communications. These third parties are obligated to keep your information secure and use it only for the intended purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. User Rights</h2>
            <p>
              You have the right to access, update, or delete the personal information we hold about you. If you wish to exercise these rights, please contact us.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Contact Us</h2>
            <p>
              For any questions regarding our Privacy Policy, please contact us at: <a href="mailto:Movitea8@gmail.com" style={styles.link}>Movitea8@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    paddingTop: 'calc(var(--header-height) + 4rem)',
    paddingBottom: '8rem',
    backgroundColor: '#FAF7F2',
    color: '#2B1A12',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  title: {
    fontSize: '3.5rem',
    fontFamily: 'var(--font-serif)',
    marginBottom: '3rem',
    textAlign: 'center',
    fontWeight: '400',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  link: {
    color: 'var(--primary-color)',
    textDecoration: 'none',
    fontWeight: '600',
  }
};

const styleSheet = document.createElement('style');
styleSheet.innerText = `
  .legal-section h2 {
    font-size: 1.5rem;
    font-family: var(--font-serif);
    font-weight: 500;
    color: #D0853E; /* primary color */
    margin-bottom: 1rem;
  }
  .legal-section p {
    font-size: 1.05rem;
    line-height: 1.8;
    font-family: var(--font-sans);
    color: rgba(43, 26, 18, 0.85);
  }
  .legal-section ul {
    font-size: 1.05rem;
    line-height: 1.8;
    font-family: var(--font-sans);
    color: rgba(43, 26, 18, 0.85);
    margin-left: 2rem;
    margin-top: 0.5rem;
  }
  @media (max-width: 600px) {
    div[style*="title"] {
      font-size: 2.5rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);
