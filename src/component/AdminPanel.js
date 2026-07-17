import React, { useState, useEffect } from 'react';
import { getAllProducts, addCustomProduct, deleteCustomProduct } from '../data/productsData';
import './AdminPanel.css';

const AdminPanel = ({ isLoggedIn, userRole }) => {
  const [productsList, setProductsList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
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

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const all = await getAllProducts();
    // Show only custom items in the manager listing
    const custom = all.filter(item => item.id.toString().startsWith('custom-'));
    setProductsList(custom);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create local URL for preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare FormData
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    
    // Standardize price format
    let formattedPrice = formData.price.trim();
    if (!formattedPrice.startsWith('₹')) {
      formattedPrice = '₹' + formattedPrice;
    }
    dataToSend.append('price', formattedPrice);
    dataToSend.append('category', formData.category);
    dataToSend.append('description', formData.description);
    
    // Technical specs
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
      setMessage("✅ Product added to Flask catalog database successfully!");
      
      // Reset Form
      setFormData({
        name: '',
        price: '',
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
      alert("Error adding product to backend!");
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this custom product?")) {
      const res = await deleteCustomProduct(id);
      if (res && res.success) {
        loadProducts();
      } else {
        alert("Could not delete product.");
      }
    }
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
        <h1>Luxe Interior Python Admin Dashboard</h1>
        <p>Dynamic Python database catalog and image uploads manager.</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

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
                <label>Price (₹) *</label>
                <input 
                  type="text" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 25,000" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                >
                  <optgroup label="Navbar Categories">
                    <option value="modularkitchen">Modular Kitchen</option>
                    <option value="bedroomcupboard">Bedroom Cupboard</option>
                    <option value="wardrobe">Wardrobes</option>
                    <option value="tvunit">TV Unit</option>
                    <option value="poojacupboard">Pooja Cupboard</option>
                    <option value="showcase">Showcase</option>
                    <option value="woodendoors">Wooden Doors</option>
                    <option value="furniture">Furniture</option>
                    <option value="woodenwork">Wooden Work</option>
                  </optgroup>
                  <optgroup label="Homepage Categories">
                    <option value="explore-sofa">Sofas</option>
                    <option value="explore-bed">Beds</option>
                    <option value="explore-dining">Dining Set</option>
                    <option value="explore-tvunit">TV Units</option>
                    <option value="explore-coffeetable">Coffee Table</option>
                    <option value="explore-mattress">Mattresses</option>
                    <option value="explore-wardrobe">Wardrobes</option>
                    <option value="explore-sofacumbed">Sofa Cum Bed</option>
                    <option value="explore-bookshelf">Bookshelves</option>
                    <option value="explore-study">Study Desk</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Image Selection Tabs */}
            <div className="form-group image-select-group">
              <label>Product Image *</label>
              <div className="image-tabs">
                <button 
                  type="button" 
                  className={imageType === 'upload' ? 'active' : ''} 
                  onClick={() => setImageType('upload')}
                >
                  Upload File
                </button>
                <button 
                  type="button" 
                  className={imageType === 'url' ? 'active' : ''} 
                  onClick={() => setImageType('url')}
                >
                  Image URL
                </button>
              </div>

              {imageType === 'upload' ? (
                <div className="file-upload-input">
                  <input 
                    type="file" 
                    id="admin-file-input"
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Upload preview" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="url-text-input">
                  <input 
                    type="text" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    placeholder="https://example.com/image.jpg" 
                  />
                  {imageUrl && (
                    <div className="image-preview">
                      <img src={imageUrl} alt="URL preview" onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image+URL' }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Detailed Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Describe features, wood species, and fabric quality..." 
                rows="3"
              />
            </div>

            <h3>Technical Specifications</h3>
            
            <div className="form-row-2">
              <div className="form-group">
                <label>Material</label>
                <input 
                  type="text" 
                  name="material" 
                  value={formData.material} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Solid Oak Wood" 
                />
              </div>

              <div className="form-group">
                <label>Dimensions</label>
                <input 
                  type="text" 
                  name="dimensions" 
                  value={formData.dimensions} 
                  onChange={handleInputChange} 
                  placeholder='e.g. 78" W x 80" L' 
                />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Color</label>
                <input 
                  type="text" 
                  name="color" 
                  value={formData.color} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Honey Finish" 
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
                <select 
                  name="assemblyRequired" 
                  value={formData.assemblyRequired} 
                  onChange={handleInputChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-admin-submit">
              ➕ Add Product to Flask Database
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="admin-card admin-list-card">
          <h2>📦 Custom Catalog ({productsList.length} items)</h2>
          {productsList.length === 0 ? (
            <p className="no-items-text">No custom products created in backend yet. Add your first item using the form on the left!</p>
          ) : (
            <div className="custom-items-list">
              {productsList.map(item => (
                <div key={item.id} className="custom-item-row">
                  <img src={item.img} alt={item.name} className="custom-item-thumbnail" />
                  <div className="custom-item-info">
                    <h4>{item.name}</h4>
                    <p className="item-price">{item.price}</p>
                    <span className="item-cat-badge">{item.category.toUpperCase()}</span>
                  </div>
                  <button 
                    className="btn-delete-item" 
                    onClick={() => handleDelete(item.id)}
                    title="Remove Product"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
