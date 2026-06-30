import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplet, Leaf, Compass, Zap, Heart } from 'lucide-react';

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'Zero Added Sugar',
    desc: 'Sweetened naturally and subtly by flavor botanicals, never artificial sugars.',
  },
  {
    icon: Droplet,
    title: 'Just Add Hot Water',
    desc: 'The ultimate luxury convenience. Stir and watch the premium blend dissolve.',
  },
  {
    icon: Leaf,
    title: 'Premium Ingredients',
    desc: 'Single-origin tea leaves, authentic spice extracts, real flowers and cocoa.',
  },
  {
    icon: Compass,
    title: 'Unique Flavours',
    desc: 'Bespoke recipes: Rose, Vanilla, Toasted Butterscotch, and Cocoa Reserve.',
  },
  {
    icon: Zap,
    title: 'Quick Preparation',
    desc: 'Instant indulgence. Brews perfectly in 30 seconds for a flawless experience.',
  },
  {
    icon: Heart,
    title: 'Comfort Experience',
    desc: 'A sensory ritual crafted to soothe the mind, excite the palate, and heal.',
  },
];

export default function WhyMovitea() {
  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  };

  return (
    <section style={styles.section}>
      <div className="container">
        {/* Intro */}
        <div style={styles.intro}>
          <span style={styles.subtitle}>WHY MOVITEA</span>
          <h2 style={styles.title}>Reimagining the Tea Ritual</h2>
        </div>

        {/* Benefits Grid */}
        <div style={styles.grid}>
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                style={styles.item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div style={styles.iconContainer}>
                  <Icon size={24} strokeWidth={1.5} color="var(--primary-color)" />
                </div>
                <div style={styles.textContainer}>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.itemDesc}>{item.desc}</p>
                </div>

                {/* SVG Line to draw itself underneath */}
                <div style={styles.lineWrapper}>
                  <svg width="100%" height="2" fill="none" style={styles.lineSvg}>
                    <motion.path
                      d="M 0 1 L 500 1"
                      stroke="rgba(197, 107, 31, 0.25)"
                      strokeWidth="1"
                      variants={lineVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: '#FAF7F2',
    padding: '8rem 0',
    borderTop: '1px solid var(--border-color)',
    position: 'relative',
    overflow: 'hidden',
  },
  intro: {
    textAlign: 'center',
    marginBottom: '5rem',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '6rem',
    rowGap: '4rem',
  },
  item: {
    display: 'flex',
    gap: '1.5rem',
    position: 'relative',
    paddingBottom: '2rem',
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--cream-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  itemTitle: {
    fontSize: '1.8rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
    fontWeight: '400',
  },
  itemDesc: {
    fontFamily: 'var(--font-story)',
    fontSize: '1.05rem',
    lineHeight: '1.7',
    color: 'var(--text-light)',
  },
  lineWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
  },
  lineSvg: {
    width: '100%',
    height: '100%',
  },
};

// Add responsive styles
const styleSheetWhy = document.createElement('style');
styleSheetWhy.innerText = `
  @media (max-width: 850px) {
    section[style*="padding: 8rem 0"] div[style*="gridTemplateColumns"] {
      grid-template-columns: 1fr !important;
      row-gap: 3rem !important;
    }
  }
`;
document.head.appendChild(styleSheetWhy);
