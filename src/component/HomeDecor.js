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
  { name: 'SOFAS', img: img1, path: '/product/explore-sofa', price: '₹25,000', deal: 'Best deal', quality: 'Bestseller' },
  { name: 'BEDS', img: img2, path: '/product/explore-bed', price: '₹45,000', deal: 'Royal comfort', quality: 'Top quality' },
  { name: 'DINING', img: img3, path: '/product/explore-dining', price: '₹45,000', deal: 'Solid wood', quality: 'Premium grade' },
  { name: 'TV UNITS', img: img4, path: '/product/explore-tvunit', price: '₹14,500', deal: 'Modern console', quality: 'Approved quality' },
  { name: 'COFFEE TABLES', img: img5, path: '/product/explore-coffeetable', price: '₹5,200', deal: 'Minimalist oak', quality: 'Best deal' },
  { name: 'MATTRESSES', img: img6, path: '/product/explore-mattress', price: '₹12,000', deal: 'Orthopedic foam', quality: 'Spine support' },
  { name: 'WARDROBES', img: img7, path: '/product/explore-wardrobe', price: '₹26,000', deal: 'Spacious sliding', quality: 'Best warranty' },
  { name: 'SOFA CUM BEDS', img: img8, path: '/product/explore-sofacumbed', price: '₹29,000', deal: 'Double utility', quality: 'Space saver' },
  { name: 'BOOKSHELVES', img: img9, path: '/product/explore-bookshelf', price: '₹9,800', deal: 'Library showcase', quality: 'Premium finish' },
  { name: 'ALL STUDY', img: img10, path: '/product/explore-study', price: '₹8,500', deal: 'Ergo desk', quality: 'Top choice' },
];

const HomeDecor = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(2); // Start highlighted on the 3rd item (Dining)
  const trackRef = useRef(null);
  
  // Refs for tracking drag/swipe coords
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const isDragging = useRef(false);



  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  const handleCardClick = (index, path) => {
    if (index === activeIndex) {
      navigate(path);
    } else {
      setActiveIndex(index);
    }
  };

  // Swipe Handlers for Touch and Mouse Dragging
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
    const threshold = 60; // minimum drag distance in pixels to count as swipe
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Dragged left -> show next slide
        setActiveIndex((prev) => (prev + 1) % items.length);
      } else {
        // Dragged right -> show prev slide
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    }
  };

  const cardWidth = 320; // Matches CSS width
  const gap = 30; // Matches CSS gap
  const trackTransform = `translateX(calc(50% - ${activeIndex * (cardWidth + gap) + cardWidth / 2}px))`;

  return (
    <div className="decor-grid-container">
      {/* Title Styled in "Our Services" Theme */}
      <div className="decor-grid-title">
        <h2>Our Craftsmanship For Home Decor</h2>
      </div>

      {/* Tabs Navigation (Category selection at the top) */}
      <div className="decor-tabs">
        {items.map((item, index) => (
          <button
            key={index}
            className={`decor-tab ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Testimonial Slider/Carousel Viewport with Swipe Events */}
      <div 
        className="decor-slider-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="decor-slider-track" 
          ref={trackRef}
          style={{ transform: trackTransform }}
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={index} 
                className={`decor-slider-card ${isActive ? 'active' : 'inactive'}`}
                onClick={() => handleCardClick(index, item.path)}
              >
                {/* Header detail block showing only product name */}
                <div className="decor-card-header">
                  <h4 className="decor-card-name">{item.name}</h4>
                </div>

                {/* Card Center: Product Image */}
                <div className="decor-card-image-wrapper">
                  <img src={item.img} alt={item.name} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot Indicators below the Slider */}
      <div className="decor-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`decor-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to category ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeDecor;