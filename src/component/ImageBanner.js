import React from 'react';
import './ImageBanner.css';

// Default banner background images from assets
import defaultProductBanner from '../assets/collection_banner_room.jpg';
import sofaBanner from '../assets/collection_sofa.jpg';
import diningBanner from '../assets/collection_dining.jpg';
import homeBannerImg from '../assets/cc1.jpg';
import craftBannerImg from '../assets/testimonial_living_room.jpg';
import portfolioBannerImg from '../assets/portfolio_penthouse.jpg';

// Category mapping to human-readable names and dedicated images
const categoryMap = {
  'modularkitchen': { name: 'Modular Kitchen', img: defaultProductBanner },
  'bedroomcupboard': { name: 'Bedroom Cupboard', img: defaultProductBanner },
  'wardrobes': { name: 'Wardrobes', img: defaultProductBanner },
  'wardrobe': { name: 'Wardrobes', img: defaultProductBanner },
  'tvunit': { name: 'TV Unit', img: defaultProductBanner },
  'poojacupboard': { name: 'Pooja Cupboard', img: defaultProductBanner },
  'showcase': { name: 'Showcase', img: defaultProductBanner },
  'woodendoors': { name: 'Wooden Doors', img: defaultProductBanner },
  'furniture': { name: 'Home Furniture', img: defaultProductBanner },
  'woodenwork': { name: 'Wooden Work', img: defaultProductBanner },

  'explore-sofa': { name: 'Luxury Sofa', img: sofaBanner },
  'sofa': { name: 'Luxury Sofa', img: sofaBanner },
  'explore-bed': { name: 'Comfort Bed', img: defaultProductBanner },
  'bed': { name: 'Comfort Bed', img: defaultProductBanner },
  'explore-dining': { name: 'Elegant Dining', img: diningBanner },
  'dining': { name: 'Elegant Dining', img: diningBanner },
  'explore-tvunit': { name: 'TV Unit Console', img: defaultProductBanner },
  'explore-coffeetable': { name: 'Coffee Table', img: defaultProductBanner },
  'coffeetable': { name: 'Coffee Table', img: defaultProductBanner },
  'explore-mattress': { name: 'Cozy Mattress', img: defaultProductBanner },
  'mattress': { name: 'Cozy Mattress', img: defaultProductBanner },
  'explore-wardrobe': { name: 'Designer Wardrobe', img: defaultProductBanner },
  'explore-sofacumbed': { name: 'Sofa Cum Bed', img: defaultProductBanner },
  'sofacumbed': { name: 'Sofa Cum Bed', img: defaultProductBanner },
  'explore-bookshelf': { name: 'Bookshelf Cabinet', img: defaultProductBanner },
  'bookshelf': { name: 'Bookshelf Cabinet', img: defaultProductBanner },
  'explore-study': { name: 'Study Desk', img: defaultProductBanner },
  'study': { name: 'Study Desk', img: defaultProductBanner }
};

/**
 * ImageBanner Component
 * Handles Product Banners, Home Banners, Craftsmanship Banners, and Portfolio Banners.
 */
const ImageBanner = ({
  type = 'product',
  category,
  title,
  subtitle,
  description,
  image,
  buttonText,
  onButtonClick,
  align = 'center',
  className = ''
}) => {
  const query = (category || '').trim().toLowerCase();
  const matchedCat = categoryMap[query];

  // Resolve defaults based on banner type
  let bannerImg = image || (matchedCat && matchedCat.img) || defaultProductBanner;
  let tagText = subtitle;
  let mainTitle = title;
  let descText = description;
  let btnLabel = buttonText;

  if (type === 'home') {
    bannerImg = image || homeBannerImg;
    tagText = tagText || 'ELEVATED LIVING SPACES';
    mainTitle = mainTitle || 'Crafted Interiors For Modern Living';
    descText = descText || 'Customized premium home interiors made for modern living and timeless comfort.';
    btnLabel = btnLabel || 'Explore Collections';
  } else if (type === 'craftsmanship') {
    bannerImg = image || craftBannerImg;
    tagText = tagText || 'OUR CRAFTSMANSHIP FOR HOME DECOR';
    mainTitle = mainTitle || 'Spaces We Are Proud Of';
    descText = descText || 'Every project is a reflection of our passion for design and attention to detail.';
    btnLabel = btnLabel || 'View Crafts';
  } else if (type === 'portfolio') {
    bannerImg = image || portfolioBannerImg;
    tagText = tagText || 'CURATED INTERIOR PORTFOLIO';
    mainTitle = mainTitle || 'Exquisite Architectural & Interior Masterpieces';
    descText = descText || 'Browse our signature completed projects across modern apartments, luxury penthouses, and elegant villas.';
    btnLabel = btnLabel || 'Explore Projects';
  } else {
    // Product banner default
    const catName = matchedCat ? matchedCat.name : (category ? category.toUpperCase() : 'Home Interior');
    tagText = tagText || 'Free shipping for all orders over ₹10,000';
    mainTitle = mainTitle || `Limited Edition ${catName} Design Collection`;
    btnLabel = btnLabel || 'Shop all';
  }

  const handleBtnClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.75,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`img-banner-container img-banner-type-${type} img-banner-align-${align} ${className}`}>
      <img src={bannerImg} alt={mainTitle || 'Banner'} className="img-banner-bg" />
      <div className="img-banner-overlay">
        <div className="img-banner-content">
          {tagText && <span className="img-banner-tag">{tagText}</span>}
          {mainTitle && <h1 className="img-banner-title">{mainTitle}</h1>}
          {descText && <p className="img-banner-description">{descText}</p>}
          {btnLabel && (
            <button className="img-banner-btn" onClick={handleBtnClick}>
              {btnLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageBanner;
