import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  { 
    title: 'Modern Minimalist Home', 
    category: 'SOFAS', 
    location: 'Mumbai, India', 
    img: img1, 
    path: '/product/explore-sofa' 
  },
  { 
    title: 'Warm Contemporary Villa', 
    category: 'BEDS', 
    location: 'Bangalore, India', 
    img: img2, 
    path: '/product/explore-bed' 
  },
  { 
    title: 'Luxury Bedroom Suite', 
    category: 'DINING', 
    location: 'Delhi, India', 
    img: img3, 
    path: '/product/explore-dining' 
  },
  { 
    title: 'Urban Chic Lounge', 
    category: 'TV UNITS', 
    location: 'Hyderabad, India', 
    img: img4, 
    path: '/product/explore-tvunit' 
  },
  { 
    title: 'Minimalist Coffee Table', 
    category: 'COFFEE TABLES', 
    location: 'Chennai, India', 
    img: img5, 
    path: '/product/explore-coffeetable' 
  },
  { 
    title: 'Royal Comfort Suite', 
    category: 'MATTRESSES', 
    location: 'Pune, India', 
    img: img6, 
    path: '/product/explore-mattress' 
  },
  { 
    title: 'Spacious Sliding Wardrobe', 
    category: 'WARDROBES', 
    location: 'Kolkata, India', 
    img: img7, 
    path: '/product/explore-wardrobe' 
  },
  { 
    title: 'Double Utility Sofa Bed', 
    category: 'SOFA CUM BEDS', 
    location: 'Ahmedabad, India', 
    img: img8, 
    path: '/product/explore-sofacumbed' 
  },
  { 
    title: 'Library Showcase Shelf', 
    category: 'BOOKSHELVES', 
    location: 'Jaipur, India', 
    img: img9, 
    path: '/product/explore-bookshelf' 
  },
  { 
    title: 'Ergonomic Study Workspace', 
    category: 'ALL STUDY', 
    location: 'Kochi, India', 
    img: img10, 
    path: '/product/explore-study' 
  },
];

const HomeDecor = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  // Swipe / Drag handling
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
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
  };

  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    dragEndX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    dragEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    processSwipe();
  };

  const processSwipe = () => {
    const diffX = dragStartX.current - dragEndX.current;
    const threshold = 50;
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
          <span className="decor-subtitle">OUR CRAFTSMANSHIP FOR HOME DECOR</span>
          <h2 className="decor-main-title">
            Spaces We<br />Are Proud Of
          </h2>
          <p className="decor-description">
            Every project is a reflection of our passion for design and attention to detail.
          </p>
        </div>

        {/* Right Slider Section */}
        <div className="decor-slider-section">
          
          {/* Top Navigation Controls */}
          <div className="decor-nav-controls">
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
            <div 
              className="decor-cards-track"
              ref={trackRef}
              style={{
                transform: `translateX(-${currentIndex * 310}px)`
              }}
            >
              {items.map((item, index) => (
                <div 
                  key={index}
                  className="decor-project-card"
                  onClick={() => navigate(item.path)}
                >
                  <div className="decor-card-image-box">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div className="decor-card-body">
                    <div className="decor-card-text">
                      <h3 className="decor-card-title">{item.title}</h3>
                      <p className="decor-card-location">{item.location}</p>
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