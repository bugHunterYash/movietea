import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import api from './api/client';
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
const Login = lazy(() => import('./pages/Login'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));

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

  // Fetch Cart if logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (!localStorage.getItem('token')) return;
      try {
        const cartRes = await api.get('/cart');
        if (cartRes.data && cartRes.data.items) {
           const mappedItems = cartRes.data.items.map(i => ({
             ...i.product,
             quantity: i.quantity
           }));
           setCartItems(mappedItems);
        }
      } catch (err) {
        console.error('Failed to fetch cart', err);
      }
    };
    fetchCart();
  }, [location.pathname]);

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
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
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
      {!isAdminRoute && <LoginReminder />}
    </div>
  );
}

function LoginReminder() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show if user is NOT logged in and hasn't dismissed it this session
    const token = localStorage.getItem('token');
    const dismissed = sessionStorage.getItem('loginReminderDismissed');
    
    if (!token && !dismissed) {
      const timer = setTimeout(() => setShow(true), 3000); // show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          backgroundColor: '#FFFFFF',
          padding: '20px 25px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(43,26,18,0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          border: '1px solid rgba(43,26,18,0.1)',
          maxWidth: '320px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: '#2B1A12', fontSize: '1.1rem' }}>Welcome to MOVITEA</h4>
          <button 
            onClick={() => {
              setShow(false);
              sessionStorage.setItem('loginReminderDismissed', 'true');
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A7A6B', padding: 0 }}
          >
            ✕
          </button>
        </div>
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', color: '#8A7A6B', fontSize: '0.85rem', lineHeight: '1.4' }}>
          Sign in to access your saved cart, view order history, and unlock exclusive premium offers.
        </p>
        <button 
          onClick={() => {
            setShow(false);
            navigate('/login');
          }}
          style={{
            backgroundColor: '#2B1A12',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            fontFamily: 'var(--font-sans)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          Sign In Now
        </button>
      </motion.div>
    </AnimatePresence>
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
