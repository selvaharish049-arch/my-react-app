import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CheckOut.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    paymentMode: 'Cash on Delivery'
  });

  if (!product) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>No product selected for purchase!</p>
        <button onClick={() => navigate('/')} style={{ cursor: 'pointer', padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const priceNum = parseInt(product.price.replace(/[₹,]/g, '')) || 0;
  const totalAmount = priceNum * quantity;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.email || !formData.address) {
      alert("Please fill in all required fields!");
      return;
    }

    // Format order details for WhatsApp
    const message = `*LUXE INTERIOR - ORDER DETAILS*
----------------------------------------
*Customer Information:*
👤 *Name:* ${formData.name}
📞 *Mobile:* ${formData.mobile}
📧 *Email:* ${formData.email}
📍 *Address:* ${formData.address}
💳 *Payment Mode:* ${formData.paymentMode}

*Ordered Product:*
🛍️ *Item Name:* ${product.name}
🔢 *Quantity:* ${quantity}
💰 *Price Per Unit:* ${product.price}
💵 *Grand Total:* ₹${totalAmount.toLocaleString()}
----------------------------------------
Please confirm my order booking. Thank you!`;

    // Target Phone: 916379183549
    const whatsappUrl = `https://wa.me/916379183549?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>🛍️ Place Your Order</h2>
        <p className="sub-text">Please provide your details below to book your product via WhatsApp.</p>

        <form className="order-form" onSubmit={handleCheckoutSubmit}>
          <label>Customer Name *</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name" 
            required 
          />

          <label>Mobile Number *</label>
          <input 
            type="tel" 
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="e.g. +91 9876543210" 
            required 
          />

          <label>Email ID *</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="yourname@gmail.com" 
            required 
          />

          <label>Customer Address *</label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Full Shipping Address, City, State, PIN" 
            required 
          />

          <label>Payment Mode *</label>
          <select 
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleInputChange}
            required
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Online Payment">Online Payment</option>
          </select>

          <label>Product Name *</label>
          <input type="text" value={product.name} readOnly style={{ background: '#f5f5f5' }} />

          <div className="price-quantity">
            <div>
              <label>Product Price</label>
              <input type="text" value={product.price} readOnly style={{ background: '#f5f5f5' }} />
            </div>
            <div>
              <label>Quantity</label>
              <input 
                type="number" 
                value={quantity} 
                min="1" 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                required 
              />
            </div>
          </div>

          <div className="total-box">
            <label>Total: ₹{totalAmount.toLocaleString()}</label>
          </div>

          <button type="submit" className="submit-btn">
            Order via WhatsApp 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;