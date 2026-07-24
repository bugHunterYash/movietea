import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header({ cartCount = 0, onOpenCart, setSelectedProduct, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About Us', path: '/about' },
    { id: 'shop', label: 'Shop', path: '/shop' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (pageId, path) => {
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const getIsActive = (item) => {
    const currentPath = location.pathname;
    if (item.id === 'home') return currentPath === '/';
    if (item.id === 'product') return currentPath.startsWith('/product');
    return currentPath === item.path;
  };

  return (
    <header style={styles.header}>
      {/* Announcement Bar */}
      <div className="announcement-bar" style={styles.announcementBar}>
        <div className="announcement-track">
            <span className="announcement-text" style={styles.announcementText}>
              First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="announcement-text" style={styles.announcementText}>
              First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="announcement-text" style={styles.announcementText}>
              First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span className="announcement-text" style={styles.announcementText}>
              First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
        </div>
      </div>
      <div className="container header-main" style={styles.container}>
        {/* Left: Nav items */}
        <nav className="desktop-nav" style={styles.desktopNav}>
          {navItems.slice(0, 3).map((item) => {
            const isActive = getIsActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.path)}
                style={{
                  ...styles.navLink,
                  color: isActive ? 'var(--primary-color)' : 'var(--dark-color)',
                  fontWeight: '500',
                }}
              >
                {item.label}
                {isActive && <span style={styles.activeDot} />}
              </button>
            );
          })}
        </nav>

        {/* Center: Logo */}
        <div className="logo-container" style={styles.logoContainer} onClick={() => handleNavClick('home', '/')}>
          <img src="/assets/logo.jfif" alt="MOVITEA" style={styles.logoImg} />
        </div>

        {/* Right: Nav items + Cart + Auth */}
        <div className="right-section" style={styles.rightSection}>
          <nav className="desktop-nav" style={styles.desktopNav}>
            {navItems.slice(3).map((item) => {
              const isActive = getIsActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.path)}
                  style={{
                    ...styles.navLink,
                    color: isActive ? 'var(--primary-color)' : 'var(--dark-color)',
                    fontWeight: '500',
                  }}
                >
                  {item.label}
                  {isActive && <span style={styles.activeDot} />}
                </button>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="auth-section" style={styles.authSection}>
            {user ? (
              <div style={styles.userMenuContainer}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-btn"
                  style={styles.userBtn}
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="user-avatar" style={styles.userAvatar} />
                  ) : (
                    <User size={20} strokeWidth={1.5} color="var(--dark-color)" />
                  )}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown" style={styles.userDropdown}>
                    <div style={styles.userInfo}>
                      <span style={styles.userName}>{user.name}</span>
                      <span style={styles.userEmail}>{user.email}</span>
                      <span style={styles.userRole}>{user.role}</span>
                    </div>
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setShowUserMenu(false);
                        }}
                        style={styles.dropdownMenuItem}
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      style={styles.dropdownMenuItem}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={styles.loginBtn}
                className="auth-login-btn"
              >
                <User size={16} strokeWidth={1.5} />
                <span className="login-btn-text">Sign In</span>
              </button>
            )}
          </div>

          <button className="cart-btn" onClick={onOpenCart} style={styles.cartBtn} aria-label="Open cart">
            <ShoppingBag size={20} strokeWidth={1.5} color="var(--dark-color)" />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>

        </div>

        {/* Mobile Menu Button - moved outside right-section for mobile reordering */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.mobileMenuBtn}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={24} strokeWidth={1.5} color="var(--dark-color)" />
          ) : (
            <Menu size={24} strokeWidth={1.5} color="var(--dark-color)" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.path)}
              style={{
                ...styles.mobileNavLink,
                color: getIsActive(item) ? 'var(--primary-color)' : 'var(--dark-color)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  style={styles.mobileNavLink}
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                style={styles.mobileNavLink}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              style={styles.mobileNavLink}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(250, 247, 242, 0.85)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100px',
    position: 'relative',
  },
  announcementBar: {
    width: '100%',
    height: '35px',
    backgroundColor: 'var(--cream-color)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(43, 26, 18, 0.05)',
  },
  announcementText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.72rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  desktopNav: {
    display: 'flex',
    gap: '2.5rem',
    alignItems: 'center',
  },
  navLink: {
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-sans)',
    position: 'relative',
    padding: '0.5rem 0',
    transition: 'var(--transition-fast)',
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoImg: {
    height: '110px',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
    transition: 'transform 0.3s ease',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  authSection: {
    position: 'relative',
  },
  userMenuContainer: {
    position: 'relative',
  },
  userBtn: {
    padding: '0.25rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.5rem 0',
    minWidth: '200px',
    boxShadow: '0 8px 24px rgba(43,26,18,0.1)',
    zIndex: 1001,
  },
  userInfo: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2B1A12',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: '#8A7A6B',
  },
  userRole: {
    fontSize: '0.65rem',
    fontWeight: '600',
    color: 'var(--primary-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  dropdownMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    color: '#2B1A12',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  cartBtn: {
    position: 'relative',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'var(--primary-color)',
    color: 'var(--white)',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenuBtn: {
    display: 'none',
    padding: '0.5rem',
  },
  mobileMenu: {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    width: '100%',
    height: 'calc(100vh - var(--header-height))',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    zIndex: 999,
  },
  mobileNavLink: {
    fontSize: '2rem',
    letterSpacing: '0.05em',
  },
  dropdownContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownMenu: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#FAF7F2',
    border: '1px solid var(--border-color)',
    padding: '0.5rem 0',
    minWidth: '190px',
    boxShadow: '0 8px 24px rgba(43,26,18,0.06)',
    zIndex: 1000,
  },
  dropdownItem: {
    width: '100%',
    textAlign: 'left',
    padding: '0.75rem 1.5rem',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-sans)',
    color: 'var(--dark-color)',
    transition: 'var(--transition-fast)',
  },
};

