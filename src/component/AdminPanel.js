import React, { useState, useEffect } from 'react';
import { getAllProducts, addCustomProduct, deleteCustomProduct } from '../data/productsData';
import OrderManagement from './OrderManagement';
import './AdminPanel.css';

const AdminPanel = ({ isLoggedIn, userRole }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [productsList, setProductsList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPercent: '26',
    category: 'modularkitchen',
    description: '',
    material: '',
    dimensions: '',
    color: '',
    warranty: '',
    assemblyRequired: 'No',
  });
  
  const [imageType, setImageType] = useState('upload'); // 'upload' or 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');

  // Solution Modal state
  const [selectedSolutionProduct, setSelectedSolutionProduct] = useState(null);
  const [solutionForm, setSolutionForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    productName: '',
    solutionDetails: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const all = await getAllProducts();
    setProductsList(all);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    
    let formattedPrice = formData.price.trim();
    if (!formattedPrice.startsWith('₹')) {
      formattedPrice = '₹' + formattedPrice;
    }
    dataToSend.append('price', formattedPrice);
    dataToSend.append('discountPercent', formData.discountPercent || '26');
    dataToSend.append('category', formData.category);
    dataToSend.append('description', formData.description);
    
    dataToSend.append('material', formData.material || 'Premium Finish');
    dataToSend.append('dimensions', formData.dimensions || 'Standard Size');
    dataToSend.append('color', formData.color || 'As shown');
    dataToSend.append('warranty', formData.warranty || '1 Year Brand Warranty');
    dataToSend.append('assemblyRequired', formData.assemblyRequired);

    if (imageType === 'upload') {
      if (!imageFile) {
        alert("Please choose an image file to upload!");
        return;
      }
      dataToSend.append('image', imageFile);
    } else {
      if (!imageUrl) {
        alert("Please enter an image URL!");
        return;
      }
      dataToSend.append('imageUrl', imageUrl);
    }

    const res = await addCustomProduct(dataToSend);
    if (res) {
      setMessage("✅ Product added to catalog successfully!");
      
      setFormData({
        name: '',
        price: '',
        discountPercent: '26',
        category: 'modularkitchen',
        description: '',
        material: '',
        dimensions: '',
        color: '',
        warranty: '',
        assemblyRequired: 'No',
      });
      setImageUrl('');
      setImageFile(null);
      setImagePreview('');
      
      const fileInput = document.getElementById('admin-file-input');
      if (fileInput) fileInput.value = '';

      loadProducts();
    } else {
      alert("Error adding product to catalog!");
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product from catalog?")) {
      const res = await deleteCustomProduct(id);
      if (res && res.success) {
        setMessage("🗑️ Product deleted permanently.");
        loadProducts();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert("Could not delete product.");
      }
    }
  };

  const handleOpenSolutionModal = (item) => {
    setSelectedSolutionProduct(item);
    setSolutionForm({
      customerName: '',
      email: '',
      phone: '',
      productName: item.name,
      solutionDetails: `Custom solution for ${item.name}: Material spec, size customization & estimated budget ${item.price}.`
    });
  };

  const handleSendSolutionWhatsApp = (e) => {
    e.preventDefault();

    if (!solutionForm.customerName || !solutionForm.phone || !solutionForm.solutionDetails) {
      alert("Please fill in Customer Name, Phone Number, and Solution Details!");
      return;
    }

    const phoneClean = solutionForm.phone.replace(/[^\d]/g, '');
    const validPhone = phoneClean.length >= 10 ? phoneClean : '916379183549';
    const targetNumber = validPhone.startsWith('91') ? validPhone : `91${validPhone}`;

    const trackingCode = 'LX-' + Math.floor(1000 + Math.random() * 9000);

    const message = `*LUXE INTERIOR - CUSTOM PROPOSAL & SOLUTION*
----------------------------------------
Hello *${solutionForm.customerName}*,

Thank you for consulting Luxe Interior! Here is our custom interior solution proposal for *${solutionForm.productName}*:

🛍️ *Product:* ${solutionForm.productName}
📝 *Solution & Specs:* ${solutionForm.solutionDetails}
📧 *Customer Email:* ${solutionForm.email || 'N/A'}
📞 *Contact Number:* ${solutionForm.phone}
----------------------------------------
📌 *Tracking Code:* ${trackingCode}
🔗 *Track Status:* http://localhost:3000/track?id=${trackingCode}
----------------------------------------
Please review this solution and let us know if you'd like to proceed! Thank you.`;

    // Save to Orders Database
    const newOrderObj = {
      orderId: trackingCode,
      customerName: solutionForm.customerName,
      phone: solutionForm.phone,
      email: solutionForm.email,
      address: 'Admin Custom Solution',
      projectType: solutionForm.productName,
      totalAmount: selectedSolutionProduct ? selectedSolutionProduct.price : '₹Custom Quote',
      paymentMode: 'Admin WhatsApp Solution',
      currentStep: 1,
      expectedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toLocaleDateString(),
      notes: `Solution: ${solutionForm.solutionDetails}`
    };

    try {
      const stored = localStorage.getItem('luxe_customer_orders');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newOrderObj);
      localStorage.setItem('luxe_customer_orders', JSON.stringify(list));
    } catch (err) {}

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setSelectedSolutionProduct(null);
    setMessage(`✅ Solution proposal sent via WhatsApp & saved to Orders Database!`);
    setTimeout(() => setMessage(''), 4000);
  };

  if (!isLoggedIn || userRole !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="denied-card">
          <h2>🚫 Access Denied</h2>
          <p>Please log in with the administrator credentials to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>Luxe Interior Admin Dashboard</h1>
        <p>Manage customer project order tracking and catalog products.</p>
      </div>

      {/* Admin Nav Tabs */}
      <div className="admin-tabs-bar" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button 
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            background: activeTab === 'orders' ? '#c98544' : '#ffffff',
            color: activeTab === 'orders' ? '#ffffff' : '#3e322d',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          📦 Project Orders & Live Tracking
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            background: activeTab === 'products' ? '#c98544' : '#ffffff',
            color: activeTab === 'products' ? '#ffffff' : '#3e322d',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          🛋️ Catalog Products Manager
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {activeTab === 'orders' ? (
        <OrderManagement />
      ) : (
        <div className="admin-main-grid">
          {/* Form Column */}
          <div className="admin-card admin-form-card">
            <h2>✨ Add New Product</h2>
            <form onSubmit={handleFormSubmit} className="admin-product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Royal Oak Bed" 
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 45000" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    name="discountPercent" 
                    min="0"
                    max="90"
                    value={formData.discountPercent} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 26" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required>
                  <optgroup label="Core Custom Categories">
                    <option value="modularkitchen">Modular Kitchen</option>
                    <option value="bedroomcupboard">Bedroom Cupboard</option>
                    <option value="wardrobe">Wardrobe</option>
                    <option value="tvunit">TV Unit</option>
                    <option value="poojacupboard">Pooja Cupboard</option>
                    <option value="showcase">Showcase</option>
                    <option value="woodendoors">Wooden Doors</option>
                    <option value="furniture">Furniture</option>
                    <option value="woodenwork">Wooden Work</option>
                  </optgroup>
                  <optgroup label="Explore Homepage Categories">
                    <option value="explore-sofa">Explore Sofa</option>
                    <option value="explore-bed">Explore Bed</option>
                    <option value="explore-dining">Explore Dining</option>
                    <option value="explore-tvunit">Explore TV Unit</option>
                    <option value="explore-coffeetable">Explore Coffee Table</option>
                    <option value="explore-mattress">Explore Mattress</option>
                    <option value="explore-wardrobe">Explore Wardrobe</option>
                    <option value="explore-sofacumbed">Explore Sofa Cum Bed</option>
                    <option value="explore-bookshelf">Explore Bookshelf</option>
                    <option value="explore-study">Explore Study Table</option>
                  </optgroup>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Product description and highlights..." 
                  rows="3" 
                  required 
                />
              </div>

              {/* Image Input Selection */}
              <div className="form-group">
                <label>Product Image Source</label>
                <div className="radio-group" style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="imageType" 
                      value="upload" 
                      checked={imageType === 'upload'} 
                      onChange={() => setImageType('upload')} 
                    />
                    Upload Local File
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="imageType" 
                      value="url" 
                      checked={imageType === 'url'} 
                      onChange={() => setImageType('url')} 
                    />
                    Image URL
                  </label>
                </div>

                {imageType === 'upload' ? (
                  <input 
                    type="file" 
                    id="admin-file-input"
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                ) : (
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/photo-..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                  />
                )}

                {(imagePreview || (imageType === 'url' && imageUrl)) && (
                  <div className="image-preview-container" style={{ marginTop: '10px' }}>
                    <img 
                      src={imageType === 'upload' ? imagePreview : imageUrl} 
                      alt="Preview" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} 
                    />
                  </div>
                )}
              </div>

              {/* Specifications */}
              <h4 style={{ margin: '16px 0 8px 0', fontSize: '14px', color: '#555' }}>Technical Specifications</h4>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Material</label>
                  <input 
                    type="text" 
                    name="material" 
                    value={formData.material} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Solid Teakwood" 
                  />
                </div>
                <div className="form-group">
                  <label>Dimensions</label>
                  <input 
                    type="text" 
                    name="dimensions" 
                    value={formData.dimensions} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 78 x 72 Inches" 
                  />
                </div>
                <div className="form-group">
                  <label>Color / Finish</label>
                  <input 
                    type="text" 
                    name="color" 
                    value={formData.color} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Walnut Finish" 
                  />
                </div>
                <div className="form-group">
                  <label>Warranty</label>
                  <input 
                    type="text" 
                    name="warranty" 
                    value={formData.warranty} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 5 Years Brand Warranty" 
                  />
                </div>
                <div className="form-group">
                  <label>Assembly Required</label>
                  <select name="assemblyRequired" value={formData.assemblyRequired} onChange={handleInputChange}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-admin-submit">
                ➕ Add Product to Catalog
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="admin-card admin-list-card">
            <h2>📦 Catalog Products ({productsList.length} items)</h2>
            {productsList.length === 0 ? (
              <p className="no-items-text">No products in catalog yet.</p>
            ) : (
              <div className="custom-items-list">
                {productsList.map(item => (
                  <div key={item.id} className="custom-item-row">
                    <img src={item.img} alt={item.name} className="custom-item-thumbnail" />
                    <div className="custom-item-info">
                      <h4>{item.name}</h4>
                      <p className="item-price">{item.price}</p>
                      <span className="item-cat-badge">{(item.category || '').toUpperCase()}</span>
                    </div>
                    <div className="custom-item-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-send-whatsapp-solution"
                        onClick={() => handleOpenSolutionModal(item)}
                        style={{
                          background: '#25D366',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                        title="Send Custom Solution via WhatsApp"
                      >
                        📱 Send Solution via WhatsApp
                      </button>

                      <button 
                        className="btn-delete-item" 
                        onClick={() => handleDelete(item.id)}
                        title="Remove Product"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SOLUTION WHATSAPP MODAL */}
      {selectedSolutionProduct && (
        <div className="modal-overlay">
          <div className="modal-content update-modal" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>📱 Send Product Solution to Customer via WhatsApp</h3>
              <button className="modal-close" onClick={() => setSelectedSolutionProduct(null)}>✕</button>
            </div>

            <form onSubmit={handleSendSolutionWhatsApp} className="modal-body">
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={solutionForm.productName} 
                  readOnly
                  style={{ background: '#f5f5f5', fontWeight: 'bold' }}
                />
              </div>

              <div className="form-group">
                <label>Customer Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ananya Sharma" 
                  value={solutionForm.customerName}
                  onChange={(e) => setSolutionForm({ ...solutionForm, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Customer Email ID *</label>
                <input 
                  type="email" 
                  placeholder="e.g. customer@gmail.com" 
                  value={solutionForm.email}
                  onChange={(e) => setSolutionForm({ ...solutionForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Customer WhatsApp / Phone Number *</label>
                <input 
                  type="tel" 
                  placeholder="e.g. +91 9876543210" 
                  value={solutionForm.phone}
                  onChange={(e) => setSolutionForm({ ...solutionForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Solution / Specifications & Estimate Details *</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe material finishes, customization details, size specifications, and price quote..." 
                  value={solutionForm.solutionDetails}
                  onChange={(e) => setSolutionForm({ ...solutionForm, solutionDetails: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setSelectedSolutionProduct(null)}>Cancel</button>
                <button type="submit" className="btn-save-update" style={{ background: '#25D366' }}>
                  🚀 Send Solution via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
