import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CheckOut.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const initialQty = location.state?.quantity || 1;

  const [quantity, setQuantity] = useState(initialQty);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    whatsappNumber: '',
    address: '',
    paymentMode: 'Cash on Delivery',
    solutionNotes: ''
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

    const trackingCode = 'LX-' + Math.floor(1000 + Math.random() * 9000);
    const newOrderObj = {
      orderId: trackingCode,
      customerName: formData.name,
      phone: formData.mobile,
      whatsappNumber: formData.whatsappNumber || formData.mobile,
      email: formData.email,
      address: formData.address,
      projectType: product.name,
      totalAmount: `₹${totalAmount.toLocaleString()}`,
      paymentMode: formData.paymentMode,
      currentStep: 1,
      expectedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toLocaleDateString(),
      notes: `Solution Notes: ${formData.solutionNotes || 'Standard order'} | Quantity: ${quantity}`
    };

    // Save to localStorage so admin sees website orders instantly in Order Database
    try {
      const stored = localStorage.getItem('luxe_customer_orders');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newOrderObj);
      localStorage.setItem('luxe_customer_orders', JSON.stringify(list));
    } catch (e) {}

    try {
      // 1. Post to Backend DB
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderObj)
      });
      const orderResult = await response.json();
      if (orderResult && orderResult.orderId) {
        newOrderObj.orderId = orderResult.orderId;
      }
    } catch (err) {
      console.log("Saved order locally.");
    }

    setCreatedOrder(newOrderObj);

    // 2. Format WhatsApp message for Admin (+91 6379183549)
    const trackingLink = `http://localhost:3000/track?id=${newOrderObj.orderId}`;
    const message = `*LUXE INTERIOR - NEW BUY NOW ORDER*
----------------------------------------
📌 *Tracking Code:* ${newOrderObj.orderId}
🔗 *Track Live Progress:* ${trackingLink}
----------------------------------------
*Customer Information:*
👤 *Name:* ${formData.name}
📞 *Phone Number:* ${formData.mobile}
💬 *WhatsApp Number:* ${formData.whatsappNumber || formData.mobile}
📧 *Email:* ${formData.email}
📍 *Delivery Address:* ${formData.address}
💳 *Payment Mode:* ${formData.paymentMode}

*Ordered Product & Solution:*
🛍️ *Item Name:* ${product.name}
🔢 *Quantity:* ${quantity}
💰 *Price Per Unit:* ${product.price}
💵 *Grand Total:* ₹${totalAmount.toLocaleString()}
📝 *Customer Custom Requirement / Solution:*
${formData.solutionNotes || 'None provided'}
----------------------------------------
Please confirm my order. Thank you!`;

    // 3. Open Admin WhatsApp (+91 6379183549)
    const whatsappUrl = `https://wa.me/916379183549?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitting(false);
  };

  return (
    <div className="checkout-container">
      {createdOrder ? (
        <div className="checkout-box" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#2e7d32', marginBottom: '8px' }}>Order Placed & Sent via WhatsApp!</h2>
          <p style={{ color: '#555', marginBottom: '24px' }}>
            Your order has been stored in the database & sent to Admin WhatsApp (<strong>+91 6379183549</strong>).
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
          <h2>🛍️ Place Your Order & Custom Solution</h2>
          <p className="sub-text">Please provide your details and custom interior requirements below to send your order directly to Admin WhatsApp.</p>

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

            <label>Email ID *</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="yourname@gmail.com" 
              required 
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 9876543210" 
                  required 
                />
              </div>
              <div>
                <label>WhatsApp Number *</label>
                <input 
                  type="tel" 
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 9876543210" 
                  required 
                />
              </div>
            </div>

            <label>Customer Shipping Address *</label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full Delivery Address, City, State, PIN" 
              required 
            />

            <label>Payment Option *</label>
            <select 
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleInputChange}
              required
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Online Payment</option>
            </select>

            <label>Custom Solution / Interior Notes</label>
            <textarea 
              name="solutionNotes"
              value={formData.solutionNotes}
              onChange={handleInputChange}
              placeholder="Describe your custom layout, wood finish preferences, size measurements, or special requests..." 
              rows="3"
            />

            <label>Product Name</label>
            <input type="text" value={product.name} readOnly style={{ background: '#f5f5f5', fontWeight: 'bold' }} />

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
              {submitting ? 'Processing Order...' : '🚀 Send Order on Admin WhatsApp'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;