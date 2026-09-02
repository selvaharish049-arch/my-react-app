import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../utils/translations';
import './ProductModal.css';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Ananya Sharma',
    rating: 5,
    headline: 'Outstanding quality & craftsmanship!',
    text: 'The product arrived well packaged and free installation was completed on the same day. Highly recommended for modern living homes!',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Karthick Raja',
    rating: 5,
    headline: 'Worth every rupee! Excellent finish.',
    text: 'Extremely comfortable and sturdy solid wood construction. Delivered fast with tracking code.',
    verified: true
  }
];

const ProductModal = ({ product, onClose, addToCart, isLoggedIn, userRole, triggerLogin }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('luxe_lang') || 'en');

  // Customer Reviews state
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newHeadline, setNewHeadline] = useState('');
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const handleLangChange = () => {
      setCurrentLang(localStorage.getItem('luxe_lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    if (!product) return;
    try {
      const storedAll = localStorage.getItem('luxe_product_reviews');
      const allMap = storedAll ? JSON.parse(storedAll) : {};
      const pId = String(product.id);
      if (allMap[pId] && Array.isArray(allMap[pId])) {
        setReviews(allMap[pId]);
      } else {
        setReviews(DEFAULT_REVIEWS);
      }
    } catch (e) {
      setReviews(DEFAULT_REVIEWS);
    }
  }, [product]);

  const saveReviewsForProduct = (updatedList) => {
    setReviews(updatedList);
    try {
      const storedAll = localStorage.getItem('luxe_product_reviews');
      const allMap = storedAll ? JSON.parse(storedAll) : {};
      allMap[String(product.id)] = updatedList;
      localStorage.setItem('luxe_product_reviews', JSON.stringify(allMap));
    } catch (e) {
      console.error("Error saving review:", e);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("⚠️ Please sign in to your Luxe account first to write a review!");
      if (triggerLogin) triggerLogin();
      return;
    }
    if (!newHeadline.trim() || !newText.trim()) {
      alert("Please enter a headline and review text.");
      return;
    }
    
    let userName = 'Verified Customer';
    try {
      const customersStr = localStorage.getItem('luxe_customers');
      if (customersStr) {
        const customers = JSON.parse(customersStr);
        if (customers.length > 0) userName = customers[customers.length - 1].name;
      }
    } catch (err) {}

    const newRev = {
      id: 'rev-' + Date.now(),
      name: userName,
      rating: Number(newRating),
      headline: newHeadline.trim(),
      text: newText.trim(),
      verified: true
    };

    const updated = [newRev, ...reviews];
    saveReviewsForProduct(updated);
    setNewHeadline('');
    setNewText('');
    setNewRating(5);
    setShowReviewForm(false);
    alert("Thank you! Your review has been added.");
  };

  const handleDeleteReview = (revId) => {
    if (window.confirm("Are you sure you want to delete this customer review?")) {
      const updated = reviews.filter(r => r.id !== revId);
      saveReviewsForProduct(updated);
    }
  };

  if (!product) return null;

  const t = (key) => getTranslation(currentLang, key);

  // Price calculations
  const priceRaw = parseInt((product.price || '₹10,000').replace(/[₹,]/g, ''), 10) || 10000;
  let discountPercent = 26;
  if (product.discountPercent !== undefined && product.discountPercent !== null) {
    discountPercent = parseInt(product.discountPercent, 10) || 0;
  } else if (product.original) {
    const origClean = parseInt(product.original.replace(/[₹,]/g, ''), 10) || Math.round(priceRaw * 1.35);
    discountPercent = origClean > priceRaw ? Math.round(((origClean - priceRaw) / origClean) * 100) : 26;
  }
  const originalPriceRaw = product.original ? parseInt(product.original.replace(/[₹,]/g, ''), 10) : Math.round(priceRaw / (1 - Math.min(discountPercent, 90) / 100));

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
    onClose();
    navigate('/checkout', { state: { product, quantity } });
  };

  const renderStars = (rating = 4.8) => {
    return (
      <div className="amazon-stars-row">
        <span className="amazon-star-icons">★★★★★</span>
        <span className="amazon-rating-val">{rating}</span>
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
          <div className="reviews-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0 }}>{t('customerReviews')} ({reviews.length})</h2>
            <button 
              className="btn-write-review"
              onClick={() => {
                if (!isLoggedIn) {
                  alert("⚠️ Please sign in to write a review!");
                  if (triggerLogin) triggerLogin();
                } else {
                  setShowReviewForm(!showReviewForm);
                }
              }}
              style={{
                background: '#c98544',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              ✍️ Write a Customer Review
            </button>
          </div>

          {/* Write Customer Review Form */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="add-review-form-card" style={{ background: '#f9f6f0', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2d9cd' }}>
              <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px', color: '#3e322d' }}>Submit Your Product Review</h3>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>Rating:</label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Fair)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>Review Headline:</label>
                <input 
                  type="text" 
                  value={newHeadline} 
                  onChange={(e) => setNewHeadline(e.target.value)} 
                  placeholder="e.g. Superior wood quality and comfortable design!"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>Review Details:</label>
                <textarea 
                  value={newText} 
                  onChange={(e) => setNewText(e.target.value)} 
                  placeholder="Share your experience regarding material, delivery, and craftsmanship..."
                  rows="3"
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ background: '#3e322d', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Submit Review
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} style={{ background: '#e0e0e0', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="reviews-summary-grid">
            <div className="summary-left">
              <span className="big-rating">4.8</span>
              <span className="max-rating">out of 5</span>
              <p>{reviews.length} customer ratings</p>
              <div className="stars-bar-list">
                <div className="bar-row"><span>5 star</span><div className="bar-fill" style={{ width: '82%' }}></div><span>82%</span></div>
                <div className="bar-row"><span>4 star</span><div className="bar-fill" style={{ width: '12%' }}></div><span>12%</span></div>
                <div className="bar-row"><span>3 star</span><div className="bar-fill" style={{ width: '4%' }}></div><span>4%</span></div>
              </div>
            </div>

            <div className="reviews-cards-list">
              {reviews.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No customer reviews yet. Be the first to leave a review!</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="review-item-card" style={{ position: 'relative' }}>
                    {isLoggedIn && userRole === 'admin' && (
                      <button 
                        onClick={() => handleDeleteReview(rev.id)}
                        className="btn-delete-review-admin"
                        title="Delete Review (Admin Only)"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#ffebee',
                          color: '#c62828',
                          border: '1px solid #ffcdd2',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete Review
                      </button>
                    )}
                    <div className="reviewer-info">
                      <span className="avatar-circle">{(rev.name || 'C').charAt(0).toUpperCase()}</span>
                      <strong>{rev.name}</strong>
                      {rev.verified && <span className="verified-badge">✓ {t('verifiedPurchase')}</span>}
                    </div>
                    <div className="review-stars">
                      {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))} 
                      <strong className="review-headline" style={{ marginLeft: '8px' }}>{rev.headline}</strong>
                    </div>
                    <p className="review-text">{rev.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
