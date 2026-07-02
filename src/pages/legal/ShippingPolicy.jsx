import React, { useEffect } from 'react';
import SEO from '../../components/SEO';

export default function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={styles.page}>
      <SEO 
        title="Shipping Policy | MOVITEA"
        description="Learn about MOVITEA's shipping policy, processing times, and delivery estimates."
      />
      <div className="container" style={styles.container}>
        <h1 style={styles.title}>Shipping Policy</h1>
        <div style={styles.content}>
          <section className="legal-section">
            <h2>Processing Time</h2>
            <p>
              All orders are processed within <strong>1–3 Business Days</strong> after receiving your order confirmation email. You will receive another notification when your order has shipped.
            </p>
          </section>

          <section className="legal-section">
            <h2>Delivery Estimates</h2>
            <p>
              Once dispatched, the estimated delivery time is <strong>3–7 Business Days</strong>. Please note that the delivery partner may vary depending on your location.
            </p>
          </section>

          <section className="legal-section">
            <h2>Delays</h2>
            <p>
              While we strive to deliver your premium tea on time, delays may occur during festivals, public holidays, or due to unforeseen events out of our control. We appreciate your patience during such times.
            </p>
          </section>

          <section className="legal-section">
            <h2>Shipping Rates</h2>
            <p>
              Shipping charges for your order will be calculated and displayed at checkout. We offer free delivery on orders above ₹499.
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
