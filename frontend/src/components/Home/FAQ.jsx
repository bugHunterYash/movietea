import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'How do I prepare MOVITEA flavoured tea?',
    answer: 'Preparation is designed to be effortlessly simple. Just take 1 scoop or sachet of our premium blend, add 150ml of hot water or milk, stir well for 10-15 seconds, and enjoy. No straining or brewing equipment required.',
  },
  {
    question: 'Is there any added sugar or sweeteners?',
    answer: 'Absolutely not. We believe in natural goodness. All our blends contain zero added refined sugar and zero artificial sweeteners. The flavors and mild sweetness come from organic botanical extracts and natural spices.',
  },
  {
    question: 'What are the premium ingredients used?',
    answer: 'We use high-grade single-origin CTC & Orthodox black tea leaves, combined with real Madagascar vanilla bean extract, cocoa husks, natural caramel flavourings, and hand-picked organic rose petals.',
  },
  {
    question: 'Can I consume it cold or as iced tea?',
    answer: 'Yes! While designed as a warm comforting cup, all our flavours taste incredible when dissolved in a little hot water, poured over ice, and topped with chilled milk or cold water for a refreshing luxury beverage.',
  },
  {
    question: 'What is the shelf life of the tea packs?',
    answer: 'Each vacuum-sealed package has a shelf life of 12 months from the packaging date. We recommend storing it in a cool, dry place away from direct sunlight to maintain the maximum aromatic profile.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section style={styles.section}>
      <div className="container" style={styles.innerContainer}>
        <div style={styles.header}>
          <span style={styles.subtitle}>QUESTIONS & ANSWERS</span>
          <h2 style={styles.title}>Frequently Asked</h2>
        </div>

        <div style={styles.faqList}>
          {FAQS.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={index} style={styles.faqItem}>
                <button onClick={() => toggleFaq(index)} style={styles.questionBtn}>
                  <span style={styles.questionText}>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={styles.iconWrapper}
                  >
                    <ChevronDown size={20} strokeWidth={1.5} color="var(--dark-color)" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={styles.answerWrapper}
                    >
                      <p style={styles.answerText}>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
  },
  innerContainer: {
    maxWidth: '800px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
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
  faqList: {
    display: 'flex',
    flexDirection: 'column',
  },
  faqItem: {
    borderBottom: '1px solid var(--border-color)',
    padding: '1.5rem 0',
  },
  questionBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    padding: '0.5rem 0',
  },
  questionText: {
    fontSize: '1.35rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--dark-color)',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerWrapper: {
    overflow: 'hidden',
  },
  answerText: {
    fontFamily: 'var(--font-story)',
    fontSize: '1rem',
    lineHeight: '1.7',
    color: 'var(--text-light)',
    paddingTop: '1rem',
    paddingBottom: '0.5rem',
  },
};
