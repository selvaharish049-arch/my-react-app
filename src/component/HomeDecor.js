import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getStoredCraftsmanshipCategories, getDeletedCraftsmanshipCategorySlugs } from '../data/productsData';
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
  const viewportRef = useRef(null);

  // Swipe / Drag handling
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);
  const isTouchActive = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getAllProducts();
        
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

        const deletedSlugs = getDeletedCraftsmanshipCategorySlugs();

        const baseMapped = categoryConfig
          .filter(cfg => !deletedSlugs.includes(cfg.key))
          .map(cfg => {
            return {
              title: cfg.label,
              img: cfg.defaultImg,
              path: cfg.path
            };
          });

        const customCats = getStoredCraftsmanshipCategories().filter(c => !deletedSlugs.includes(c.slug));
        const customMapped = customCats.map(c => ({
          title: c.title,
          img: c.img,
          path: c.path || `/product/${c.slug}`
        }));

        setSliderItems([...baseMapped, ...customMapped]);
      } catch (err) {
        console.error("Failed to load dynamic Home Decor slider items:", err);
      }
    };

    fetchProducts();
    window.addEventListener('craftsmanshipCategoryUpdated', fetchProducts);

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
            onClick={() => navigate('/furniture')}
          >
            VIEW ALL COLLECTIONS &rarr;
          </button>
        </div>

        {/* Right Slider Section */}
        <div className="decor-slider-section">

          {/* Cards Track Container */}
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