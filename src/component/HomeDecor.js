import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getStoredCraftsmanshipCategories, 
  getDeletedCraftsmanshipCategorySlugs,
  sanitizeImage
} from '../data/productsData';
import './HomeDecor.css';

import img1 from '../assets/d1.jpg';
import img2 from '../assets/d2.jpg';
import img3 from '../assets/d3.jpg';
import img4 from '../assets/d4.jpg';
import img5 from '../assets/d5.jpg';
import img6 from '../assets/d6.jpg';
import img7 from '../assets/d7.jpg';
import img8 from '../assets/d8.jpg';
import img9 from '../assets/d9.jpg';
import img10 from '../assets/d1.jpg';

const baseItems = [
  { id: 'explore-sofa', title: 'Sofa', img: img1, path: '/product/explore-sofa' },
  { id: 'explore-bed', title: 'Bed', img: img2, path: '/product/explore-bed' },
  { id: 'explore-dining', title: 'Dining', img: img3, path: '/product/explore-dining' },
  { id: 'explore-tvunit', title: 'TV Unit', img: img4, path: '/product/explore-tvunit' },
  { id: 'explore-coffeetable', title: 'Coffee Table', img: img5, path: '/product/explore-coffeetable' },
  { id: 'explore-mattress', title: 'Mattress', img: img6, path: '/product/explore-mattress' },
  { id: 'explore-wardrobe', title: 'Wardrobe', img: img7, path: '/product/explore-wardrobe' },
  { id: 'explore-sofacumbed', title: 'Sofa Cum Bed', img: img8, path: '/product/explore-sofacumbed' },
  { id: 'explore-bookshelf', title: 'Bookshelf', img: img9, path: '/product/explore-bookshelf' },
  { id: 'explore-study', title: 'Study', img: img10, path: '/product/explore-study' },
];

