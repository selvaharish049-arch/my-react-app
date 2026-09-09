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
    panNumber: '',
    address: '',
    paymentMode: 'Cash on Delivery',
    solutionNotes: ''
  });

  const [customPicPreview, setCustomPicPreview] = useState('');
  const [customPicData, setCustomPicData] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [panError, setPanError] = useState('');

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

  const handleCustomPicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPicPreview(reader.result);
        setCustomPicData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    if (e) e.preventDefault();
    if (submitting) return;

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber)) {
      setPanError('Please enter a valid 10-character PAN Card Number (e.g. ABCDE1234F).');
      alert('Please enter a valid 10-character PAN Card Number (e.g., ABCDE1234F)!');
      return;
    }

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
      panNumber: formData.panNumber.toUpperCase(),
      address: formData.address,
      projectType: product.name,
      totalAmount: `₹${totalAmount.toLocaleString()}`,
      paymentMode: formData.paymentMode,
      customPic: customPicData,
      currentStep: 1,
      expectedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toLocaleDateString(),
      notes: `Solution Notes: ${formData.solutionNotes || 'Standard order'} | Quantity: ${quantity} | PAN: ${formData.panNumber.toUpperCase()}`
    };

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://selvaharish-interior-back.onrender.com';

    try {
      // 1. Post to Backend DB with 8s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${baseUrl}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderObj),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const orderResult = await response.json();
        if (orderResult && orderResult.orderId) {
          newOrderObj.orderId = orderResult.orderId;
        }
      }
    } catch (err) {
      console.log("Saved order locally.");
    }

    // Save/Update in localStorage with final orderId
    try {
      const stored = localStorage.getItem('luxe_customer_orders');
      let list = stored ? JSON.parse(stored) : [];
      list = list.filter(o => o && String(o.orderId).toLowerCase().trim() !== String(newOrderObj.orderId).toLowerCase().trim());
      list.unshift(newOrderObj);
      localStorage.setItem('luxe_customer_orders', JSON.stringify(list));
      window.dispatchEvent(new Event('orderStatusUpdated'));
    } catch (e) {}

    setCreatedOrder(newOrderObj);

    // 2. Format WhatsApp message for Admin (+91 6379183549)
    const trackingLink = `http://localhost:3000/track?id=${newOrderObj.orderId}`;
    const message = `*LUXE INTERIOR - NEW CUSTOM SOLUTION ORDER*
----------------------------------------
📌 *Tracking Code:* ${newOrderObj.orderId}
🔗 *Track Live Progress:* ${trackingLink}
----------------------------------------
*Customer Information:*
👤 *Name:* ${formData.name}
📞 *Phone Number:* ${formData.mobile}
💬 *WhatsApp Number:* ${formData.whatsappNumber || formData.mobile}
📧 *Email:* ${formData.email}
🆔 *PAN Card Number:* ${formData.panNumber.toUpperCase()}
📍 *Delivery Address:* ${formData.address}
💳 *Payment Mode:* ${formData.paymentMode}
📷 *Custom Reference Photo Attached:* ${customPicData ? 'YES (Uploaded)' : 'NO'}

*Ordered Design & Solution:*
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
            Your custom order & reference photo have been saved to the database & sent to Admin WhatsApp (<strong>+91 6379183549</strong>).
          </p>

          <div style={{ background: '#faf8f5', border: '2px dashed #c98544', padding: '20px', borderRadius: '12px', marginBottom: '28px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#8c7d78', letterSpacing: '1px' }}>YOUR UNIQUE TRACKING CODE</span>
            <h1 style={{ fontSize: '36px', color: '#1f1816', margin: '6px 0', fontFamily: 'Playfair Display, serif' }}>{createdOrder.orderId}</h1>
            <p style={{ fontSize: '13px', color: '#5a4b44', margin: '4px 0 0 0' }}>PAN Card Registered: <strong>{createdOrder.panNumber}</strong></p>
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
          <p className="sub-text">Please provide your details, custom interior requirements, and optional design reference photo below to send your order directly to Admin WhatsApp.</p>

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

            <label>PAN Card Number (Set PAN Num) *</label>
            <input 
              type="text" 
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              placeholder="e.g. ABCDE1234F" 
              maxLength="10"
              style={{ textTransform: 'uppercase' }}
              required 
            />
            {panError ? (
              <span style={{ color: '#d32f2f', fontSize: '12px', fontWeight: 'bold', display: 'block', marginTop: '-8px', marginBottom: '12px' }}>⚠️ {panError}</span>
            ) : (
              <span style={{ color: '#777', fontSize: '11.5px', display: 'block', marginTop: '-8px', marginBottom: '12px' }}>10-character PAN Card format required for order verification & tax invoice.</span>
            )}

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
              <option value="Online Payment">Online Payment (UPI / Card)</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Flexible EMI">Flexible EMI Option</option>
            </select>

            {/* Custom Reference Photo Upload Input (Below Payment Option) */}
            <div style={{ margin: '18px 0', background: '#faf6f0', padding: '16px', borderRadius: '10px', border: '1px dashed #c98544' }}>
              <label style={{ display: 'block', fontWeight: '700', color: '#2c211e', marginBottom: '4px', fontSize: '13.5px' }}>
                📷 Upload Your Own Customized Design / Reference Photo
              </label>
              <p style={{ fontSize: '12px', color: '#6e615a', margin: '0 0 10px 0' }}>
                Upload your room photo, hand sketch, or custom design picture for our carpenters & designers.
              </p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCustomPicUpload}
                style={{ display: 'block', width: '100%' }}
              />
              {customPicPreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                  <img src={customPicPreview} alt="Uploaded Reference" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #c98544' }} />
                  <span style={{ color: '#2e7d32', fontWeight: '700', fontSize: '13px' }}>✓ Reference Photo Attached</span>
                </div>
              )}
            </div>

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