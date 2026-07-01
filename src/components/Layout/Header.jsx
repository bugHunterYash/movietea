import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';

export default function Header({ setSelectedProduct }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      window.location.reload();
    } else {
      navigate('/login');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About Us', path: '/about' },
    { id: 'shop', label: 'Shop', path: '/shop' },
    { id: 'bulk-orders', label: 'Bulk Orders', path: '/bulk-orders' },
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
      <div style={styles.announcementBar}>
        <div className="announcement-track">
          <span style={styles.announcementText}>
            First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span style={styles.announcementText}>
            First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span style={styles.announcementText}>
            First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span style={styles.announcementText}>
            First Order Special • Get 50% OFF • Free Delivery Above ₹499 &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
      <div className="container" style={styles.container}>
        {/* Left: Nav items */}
        <nav style={styles.desktopNav}>
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
        <div style={styles.logoContainer} onClick={() => handleNavClick('home', '/')}>
          <img src="/assets/logo.jfif" alt="MOVITEA" style={styles.logoImg} />
        </div>

        {/* Right: Nav items + Cart */}
        <div style={styles.rightSection}>
          <nav style={styles.desktopNav}>
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

          <button onClick={handleAuthAction} style={styles.authBtn} aria-label={isLoggedIn ? 'Sign out' : 'Sign in'}>
            {isLoggedIn ? (
              <>
                <LogOut size={24} strokeWidth={1.5} color="var(--dark-color)" />
                <span style={styles.authText}>Logout</span>
              </>
            ) : (
              <>
                <User size={24} strokeWidth={1.5} color="var(--dark-color)" />
                <span style={styles.authText}>Login</span>
              </>
            )}
          </button>

          <button
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
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                ...styles.mobileNavLink,
                color: currentPage === item.id ? 'var(--primary-color)' : 'var(--dark-color)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {item.label}
            </button>
          ))}
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
    height: '75px',
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
    height: '130px',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
    transition: 'transform 0.3s ease',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  authBtn: {
    position: 'relative',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    gap: '0.4rem',
  },
  authText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--dark-color)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
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
    @media (max-width: 768px) {
      header nav {
        display: none !important;
      }
      header button[aria-label="Toggle menu"] {
        display: block !important;
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
  `;
  document.head.appendChild(styleSheet);
}
