import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollProgress from './components/Layout/ScrollProgress';

// Lazy load pages for optimal code splitting & speed
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const BulkOrders = lazy(() => import('./pages/BulkOrders'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState('butterscotch');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    // Disable Lenis smooth scrolling inside Admin Dashboard for standard table navigation
    if (isAdminRoute) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenisRaf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenisRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenisRaf);
    };
  }, [isAdminRoute]);

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={styles.appContainer}>
      {/* Conditionally render header, footer and cart for standard page layouts */}
      {!isAdminRoute && (
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {/* Page Content with transition animations */}
      <div style={isAdminRoute ? styles.adminPageContent : styles.pageContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/" element={<Home setSelectedProduct={setSelectedProduct} />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} setSelectedProduct={setSelectedProduct} />} />
                <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {!isAdminRoute && <Footer />}

      {!isAdminRoute && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {!isAdminRoute && <ScrollProgress />}
    </div>
  );
}

function PageLoader() {
  return (
    <div style={styles.loader}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={styles.spinner}
      />
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: '#FAF7F2',
  },
  pageContent: {
    flex: 1,
  },
  adminPageContent: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    width: '100%',
  },
  spinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid var(--cream-color)',
    borderTopColor: 'var(--primary-color)',
  },
};
