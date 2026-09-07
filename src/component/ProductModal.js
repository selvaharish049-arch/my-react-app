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
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('luxe_lang') || 'en');

  // Customer Reviews state
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newHeadline, setNewHeadline] = useState('');
  const [newText, setNewText] = useState('');

  // Lightbox Modal state for expanded view
  const [showLightbox, setShowLightbox] = useState(false);

  // Book a Consultation Modal State
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [modalOrderId, setModalOrderId] = useState('');
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    panNumber: '',
    address: '',
    paymentMode: 'Cash on Delivery',
    quantity: 1,
    notes: ''
  });

  const handleOpenConsultModal = () => {
    setModalOrderId('CON-' + Math.floor(1000 + Math.random() * 9000));
    setShowConsultModal(true);
  };

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

  const productImages = (product && product.images && product.images.length > 0)
    ? product.images
    : [product?.img, product?.img, product?.img];

  // Keyboard Arrow Keys (Left & Right) and Escape Key navigation for Lightbox Pop-up
  useEffect(() => {
    if (!showLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveImgIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setShowLightbox(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, productImages.length]);

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

  const handleCustomizeClick = () => {
    onClose();
    navigate('/checkout', { state: { product, action: 'customize' } });
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!consultForm.name.trim() || !consultForm.phone.trim() || !consultForm.whatsappNumber.trim() || !consultForm.address.trim()) {
      alert("Please fill in your Full Name, Phone Number, WhatsApp Number, and Delivery Address!");
      return;
    }

    const trackingCode = modalOrderId || ('CON-' + Math.floor(1000 + Math.random() * 9000));
    const priceNum = parseInt((product.price || '₹0').replace(/[₹,]/g, '')) || 0;
    const qty = parseInt(consultForm.quantity) || 1;
    const totalCalcPrice = priceNum * qty;

    const consultationObj = {
      orderId: trackingCode,
      customerName: consultForm.name,
      phone: consultForm.phone,
      whatsappNumber: consultForm.whatsappNumber,
      email: consultForm.email || 'consultation@customer.com',
      panNumber: consultForm.panNumber ? consultForm.panNumber.toUpperCase() : 'N/A',
      address: consultForm.address,
      projectType: product.name,
      totalAmount: totalCalcPrice > 0 ? `₹${totalCalcPrice.toLocaleString()}` : product.price,
      paymentMode: consultForm.paymentMode,
      currentStep: 1,
      expectedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toLocaleDateString(),
      notes: `Consultation Booking for ${product.name} (Qty: ${qty}) | PAN: ${consultForm.panNumber ? consultForm.panNumber.toUpperCase() : 'N/A'} | Notes: ${consultForm.notes || 'None'}`
    };

    try {
      const stored = localStorage.getItem('luxe_customer_orders');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(consultationObj);
      localStorage.setItem('luxe_customer_orders', JSON.stringify(list));
      window.dispatchEvent(new Event('orderStatusUpdated'));
    } catch (err) {}

    try {
      await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationObj)
      });
    } catch (err) {}

    const trackingLink = `http://localhost:3000/track?id=${trackingCode}`;
    const msg = `*LUXE INTERIORS - NEW BOOK A CONSULTATION*
----------------------------------------
📌 *Tracking Order ID:* ${trackingCode}
🔗 *Track Live Progress:* ${trackingLink}
----------------------------------------
*Customer Information:*
👤 *Full Name:* ${consultForm.name}
📞 *Phone Number:* ${consultForm.phone}
💬 *WhatsApp Number:* ${consultForm.whatsappNumber}
🆔 *PAN Card Number:* ${consultForm.panNumber ? consultForm.panNumber.toUpperCase() : 'Not provided'}
📍 *Site / Delivery Address:* ${consultForm.address}
💳 *Payment Mode:* ${consultForm.paymentMode}

*Product & Order Details:*
🛋️ *Product Name:* ${product.name}
💰 *Price Per Unit:* ${product.price}
🔢 *Quantity:* ${qty}
💵 *Grand Total:* ${totalCalcPrice > 0 ? `₹${totalCalcPrice.toLocaleString()}` : product.price}

📝 *Special Requirements / Notes:*
${consultForm.notes || 'None provided'}
----------------------------------------
Please contact me to schedule our consultation. Thank you!`;

    window.open(`https://wa.me/916379183549?text=${encodeURIComponent(msg)}`, '_blank');
    setShowConsultModal(false);
    onClose();
    navigate(`/track?id=${trackingCode}`);
  };

  if (!product) return null;

  const t = (key) => getTranslation(currentLang, key);

  // Price calculations
  const priceRaw = parseInt((product.price || '₹10,000').replace(/[₹,]/g, ''), 10) || 10000;



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
        
        {/* Header Ribbon */}
        <div className="amazon-modal-top-ribbon">
          <span className="bestseller-badge">✨ Reference Design Inspiration</span>
          <span className="bestseller-cat">in {(product.category || 'HOME INTERIORS').toUpperCase()}</span>
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
                  onClick={() => {
                    setActiveImgIndex(idx);
                    setShowLightbox(true);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <div 
              className="amazon-main-image-box" 
              onClick={() => setShowLightbox(true)}
              style={{ cursor: 'pointer' }}
            >
              <img src={productImages[activeImgIndex]} alt={product.name} className="amazon-main-img" />
              <span className="amazon-zoom-hover-tag">🔍 Touch to expand view</span>
            </div>
          </div>

          {/* Center Column: Product Specifications & Details */}
          <div className="amazon-details-column">
            <h1 className="amazon-product-title">{product.name}</h1>
            <p className="amazon-brand-link">Customized by Luxe Interiors Studio</p>
            
            {renderStars(product.rating)}
            
            <div className="amazon-divider-line"></div>

            {/* Professional Design Callout Box */}
            <div className="custom-design-callout-box">
              <p>
                💡 <strong>Love this design?</strong> We can create a similar look specifically for your home. Every design is customized according to your space, lifestyle, preferences, and requirements.
              </p>
            </div>

            {/* Estimated Price Range Block */}
            <div className="amazon-price-box">
              <div className="price-main-row">
                <span className="est-budget-label">Est. Reference Budget:</span>
                <span className="currency-symbol">₹</span>
                <span className="current-price-num">{priceRaw.toLocaleString()}</span>
              </div>
              <p className="taxes-note">Fully customizable based on materials, layout & fittings</p>
            </div>

            <div className="amazon-divider-line"></div>

            {/* Specifications Table */}
            <div className="amazon-specs-section">
              <h3>Design Specifications & Options</h3>
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
                        <td className="spec-label">Material Options</td>
                        <td className="spec-val">BWP 710 Plywood, HDMR, German Laminate, Acrylic & PU Matte/Gloss</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Customization</td>
                        <td className="spec-val">100% Tailored to your home space & layout</td>
                      </tr>
                      <tr>
                        <td className="spec-label">Warranty</td>
                        <td className="spec-val">10-Year Flat Warranty on Woodwork & Hardware</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="amazon-about-item">
              <h3>About this reference design</h3>
              <ul>
                <li>{product.description || "Premium reference interior design engineered for modern space utilization, durability, and luxury aesthetics."}</li>
                <li>Made with high-grade moisture resistant core boards and precision German fittings.</li>
                <li>Includes anti-scratch coating, soft-close hardware, and custom lighting integration.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Customization Consultation Box */}
          <div className="amazon-buybox-column">
            <div className="buybox-card">
              
              <div className="buybox-price-row">
                <span>Custom Solution</span>
              </div>

              <div className="buybox-stock-status">
                <span className="stock-green">✓ Designers Available for Consultation</span>
              </div>

              {/* Consultation Action Buttons */}
              <div className="modal-consultation-btn-group">
                <button type="button" className="btn-customize-design" onClick={handleCustomizeClick}>
                  ✨ Customize This Design
                </button>

                <button type="button" className="btn-book-consultation" onClick={handleOpenConsultModal}>
                  📅 Book a Consultation
                </button>
              </div>

              <div className="buybox-seller-info">
                <div className="seller-row">
                  <span>Design Studio</span>
                  <strong>Luxe Interior Works</strong>
                </div>
                <div className="seller-row">
                  <span>Site Visit</span>
                  <strong>Free 3D Laser Measurement</strong>
                </div>
                <div className="seller-row">
                  <span>Execution</span>
                  <strong>Certified Master Carpenters</strong>
                </div>
              </div>

              <div className="buybox-guarantees">
                <span>🔒 10-Year Flat Warranty Included</span>
              </div>

            </div>
          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="amazon-reviews-container">
          <div className="reviews-header-bar">
            <h2>{t('customerReviews')} ({reviews.length})</h2>
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
            >
              ✍️ Write a Customer Review
            </button>
          </div>

          {/* Write Customer Review Form */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="add-review-form-card">
              <h3>Submit Your Product Review</h3>
              
              <div className="form-group-item">
                <label>Rating:</label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(e.target.value)}
                >
                  <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Fair)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>

              <div className="form-group-item">
                <label>Review Headline:</label>
                <input 
                  type="text" 
                  value={newHeadline} 
                  onChange={(e) => setNewHeadline(e.target.value)} 
                  placeholder="e.g. Superior wood quality and comfortable design!"
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Review Details:</label>
                <textarea 
                  value={newText} 
                  onChange={(e) => setNewText(e.target.value)} 
                  placeholder="Share your experience regarding material, delivery, and craftsmanship..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-btn-row">
                <button type="submit" className="btn-submit-rev">
                  Submit Review
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="btn-cancel-rev">
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
                <p className="no-reviews-note">No customer reviews yet. Be the first to leave a review!</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="review-item-card">
                    {isLoggedIn && userRole === 'admin' && (
                      <button 
                        onClick={() => handleDeleteReview(rev.id)}
                        className="btn-delete-review-admin"
                        title="Delete Review (Admin Only)"
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
                      <strong className="review-headline">{rev.headline}</strong>
                    </div>
                    <p className="review-text">{rev.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Book a Consultation Modal Dialog Overlay */}
      {showConsultModal && (
        <div 
          className="consult-modal-overlay" 
          onClick={(e) => {
            e.stopPropagation();
            setShowConsultModal(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
        >
          <div 
            className="consult-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setShowConsultModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#777'
              }}
            >
              &times;
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#2c211e', fontFamily: "'Playfair Display', serif" }}>
              📅 Book a Design Consultation
            </h2>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#6e615a', lineHeight: '1.4' }}>
              Please provide your details below to schedule an expert interior design consultation for <strong>{product.name}</strong>.
            </p>

            {/* Generated Order ID & Product Details Banner */}
            <div style={{ background: '#faf8f5', border: '1px dashed #c98544', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#8c7d78', letterSpacing: '0.8px' }}>TRACKING ORDER ID</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#c98544' }}>{modalOrderId || 'CON-1001'}</span>
              </div>
              <div style={{ fontSize: '13.5px', color: '#1f1816', fontWeight: '700', marginTop: '4px' }}>
                🛋️ Product: {product.name} ({product.price})
              </div>
            </div>

            <form onSubmit={handleConsultSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#3e322d', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input 
                  type="text"
                  value={consultForm.name}
                  onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #dcd4c8', boxSizing: 'border-box', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#3e322d', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input 
                    type="tel"
                    value={consultForm.phone}
                    onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #dcd4c8', boxSizing: 'border-box', fontSize: '13.5px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#3e322d', marginBottom: '4px' }}>
                    WhatsApp Number *
                  </label>
                  <input 
                    type="tel"
                    value={consultForm.whatsappNumber}
                    onChange={(e) => setConsultForm({ ...consultForm, whatsappNumber: e.target.value })}
                    placeholder="+91 9876543210"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #dcd4c8', boxSizing: 'border-box', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#3e322d', marginBottom: '4px' }}>
                  Payment Option *
                </label>
                <select
                  value={consultForm.paymentMode}
                  onChange={(e) => setConsultForm({ ...consultForm, paymentMode: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #dcd4c8', boxSizing: 'border-box', fontSize: '13.5px' }}
                >
                  <option value="Cash on Delivery">Cash on Delivery / Pay on Site</option>
                  <option value="Online Payment">Online Payment (UPI / Card)</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Flexible EMI">Flexible EMI Option</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#3e322d', marginBottom: '4px' }}>
                  Site / Delivery Address *
                </label>
                <textarea 
                  value={consultForm.address}
                  onChange={(e) => setConsultForm({ ...consultForm, address: e.target.value })}
                  placeholder="Full Delivery Address, City, State, PIN..."
                  rows="2"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #dcd4c8', boxSizing: 'border-box', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#3e322d', marginBottom: '4px' }}>
                  Preferred Date & Special Requirements
                </label>
                <textarea 
                  value={consultForm.notes}
                  onChange={(e) => setConsultForm({ ...consultForm, notes: e.target.value })}
                  placeholder="Mention preferred site visit date, room measurements, or special requests..."
                  rows="2"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #dcd4c8', boxSizing: 'border-box', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit"
                  style={{
                    background: '#25d366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  🚀 Confirm & Send to WhatsApp
                </button>
                <button 
                  type="button"
                  onClick={() => setShowConsultModal(false)}
                  style={{
                    background: '#e0e0e0',
                    color: '#333333',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 18px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expanded Medium/Large Image Lightbox Modal Pop-up */}
      {showLightbox && (
        <div 
          className="lightbox-modal-overlay" 
          onClick={(e) => {
            e.stopPropagation();
            setShowLightbox(false);
          }} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
        >
          <div 
            className="lightbox-modal-card" 
            onClick={(e) => e.stopPropagation()} 
            style={{
              position: 'relative',
              maxWidth: '850px',
              width: '92%',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowLightbox(false)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                background: '#3c312e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Main Pop-up Image Box with Prev/Next Arrow Buttons */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Prev Button */}
              <button
                onClick={() => setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                style={{
                  position: 'absolute',
                  left: '10px',
                  background: 'rgba(60, 49, 46, 0.75)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Previous Image"
              >
                ‹
              </button>

              {/* Display Active Image */}
              <img 
                src={productImages[activeImgIndex]} 
                alt={`${product.name} View ${activeImgIndex + 1}`} 
                style={{
                  maxWidth: '100%',
                  maxHeight: '68vh',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }} 
              />

              {/* Next Button */}
              <button
                onClick={() => setActiveImgIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'rgba(60, 49, 46, 0.75)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Next Image"
              >
                ›
              </button>
            </div>

            {/* Pop-up 3 Thumbnails Switcher */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '14px', justifyContent: 'center' }}>
              {productImages.map((imgSrc, idx) => (
                <img 
                  key={idx}
                  src={imgSrc}
                  alt={`View ${idx + 1}`}
                  onClick={() => setActiveImgIndex(idx)}
                  style={{
                    width: '56px',
                    height: '56px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: activeImgIndex === idx ? '3px solid #c98544' : '1px solid #ddd',
                    opacity: activeImgIndex === idx ? 1 : 0.5,
                    transition: 'all 0.2s ease',
                    transform: activeImgIndex === idx ? 'scale(1.08)' : 'scale(1)'
                  }}
                />
              ))}
            </div>

            <div style={{ marginTop: '12px', fontSize: '18px', fontWeight: '700', color: '#1f1816', fontFamily: "'Playfair Display', serif" }}>
              {product.name} (View {activeImgIndex + 1} of {productImages.length})
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7a6b65' }}>
              Touch background, ✕ button, or use ‹ › arrows to navigate images
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;
