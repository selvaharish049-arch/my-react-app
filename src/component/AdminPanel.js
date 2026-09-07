import React, { useState, useEffect } from 'react';
import { 
  getAllProducts, 
  addCustomProduct, 
  deleteCustomProduct,
  getStoredCraftsmanshipCategories,
  getDeletedCraftsmanshipCategorySlugs,
  saveCraftsmanshipCategory,
  deleteCraftsmanshipCategory,
  fileToBase64
} from '../data/productsData';
import OrderManagement from './OrderManagement';
import './AdminPanel.css';

import img1 from '../assets/d1.jpg';
import img2 from '../assets/d2.jpg';
import img3 from '../assets/d3.jpg';
import img4 from '../assets/d4.jpg';
import img5 from '../assets/d5.jpg';
import img6 from '../assets/d6.jpg';
import img7 from '../assets/d7.jpg';
import img8 from '../assets/d8.jpg';
import img9 from '../assets/d9.jpg';

const CORE_CUSTOM_CATS = [
  'modularkitchen', 'bedroomcupboard', 'wardrobe', 'tvunit',
  'poojacupboard', 'showcase', 'woodendoors', 'furniture', 'woodenwork'
];

const BASE_CRAFTSMANSHIP_CATS = [
  { title: 'Sofa', slug: 'explore-sofa', img: img1 },
  { title: 'Bed', slug: 'explore-bed', img: img2 },
  { title: 'Dining', slug: 'explore-dining', img: img3 },
  { title: 'TV Unit', slug: 'explore-tvunit', img: img4 },
  { title: 'Coffee Table', slug: 'explore-coffeetable', img: img5 },
  { title: 'Mattress', slug: 'explore-mattress', img: img6 },
  { title: 'Wardrobe', slug: 'explore-wardrobe', img: img7 },
  { title: 'Sofa Cum Bed', slug: 'explore-sofacumbed', img: img8 },
  { title: 'Bookshelf', slug: 'explore-bookshelf', img: img9 },
  { title: 'Study', slug: 'explore-study', img: img1 },
];

