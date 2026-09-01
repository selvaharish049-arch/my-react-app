import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../data/productsData';
import './HomeDecor.css';

// Import images
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

const items = [
  { title: 'Sofa', img: img1, path: '/product/explore-sofa' },
  { title: 'Bed', img: img2, path: '/product/explore-bed' },
  { title: 'Dining', img: img3, path: '/product/explore-dining' },
  { title: 'TV Unit', img: img4, path: '/product/explore-tvunit' },
  { title: 'Coffee Table', img: img5, path: '/product/explore-coffeetable' },
  { title: 'Mattress', img: img6, path: '/product/explore-mattress' },
  { title: 'Wardrobe', img: img7, path: '/product/explore-wardrobe' },
  { title: 'Sofa Cum Bed', img: img8, path: '/product/explore-sofacumbed' },
  { title: 'Bookshelf', img: img9, path: '/product/explore-bookshelf' },
  { title: 'Study', img: img10, path: '/product/explore-study' },
];

const HomeDecor = () => {
  const navigate = useNavigate();
  const [sliderItems, setSliderItems] = useState(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepSize, setStepSize] = useState(310);
  const trackRef = useRef(null);

  // Swipe / Drag handling
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);
  const isTouchActive = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        
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

        const mappedItems = categoryConfig.map(cfg => {
          const matchingProducts = allProducts.filter(p => p.category === cfg.key);
          
          // Check for custom products first (newly added by admin)
          const customProd = matchingProducts.find(p => String(p.id).startsWith('custom-'));
          
          if (customProd) {
            return {
              title: cfg.label,
              img: cfg.defaultImg,
              path: cfg.path
            };
          } else if (matchingProducts.length > 0) {
            return {
              title: cfg.label,
              img: cfg.defaultImg,
              path: cfg.path
            };
          }

          return {
            title: cfg.label,
            img: cfg.defaultImg,
            path: cfg.path
          };
        });

        setSliderItems(mappedItems);
      } catch (err) {
        console.error("Failed to load dynamic Home Decor slider items:", err);
      }
    };

    fetchProducts();

    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setStepSize(260);
      } else {
        setStepSize(310);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    const threshold = 70;
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

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

            {/* Mobile Top Navigation Controls */}
            <div className="decor-nav-controls decor-nav-controls-mobile">
              <button className="decor-nav-btn" onClick={handlePrev} aria-label="Previous Slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="decor-nav-btn" onClick={handleNext} aria-label="Next Slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <p className="decor-description">
            Every project is a reflection of our passion for design and attention to detail.
          </p>
        </div>

        {/* Right Slider Section */}
        <div className="decor-slider-section">
          
          {/* Desktop Top Navigation Controls */}
          <div className="decor-nav-controls decor-nav-controls-desktop">
            <button className="decor-nav-btn" onClick={handlePrev} aria-label="Previous Slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="decor-nav-btn" onClick={handleNext} aria-label="Next Slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Cards Track Container */}
          <div 
            className="decor-cards-viewport"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Overlay Navigation Arrows for Mobile View */}
            <button 
              className="decor-overlay-arrow decor-overlay-arrow-left" 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button 
              className="decor-overlay-arrow decor-overlay-arrow-right" 
              onClick={(e) => { e.stopPropagation(); handleNext(); }} 
              aria-label="Next Slide"
            >
              ›
            </button>

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