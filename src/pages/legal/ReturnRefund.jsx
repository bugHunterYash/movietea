import React, { useEffect } from 'react';
import SEO from '../../components/SEO';

export default function ReturnRefund() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={styles.page}>
      <SEO 
        title="Return & Refund Policy | MOVITEA"
        description="Review MOVITEA's return and refund policy. Note that due to food safety, all consumable products are non-returnable."
      />
      <div className="container" style={styles.container}>
        <h1 style={styles.title}>Return & Refund Policy</h1>
        <div style={styles.content}>
          <section className="legal-section">
            <p style={{ fontWeight: '600', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
              MOVITEA sells consumable food products.
            </p>
          </section>

          <section className="legal-section">
            <h2>No Returns</h2>
            <p>
              All MOVITEA products are strictly <strong>NON-RETURNABLE</strong> and <strong>NON-REFUNDABLE</strong>.
            </p>
            <p>
              Due to food safety, hygiene, and quality standards, we do not accept returns, exchanges, or refunds under any circumstances after an order has been placed or delivered.
            </p>
            <p>This policy applies to:</p>
            <ul>
              <li>Tea Sachets</li>
              <li>Tea Jars</li>
              <li>Combo Packs</li>
              <li>Gift Packs</li>
              <li>Promotional Products</li>
              <li>Limited Edition Products</li>
              <li>All consumable items sold by MOVITEA</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Damaged or Wrongly Delivered Products</h2>
            <p>
              In the rare event that your product is delivered damaged, defective, or you receive the wrong item, you must contact us within <strong>48 hours</strong> of delivery. Please provide the following to our support team:
            </p>
            <ul>
              <li>Order ID</li>
              <li>Clear images of the damaged product and packaging</li>
              <li>Unboxing photos or videos (if available)</li>
            </ul>
            <p>
              We will investigate the issue and, if verified, provide a replacement or process a refund for the damaged items.
            </p>
          </section>

          <section className="legal-section">
            <h2>No Refunds for Regular Purchases</h2>
            <p>All purchases made on MOVITEA are final.</p>
            <p>Refunds will not be issued for:</p>
            <ul>
              <li>Change of mind</li>
              <li>Taste preference</li>
              <li>Wrong product selected by customer</li>
              <li>Incorrect shipping address provided by customer</li>
              <li>Delayed deliveries caused by courier partners</li>
              <li>Customer unavailable during delivery</li>
              <li>Opened or unopened products</li>
              <li>Damaged packaging after delivery</li>
              <li>Refused deliveries</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>Refund Processing</h2>
            <p>
              Approved refunds (in case of confirmed damages or errors on our end) are credited to the original payment method within <strong>5–7 business days</strong>.
            </p>
          </section>

          <section className="legal-section">
            <h2>Important Notice</h2>
            <p>
              By placing an order on MOVITEA, the customer acknowledges and agrees that all products sold are consumable food items and are therefore strictly non-returnable, non-exchangeable, and non-refundable. Please review your cart, delivery address, and order details carefully before completing your purchase. This policy forms an integral part of MOVITEA's Terms & Conditions.
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
