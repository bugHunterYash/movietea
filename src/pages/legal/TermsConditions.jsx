import React, { useEffect } from 'react';
import SEO from '../../components/SEO';

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={styles.page}>
      <SEO 
        title="Terms & Conditions | MOVITEA"
        description="Read the Terms and Conditions for using MOVITEA services and purchasing our premium tea products."
      />
      <div className="container" style={styles.container}>
        <h1 style={styles.title}>Terms & Conditions</h1>
        <div style={styles.content}>
          <section className="legal-section">
            <h2>1. Website Usage</h2>
            <p>
              By accessing and using MOVITEA, you agree to comply with and be bound by the following terms and conditions of use. If you disagree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Product Availability & Pricing</h2>
            <p>
              All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We shall not be liable for any modification, price change, suspension, or discontinuance of products.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Intellectual Property</h2>
            <p>
              The content, design, logo, and imagery on this website are owned by MOVITEA and are protected by applicable intellectual property laws. Unauthorized use or reproduction is strictly prohibited.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. User Accounts & Google Sign-In</h2>
            <p>
              When you create an account or log in via Google, you are responsible for maintaining the confidentiality of your account information. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Pre-orders</h2>
            <p>
              Pre-orders allow you to reserve a product before it is available for general sale. Payment for pre-orders is collected at the time of purchase. Shipping timelines for pre-orders are estimates and subject to change.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Limitation of Liability</h2>
            <p>
              MOVITEA shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or website.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of India.
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
  }
};
