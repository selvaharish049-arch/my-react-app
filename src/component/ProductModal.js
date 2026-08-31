import React, { useState } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, onClose, addToCart, isLoggedIn, triggerLogin }) => {
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    paymentMode: 'Cash on Delivery'
  });

  if (!product) return null;

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("⚠️ Access Restricted: Please login to your account first before adding items to your cart.");
      if (triggerLogin) triggerLogin();
      onClose();
      return;
    }
    // Add product based on selected quantity
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

  const handleWhatsAppOrderSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("⚠️ Access Restricted: Please login to your account first before buying products.");
      if (triggerLogin) triggerLogin();
      onClose();
      return;
    }

    if (!formData.name || !formData.mobile || !formData.email || !formData.address) {
      alert("Please fill all required fields!");
      return;
    }

    const priceNum = parseInt(product.price.replace(/[₹,]/g, '')) || 0;
    const totalAmount = priceNum * quantity;

    // Formatted WhatsApp Message
    const message = `*LUXE INTERIOR - NEW ORDER*
----------------------------------------
*Customer Details:*
👤 *Name:* ${formData.name}
📞 *Mobile:* ${formData.mobile}
📧 *Email:* ${formData.email}
📍 *Address:* ${formData.address}
💳 *Payment:* ${formData.paymentMode}

*Product Details:*
🛍️ *Item:* ${product.name}
📦 *Category:* ${product.category.toUpperCase()}
🔢 *Quantity:* ${quantity}
💰 *Price:* ${product.price}
💵 *Total:* ₹${totalAmount.toLocaleString()}
----------------------------------------
Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/916379183549?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4.5);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose}>&times;</button>
        
        <div className="product-modal-grid">
          {/* Left Column: Product Image */}
          <div className="product-modal-media">
            <img src={product.img} alt={product.name} className="product-modal-img" />
          </div>

          {/* Right Column: Info & Actions */}
          <div className="product-modal-info">
            <span className="product-modal-tag">{product.category.toUpperCase()}</span>
            <h2 className="product-modal-title">{product.name}</h2>
            
            <div className="product-modal-rating">
              {renderStars(product.rating)}
              <span className="rating-val">({product.rating || 4.5})</span>
            </div>

            <p className="product-modal-price">{product.price}</p>
            <p className="product-modal-desc">{product.description || "Elegant design crafted with finest materials to elevate your interior aesthetic."}</p>

            {/* Specifications Table */}
            <div className="product-modal-specs">
              <h4>Specifications:</h4>
              <table>
                <tbody>
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-val">{val}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td className="spec-key">Material</td>
                        <td className="spec-val">Premium Quality Finish</td>
                      </tr>
                      <tr>
                        <td className="spec-key">Warranty</td>
                        <td className="spec-val">1 Year Brand Warranty</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {!showCheckoutForm ? (
              <div className="product-modal-actions">
                <div className="quantity-wrapper">
                  <span className="qty-label">Quantity:</span>
                  <div className="qty-selector">
                    <button onClick={() => handleQuantityChange('dec')}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleQuantityChange('inc')}>+</button>
                  </div>
                </div>

                <div className="button-group">
                  <button className="btn-modal-cart" onClick={handleAddToCart}>
                    🛒 Add to Cart
                  </button>
                  <button 
                    className="btn-modal-whatsapp" 
                    onClick={() => {
                      if (!isLoggedIn) {
                        alert("⚠️ Access Restricted: Please login to your account first before checking out.");
                        if (triggerLogin) triggerLogin();
                        onClose();
                      } else {
                        setShowCheckoutForm(true);
                      }
                    }}
                  >
                    💬 Order on WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-checkout-form-container">
                <button className="btn-back" onClick={() => setShowCheckoutForm(false)}>
                  ← Back to details
                </button>
                <h3>Enter Order Details</h3>
                <form onSubmit={handleWhatsAppOrderSubmit} className="modal-shipping-form">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Full Name" 
                      value={formData.name} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Mobile Number *</label>
                    <input 
                      type="tel" 
                      name="mobile" 
                      placeholder="e.g. +91 9876543210" 
                      value={formData.mobile} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Email ID *</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="yourname@email.com" 
                      value={formData.email} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Shipping Address *</label>
                    <textarea 
                      name="address" 
                      placeholder="Full delivery address with Pin Code" 
                      value={formData.address} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Payment Method *</label>
                    <select 
                      name="paymentMode" 
                      value={formData.paymentMode} 
                      onChange={handleFormChange}
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Online Payment">Online Payment</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-modal-checkout-submit">
                    Send Order Details to WhatsApp 🚀
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
