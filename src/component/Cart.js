import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ cartItems, setCartItems, onClose, isLoggedIn }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    paymentMode: 'Cash on Delivery'
  });

  const totalAmount = cartItems.reduce((total, item) => {
    const priceValue = parseInt(item.price.replace(/[₹,]/g, '')) || 0;
    return total + priceValue;
  }, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemoveItem = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([]);
    }
  };

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.email || !formData.address) {
      alert("Please fill in all details!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Group items by name to show quantities
    const groupedItems = {};
    cartItems.forEach(item => {
      if (groupedItems[item.name]) {
        groupedItems[item.name].quantity += 1;
      } else {
        groupedItems[item.name] = {
          name: item.name,
          price: item.price,
          quantity: 1
        };
      }
    });

    let itemsMessage = '';
    let counter = 1;
    Object.values(groupedItems).forEach(item => {
      itemsMessage += `${counter}. 🛍️ *${item.name}* (Qty: ${item.quantity}) - ${item.price}\n`;
      counter++;
    });

    // Format WhatsApp order message
    const message = `*LUXE INTERIOR - CART ORDER*
----------------------------------------
*Customer Information:*
👤 *Name:* ${formData.name}
📞 *Mobile:* ${formData.mobile}
📧 *Email:* ${formData.email}
📍 *Address:* ${formData.address}
💳 *Payment Mode:* ${formData.paymentMode}

*Items Ordered:*
${itemsMessage}
----------------------------------------
💵 *Grand Total:* ₹${totalAmount.toLocaleString()}
----------------------------------------
Please confirm my cart order booking. Thank you!`;

    // Clear cart locally after checkout redirection
    setCartItems([]);
    
    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/916379183549?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="cart-modal">
      <div className="cart-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>🛍️ Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart-msg">Your shopping cart is currently empty.</p>
        ) : (
          <>
            {!showCheckout ? (
              <>
                <div className="cart-list">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <img src={item.img} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">{item.price}</p>
                      </div>
                      <button 
                        className="remove-item-btn" 
                        onClick={() => handleRemoveItem(index)}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total-section">
                  <div className="total-row">
                    <span>Total Amount:</span>
                    <strong>₹{totalAmount.toLocaleString()}</strong>
                  </div>
                  
                  <div className="cart-action-buttons">
                    <button className="clear-cart-btn" onClick={handleClearCart}>
                      Clear Cart
                    </button>
                    <button 
                      className="proceed-checkout-btn" 
                      onClick={() => {
                        if (!isLoggedIn) {
                          alert("Please login first to check out!");
                        } else {
                          setShowCheckout(true);
                        }
                      }}
                    >
                      Checkout via WhatsApp 🚀
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="cart-checkout-form-container">
                <button className="back-to-cart-btn" onClick={() => setShowCheckout(false)}>
                  ← Back to cart list
                </button>
                <h3>Delivery & Contact Details</h3>
                
                <form onSubmit={handleWhatsAppCheckout} className="cart-shipping-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Enter your name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input 
                      type="tel" 
                      name="mobile" 
                      placeholder="e.g. +91 9876543210" 
                      value={formData.mobile} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Email ID *</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="yourname@domain.com" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Shipping Address *</label>
                    <textarea 
                      name="address" 
                      placeholder="Street, Landmark, City, Pincode" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Payment Option *</label>
                    <select 
                      name="paymentMode" 
                      value={formData.paymentMode} 
                      onChange={handleInputChange}
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Online Payment">Online Payment</option>
                    </select>
                  </div>

                  <div className="checkout-summary-bar">
                    <span>Grand Total: <strong>₹{totalAmount.toLocaleString()}</strong></span>
                  </div>

                  <button type="submit" className="confirm-checkout-btn">
                    Place WhatsApp Order Now 🚀
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;