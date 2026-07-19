import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SiteLoader({ onLoadingComplete }) {
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const preloadImages = () => {
      const imagesToPreload = [
        "/images/loader1.webp",
        "/images/loader2.webp",
        "/images/loader3.webp",
        "/images/loader4.webp"
      ];

      const imagePromises = imagesToPreload.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error so we don't block forever
          img.src = src;
        });
      });

      return Promise.all(imagePromises);
    };

    const waitForDocument = () => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve, { once: true });
        }
      });
    };

    const runPreloader = async () => {
      try {
        // Race condition: wait for all assets OR a 5 second timeout
        const timeoutPromise = new Promise((resolve) => {
          timeoutId = setTimeout(() => {
            console.warn("Loader timeout reached, forcing completion.");
            resolve();
          }, 5000);
        });

        // Wait for both document complete and specific images
        const assetsPromise = Promise.all([
          waitForDocument(),
          preloadImages()
        ]);

        await Promise.race([assetsPromise, timeoutPromise]);

        // Small buffer to ensure visual smoothness before calling complete
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) onLoadingComplete();
          }, 300);
        }
      } catch (error) {
        console.error("Error during preloading:", error);
        if (isMounted) onLoadingComplete();
      }
    };

    runPreloader();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={styles.loaderOverlay}
    >
      <motion.img
        src="/images/Final.png"
        alt="Movitea Loading..."
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: [0, 1, 0.8, 1], 
          scale: 1 
        }}
        transition={{ 
          opacity: { 
            times: [0, 0.2, 0.6, 1],
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 1,
            ease: "easeOut"
          }
        }}
        style={styles.logo}
      />
    </motion.div>
  );
}

const styles = {
  loaderOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#FFFDF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  logo: {
    width: '200px',
    height: 'auto',
    objectFit: 'contain'
  }
};
