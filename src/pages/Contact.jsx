import React from 'react';

export default function Contact() {
  return (
    <div style={styles.page}>
      <div className="container" style={styles.grid}>
        {/* Left Side: Contact Details */}
        <div style={styles.infoCol}>
          <span style={styles.subtitle}>SAY HELLO</span>
          <h1 style={styles.title}>Atelier Concierge</h1>
          <p style={styles.desc}>
            Whether you have questions about our ingredients, brewing processes, or want to discuss a bulk custom order, our concierge is ready to assist.
          </p>

          <div style={styles.detailsBlock}>
            <div style={styles.detailItem}>
              <h4>Concierge Support</h4>
              <p>support@movitea.com</p>
              <p>+91 98765 43210</p>
            </div>
            
            <div style={styles.detailItem}>
              <h4>Atelier Location</h4>
              <p>12, Luxury Row, Jubilee Hills</p>
              <p>Hyderabad, TS, India</p>
            </div>

            <div style={styles.detailItem}>
              <h4>Working Hours</h4>
              <p>Monday &mdash; Saturday</p>
              <p>10:00 AM &mdash; 7:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div style={styles.formCol}>
          <form style={styles.form} onSubmit={(e) => { e.preventDefault(); alert("Thank you. Our concierge team will connect with you shortly."); }}>
            <h3 style={styles.formTitle}>Send a Message</h3>
            
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input type="text" style={styles.input} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input type="email" style={styles.input} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Message</label>
              <textarea style={styles.textarea} rows="6" required></textarea>
            </div>

            <button type="submit" className="luxury-btn" style={styles.submitBtn}>
              Send Message
            </button>
          </form>
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
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '6rem',
    alignItems: 'flex-start',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    color: 'var(--primary-color)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '4.5rem',
    lineHeight: '1.1',
  },
  desc: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
  },
  detailsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    marginTop: '2rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    h4: {
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: 'var(--dark-color)',
    },
    p: {
      fontSize: '1rem',
    },
  },
  formCol: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    padding: '4rem 3.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  formTitle: {
    fontSize: '2.2rem',
    fontFamily: 'var(--font-serif)',
    marginBottom: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  label: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: '600',
    color: 'var(--dark-color)',
  },
  input: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    padding: '0.8rem 0',
    fontSize: '1rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      borderColor: 'var(--primary-color)',
    },
  },
  textarea: {
    border: 'none',
    borderBottom: '1px solid var(--border-color)',
    padding: '0.8rem 0',
    fontSize: '1rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    resize: 'none',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      borderColor: 'var(--primary-color)',
    },
  },
  submitBtn: {
    width: '100%',
    marginTop: '1rem',
  },
};

// Add responsive styles
const styleSheetContact = document.createElement('style');
styleSheetContact.innerText = `
  @media (max-width: 900px) {
    div[style*="page"] div[style*="gridTemplateColumns"] {
      grid-template-columns: 1fr !important;
      gap: 4rem !important;
    }
    div[style*="formCol"] {
      padding: 2.5rem 1.5rem !important;
    }
  }
`;
document.head.appendChild(styleSheetContact);
