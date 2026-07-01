import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { authAPI, isAuthenticated, removeToken, cartAPI } from './utils/api';

gsap.registerPlugin(ScrollTrigger);

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import CartDrawer from './components/CartDrawer';

// Lazy load pages for optimal code splitting & speed
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const GiftCollection = lazy(() => import('./pages/GiftCollection'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Login = lazy(() => import('./pages/Login'));

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setSelectedProduct] = useState('butterscotch');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Load cart from localStorage (guest)
  const loadLocalCart = () => {
    try {
      const saved = localStorage.getItem('movitea_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load local cart:', error);
    }
  };

  // Persist cart to localStorage (guest)
  const saveLocalCart = (items) => {
    try {
      localStorage.setItem('movitea_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save local cart:', error);
    }
  };

  // Load cart from server (logged-in user)
  const loadServerCart = async () => {
    try {
      const serverCart = await cartAPI.get();
      const transformed = serverCart.map((item) => ({
        id: item.product.slug,
        cartItemId: item.id,
        dbProductId: item.productId,
        name: item.product.name,
        price: item.product.discountPrice || item.product.price,
        img: item.product.image || '/assets/logo.jfif',
        quantity: item.quantity,
        slug: item.product.slug,
        stock: item.product.stock,
      }));
      setCartItems(transformed);
    } catch (error) {
      console.error('Failed to load server cart:', error);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          await loadServerCart();
        } catch (error) {
          console.error('Auth check failed:', error);
          removeToken();
          setUser(null);
          loadLocalCart();
        }
      } else {
        loadLocalCart();
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

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
  const handleAddToCart = async (product) => {
    if (isAuthenticated()) {
      try {
        const result = await cartAPI.add(product.dbProductId || product.id, 1);
        const newItem = {
          id: product.slug || product.id,
          cartItemId: result.id,
          dbProductId: result.productId,
          name: result.product?.name || product.name,
          price: result.product?.discountPrice || result.product?.price || product.price,
          img: result.product?.image || product.img || '/assets/logo.jfif',
          quantity: result.quantity,
          slug: result.product?.slug || product.slug,
          stock: result.product?.stock || product.stock,
        };
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === newItem.id);
          if (existing) {
            return prev.map((item) =>
              item.id === newItem.id ? { ...item, quantity: newItem.quantity } : item
            );
          }
          return [...prev, newItem];
        });
      } catch (error) {
        console.error('Failed to add to server cart:', error);
      }
    } else {
      setCartItems((prevItems) => {
        const existing = prevItems.find((item) => item.id === product.id);
        const updated = existing
          ? prevItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...prevItems, { ...product, quantity: 1 }];
        saveLocalCart(updated);
        return updated;
      });
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    if (isAuthenticated()) {
      const item = cartItems.find((i) => i.id === productId);
      if (item?.cartItemId) {
        try {
          await cartAPI.update(item.cartItemId, newQuantity);
        } catch (error) {
          console.error('Failed to update server cart:', error);
        }
      }
    }

    setCartItems((prevItems) => {
      const updated = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      if (!isAuthenticated()) saveLocalCart(updated);
      return updated;
    });
  };

  const handleRemoveItem = async (productId) => {
    if (isAuthenticated()) {
      const item = cartItems.find((i) => i.id === productId);
      if (item?.cartItemId) {
        try {
          await cartAPI.remove(item.cartItemId);
        } catch (error) {
          console.error('Failed to remove from server cart:', error);
        }
      }
    }

    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== productId);
      if (!isAuthenticated()) saveLocalCart(updated);
      return updated;
    });
  };

  const clearCart = async () => {
    if (isAuthenticated()) {
      try {
        await cartAPI.clear();
      } catch (error) {
        console.error('Failed to clear server cart:', error);
      }
    }
    setCartItems([]);
    localStorage.removeItem('movitea_cart');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    removeToken();
    setUser(null);
    // Clear server cart reference, keep local items as guest
    setCartItems([]);
    navigate('/');
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={styles.spinner}
        />
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      {/* Conditionally render header, footer and cart for standard page layouts */}
      {!isAdminRoute && (
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          setSelectedProduct={setSelectedProduct}
          user={user}
          onLogout={handleLogout}
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
                <Route path="/gift-collection" element={<GiftCollection onAddToCart={handleAddToCart} />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} user={user} />} />
                <Route path="/admin/*" element={<Admin user={user} />} />
                <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
                <Route path="/login" element={<Login />} />
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
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: '#FAF7F2',
  },
  spinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid var(--cream-color)',
    borderTopColor: 'var(--primary-color)',
  },
};
