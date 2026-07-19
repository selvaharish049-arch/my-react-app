import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, userRole, currentUser, onLogout, onLoginClick, cartCount, onCartClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

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
    if (userRole === 'admin') return 'K'; // Admin name is Karthi
    return 'C'; // Customer
  };

  return (
    <nav className="navbar" onMouseLeave={() => setShowProfileMenu(false)}>
      {/* 1. TOP BAR PANEL */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>Furniture</span> | <span>Home Interiors</span> | <span>Bulk Order</span>
        </div>
        <div className="top-bar-right">
          <span>📞 +91 6379183549</span> | <span>Track Order</span> | <span>Help Center</span>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW (Logo left, Search center, Actions right) */}
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
                    🚪 Logout
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

      {/* 3. BOTTOM MENU ROW (Horizontal link categories list) */}
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
      </div>
    </nav>
  );
};

export default Navbar;