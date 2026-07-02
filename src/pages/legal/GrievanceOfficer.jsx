import React, { useEffect } from 'react';
import SEO from '../../components/SEO';

export default function GrievanceOfficer() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div style={styles.page}>
      <SEO 
        title="Grievance Officer | MOVITEA"
        description="Contact the MOVITEA Grievance Officer for resolving complaints in compliance with Consumer Protection Rules."
      />
      <div className="container" style={styles.container}>
        <h1 style={styles.title}>Grievance Officer</h1>
        <div style={styles.content}>
          <section className="legal-section">
            <p>
              In compliance with the Consumer Protection (E-Commerce) Rules, 2020, MOVITEA has appointed a Grievance Officer to address and resolve any concerns or complaints regarding our products, services, or policies.
            </p>
          </section>

          <section className="legal-section">
            <div style={styles.officerCard}>
              <h2 style={{ marginBottom: '1rem', color: 'var(--dark-color)' }}>Contact Details</h2>
              <div style={styles.detailRow}>
                <strong>Name:</strong> <span>MOVITEA Grievance Officer</span>
              </div>
              <div style={styles.detailRow}>
                <strong>Email:</strong> <a href="mailto:Movitea8@gmail.com" style={{ color: 'var(--primary-color)' }}>Movitea8@gmail.com</a>
              </div>
              <div style={styles.detailRow}>
                <strong>Phone:</strong> <span>+91 9818501302</span>
              </div>
              <div style={styles.detailRow}>
                <strong>Address:</strong>
                <span>
                  Rzg 405A Rajnagar 2 palam<br />
                  Delhi 110077<br />
                  India
                </span>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>Complaint Resolution</h2>
            <p>
              All complaints will be acknowledged within <strong>48 hours</strong> of receipt and we strive to resolve them as quickly as possible.
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
  officerCard: {
    backgroundColor: '#FFFFFF',
    padding: '2rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  detailRow: {
    display: 'flex',
    gap: '1rem',
    fontSize: '1.1rem',
    fontFamily: 'var(--font-sans)',
    strong: {
      width: '100px',
      color: 'var(--dark-color)',
    },
    span: {
      color: 'rgba(43,26,18,0.8)',
    }
  }
};
