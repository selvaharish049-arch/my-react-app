import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getAllProducts, 
  deleteCustomProduct, 
  getStoredCraftsmanshipCategories, 
  deleteCraftsmanshipCategory
} from '../data/productsData';
import ProductModal from './ProductModal';
import { getPriceDetails, renderStars } from '../utils/priceHelper';
import './ProductPage.css';

import BannerImage from './BannerImage';
import CollectionSplit from './CollectionSplit';

const ProductPage = ({ isLoggedIn, userRole, addToCart, triggerLogin }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [customCatsList, setCustomCatsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize inputs
  const rawQuery = (name || '').trim();
  const query = rawQuery.toLowerCase();
  const queryClean = query.replace('explore-', '').replace(/\s+/g, '');

  const baseCategories = [
    'sofa', 'table', 'curtain', 'mattress', 'dining', 'lamp', 'pillow', 'modularkitchen', 'coffeetable',
    'bed', 'tvunit', 'wardrobe', 'sofacumbed', 'bookshelf', 'study',
    'bedroomcupboard', 'poojacupboard', 'showcase', 'woodendoors', 'furniture', 'woodenwork',
    'explore-sofa', 'explore-bed', 'explore-dining', 'explore-tvunit', 'explore-coffeetable',
    'explore-mattress', 'explore-wardrobe', 'explore-sofacumbed', 'explore-bookshelf', 'explore-study'
  ];

  useEffect(() => {
    loadProducts();
    window.addEventListener('productDataUpdated', loadProducts);
    window.addEventListener('productUpdated', loadProducts);
    window.addEventListener('craftsmanshipCategoryUpdated', loadProducts);
    window.addEventListener('storage', loadProducts);
    return () => {
      window.removeEventListener('productDataUpdated', loadProducts);
      window.removeEventListener('productUpdated', loadProducts);
      window.removeEventListener('craftsmanshipCategoryUpdated', loadProducts);
      window.removeEventListener('storage', loadProducts);
    };
  }, [name, isLoggedIn]);

  const loadProducts = async () => {
    const list = await getAllProducts();
    const cCats = getStoredCraftsmanshipCategories();
    setProductsList(list);
    setCustomCatsList(cCats);
    setLoading(false);
  };

  const handleDeleteProduct = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await deleteCustomProduct(id);
      if (res && res.success) {
        await loadProducts();
        return true;
      } else {
        alert("Could not delete product.");
        return false;
      }
    }
    return false;
  };

  const handleDeleteCategory = (slug, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this craftsmanship category?")) {
      deleteCraftsmanshipCategory(slug);
      loadProducts();
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="product-page-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h3>Loading Collections...</h3>
      </div>
    );
  }

  // Combine custom category slugs & titles + dynamic product categories into valid categories list
  const customCatSlugs = customCatsList.map(c => (c.slug || '').toLowerCase());
  const customCatCleanSlugs = customCatsList.map(c => (c.slug || '').replace('explore-', '').toLowerCase());
  const customCatTitles = customCatsList.map(c => (c.title || '').toLowerCase());
  const prodCatSlugs = productsList.map(p => String(p.category || '').toLowerCase());
  const prodCatCleanSlugs = productsList.map(p => String(p.category || '').replace('explore-', '').toLowerCase());

  const allCategories = [
    ...baseCategories,
    ...customCatSlugs,
    ...customCatCleanSlugs,
    ...customCatTitles,
    ...prodCatSlugs,
    ...prodCatCleanSlugs
  ];

  const matchedCustomCat = customCatsList.find(c => {
    const s = (c.slug || '').toLowerCase();
    const t = (c.title || '').toLowerCase();
    const cs = s.replace('explore-', '').replace(/\s+/g, '');
    const ts = t.replace('explore-', '').replace(/\s+/g, '');
    return s === query || t === query || cs === queryClean || ts === queryClean;
  });

  let renderedContent = null;
  let pageTitle = '';

  const getCategoryTitle = (cat) => {
    if (matchedCustomCat) return matchedCustomCat.title;

    // Check if any product has category matching query
    const sampleProd = productsList.find(p => {
      const c = String(p.category || '').toLowerCase().trim();
      const cClean = c.replace('explore-', '').replace(/\s+/g, '');
      return c === query || cClean === queryClean;
    });

    if (sampleProd && sampleProd.category) {
      const rawCat = sampleProd.category.replace('explore-', '');
      return rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
    }

    const titles = {
      'modularkitchen': 'Modular Kitchen Collection',
      'coffeetable': 'Coffee Tables',
      'tvunit': 'TV Units',
      'sofacumbed': 'Sofa Cum Beds',
      'bookshelf': 'Bookshelves & Cases',
      'study': 'Study Tables & Desks',
      'bed': 'King & Queen Beds',
      'wardrobe': 'Wardrobes & Closets',
      'bedroomcupboard': 'Bedroom Cupboard Collection',
      'poojacupboard': 'Pooja Cupboard Collection',
      'showcase': 'Showcase Collection',
      'woodendoors': 'Wooden Doors Collection',
      'furniture': 'Furniture Collection',
      'woodenwork': 'Wooden Work Collection',
      'explore-sofa': 'Sofa Collection',
      'explore-bed': 'King & Queen Beds',
      'explore-dining': 'Dining Collection',
      'explore-tvunit': 'TV Entertainment Units',
      'explore-coffeetable': 'Coffee Tables',
      'explore-mattress': 'Mattresses',
      'explore-wardrobe': 'Wardrobes & Closets',
      'explore-sofacumbed': 'Sofa Cum Beds',
      'explore-bookshelf': 'Bookshelves & Cases',
      'explore-study': 'Study Tables & Desks'
    };
    return titles[cat] || `${cat.charAt(0).toUpperCase() + cat.slice(1)} Collection`;
  };

  const isCategoryQuery = allCategories.includes(query) || allCategories.includes(queryClean) || !!matchedCustomCat;

  if (isCategoryQuery) {
    // 1. Filter products belonging to this category cleanly matching slug or clean name
    const filteredProducts = productsList.filter(p => {
      if (!p || !p.category) return false;
      const c = String(p.category).toLowerCase().trim();
      const cClean = c.replace('explore-', '').replace(/\s+/g, '');
      const catSlugClean = matchedCustomCat ? (matchedCustomCat.slug || '').toLowerCase().replace('explore-', '').replace(/\s+/g, '') : '';
      const catTitleClean = matchedCustomCat ? (matchedCustomCat.title || '').toLowerCase().replace('explore-', '').replace(/\s+/g, '') : '';

      return (
        c === query ||
        cClean === queryClean ||
        c === queryClean ||
        cClean === query ||
        (matchedCustomCat && (
          c === (matchedCustomCat.slug || '').toLowerCase() ||
          c === (matchedCustomCat.title || '').toLowerCase() ||
          cClean === catSlugClean ||
          cClean === catTitleClean
        ))
      );
    });

    pageTitle = getCategoryTitle(query);

    // If no specific sub-products exist yet for a custom category created by admin (e.g. chair, pen, pencil),
    // generate a Craftsmanship Category Product item so clicking it opens full Product Details!
    let displayProducts = [...filteredProducts];

    renderedContent = (
      <div>
        {displayProducts.length === 0 ? (
          <div className="search-empty" style={{ textAlign: 'center', padding: '60px 20px', background: '#faf8f5', borderRadius: '12px', margin: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛋️</div>
            <h3 style={{ color: '#2c211e', fontSize: '20px', marginBottom: '8px' }}>No sub-products in "{pageTitle}" yet</h3>
            <p className="no-items" style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              We are currently crafting new custom designs for this collection.
            </p>
            {isLoggedIn && userRole === 'admin' ? (
              <button 
                className="btn-back-home" 
                onClick={() => navigate('/admin')}
                style={{ background: '#c98544', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ➕ Add Sub-Products in Admin Panel
              </button>
            ) : (
              <button className="btn-back-home" onClick={() => navigate('/homedecor')}>View All Craftsmanship Collections</button>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {displayProducts.map((item) => (
              <div 
                key={item.id} 
                className="product-item" 
                onClick={() => setSelectedProduct(item)} 
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {/* Admin delete button */}
                {isLoggedIn && userRole === 'admin' && (
                  <button 
                    className="direct-delete-btn" 
                    onClick={(e) => {
                      if (item.isCategoryPlaceholder) {
                        handleDeleteCategory(item.slug, e);
                      } else {
                        handleDeleteProduct(item.id, e);
                      }
                    }}
                    title="Delete Category/Product"
                  >
                    🗑️ Delete
                  </button>
                )}

                <img src={item.img} alt={item.name} className="product-img" />
                <h3>{item.name}</h3>
                {renderStars(item.rating || 5)}
                {(() => {
                  const priceInfo = getPriceDetails(item.price, item);
                  return (
                    <div className="product-card-price-row">
                      <span className="product-card-current-price">{priceInfo.price}</span>
                      {priceInfo.original && (
                        <span className="product-card-original-price">{priceInfo.original}</span>
                      )}
                      {priceInfo.discount && (
                        <span className="product-card-discount-tag">{priceInfo.discount}</span>
                      )}
                    </div>
                  );
                })()}
                <div className="button-group" style={{ marginTop: '12px' }}>
                  <button 
                    className="add-cart" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(item);
                    }}
                    style={{ background: '#3e322d', color: '#fff', width: '100%', fontSize: '13px', padding: '10px 12px', borderRadius: '6px' }}
                  >
                    ✨ View Details & Customize
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    // 2. Specific product search or keyword queries
    const exactMatch = productsList.find(p => p.name.toLowerCase() === query);
    
    if (exactMatch) {
      pageTitle = exactMatch.name;
      renderedContent = (
        <div className="direct-detail-container">
          <div className="detail-grid">
            <div className="detail-media" style={{ position: 'relative' }}>
              {isLoggedIn && userRole === 'admin' && (
                <button 
                  className="direct-delete-btn" 
                  onClick={async (e) => {
                    const deleted = await handleDeleteProduct(exactMatch.id, e);
                    if (deleted) {
                      navigate(-1);
                    }
                  }}
                  style={{ top: '10px', right: '10px' }}
                >
                  🗑️ Delete Product
                </button>
              )}
              <img src={exactMatch.img} alt={exactMatch.name} />
            </div>
            <div className="detail-info">
              <span className="detail-cat-badge">{exactMatch.category.toUpperCase()}</span>
              <h2>{exactMatch.name}</h2>
              <p className="detail-price">{exactMatch.price}</p>
              <p className="detail-desc">{exactMatch.description || "Premium craft piece designed to enrich your lifestyle."}</p>
              
              <div className="detail-specs">
                <h4>Specifications:</h4>
                <table>
                  <tbody>
                    {exactMatch.specifications ? (
                      Object.entries(exactMatch.specifications).map(([key, val]) => (
                        <tr key={key}>
                          <td><strong>{key}</strong></td>
                          <td>{val}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>Material</td>
                        <td>Premium Quality Wood & Fabric</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="detail-actions">
                <button 
                  className="btn-detail-add-cart"
                  onClick={() => {
                    if (!isLoggedIn) {
                      alert("⚠️ Access Restricted: Please login to your account first before adding items to your cart.");
                      if (triggerLogin) triggerLogin();
                    } else {
                      addToCart({ id: exactMatch.id, name: exactMatch.name, price: exactMatch.price, img: exactMatch.img });
                    }
                  }}
                >
                  🛒 Add to Cart
                </button>
                <button className="btn-detail-whatsapp" onClick={() => setSelectedProduct(exactMatch)}>
                  💬 Buy via WhatsApp & Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // General keywords filter
      const searchResults = productsList.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );

      pageTitle = `Search Results for "${name}"`;

      renderedContent = (
        <div>
          {searchResults.length === 0 ? (
            <div className="search-empty">
              <p>No products match your search. Try searching for "sofa", "table", "kitchen", or "lamp".</p>
              <button className="btn-back-home" onClick={() => navigate('/homedecor')}>View Craftsmanship Catalog</button>
            </div>
          ) : (
            <div className="product-grid">
              {searchResults.map((item) => (
                <div key={item.id} className="product-item" onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer', position: 'relative' }}>
                  
                  {isLoggedIn && userRole === 'admin' && (
                    <button 
                      className="direct-delete-btn" 
                      onClick={(e) => handleDeleteProduct(item.id, e)}
                      title="Delete Product"
                    >
                      🗑️ Delete
                    </button>
                  )}

                  <img src={item.img} alt={item.name} className="product-img" />
                  <h3>{item.name}</h3>
                  {renderStars(item.rating)}
                  {(() => {
                    const priceInfo = getPriceDetails(item.price, item);
                    return (
                      <div className="product-card-price-row">
                        <span className="product-card-current-price" style={{ fontSize: '13px', color: '#7a6b65' }}>
                          Est. Budget: <strong style={{ color: '#3e322d', fontSize: '15px' }}>{priceInfo.price}</strong>
                        </span>
                      </div>
                    );
                  })()}
                  <div className="button-group" style={{ marginTop: '12px' }}>
                    <button 
                      className="add-cart" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(item);
                      }}
                      style={{ background: '#3e322d', color: '#fff', width: '100%', fontSize: '13px', padding: '10px 12px', borderRadius: '6px' }}
                    >
                      ✨ View Details & Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="product-page-wrapper">
      <BannerImage category={queryClean} />

      <div className="product-page-container">
        <button className="btn-page-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {isCategoryQuery ? (
          <>
            <p className="collection-grid-sub" style={{ textAlign: 'center', marginTop: '10px' }}>FIND A FIT FOR YOUR HOUSE</p>
            <h2 className="collection-grid-title" style={{ textAlign: 'center', marginBottom: '40px', fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#3e322d', fontWeight: '500' }}>{pageTitle}</h2>
          </>
        ) : (
          <h1 className="page-heading">{pageTitle}</h1>
        )}

        {renderedContent}

        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            addToCart={addToCart} 
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            triggerLogin={triggerLogin}
          />
        )}
      </div>

      {isCategoryQuery && <CollectionSplit />}
    </div>
  );
};

export default ProductPage;