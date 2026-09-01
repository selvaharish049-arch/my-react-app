import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import { getTranslation } from '../utils/translations';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, userRole, currentUser, onLogout, onLoginClick, cartCount, onCartClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('luxe_lang') || 'en');
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setCurrentLang(newLang);
    localStorage.setItem('luxe_lang', newLang);
    window.dispatchEvent(new Event('languageChange'));
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
    if (userRole === 'admin') return 'K'; // Admin name is Karthi
    return 'C'; // Customer
  };

  const t = (key) => getTranslation(currentLang, key);

  return (
    <nav className="navbar" onMouseLeave={() => setShowProfileMenu(false)}>
      {/* 1. TOP BAR PANEL */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>{t('furniture')}</span> | <span>{t('homeInteriors')}</span> | <span>{t('bulkOrder')}</span>
        </div>
        <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📞 +91 6379183549</span> | 
          <Link to="/track" className="top-bar-link" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('trackOrder')}
          </Link> | 
          <span>{t('helpCenter')}</span> |
          
          {/* Multi-Language Selector Dropdown */}
          <div className="lang-select-box" style={{ marginLeft: '6px' }}>
            <span style={{ fontSize: '13px', marginRight: '4px' }}>🌐</span>
            <select 
              value={currentLang} 
              onChange={handleLanguageChange}
              className="lang-select-dropdown"
              style={{
                background: '#3e322d',
                color: '#ffffff',
                border: '1px solid #7a6e67',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '12px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="en">English (EN)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
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