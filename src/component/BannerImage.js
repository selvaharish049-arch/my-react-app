import React from 'react';
import './BannerImage.css';

// Import the single high-quality banner background image
import collectionBanner from '../assets/collection_banner_room.jpg';

const categoryNames = {
  // Navbar categories
  'modularkitchen': 'Modular Kitchen',
  'bedroomcupboard': 'Bedroom Cupboard',
  'wardrobes': 'Wardrobes',
  'wardrobe': 'Wardrobes',
  'tvunit': 'TV Unit',
  'poojacupboard': 'Pooja Cupboard',
  'showcase': 'Showcase',
  'woodendoors': 'Wooden Doors',
  'furniture': 'Home Furniture',
  'woodenwork': 'Wooden Work',

  // Explore categories
  'explore-sofa': 'Luxury Sofa',
  'explore-bed': 'Comfort Bed',
  'explore-dining': 'Elegant Dining',
  'explore-tvunit': 'TV Unit Console',
  'explore-coffeetable': 'Coffee Table',
  'explore-mattress': 'Cozy Mattress',
  'explore-wardrobe': 'Designer Wardrobe',
  'explore-sofacumbed': 'Sofa Cum Bed',
  'explore-bookshelf': 'Bookshelf Cabinet',
  'explore-study': 'Study Desk',
};

const BannerImage = ({ category }) => {
  const query = (category || '').trim().toLowerCase();
  const displayName = categoryNames[query] || 'Home Interior';

  return (
    <div className="category-banner-container">
      <img src={collectionBanner} alt="Collection Banner" className="category-banner-image" />
      <div className="category-banner-overlay">
        <p className="category-banner-shipping">Free shipping for all orders over ₹10,000</p>
        <h1 className="category-banner-title">Limited Edition {displayName} Design Collection</h1>
        <button 
          className="category-banner-shop-btn"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.85,
              behavior: 'smooth'
            });
          }}
        >
          Shop all
        </button>
      </div>
    </div>
  );
};

export default BannerImage;
