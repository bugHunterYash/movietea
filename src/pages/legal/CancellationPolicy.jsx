import React, { useEffect } from 'react';
import SEO from '../../components/SEO';

export default function CancellationPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={styles.page}>
      <SEO 
        title="Cancellation Policy | MOVITEA"
        description="Review MOVITEA's cancellation policy. Find out when and how you can cancel your tea orders."
      />
      <div className="container" style={styles.container}>
        <h1 style={styles.title}>Cancellation Policy</h1>
        <div style={styles.content}>
          <section className="legal-section">
            <h2>Order Cancellation</h2>
            <p>
              Orders may be cancelled only <strong>before they are dispatched</strong>. If you wish to cancel an order, please contact our support team immediately at <a href="mailto:Movitea8@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Movitea8@gmail.com</a>.
            </p>
            <p>
              After an order has been dispatched from our facility, <strong>orders cannot be cancelled</strong>.
            </p>
          </section>

          <section className="legal-section">
            <h2>Pre-Orders</h2>
            <p>
              Pre-orders can be cancelled anytime before the order confirmation and dispatch. Once the pre-order is confirmed and the shipping process begins, it cannot be cancelled.
            </p>
          </section>

          <section className="legal-section">
            <h2>Cancellation by MOVITEA</h2>
            <p>
              MOVITEA reserves the right to cancel any order for reasons including but not limited to stock unavailability, pricing errors, or suspicion of fraudulent activity. If we cancel your order, any payment made will be fully refunded to your original payment method.
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
