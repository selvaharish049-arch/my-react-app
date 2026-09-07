import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, userRole, currentUser, onLogout, onLoginClick, cartCount, onCartClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasOrderUpdate, setHasOrderUpdate] = useState(false);
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkNotification = () => {
      // 1. NEVER show order update notification badge to Admin
      if (userRole === 'admin' || !isLoggedIn) {
        setHasOrderUpdate(false);
        setUnreadCount(0);
        return;
      }

      try {
        const userStr = localStorage.getItem('luxe_user');
        if (!userStr) {
          setHasOrderUpdate(false);
          setUnreadCount(0);
          return;
        }

        const user = JSON.parse(userStr);
        if (!user || user.role === 'admin') {
          setHasOrderUpdate(false);
          setUnreadCount(0);
          return;
        }

        const custEmail = user.email ? user.email.toLowerCase().trim() : '';
        const custPhone = user.phone ? user.phone.trim() : '';

        // Check email-isolated customer notifications map
        const storedNotifs = localStorage.getItem('luxe_customer_notifications');
        if (storedNotifs) {
          const notifMap = JSON.parse(storedNotifs);
          const myNotifs = (custEmail && notifMap[custEmail]) || (custPhone && notifMap[custPhone]) || [];
          if (Array.isArray(myNotifs) && myNotifs.length > 0) {
            setHasOrderUpdate(true);
            setUnreadCount(myNotifs.length);
            return;
          }
        }

        // Legacy fallback single update check
        const storedLegacy = localStorage.getItem('luxe_has_order_update');
        if (storedLegacy) {
          const updateObj = JSON.parse(storedLegacy);
          if (updateObj && updateObj.customerEmail) {
            if (custEmail && updateObj.customerEmail.toLowerCase().trim() === custEmail) {
              setHasOrderUpdate(true);
              setUnreadCount(1);
              return;
            }
          }
        }

        setHasOrderUpdate(false);
        setUnreadCount(0);
      } catch (e) {
        setHasOrderUpdate(false);
        setUnreadCount(0);
      }
    };

    checkNotification();
    window.addEventListener('orderStatusUpdated', checkNotification);
    window.addEventListener('storage', checkNotification);
    return () => {
      window.removeEventListener('orderStatusUpdated', checkNotification);
      window.removeEventListener('storage', checkNotification);
    };
  }, [userRole, currentUser, isLoggedIn]);

  const handleClearNotifications = () => {
    try {
      const userStr = localStorage.getItem('luxe_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const custEmail = user?.email ? user.email.toLowerCase().trim() : '';
        const custPhone = user?.phone ? user.phone.trim() : '';

        const storedNotifs = localStorage.getItem('luxe_customer_notifications');
        if (storedNotifs) {
          const notifMap = JSON.parse(storedNotifs);
          if (custEmail && notifMap[custEmail]) delete notifMap[custEmail];
          if (custPhone && notifMap[custPhone]) delete notifMap[custPhone];
          localStorage.setItem('luxe_customer_notifications', JSON.stringify(notifMap));
        }
        localStorage.removeItem('luxe_has_order_update');
      }
    } catch (e) {}
    setHasOrderUpdate(false);
    setUnreadCount(0);
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      onLoginClick();
    } else {
      setShowProfileMenu(prev => !prev);
    }
  };

  const getProfileInitials = () => {
    if (currentUser && currentUser.name) {
      return currentUser.name[0].toUpperCase();
    }
    if (userRole === 'admin') return 'K';
    return 'C';
  };

  return (
    <nav className="navbar" onMouseLeave={() => setShowProfileMenu(false)}>
      {/* 1. TOP BAR PANEL */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>Furniture</span> | <span>Home Interiors</span> | <span>Bulk Order</span>
        </div>
        <div className="top-bar-right">
          <a href="tel:+916379183549" className="top-bar-link">
            <svg className="nav-top-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>+91 6379183549</span>
          </a>
          <span className="top-sep">|</span>

          {/* Permanent Link Name: Update Order */}
          <Link 
            to="/track" 
            className="top-bar-link" 
            onClick={handleClearNotifications}
            title="Update Order Status & Tracking"
          >
            <svg className="nav-top-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Update Order</span>
            {hasOrderUpdate && userRole !== 'admin' && (
              <span className="notification-badge-pill">
                🔔 {unreadCount || 1}
              </span>
            )}
          </Link>
          <span className="top-sep">|</span>

          <Link to="/help" className="top-bar-link">
            <svg className="nav-top-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Help Center</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW */}
      <div className="main-header">
        {/* Left Logo styled to minimal chair vector icon matching Image 2 */}
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-brand">
            <div className="logo-chair-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" stroke="#1f1816" strokeWidth="8.5" strokeLinecap="square" strokeLinejoin="miter">
                <line x1="78" y1="8" x2="52" y2="60" />
                <line x1="26" y1="60" x2="64" y2="60" />
                <line x1="26" y1="60" x2="16" y2="92" />
                <line x1="64" y1="60" x2="72" y2="92" />
                <line x1="36" y1="72" x2="66" y2="72" />
              </svg>
            </div>
            <span className="logo-text">LUXE INTERIORS</span>
          </div>
        </div>

        {/* Center Search bar */}
        <div className="navbar-search">
          <SearchComponent />
        </div>

        {/* Right Action Icons Panel with Minimal Vector Icons */}
        <div className="nav-icons">
          {/* Admin Direct Access Icon */}
          {userRole === 'admin' && (
            <div className="nav-action-btn" onClick={() => navigate('/admin')} title="Admin Panel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="nav-icon-text">Admin</span>
            </div>
          )}

          {/* Account Profile Trigger */}
          <div className="profile-wrapper">
            <div className="nav-action-btn account-btn" onClick={handleProfileClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="nav-icon-text">{isLoggedIn ? 'Account' : 'Login'}</span>
            </div>

            {/* Profile Dropdown Menu */}
            {isLoggedIn && showProfileMenu && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  <div className="menu-avatar">
                    {getProfileInitials()}
                  </div>
                  <div className="menu-user-details">
                    <p className="menu-role-tag">{userRole === 'admin' ? 'Administrator' : 'Valued Customer'}</p>
                    <p className="menu-email-text">
                      {currentUser ? (currentUser.email || currentUser.name) : (userRole === 'admin' ? 'karthi' : 'customer@luxe.com')}
                    </p>
                  </div>
                </div>
                <div className="profile-dropdown-actions">
                  {userRole === 'admin' && (
                    <Link to="/admin" className="menu-action-link" onClick={() => setShowProfileMenu(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    className="menu-logout-btn" 
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger with Vector Shopping Bag Icon */}
          <div className="nav-action-btn cart-btn-wrapper" onClick={onCartClick}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </div>
            <span className="nav-icon-text">Cart</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM MENU ROW (Horizontally Scrollable on Mobile & Laptop) */}
      <div className="bottom-menu">
        <Link to="/" className="bottom-nav-link">Home</Link>
        <Link to="/modularkitchen" className="bottom-nav-link">Modular Kitchen</Link>
        <Link to="/bedroomcupboard" className="bottom-nav-link">Bedroom Cupboard</Link>
        <Link to="/wardrobes" className="bottom-nav-link">Wardrobes</Link>
        <Link to="/tvunit" className="bottom-nav-link">TV Unit</Link>
        <Link to="/poojacupboard" className="bottom-nav-link">Pooja Cupboard</Link>
        <Link to="/showcase" className="bottom-nav-link">Showcase</Link>
        <Link to="/woodendoors" className="bottom-nav-link">Wooden Doors</Link>
        <Link to="/furniture" className="bottom-nav-link">Furniture</Link>
        <Link to="/woodenwork" className="bottom-nav-link">Wooden Work</Link>
        <Link to="/homedecor" className="bottom-nav-link">Our Craftsmanship</Link>
        <Link to="/help" className="bottom-nav-link">Help Center</Link>
      </div>
    </nav>
  );
};

export default Navbar;