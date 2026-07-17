import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../data/productsData';
import './SearchComponent.css';

const SearchComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [isOpen]); // Reload products list whenever search box opens

  const loadProducts = async () => {
    const list = await getAllProducts();
    setAllProducts(list);
  };

  const trendingCategories = [
    "sofa", "table", "coffeetable", "curtain", 
    "mattress", "dining", "lamp", "pillow", "modularkitchen"
  ];

  const trendingLabels = {
    "sofa": "Sofa Sets",
    "table": "Study & Dining Tables",
    "coffeetable": "Coffee Tables",
    "curtain": "Curtains",
    "mattress": "Mattresses",
    "dining": "Dining Sets",
    "lamp": "Designer Lights",
    "pillow": "Pillows",
    "modularkitchen": "Modular Kitchen"
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

  const handleCategoryClick = (category) => {
    setSearchInput('');
    setIsOpen(false);
    if (category === 'modularkitchen') {
      navigate('/modularkitchen');
    } else {
      navigate(`/product/${category}`);
    }
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

  return (
    <div className="search-component-wrapper">
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search Products, categories & more..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsOpen(true)} 
            onBlur={() => setTimeout(() => setIsOpen(false), 250)}
          />
          <button type="submit" className="search-go-btn">🔍</button>
        </form>

        {isOpen && (
          <div className="dropdown-menu">
            {/* Suggestions list */}
            {searchInput.trim() !== '' && (
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
            )}

            {/* Trending categories */}
            <div className="trending-section">
              <h4 className="menu-title">Trending Categories</h4>
              <div className="trending-grid">
                {trendingCategories.map((cat) => (
                  <button 
                    key={cat} 
                    type="button"
                    className="pill-btn" 
                    onMouseDown={() => handleCategoryClick(cat)}
                  >
                    {trendingLabels[cat] || cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;