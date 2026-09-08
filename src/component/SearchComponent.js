import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../data/productsData';
import { getTranslation } from '../utils/translations';
import './SearchComponent.css';

const SearchComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('luxe_lang') || 'en');
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    const handleLangChange = () => {
      setCurrentLang(localStorage.getItem('luxe_lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, [isOpen]);

  const loadProducts = async () => {
    const list = await getAllProducts();
    setAllProducts(list);
  };

  const getSuggestions = () => {
    if (!searchInput.trim()) return [];
    const term = searchInput.toLowerCase();
    
    return allProducts.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.category.toLowerCase().includes(term)
    ).slice(0, 6);
  };

  const handleSuggestionClick = (item) => {
    setSearchInput('');
    setIsOpen(false);
    navigate(`/product/${item.name}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchInput.trim().toLowerCase();
    if (!term) return;

    setIsOpen(false);
    setSearchInput('');
    
    if (term === 'kitchen' || term === 'modular kitchen') {
      navigate('/modularkitchen');
    } else {
      navigate(`/product/${term}`);
    }
  };

  const suggestions = getSuggestions();
  const t = (key) => getTranslation(currentLang, key);

  return (
    <div className="search-component-wrapper">
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')} 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsOpen(true)} 
            onBlur={() => setTimeout(() => setIsOpen(false), 250)}
          />
          <button type="submit" className="search-go-btn">{t('searchBtn')}</button>
        </form>

        {isOpen && searchInput.trim() !== '' && (
          <div className="dropdown-menu">
            {/* Suggestions list */}
            <div className="suggestions-section">
              <h4 className="menu-title">Product Matches</h4>
              {suggestions.length === 0 ? (
                <p className="empty-msg">No products matching "{searchInput}"</p>
              ) : (
                <div className="suggestions-list">
                  {suggestions.map((item) => (
                    <div 
                      key={item.id} 
                      className="suggestion-item" 
                      onMouseDown={() => handleSuggestionClick(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={item.img} alt={item.name} className="suggestion-thumb" />
                      <div className="suggestion-info">
                        <span className="suggestion-name">{item.name}</span>
                        <span className="suggestion-price">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;