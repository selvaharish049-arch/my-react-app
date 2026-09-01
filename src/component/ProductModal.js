import React, { useState, useEffect } from 'react';
import { getTranslation } from '../utils/translations';
import './ProductModal.css';

const ProductModal = ({ product, onClose, addToCart, isLoggedIn, triggerLogin }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('luxe_lang') || 'en');
  const [selectedPincode, setSelectedPincode] = useState('600001');
  const [showPincodeInput, setShowPincodeInput] = useState(false);

  useEffect(() => {
    const handleLangChange = () => {
      setCurrentLang(localStorage.getItem('luxe_lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  if (!product) return null;

  const t = (key) => getTranslation(currentLang, key);

  // Price calculations
  const priceRaw = parseInt((product.price || '₹10,000').replace(/[₹,]/g, ''), 10) || 10000;
  const originalPriceRaw = Math.round(priceRaw * 1.35);
  const discountPercent = Math.round(((originalPriceRaw - priceRaw) / originalPriceRaw) * 100);
  const emiAmount = Math.round(priceRaw / 12);

  // Multiple image thumbnails generator for gallery
  const productImages = [
    product.img,
    product.img, // gallery view
    product.img
  ];

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("⚠️ Access Restricted: Please sign in to your Luxe account first before adding items to cart.");
      if (triggerLogin) triggerLogin();
      onClose();
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img
      });
    }
    onClose();
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert("⚠️ Access Restricted: Please sign in to your Luxe account first to buy products.");
      if (triggerLogin) triggerLogin();
      onClose();
      return;
    }

    const totalAmount = priceRaw * quantity;
    const message = `*LUXE INTERIOR - AMAZON EXPRESS BUY NOW*
----------------------------------------
*Product Details:*
🛍️ *Item:* ${product.name}
📦 *Category:* ${(product.category || '').toUpperCase()}
🔢 *Quantity:* ${quantity}
💰 *Price:* ${product.price}
💵 *Grand Total:* ₹${totalAmount.toLocaleString()}
📍 *Delivery Pincode:* ${selectedPincode}
----------------------------------------
Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/916379183549?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating = 4.8) => {
    return (
      <div className="amazon-stars-row">
        <span className="amazon-star-icons">★★★★★</span>
        <span className="amazon-rating-val">{rating}</span>
        <span className="amazon-reviews-count">1,420 ratings | 500+ bought in past month</span>
      </div>
    );
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-container amazon-modal-layout" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose}>&times;</button>
        
        {/* Amazon Header Ribbon */}
        <div className="amazon-modal-top-ribbon">
          <span className="bestseller-badge">#1 Best Seller</span>
          <span className="bestseller-cat">in {product.category ? product.category.toUpperCase() : 'HOME INTERIORS'}</span>
        </div>

        <div className="amazon-product-grid">
          
          {/* Left Column: Gallery Thumbnails & Main Image */}
          <div className="amazon-media-column">
            <div className="amazon-thumbnails-list">
              {productImages.map((imgSrc, idx) => (
                <img 
                  key={idx} 
                  src={imgSrc} 
                  alt="Thumbnail" 
                  className={`amazon-thumb-img ${activeImgIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImgIndex(idx)}
                />
              ))}
            </div>
            <div className="amazon-main-image-box">
              <img src={productImages[activeImgIndex]} alt={product.name} className="amazon-main-img" />
              <span className="amazon-zoom-hover-tag">🔍 Touch to expand view</span>
            </div>
          </div>

          {/* Center Column: Product Specifications & Details */}
          <div className="amazon-details-column">
            <h1 className="amazon-product-title">{product.name}</h1>
            <p className="amazon-brand-link">Visit the Luxe Interiors Store</p>
            
            {renderStars(product.rating)}
            
            <div className="amazon-divider-line"></div>

            {/* Amazon Price Block */}
            <div className="amazon-price-box">
              <div className="price-main-row">
                <span className="discount-tag">-{discountPercent}%</span>
                <span className="currency-symbol">₹</span>
                <span className="current-price-num">{priceRaw.toLocaleString()}</span>
              </div>
              <div className="mrp-row">
                <span>M.R.P.: <del>₹{originalPriceRaw.toLocaleString()}</del></span>
              </div>
              <p className="taxes-note">Inclusive of all taxes</p>
              <div className="emi-note-card">
                <strong>EMI</strong> starts at ₹{emiAmount.toLocaleString()}/month. <span className="link-text">No Cost EMI available</span>
              </div>
            </div>

            {/* Special Offers Box */}
            <div className="amazon-offers-container">
              <div className="offer-card">
                <span className="offer-icon">💳</span>
                <strong>Bank Offer</strong>
                <p>Upto ₹1,500 Discount on HDFC/SBI Credit Cards</p>
              </div>
              <div className="offer-card">
                <span className="offer-icon">🚚</span>
                <strong>Free Delivery</strong>
                <p>Free installation by Luxe Experts on delivery</p>
              </div>
              <div className="offer-card">
                <span className="offer-icon">🛡️</span>
                <strong>Warranty</strong>
                <p>3 Years Brand Warranty included</p>
              </div>
            </div>

            <div className="amazon-divider-line"></div>

            {/* Product Specifications Table */}
            <div className="amazon-specs-section">
              <h3>{t('specifications')}</h3>
              <table className="amazon-specs-table">
                <tbody>
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td className="spec-label">{key}</td>
                        <td className="spec-val">{val}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td className="spec-label">Brand</td>
                        <td className="spec-val">Luxe Interiors</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Material</td>
                        <td className="spec-val">Solid Teak Wood & Premium Upholstery</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Assembly Required</td>
                        <td className="spec-val">No (Free installation on delivery)</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="amazon-about-item">
              <h3>About this item</h3>
              <ul>
                <li>{product.description || "Premium designer furniture engineered for modern comfort, durability, and luxury aesthetics."}</li>
                <li>Made with high-density polyurethane foam and kiln-dried solid hardwood frame.</li>
                <li>Includes scratch-resistant coating and fade-resistant fabric finish.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Amazon Buying Box */}
          <div className="amazon-buybox-column">
            <div className="buybox-card">
              
              <div className="buybox-price-row">
                <span className="currency">₹</span>
                <span className="buybox-price">{priceRaw.toLocaleString()}</span>
              </div>

              <div className="buybox-delivery">
                <span className="free-tag">{t('freeDelivery')}</span> <strong>Tomorrow</strong>. Order within 4 hrs 20 mins.
              </div>

              <div className="buybox-pincode-row">
                <span className="pin-icon">📍</span>
                <span>Deliver to Chennai {selectedPincode}</span>
                <button 
                  className="change-pin-btn" 
                  onClick={() => setShowPincodeInput(!showPincodeInput)}
                >
                  Update
                </button>
              </div>

              {showPincodeInput && (
                <div className="pincode-input-box">
                  <input 
                    type="text" 
                    value={selectedPincode} 
                    onChange={(e) => setSelectedPincode(e.target.value)}
                    maxLength={6}
                  />
                  <button onClick={() => setShowPincodeInput(false)}>Apply</button>
                </div>
              )}

              <div className="buybox-stock-status">
                <span className="stock-green">{t('inStock')}</span>
              </div>

              <div className="buybox-qty-row">
                <label>Quantity:</label>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="qty-dropdown"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Amazon CTAs */}
              <button className="amazon-btn-add-cart" onClick={handleAddToCart}>
                🛒 {t('addToCart')}
              </button>

              <button className="amazon-btn-buy-now" onClick={handleBuyNow}>
                ⚡ {t('buyNow')}
              </button>

              <div className="buybox-seller-info">
                <div className="seller-row">
                  <span>Ships from</span>
                  <strong>Luxe Interior Direct</strong>
                </div>
                <div className="seller-row">
                  <span>Sold by</span>
                  <strong>Luxe Craftsmans Studio</strong>
                </div>
                <div className="seller-row">
                  <span>Payment</span>
                  <strong>Secure Transaction</strong>
                </div>
              </div>

              <div className="buybox-guarantees">
                <span>🔒 100% Purchase Protection</span>
              </div>

            </div>
          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="amazon-reviews-container">
          <h2>{t('customerReviews')}</h2>
          <div className="reviews-summary-grid">
            <div className="summary-left">
              <span className="big-rating">4.8</span>
              <span className="max-rating">out of 5</span>
              <p>1,420 global ratings</p>
              <div className="stars-bar-list">
                <div className="bar-row"><span>5 star</span><div className="bar-fill" style={{ width: '82%' }}></div><span>82%</span></div>
                <div className="bar-row"><span>4 star</span><div className="bar-fill" style={{ width: '12%' }}></div><span>12%</span></div>
                <div className="bar-row"><span>3 star</span><div className="bar-fill" style={{ width: '4%' }}></div><span>4%</span></div>
              </div>
            </div>

            <div className="reviews-cards-list">
              <div className="review-item-card">
                <div className="reviewer-info">
                  <span className="avatar-circle">A</span>
                  <strong>Ananya Sharma</strong>
                  <span className="verified-badge">✓ {t('verifiedPurchase')}</span>
                </div>
                <div className="review-stars">★★★★★ <strong className="review-headline">Outstanding quality & craftsmanship!</strong></div>
                <p className="review-text">The product arrived well packaged and free installation was completed on the same day. Highly recommended for modern living homes!</p>
              </div>

              <div className="review-item-card">
                <div className="reviewer-info">
                  <span className="avatar-circle">K</span>
                  <strong>Karthick Raja</strong>
                  <span className="verified-badge">✓ {t('verifiedPurchase')}</span>
                </div>
                <div className="review-stars">★★★★★ <strong className="review-headline">Worth every rupee! Excellent finish.</strong></div>
                <p className="review-text">Extremely comfortable and sturdy solid wood construction. Delivered fast with tracking code.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
