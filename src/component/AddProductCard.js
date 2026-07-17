import React, { useState, useRef } from 'react';
import { addCustomProduct } from '../data/productsData';
import './AddProductCard.css';

const AddProductCard = ({ category, onProductAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    material: '',
    dimensions: '',
    color: '',
    warranty: '',
    assemblyRequired: 'No'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    if (!formData.name.trim() || !formData.price.trim()) {
      alert("Please fill in the Product Name and Price!");
      return;
    }
    if (!imageFile) {
      alert("Please select an image file from your explorer!");
      return;
    }

    setLoading(true);

    // Prepare Multipart FormData
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    
    // Standardize price formatting
    let formattedPrice = formData.price.trim();
    if (!formattedPrice.startsWith('₹')) {
      formattedPrice = '₹' + formattedPrice;
    }
    dataToSend.append('price', formattedPrice);
    dataToSend.append('category', category);
    dataToSend.append('description', formData.description || `Premium quality ${category} collection piece.`);
    dataToSend.append('material', formData.material || 'Premium Finish');
    dataToSend.append('dimensions', formData.dimensions || 'Standard Size');
    dataToSend.append('color', formData.color || 'As shown');
    dataToSend.append('warranty', formData.warranty || '1 Year Brand Warranty');
    dataToSend.append('assemblyRequired', formData.assemblyRequired);
    dataToSend.append('image', imageFile);

    try {
      const result = await addCustomProduct(dataToSend);
      if (result) {
        alert("🎉 Product successfully added to the catalog and saved to files!");
        setShowModal(false);
        // Reset form states
        setFormData({
          name: '',
          price: '',
          description: '',
          material: '',
          dimensions: '',
          color: '',
          warranty: '',
          assemblyRequired: 'No'
        });
        setImageFile(null);
        setImagePreview('');
        if (onProductAdded) {
          onProductAdded();
        }
      } else {
        alert("Failed to save product to backend files. Please verify server status.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("An error occurred while uploading. Is Flask backend running?");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = () => {
    const labels = {
      'sofa': 'Sofa',
      'table': 'Table',
      'curtain': 'Curtain',
      'mattress': 'Mattress',
      'dining': 'Dining Set',
      'lamp': 'Lamp',
      'pillow': 'Pillow',
      'modularkitchen': 'Kitchen Set',
      'coffeetable': 'Coffee Table',
      'bed': 'Bed',
      'tvunit': 'TV Unit',
      'wardrobe': 'Wardrobe',
      'sofacumbed': 'Sofa Cum Bed',
      'bookshelf': 'Bookshelf',
      'study': 'Study Desk'
    };
    return labels[category] || category;
  };

  return (
    <>
      {/* 1. Dotted plus card shown in the catalog grid */}
      <div 
        className="product-item add-product-grid-card" 
        onClick={() => setShowModal(true)}
        title={`Add new ${getCategoryLabel()} item`}
        style={{ cursor: 'pointer' }}
      >
        <div className="product-img add-product-img-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9f6', border: '2px dashed #c98544', borderRadius: '6px', height: '220px', marginBottom: '12px' }}>
          <span style={{ fontSize: '32px', color: '#c98544' }}>➕</span>
        </div>
        <h3>Add New {getCategoryLabel()}</h3>
        
        <div className="product-card-rating-row">
          <span className="product-card-star">★</span>
          <span className="product-card-star">★</span>
          <span className="product-card-star">★</span>
          <span className="product-card-star">★</span>
          <span className="product-card-star">★</span>
          <span className="product-card-rating-count">(99+)</span>
        </div>

        <div className="product-card-price-row">
          <span className="product-card-current-price">Manage Catalog</span>
        </div>
        
        <div className="button-group">
          <button className="add-cart" style={{ width: '100%', backgroundColor: '#c98544', color: '#fff', border: 'none' }}>
            ➕ Add Item
          </button>
        </div>
      </div>

      {/* 2. Admin Inline Modal Dialog */}
      {showModal && (
        <div className="add-prod-modal-overlay">
          <div className="add-prod-modal-container">
            <button className="add-prod-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            
            <h2 className="add-prod-title">✨ Add Premium {getCategoryLabel()}</h2>
            <p className="add-prod-subtitle">Provide details to save the product to local files and inventory.</p>

            <form onSubmit={handleFormSubmit} className="add-prod-form">
              {/* Image Picker Box (Triggers File Explorer) */}
              <div className="add-prod-image-picker" onClick={handleBoxClick}>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview ? (
                  <div className="add-prod-preview-wrap">
                    <img src={imagePreview} alt="Selected preview" />
                    <div className="preview-overlay">Change Image</div>
                  </div>
                ) : (
                  <div className="add-prod-placeholder">
                    <span className="photo-icon">📷</span>
                    <span className="picker-text">Click to choose image from Explorer *</span>
                    <span className="picker-subtext">PNG, JPG, JPEG supported</span>
                  </div>
                )}
              </div>

              {/* Basic Details */}
              <div className="add-prod-form-group">
                <label>Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="e.g. Royal Gold Chesterfield Sofa"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="add-prod-row-2">
                <div className="add-prod-form-group">
                  <label>Price (₹) *</label>
                  <input 
                    type="text" 
                    name="price"
                    placeholder="e.g. 35,000"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="add-prod-form-group">
                  <label>Material *</label>
                  <input 
                    type="text" 
                    name="material"
                    placeholder="e.g. Solid Teak Wood & Velvet"
                    value={formData.material}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="add-prod-row-3">
                <div className="add-prod-form-group">
                  <label>Dimensions</label>
                  <input 
                    type="text" 
                    name="dimensions"
                    placeholder='e.g. 84" W x 36" D'
                    value={formData.dimensions}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="add-prod-form-group">
                  <label>Color</label>
                  <input 
                    type="text" 
                    name="color"
                    placeholder="e.g. Dark Slate / Emerald Gold"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="add-prod-form-group">
                  <label>Warranty</label>
                  <input 
                    type="text" 
                    name="warranty"
                    placeholder="e.g. 5 Years Warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="add-prod-row-2">
                <div className="add-prod-form-group">
                  <label>Assembly Required</label>
                  <select 
                    name="assemblyRequired"
                    value={formData.assemblyRequired}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div className="add-prod-form-group">
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={getCategoryLabel()} 
                    disabled 
                    style={{ background: '#f5f5f5', color: '#666', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              <div className="add-prod-form-group">
                <label>Product Description</label>
                <textarea 
                  name="description"
                  placeholder="Describe craftsmanship, cushion thickness, comfort, layout..."
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <button 
                type="submit" 
                className="add-prod-submit-btn" 
                disabled={loading}
              >
                {loading ? 'Uploading & Saving to Disk...' : '💾 Save Product to Inventory'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductCard;
