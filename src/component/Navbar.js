import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, userRole, currentUser, onLogout, onLoginClick, cartCount, onCartClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasOrderUpdate, setHasOrderUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkNotification = () => {
      // 1. NEVER show order update notification to Admin
      if (userRole === 'admin') {
        setHasOrderUpdate(false);
        return;
      }

      // 2. Only show if logged in as customer
      if (!isLoggedIn) {
        setHasOrderUpdate(false);
        return;
      }

      try {
        const stored = localStorage.getItem('luxe_has_order_update');
        if (!stored) {
          setHasOrderUpdate(false);
          return;
        }

        const updateObj = JSON.parse(stored);
        if (!updateObj) {
          setHasOrderUpdate(false);
          return;
        }

        const userStr = localStorage.getItem('luxe_user');
        if (!userStr) {
          setHasOrderUpdate(false);
          return;
        }

        const user = JSON.parse(userStr);
        if (!user || user.role === 'admin') {
          setHasOrderUpdate(false);
          return;
        }

        const custEmail = user.email ? user.email.toLowerCase().trim() : '';
        const custPhone = user.phone ? user.phone.trim() : '';

        // Match order ID in customer orders database
        const ordersStr = localStorage.getItem('luxe_customer_orders');
        if (ordersStr) {
          const orders = JSON.parse(ordersStr);
          const matchedOrder = orders.find(o => String(o.orderId) === String(updateObj.orderId));
          if (matchedOrder) {
            const ordEmail = matchedOrder.email ? matchedOrder.email.toLowerCase().trim() : '';
            const ordPhone = matchedOrder.phone ? matchedOrder.phone.trim() : '';
            
            // Show badge ONLY if this order belongs to the currently logged in customer
            if ((custEmail && ordEmail === custEmail) || (custPhone && ordPhone === custPhone)) {
              setHasOrderUpdate(true);
              return;
            }
          }
        }

        setHasOrderUpdate(false);
      } catch (e) {
        setHasOrderUpdate(false);
      }
    };

    checkNotification();
    window.addEventListener('orderStatusUpdated', checkNotification);
    return () => window.removeEventListener('orderStatusUpdated', checkNotification);
  }, [userRole, currentUser, isLoggedIn]);

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
        <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📞 +91 6379183549</span> | 
          
          {/* Permanent Link Name: Update Order (Notification ONLY for matching logged-in customer) */}
          <Link 
            to="/track" 
            className="top-bar-link" 
            onClick={() => {
              try { localStorage.removeItem('luxe_has_order_update'); } catch(e){}
              setHasOrderUpdate(false);
            }}
            style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Update Order Status & Tracking"
          >
            <span>Update Order</span>
            {hasOrderUpdate && userRole !== 'admin' && (
              <span 
                style={{ 
                  background: '#d32f2f', 
                  color: '#ffffff', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  padding: '2px 7px', 
                  borderRadius: '10px',
                  boxShadow: '0 0 8px rgba(211, 47, 47, 0.9)'
                }}
              >
                🔔 1
              </span>
            )}
          </Link> | 
          
          <span>Help Center</span>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW */}
      <div className="main-header">
        {/* Left Logo */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span className="logo-text">LUXE INTERIORS</span>
        </div>

        {/* Center Search bar */}
        <div className="navbar-search">
          <SearchComponent />
        </div>

        {/* Right Icons panel */}
        <div className="nav-icons">
          {/* Account Profile Trigger */}
          <div className="profile-wrapper" style={{ position: 'relative' }}>
            <div className="account-btn" onClick={handleProfileClick}>
              <span className="nav-icon-symbol">👤</span>
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
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <button 
                    className="menu-logout-btn" 
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <div className="cart-btn-wrapper" onClick={onCartClick}>
            <span className="nav-icon-symbol">👜</span>
            <span className="nav-icon-text">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM MENU ROW */}
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
        
        {/* Mobile-only menu items */}
        <Link to="/homedecor" className="bottom-nav-link mobile-only">Our Craftsmanship</Link>
        {!isLoggedIn && (
          <span className="bottom-nav-link mobile-only" onClick={onLoginClick} style={{ cursor: 'pointer' }}>
            Login
          </span>
        )}
        {isLoggedIn && userRole === 'admin' && (
          <Link to="/admin" className="bottom-nav-link mobile-only">
            Admin Panel
          </Link>
        )}
        {isLoggedIn && (
          <span className="bottom-nav-link mobile-only" onClick={onLogout} style={{ cursor: 'pointer', color: '#c53929' }}>
            Logout
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;