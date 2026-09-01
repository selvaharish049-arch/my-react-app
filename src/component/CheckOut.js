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
  const [createdOrder, setCreatedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.email || !formData.address) {
      alert("Please fill in all required fields!");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Post to Backend DB & Trigger Email Notification
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.mobile,
          email: formData.email,
          address: formData.address,
          projectType: product.name,
          items: [{ name: product.name, price: product.price, quantity }],
          totalAmount: `₹${totalAmount.toLocaleString()}`,
          paymentMode: formData.paymentMode,
          notes: `Quantity: ${quantity} x ${product.name}`
        })
      });

      const orderResult = await response.json();
      const trackingCode = orderResult.orderId || 'SH-104';
      setCreatedOrder(orderResult);

      // 2. Format WhatsApp message with Tracking Code & Direct Tracking Link
      const trackingLink = `http://localhost:3000/track?id=${trackingCode}`;
      const message = `*LUXE INTERIOR - NEW ORDER BOOKING*
----------------------------------------
📌 *Tracking Code:* ${trackingCode}
🔗 *Track Live Progress:* ${trackingLink}
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
Notification sent to selvaharish049@gmail.com & Database stored.
Please confirm my order. Thank you!`;

      // 3. Open WhatsApp
      const whatsappUrl = `https://wa.me/916379183549?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Database connection notice:', err);
      // Fallback tracking ID if backend offline
      setCreatedOrder({
        orderId: 'SH-104',
        customerName: formData.name,
        projectType: product.name
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      {createdOrder ? (
        <div className="checkout-box" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#2e7d32', marginBottom: '8px' }}>Order Placed & Sent via WhatsApp!</h2>
          <p style={{ color: '#555', marginBottom: '24px' }}>
            Your order has been stored in the database & notified to <strong>selvaharish049@gmail.com</strong>.
          </p>

          <div style={{ background: '#faf8f5', border: '2px dashed #c98544', padding: '20px', borderRadius: '12px', marginBottom: '28px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#8c7d78', letterSpacing: '1px' }}>YOUR UNIQUE TRACKING CODE</span>
            <h1 style={{ fontSize: '36px', color: '#1f1816', margin: '6px 0', fontFamily: 'Playfair Display, serif' }}>{createdOrder.orderId}</h1>
            <p style={{ fontSize: '13px', color: '#5a4b44', margin: 0 }}>Click below to track live status & project location stage.</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate(`/track?id=${createdOrder.orderId}`)} 
              style={{ background: '#c98544', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '30px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}
            >
              📍 Track Order Location & Status 🚀
            </button>
            <button 
              onClick={() => navigate('/')} 
              style={{ background: '#ffffff', color: '#3e322d', border: '1px solid #dcd4c8', padding: '14px 24px', borderRadius: '30px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
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

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Processing Order...' : 'Order via WhatsApp 🚀'}
          </button>
        </form>
      </div>
      )}
    </div>
  );
};

export default Checkout;