const HomeDecor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sliderItems, setSliderItems] = useState(baseItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepSize, setStepSize] = useState(310);
  const [searchFilter, setSearchFilter] = useState('');
  
  const trackRef = useRef(null);
  const viewportRef = useRef(null);

  const isStandalonePage = location.pathname === '/homedecor' || location.pathname === '/craftsmanship';

  // Swipe / Drag handling for homepage slider
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);
  const isTouchActive = useRef(false);

  const fetchProducts = async () => {
    try {
      const deletedSlugs = getDeletedCraftsmanshipCategorySlugs();

      // 1. Exactly 10 Base Craftsmanship Categories
      const categoryConfig = [
        { key: 'explore-sofa', label: 'Sofa', defaultImg: img1, path: '/product/explore-sofa' },
        { key: 'explore-bed', label: 'Bed', defaultImg: img2, path: '/product/explore-bed' },
        { key: 'explore-dining', label: 'Dining', defaultImg: img3, path: '/product/explore-dining' },
        { key: 'explore-tvunit', label: 'TV Unit', defaultImg: img4, path: '/product/explore-tvunit' },
        { key: 'explore-coffeetable', label: 'Coffee Table', defaultImg: img5, path: '/product/explore-coffeetable' },
        { key: 'explore-mattress', label: 'Mattress', defaultImg: img6, path: '/product/explore-mattress' },
        { key: 'explore-wardrobe', label: 'Wardrobe', defaultImg: img7, path: '/product/explore-wardrobe' },
        { key: 'explore-sofacumbed', label: 'Sofa Cum Bed', defaultImg: img8, path: '/product/explore-sofacumbed' },
        { key: 'explore-bookshelf', label: 'Bookshelf', defaultImg: img9, path: '/product/explore-bookshelf' },
        { key: 'explore-study', label: 'Study', defaultImg: img10, path: '/product/explore-study' }
      ];

      const baseMapped = categoryConfig
        .filter(cfg => !deletedSlugs.includes(cfg.key))
        .map(cfg => ({
          id: cfg.key,
          title: cfg.label,
          img: cfg.defaultImg,
          path: cfg.path,
          type: 'category'
        }));

      // 2. Custom categories added by Admin in Admin Panel (e.g. Chair, Recliners, Bar Counter, etc.)
      const customCats = getStoredCraftsmanshipCategories().filter(c => !deletedSlugs.includes(c.slug));
      const customMapped = customCats.map(c => ({
        id: c.id || c.slug,
        title: c.title,
        img: sanitizeImage(c.img),
        path: c.path || `/product/${c.slug}`,
        type: 'customCategory'
      }));

      // Combine base 10 + Admin custom categories ONLY (no individual product cards on category slider!)
      const combined = [...baseMapped, ...customMapped];

      setSliderItems(combined);
    } catch (err) {
      console.error("Failed to load Home Decor products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();

    window.addEventListener('craftsmanshipCategoryUpdated', fetchProducts);
    window.addEventListener('productUpdated', fetchProducts);
    window.addEventListener('productDataUpdated', fetchProducts);
    window.addEventListener('storage', fetchProducts);

    const handleResize = () => {
      if (viewportRef.current) {
        if (window.innerWidth <= 768) {
          setStepSize(viewportRef.current.clientWidth);
        } else {
          setStepSize(310);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('craftsmanshipCategoryUpdated', fetchProducts);
      window.removeEventListener('productUpdated', fetchProducts);
      window.removeEventListener('productDataUpdated', fetchProducts);
      window.removeEventListener('storage', fetchProducts);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliderItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    isTouchActive.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragEndX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    dragEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    processSwipe();
    setTimeout(() => {
      isTouchActive.current = false;
    }, 500);
  };

  const handleMouseDown = (e) => {
    if (isTouchActive.current) return;
    dragStartX.current = e.clientX;
    dragEndX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (isTouchActive.current || !isDragging.current) return;
    dragEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (isTouchActive.current || !isDragging.current) return;
    isDragging.current = false;
    processSwipe();
  };

  const processSwipe = () => {
    const diffX = dragStartX.current - dragEndX.current;
    const threshold = 40;
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const filteredItems = sliderItems.filter(item => 
    item.title.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  // If viewing on dedicated standalone page (/homedecor or /craftsmanship)
  if (isStandalonePage) {
    return (
      <div className="decor-standalone-page">
        {/* Top Breadcrumb & Page Banner */}
        <div className="decor-page-header">
          <div className="decor-page-header-container">
            <span className="decor-page-breadcrumb">HOME &nbsp;/&nbsp; OUR CRAFTSMANSHIP &nbsp;/&nbsp; HOME DECOR</span>
            <h1 className="decor-page-main-title">Home Decor & Craftsmanship Collections</h1>
            <p className="decor-page-subtitle">
              Explore all our bespoke furniture ranges, handcrafted interiors, and specialized decor collections.
            </p>
            <div className="decor-page-meta">
              <span className="decor-count-badge">✨ {sliderItems.length} Collections Available</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="decor-toolbar-container">
          <div className="decor-search-wrapper">
            <svg className="decor-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search collections (Sofa, Bed, Dining...)..." 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="decor-search-input"
            />
            {searchFilter && (
              <button className="decor-search-clear" onClick={() => setSearchFilter('')}>×</button>
            )}
          </div>
        </div>

        {/* All Products Grid View */}
        <div className="decor-page-grid-container">
          {filteredItems.length === 0 ? (
            <div className="decor-empty-state">
              <p>No collections found matching "{searchFilter}".</p>
              <button className="decor-view-all-btn" onClick={() => setSearchFilter('')}>Show All Collections</button>
            </div>
          ) : (
            <div className="decor-grid-view">
              {filteredItems.map((item, index) => (
                <div 
                  key={index}
                  className="decor-project-card decor-grid-card"
                  onClick={() => navigate(item.path)}
                >
                  <div className="decor-card-image-box">
                    <img src={item.img} alt={item.title || 'Product'} />
                    {item.price && (
                      <span className="decor-card-price-tag">{item.price}</span>
                    )}
                  </div>
                  <div className="decor-card-body">
                    <div className="decor-card-text">
                      <h3 className="decor-card-title">{item.title}</h3>
                    </div>
                    <span className="decor-card-arrow">&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise, render embedded section on Homepage
  return (
    <section className="decor-projects-section">
      <div className="decor-projects-container">
        
        {/* Left Info Panel */}
        <div className="decor-info-panel">
          <div className="decor-header-row">
            <div className="decor-title-group">
              <span className="decor-subtitle">OUR CRAFTSMANSHIP FOR HOME DECOR</span>
              <h2 className="decor-main-title">
                Spaces We<br className="decor-br-desktop" /> Are Proud Of
              </h2>
            </div>
          </div>

          <p className="decor-description">
            Every project is a reflection of our passion for design and attention to detail.
          </p>

          <button 
            type="button"
            className="decor-view-all-btn"
            onClick={() => navigate('/homedecor')}
          >
            VIEW ALL COLLECTIONS ({sliderItems.length}) &rarr;
          </button>
        </div>

        {/* Right Slider Section */}
        <div className="decor-slider-section">

          <div 
            className="decor-cards-viewport"
            ref={viewportRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >

            <div 
              className="decor-cards-track"
              ref={trackRef}
              style={{
                transform: `translateX(-${currentIndex * stepSize}px)`
              }}
            >
              {sliderItems.map((item, index) => (
                <div 
                  key={index}
                  className="decor-project-card"
                  onClick={() => navigate(item.path)}
                >
                  <div className="decor-card-image-box">
                    <img src={item.img} alt={item.title || 'Product'} />
                    {item.price && (
                      <span className="decor-card-price-tag">{item.price}</span>
                    )}
                  </div>
                  <div className="decor-card-body">
                    <div className="decor-card-text">
                      <h3 className="decor-card-title">{item.title}</h3>
                    </div>
                    <span className="decor-card-arrow">&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HomeDecor;