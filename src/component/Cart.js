import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ cartItems, setCartItems, onClose, isLoggedIn }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    panNumber: '',
    address: '',
    paymentMode: 'Cash on Delivery'
  });
  const [panError, setPanError] = useState('');

  const totalAmount = cartItems.reduce((total, item) => {
    const priceValue = parseInt(item.price.replace(/[₹,]/g, '')) || 0;
    return total + priceValue;
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'panNumber') {
      const upperPan = value.toUpperCase().slice(0, 10);
      setFormData(prev => ({ ...prev, panNumber: upperPan }));

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (upperPan.length === 10 && !panRegex.test(upperPan)) {
        setPanError('Invalid PAN format! Example: ABCDE1234F');
      } else {
        setPanError('');
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleRemoveItem = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([]);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppCheckout = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber)) {
      setPanError('Please enter a valid 10-character PAN Card Number (e.g. ABCDE1234F).');
      alert('Please enter a valid 10-character PAN Card Number (e.g., ABCDE1234F)!');
      return;
    }

    if (!formData.name || !formData.mobile || !formData.email || !formData.address) {
      alert("Please fill in all details!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);

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

    const itemsList = Object.values(groupedItems);
    let itemsMessage = '';
    let counter = 1;
    itemsList.forEach(item => {
      itemsMessage += `${counter}. 🛍️ *${item.name}* (Qty: ${item.quantity}) - ${item.price}\n`;
      counter++;
    });

    const trackingCode = 'LX-' + Math.floor(1000 + Math.random() * 9000);
    const newOrderObj = {
      orderId: trackingCode,
      customerName: formData.name,
      phone: formData.mobile,
      email: formData.email,
      panNumber: formData.panNumber.toUpperCase(),
      address: formData.address,
      projectType: itemsList.map(i => i.name).join(', '),
      totalAmount: `₹${totalAmount.toLocaleString()}`,
      paymentMode: formData.paymentMode,
      currentStep: 1,
      expectedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toLocaleDateString(),
      notes: `Cart Items (${itemsList.length}): ${itemsList.map(i => `${i.name} (x${i.quantity})`).join(', ')} | PAN: ${formData.panNumber.toUpperCase()}`
    };

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://selvaharish-interior-back.onrender.com';

    try {
      // 1. Post Cart Order to Backend API first
      const res = await fetch(`${baseUrl}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderObj)
      });
      if (res.ok) {
        const orderRes = await res.json();
        if (orderRes && orderRes.orderId) {
          newOrderObj.orderId = orderRes.orderId;
        }
      }
    } catch (err) {
      console.error('Backend DB Notice:', err);
    }

    // Save/Update order to localStorage with final server orderId
    try {
      const stored = localStorage.getItem('luxe_customer_orders');
      let list = stored ? JSON.parse(stored) : [];
      list = list.filter(o => o && String(o.orderId).toLowerCase().trim() !== String(newOrderObj.orderId).toLowerCase().trim());
      list.unshift(newOrderObj);
      localStorage.setItem('luxe_customer_orders', JSON.stringify(list));
      window.dispatchEvent(new Event('orderStatusUpdated'));
    } catch (e) {}

    const trackingLink = `http://localhost:3000/track?id=${newOrderObj.orderId}`;

    // Format WhatsApp order message
    const message = `*LUXE INTERIOR - CART ORDER*
----------------------------------------
📌 *Tracking Code:* ${newOrderObj.orderId}
🔗 *Track Live Progress:* ${trackingLink}
----------------------------------------
*Customer Information:*
👤 *Name:* ${formData.name}
📞 *Mobile:* ${formData.mobile}
📧 *Email:* ${formData.email}
🆔 *PAN Card Number:* ${formData.panNumber.toUpperCase()}
📍 *Address:* ${formData.address}
💳 *Payment Mode:* ${formData.paymentMode}

*Items Ordered:*
${itemsMessage}----------------------------------------
💵 *Grand Total:* ₹${totalAmount.toLocaleString()}
----------------------------------------
Please confirm my cart order. Thank you!`;

    // Clear cart locally after checkout redirection
    setCartItems([]);
    
    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/916379183549?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
    
    alert(`🎉 Order Placed Successfully!\n\nYour Unique Tracking Code: ${newOrderObj.orderId}\n\nYou can track your order anytime on the Track Order page.`);
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
                    <label>PAN Card Number (Set PAN Num) *</label>
                    <input 
                      type="text" 
                      name="panNumber" 
                      placeholder="e.g. ABCDE1234F" 
                      value={formData.panNumber} 
                      onChange={handleInputChange} 
                      maxLength="10"
                      style={{ textTransform: 'uppercase' }}
                      required 
                    />
                    {panError && <span style={{ color: '#d32f2f', fontSize: '11px', fontWeight: 'bold' }}>⚠️ {panError}</span>}
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