const AdminPanel = ({ isLoggedIn, userRole }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'customized', 'craftsmanship', 'categories'
  const [productsList, setProductsList] = useState([]);
  const [customCraftCats, setCustomCraftCats] = useState([]);

  const [catForm, setCatForm] = useState({
    title: '',
    slug: '',
    imageType: 'upload',
    imageUrl: '',
    imageFile: null,
    imagePreview: ''
  });

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

  const [imageUrl2, setImageUrl2] = useState('');
  const [imageFile2, setImageFile2] = useState(null);
  const [imagePreview2, setImagePreview2] = useState('');

  const [imageUrl3, setImageUrl3] = useState('');
  const [imageFile3, setImageFile3] = useState(null);
  const [imagePreview3, setImagePreview3] = useState('');

  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCatInput, setShowCustomCatInput] = useState(false);

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

  const loadCategories = () => {
    setCustomCraftCats(getStoredCraftsmanshipCategories());
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    window.addEventListener('craftsmanshipCategoryUpdated', loadCategories);
    return () => window.removeEventListener('craftsmanshipCategoryUpdated', loadCategories);
  }, []);

  const loadProducts = async () => {
    const all = await getAllProducts();
    setProductsList(all);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setShowCustomCatInput(false);
    setCustomCategory('');
    if (tab === 'customized') {
      setFormData(prev => ({ ...prev, category: 'modularkitchen' }));
    } else if (tab === 'craftsmanship') {
      setFormData(prev => ({ ...prev, category: 'explore-sofa' }));
    }
  };

  const handleCategoryFormSubmit = async (e) => {
    e.preventDefault();
    if (!catForm.title.trim()) {
      alert("Please enter Category Title!");
      return;
    }

    let catImg = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
    if (catForm.imageType === 'upload' && catForm.imageFile) {
      const b64 = await fileToBase64(catForm.imageFile);
      if (b64) catImg = b64;
    } else if (catForm.imageType === 'url' && catForm.imageUrl) {
      catImg = catForm.imageUrl;
    }

    const saved = saveCraftsmanshipCategory({
      title: catForm.title.trim(),
      slug: catForm.slug.trim(),
      img: catImg
    });

    if (saved) {
      setMessage(`✅ Craftsmanship Category "${saved.title}" created successfully!`);
      setCatForm({
        title: '',
        slug: '',
        imageType: 'upload',
        imageUrl: '',
        imageFile: null,
        imagePreview: ''
      });
      loadCategories();
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleDeleteCategory = (slug) => {
    if (window.confirm("Are you sure you want to remove this custom category?")) {
      deleteCraftsmanshipCategory(slug);
      loadCategories();
      setMessage("🗑️ Category removed successfully!");
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const b64 = await fileToBase64(file);
      setImagePreview(b64 || URL.createObjectURL(file));
    }
  };

  const handleFileChange2 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile2(file);
      const b64 = await fileToBase64(file);
      setImagePreview2(b64 || URL.createObjectURL(file));
    }
  };

  const handleFileChange3 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile3(file);
      const b64 = await fileToBase64(file);
      setImagePreview3(b64 || URL.createObjectURL(file));
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
    const targetCategory = (showCustomCatInput && customCategory.trim()) 
      ? customCategory.trim().toLowerCase() 
      : formData.category;
    dataToSend.append('category', targetCategory);
    dataToSend.append('description', formData.description);
    
    dataToSend.append('material', formData.material || 'BWP 710 Plywood, HDMR, German Laminate, Acrylic & PU Matte/Gloss');
    dataToSend.append('dimensions', formData.dimensions || '100% Tailored to your home space & layout');
    dataToSend.append('color', formData.color || 'As shown');
    dataToSend.append('warranty', formData.warranty || '10-Year Flat Warranty on Woodwork & Hardware');
    dataToSend.append('assemblyRequired', formData.assemblyRequired);

    if (imageType === 'upload') {
      if (!imageFile) {
        alert("Please choose Main Cover Image 1 to upload!");
        return;
      }
      dataToSend.append('image', imageFile);
      if (imageFile2) dataToSend.append('image2', imageFile2);
      if (imageFile3) dataToSend.append('image3', imageFile3);
    } else {
      if (!imageUrl) {
        alert("Please enter Main Cover Image 1 URL!");
        return;
      }
      dataToSend.append('imageUrl', imageUrl);
      if (imageUrl2) dataToSend.append('imageUrl2', imageUrl2);
      if (imageUrl3) dataToSend.append('imageUrl3', imageUrl3);
    }

    const res = await addCustomProduct(dataToSend);
    if (res) {
      setMessage("✅ Product added to catalog successfully!");
      
      setFormData({
        name: '',
        price: '',
        discountPercent: '26',
        category: activeTab === 'craftsmanship' ? 'explore-sofa' : 'modularkitchen',
        description: '',
        material: '',
        dimensions: '',
        color: '',
        warranty: '',
        assemblyRequired: 'No',
      });
      setShowCustomCatInput(false);
      setCustomCategory('');

      setImageUrl('');
      setImageFile(null);
      setImagePreview('');

      setImageUrl2('');
      setImageFile2(null);
      setImagePreview2('');

      setImageUrl3('');
      setImageFile3(null);
      setImagePreview3('');
      
      const fileInput = document.getElementById('admin-file-input');
      if (fileInput) fileInput.value = '';

      loadProducts();
      window.dispatchEvent(new Event('productDataUpdated'));
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
        window.dispatchEvent(new Event('productDataUpdated'));
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert("Could not delete product.");
      }
    }
  };

  const handleOpenSolutionModal = (product) => {
    setSelectedSolutionProduct(product);
    setSolutionForm({
      customerName: '',
      email: '',
      phone: '',
      productName: product.name,
      solutionDetails: `Recommended Customization: ${product.description || 'Tailored to your space & requirements.'}`
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

    const messageText = `*LUXE INTERIOR - CUSTOM PROPOSAL & SOLUTION*
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
      window.dispatchEvent(new Event('orderStatusUpdated'));
    } catch (err) {}

    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(messageText)}`;
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

  const deletedCatSlugs = getDeletedCraftsmanshipCategorySlugs();
  const activeBaseCraftCats = BASE_CRAFTSMANSHIP_CATS.filter(b => !deletedCatSlugs.includes(b.slug));
  const activeCustomCraftCats = customCraftCats.filter(c => !deletedCatSlugs.includes(c.slug));

  // Filter products based on active tab
  const customizedProductsList = productsList.filter(p => CORE_CUSTOM_CATS.includes((p.category || '').toLowerCase()));
  const craftsmanshipProductsList = productsList.filter(p => !CORE_CUSTOM_CATS.includes((p.category || '').toLowerCase()));

  const currentProductsDisplay = activeTab === 'customized' ? customizedProductsList : craftsmanshipProductsList;

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>⚙️ Luxe Admin Control Dashboard</h1>
        <p>Manage customer project orders, live tracking status, custom solution proposals, and catalog products.</p>
      </div>

      {/* Admin Nav Tabs */}
      <div className="admin-tabs-bar" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button 
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('orders')}
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            background: activeTab === 'orders' ? '#c98544' : '#ffffff',
            color: activeTab === 'orders' ? '#ffffff' : '#3e322d',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          📦 Customer Orders Database
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'customized' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('customized')}
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            background: activeTab === 'customized' ? '#c98544' : '#ffffff',
            color: activeTab === 'customized' ? '#ffffff' : '#3e322d',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          ✨ Core Customized Catalog
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'craftsmanship' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('craftsmanship')}
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            background: activeTab === 'craftsmanship' ? '#c98544' : '#ffffff',
            color: activeTab === 'craftsmanship' ? '#ffffff' : '#3e322d',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          🎨 Our Craftsmanship Catalog
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('categories')}
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            background: activeTab === 'categories' ? '#c98544' : '#ffffff',
            color: activeTab === 'categories' ? '#ffffff' : '#3e322d',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          ➕ Craftsmanship Category Manager
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {activeTab === 'orders' ? (
        <OrderManagement />
      ) : activeTab === 'categories' ? (
        <div className="admin-main-grid">
          {/* Create Craftsmanship Category Form */}
          <div className="admin-card admin-form-card">
            <h2>➕ Create New Craftsmanship Category</h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              Create a new category (e.g. Dining, Recliners, Bar Counter). It will automatically appear as a card on the Homepage slider and in the Admin Target Category select dropdown!
            </p>

            <form onSubmit={handleCategoryFormSubmit} className="admin-product-form">
              <div className="form-group">
                <label>Category Title / Display Name *</label>
                <input 
                  type="text" 
                  value={catForm.title} 
                  onChange={(e) => setCatForm({ ...catForm, title: e.target.value })} 
                  placeholder="e.g. Dining, Recliners, Bar Counter" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Category Code / Slug (Optional)</label>
                <input 
                  type="text" 
                  value={catForm.slug} 
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} 
                  placeholder="e.g. explore-dining (auto-generated if empty)" 
                />
              </div>

              {/* Cover Image for Category */}
              <div className="form-group">
                <label>Category Cover Image *</label>
                <div className="radio-group" style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="catImageType" 
                      value="upload" 
                      checked={catForm.imageType === 'upload'} 
                      onChange={() => setCatForm({ ...catForm, imageType: 'upload' })} 
                    />
                    Upload Local Image
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="catImageType" 
                      value="url" 
                      checked={catForm.imageType === 'url'} 
                      onChange={() => setCatForm({ ...catForm, imageType: 'url' })} 
                    />
                    Image Web URL
                  </label>
                </div>

                {catForm.imageType === 'upload' ? (
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setCatForm({ ...catForm, imageFile: file, imagePreview: URL.createObjectURL(file) });
                      }
                    }} 
                  />
                ) : (
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..." 
                    value={catForm.imageUrl} 
                    onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value, imagePreview: e.target.value })} 
                  />
                )}

                {catForm.imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={catForm.imagePreview} alt="Category Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #c98544' }} />
                  </div>
                )}
              </div>

              <button type="submit" className="btn-admin-submit" style={{ marginTop: '16px' }}>
                ➕ Save & Create Craftsmanship Category
              </button>
            </form>
          </div>

          {/* List Column for Categories */}
          <div className="admin-card admin-list-card">
            <h2>🎨 Craftsmanship Categories List ({activeCustomCraftCats.length + activeBaseCraftCats.length} categories)</h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              Categories listed here are displayed on the Homepage slider and available in Target Category dropdowns for adding products. Click Delete to remove any category.
            </p>
            
            <div className="custom-items-list">
              {/* Custom Added Categories */}
              {activeCustomCraftCats.map(cCat => (
                <div key={cCat.slug} className="custom-item-row" style={{ borderLeft: '4px solid #c98544', padding: '12px', background: '#fff', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                  <img 
                    src={cCat.img} 
                    alt={cCat.title} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="custom-item-info" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{cCat.title} ✨</h4>
                    <span className="item-cat-badge" style={{ background: '#c98544', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      CUSTOM CATEGORY ({cCat.slug})
                    </span>
                  </div>
                  <div className="custom-item-actions">
                    <button 
                      className="btn-delete-item"
                      onClick={() => handleDeleteCategory(cCat.slug)}
                      style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}
                      title="Remove Category"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Base Default Categories */}
              {activeBaseCraftCats.map(bCat => (
                <div key={bCat.slug} className="custom-item-row" style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={bCat.img} 
                    alt={bCat.title} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="custom-item-info" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#333' }}>{bCat.title}</h4>
                    <span className="item-cat-badge" style={{ background: '#888', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                      BASE CATEGORY ({bCat.slug})
                    </span>
                  </div>
                  <div className="custom-item-actions">
                    <button 
                      className="btn-delete-item"
                      onClick={() => handleDeleteCategory(bCat.slug)}
                      style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}
                      title="Remove Category"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-main-grid">
          {/* Form Column */}
          <div className="admin-card admin-form-card">
            <h2>
              {activeTab === 'customized' ? '✨ Add Core Customized Reference Design' : '🎨 Add Our Craftsmanship Product'}
            </h2>
            <form onSubmit={handleFormSubmit} className="admin-product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder={activeTab === 'customized' ? "e.g. Royal Teak Modular Kitchen" : "e.g. Velvet Chesterfield Sofa"} 
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Est. Reference Budget (₹) *</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 145000" 
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
                <label>Target Category *</label>
                {!showCustomCatInput ? (
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={(e) => {
                      if (e.target.value === 'custom_other') {
                        setShowCustomCatInput(true);
                      } else {
                        handleInputChange(e);
                      }
                    }} 
                    required
                  >
                    {activeTab === 'customized' ? (
                      <optgroup label="Core Customized Categories">
                        <option value="modularkitchen">Modular Kitchen</option>
                        <option value="bedroomcupboard">Bedroom Cupboard</option>
                        <option value="wardrobe">Wardrobe</option>
                        <option value="tvunit">TV Unit</option>
                        <option value="poojacupboard">Pooja Cupboard</option>
                        <option value="showcase">Showcase</option>
                        <option value="woodendoors">Wooden Doors</option>
                        <option value="furniture">Furniture</option>
                        <option value="woodenwork">Wooden Work</option>
                        <option value="custom_other">✏️ + Add New Custom Category Name...</option>
                      </optgroup>
                    ) : (
                      <optgroup label="Our Craftsmanship Categories">
                        {activeBaseCraftCats.map(bCat => (
                          <option key={bCat.slug} value={bCat.slug}>{bCat.title}</option>
                        ))}
                        {activeCustomCraftCats.map(cat => (
                          <option key={cat.slug} value={cat.slug}>{cat.title}</option>
                        ))}
                        <option value="custom_other">✏️ + Add New Custom Category Name...</option>
                      </optgroup>
                    )}
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. explore-sofa, recliners, custom-decor..." 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => { setShowCustomCatInput(false); setCustomCategory(''); }}
                      style={{ background: '#777', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px' }}
                    >
                      ↩ Select List
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description / About Details *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Sleek acrylic finish with soft-close Blum drawers & quartz countertop..." 
                  rows="3" 
                  required 
                />
              </div>

              {/* Image Input Selection */}
              <div className="form-group">
                <label>Product Image Source (3 Images Gallery)</label>
                <div className="radio-group" style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="imageType" 
                      value="upload" 
                      checked={imageType === 'upload'} 
                      onChange={() => setImageType('upload')} 
                    />
                    Upload Local Images
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="imageType" 
                      value="url" 
                      checked={imageType === 'url'} 
                      onChange={() => setImageType('url')} 
                    />
                    Image Web URLs
                  </label>
                </div>

                {imageType === 'upload' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Image 1 */}
                    <div style={{ background: '#faf6f0', border: '1px solid #e8decb', padding: '10px 12px', borderRadius: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#3c312e', display: 'block', marginBottom: '4px' }}>
                        📷 1st Image (Main Cover) *
                      </label>
                      <input 
                        type="file" 
                        id="admin-file-input"
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                      {imagePreview && (
                        <div style={{ marginTop: '8px' }}>
                          <img src={imagePreview} alt="Preview 1" style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #c98544' }} />
                        </div>
                      )}
                    </div>

                    {/* Image 2 */}
                    <div style={{ background: '#faf6f0', border: '1px solid #e8decb', padding: '10px 12px', borderRadius: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#3c312e', display: 'block', marginBottom: '4px' }}>
                        📷 2nd Image (Left Corner Gallery View 2)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange2} 
                      />
                      {imagePreview2 && (
                        <div style={{ marginTop: '8px' }}>
                          <img src={imagePreview2} alt="Preview 2" style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #c98544' }} />
                        </div>
                      )}
                    </div>

                    {/* Image 3 */}
                    <div style={{ background: '#faf6f0', border: '1px solid #e8decb', padding: '10px 12px', borderRadius: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#3c312e', display: 'block', marginBottom: '4px' }}>
                        📷 3rd Image (Left Corner Gallery View 3)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange3} 
                      />
                      {imagePreview3 && (
                        <div style={{ marginTop: '8px' }}>
                          <img src={imagePreview3} alt="Preview 3" style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #c98544' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Image 1 URL */}
                    <div style={{ background: '#faf6f0', border: '1px solid #e8decb', padding: '10px 12px', borderRadius: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#3c312e', display: 'block', marginBottom: '4px' }}>1st Image URL (Main Cover) *</label>
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..." 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                      />
                      {imageUrl && (
                        <div style={{ marginTop: '6px' }}>
                          <img src={imageUrl} alt="Preview 1" style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #c98544' }} />
                        </div>
                      )}
                    </div>

                    {/* Image 2 URL */}
                    <div style={{ background: '#faf6f0', border: '1px solid #e8decb', padding: '10px 12px', borderRadius: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#3c312e', display: 'block', marginBottom: '4px' }}>2nd Image URL (Gallery View 2)</label>
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..." 
                        value={imageUrl2} 
                        onChange={(e) => setImageUrl2(e.target.value)} 
                      />
                      {imageUrl2 && (
                        <div style={{ marginTop: '6px' }}>
                          <img src={imageUrl2} alt="Preview 2" style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #c98544' }} />
                        </div>
                      )}
                    </div>

                    {/* Image 3 URL */}
                    <div style={{ background: '#faf6f0', border: '1px solid #e8decb', padding: '10px 12px', borderRadius: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#3c312e', display: 'block', marginBottom: '4px' }}>3rd Image URL (Gallery View 3)</label>
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..." 
                        value={imageUrl3} 
                        onChange={(e) => setImageUrl3(e.target.value)} 
                      />
                      {imageUrl3 && (
                        <div style={{ marginTop: '6px' }}>
                          <img src={imageUrl3} alt="Preview 3" style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #c98544' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications Block */}
              <div className="specifications-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div className="form-group">
                  <label>Material Options</label>
                  <input 
                    type="text" 
                    name="material" 
                    value={formData.material} 
                    onChange={handleInputChange} 
                    placeholder="BWP 710 Plywood, HDMR, German Laminate..." 
                  />
                </div>
                <div className="form-group">
                  <label>Customization</label>
                  <input 
                    type="text" 
                    name="dimensions" 
                    value={formData.dimensions} 
                    onChange={handleInputChange} 
                    placeholder="100% Tailored to your home space & layout" 
                  />
                </div>
                <div className="form-group">
                  <label>Color / Finish</label>
                  <input 
                    type="text" 
                    name="color" 
                    value={formData.color} 
                    onChange={handleInputChange} 
                    placeholder="As Shown / Custom Shades" 
                  />
                </div>
                <div className="form-group">
                  <label>Warranty</label>
                  <input 
                    type="text" 
                    name="warranty" 
                    value={formData.warranty} 
                    onChange={handleInputChange} 
                    placeholder="10-Year Flat Warranty on Woodwork & Hardware" 
                  />
                </div>
              </div>

              <button type="submit" className="btn-admin-submit" style={{ marginTop: '16px' }}>
                ➕ Add Product to {activeTab === 'customized' ? 'Core Customized Catalog' : 'Our Craftsmanship Catalog'}
              </button>
            </form>
          </div>

          {/* List Column */}
          <div className="admin-card admin-list-card">
            <h2>
              📦 {activeTab === 'customized' ? 'Core Customized Products' : 'Our Craftsmanship Products'} ({currentProductsDisplay.length} items)
            </h2>
            {currentProductsDisplay.length === 0 ? (
              <p className="no-items-text">No products found in this section catalog yet.</p>
            ) : (
              <div className="custom-items-list">
                {currentProductsDisplay.map(item => (
                  <div key={item.id} className="custom-item-row">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="custom-item-thumbnail" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
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
        <div className="admin-modal-overlay" onClick={() => setSelectedSolutionProduct(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedSolutionProduct(null)}>&times;</button>
            
            <h2>📱 Send Custom Solution via WhatsApp</h2>
            <p className="modal-sub-text">
              Prepare custom proposal for <strong>{selectedSolutionProduct.name}</strong> ({selectedSolutionProduct.price}) and open pre-filled WhatsApp message.
            </p>

            <form onSubmit={handleSendSolutionWhatsApp} className="solution-form">
              <div className="form-group">
                <label>Customer Full Name *</label>
                <input 
                  type="text"
                  value={solutionForm.customerName}
                  onChange={(e) => setSolutionForm({ ...solutionForm, customerName: e.target.value })}
                  placeholder="e.g. Karthik Raja"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Customer Phone Number *</label>
                  <input 
                    type="tel"
                    value={solutionForm.phone}
                    onChange={(e) => setSolutionForm({ ...solutionForm, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Customer Email (Optional)</label>
                  <input 
                    type="email"
                    value={solutionForm.email}
                    onChange={(e) => setSolutionForm({ ...solutionForm, email: e.target.value })}
                    placeholder="customer@gmail.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Custom Interior Solution Details & Specs *</label>
                <textarea 
                  value={solutionForm.solutionDetails}
                  onChange={(e) => setSolutionForm({ ...solutionForm, solutionDetails: e.target.value })}
                  rows="4"
                  placeholder="Details of custom size, wood materials, laminate color, estimated budget, timeline..."
                  required
                />
              </div>

              <div className="modal-btn-row">
                <button type="submit" className="btn-confirm-solution">
                  🚀 Send Proposal on WhatsApp & Track
                </button>
                <button type="button" className="btn-cancel-modal" onClick={() => setSelectedSolutionProduct(null)}>
                  Cancel
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
