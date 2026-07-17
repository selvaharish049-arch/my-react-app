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
      {/* Top Bar */}
      <div className="top-bar">
        <div className="left-links">
          <span>Furniture</span> | <span>Home Interiors</span> | <span>Bulk Order</span>
        </div>
        <div className="right-links">
          <span>📞 +91 6379183549</span> | <span>Track Order</span> | <span>Help Center</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>LUXE INTERIOR</div>

        <div className="navbar-search">
          <SearchComponent />
        </div>

        <div className="nav-icons">
          {/* Cart Trigger */}
          <div className="cart-container" onClick={onCartClick} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
            <span>🛒 Cart</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>

          {/* Dynamic Profile/Login Dropdown */}
          <div className="profile-wrapper" style={{ position: 'relative' }}>
            {isLoggedIn ? (
              <div className="logged-in-profile-trigger" onClick={handleProfileClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <div className="profile-avatar-circle">
                  {getProfileInitials()}
                </div>
                <span>Profile ▼</span>
              </div>
            ) : (
              <span className="login-trigger" onClick={onLoginClick} style={{ cursor: 'pointer' }}>Login</span>
            )}

            {/* Profile Dropdown Menu */}
            {isLoggedIn && showProfileMenu && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  <div className="menu-avatar">
                    {getProfileInitials()}
                  </div>
                  <div className="menu-user-details">
                    <p className="menu-role-tag">{userRole === 'admin' ? 'Administrator' : 'Valued Customer'}</p>
                    <p className="menu-email-text">{currentUser ? (currentUser.email || currentUser.name) : (userRole === 'admin' ? 'karthi' : 'customer@luxe.com')}</p>
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
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="bottom-menu">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/modularkitchen" className="nav-link">Modular Kitchen</Link>
        <Link to="/bedroomcupboard" className="nav-link">Bedroom Cupboard</Link>
        <Link to="/wardrobes" className="nav-link">Wardrobes</Link>
        <Link to="/tvunit" className="nav-link">TV Unit</Link>
        <Link to="/poojacupboard" className="nav-link">Pooja Cupboard</Link>
        <Link to="/showcase" className="nav-link">Showcase</Link>
        <Link to="/woodendoors" className="nav-link">Wooden Doors</Link>
        <Link to="/furniture" className="nav-link">Furniture</Link>
        <Link to="/woodenwork" className="nav-link">Wooden Work</Link>
      </div>
    </nav>
  );
};

export default Navbar;