// Add responsive media query and hover support
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = `
    .announcement-track {
      display: flex;
      width: max-content;
      animation: marquee 25s linear infinite;
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @media (max-width: 1024px) {
      .logo-container img {
        height: 80px !important;
      }
      .auth-section .login-btn-text {
        display: none;
      }
      .desktop-nav {
        gap: 1.5rem !important;
      }
      .desktop-nav button {
        font-size: 0.75rem !important;
      }
    }
    @media (max-width: 768px) {
      .header-main {
        position: relative !important;
      }
      .desktop-nav {
        display: none !important;
      }
      .mobile-menu-btn {
        display: flex !important;
        order: 1 !important;
      }
      .logo-container {
        position: static !important;
        transform: none !important;
        order: 2 !important;
        flex: 1 !important;
        display: flex !important;
        justify-content: center !important;
        pointer-events: auto !important;
      }
      .logo-container img {
        height: 55px !important;
      }
      .right-section {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        width: auto !important;
        order: 3 !important;
      }
      .right-section > nav {
        display: none !important;
      }
      .auth-section {
        display: flex !important;
      }
      .auth-section .login-btn-text {
        display: inline !important;
      }
      .auth-section .user-dropdown {
        display: none !important;
      }
      .auth-section .user-btn {
        padding: 0.2rem !important;
      }
      .auth-section .user-avatar {
        width: 28px !important;
        height: 28px !important;
      }
      .announcement-bar {
        height: 28px !important;
      }
      .announcement-text {
        font-size: 0.6rem !important;
      }
      .user-dropdown {
        right: auto !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        min-width: 220px !important;
        width: max-content !important;
      }
    }
    @media (max-width: 480px) {
      .logo-container img {
        height: 45px !important;
      }
    }
    header img:hover {
      transform: scale(1.05);
    }
    .nav-dropdown-container:hover .nav-dropdown-menu {
      display: flex !important;
      flex-direction: column !important;
    }
    .nav-dropdown-menu button:hover {
      background-color: var(--cream-color) !important;
      color: var(--primary-color) !important;
    }
    .user-dropdown button:hover {
      background-color: var(--cream-color) !important;
    }
  `;
  document.head.appendChild(styleSheet);
}
