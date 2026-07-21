import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts, deleteCustomProduct } from '../data/productsData';
import ProductModal from './ProductModal';
import { getPriceDetails, renderStars } from '../utils/priceHelper';
import './ProductPage.css';

import BannerImage from './BannerImage';
import CollectionSplit from './CollectionSplit';

const ProductPage = ({ isLoggedIn, userRole, addToCart, triggerLogin }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize inputs
  const query = (name || '').trim().toLowerCase();

  // Categories list (Includes Navbar 9 categories + Homepage 10 categories)
  const categories = [
    'sofa', 'table', 'curtain', 'mattress', 'dining', 'lamp', 'pillow', 'modularkitchen', 'coffeetable',
    'bed', 'tvunit', 'wardrobe', 'sofacumbed', 'bookshelf', 'study',
    'bedroomcupboard', 'poojacupboard', 'showcase', 'woodendoors', 'furniture', 'woodenwork',
    'explore-sofa', 'explore-bed', 'explore-dining', 'explore-tvunit', 'explore-coffeetable',
    'explore-mattress', 'explore-wardrobe', 'explore-sofacumbed', 'explore-bookshelf', 'explore-study'
  ];



  useEffect(() => {
    loadProducts();
  }, [name]); // Reload whenever name URL changes

  const loadProducts = async () => {
    setLoading(true);
    const list = await getAllProducts();
    setProductsList(list);
    setLoading(false);
  };

  const handleDeleteProduct = async (id, e) => {
    e.stopPropagation(); // Avoid triggering details modal
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await deleteCustomProduct(id);
      if (res && res.success) {
        loadProducts();
      } else {
        alert("Could not delete product.");
      }
    }
  };

  if (loading) {
    return (
      <div className="product-page-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h3>Loading Collections...</h3>
      </div>
    );
  }

  let renderedContent = null;
  let pageTitle = '';

  const getCategoryTitle = (cat) => {
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

  if (categories.includes(query)) {
    // 1. Category layout rendering
    const filteredProducts = productsList.filter(p => p.category === query);
    pageTitle = getCategoryTitle(query);

    renderedContent = (
      <div>
        {filteredProducts.length === 0 ? (
          <p className="no-items">No products found in this category.</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((item) => (
              <div key={item.id} className="product-item" onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer', position: 'relative' }}>
                
                {/* Admin direct delete button */}
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
                  const priceInfo = getPriceDetails(item.price);
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
                <div className="button-group">
                  <button 
                    className="add-cart" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoggedIn) {
                        alert("⚠️ Access Restricted: Please login to your account first before adding items to your cart.");
                        if (triggerLogin) triggerLogin();
                      } else {
                        addToCart({ id: item.id, name: item.name, price: item.price, img: item.img });
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className="buy-now" onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}>
                    Buy Now
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
                  onClick={(e) => {
                    handleDeleteProduct(exactMatch.id, e);
                    navigate(-1);
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
                  💬 Buy via WhatsApp
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
              <button className="btn-back-home" onClick={() => navigate('/')}>Back to Home</button>
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
                    const priceInfo = getPriceDetails(item.price);
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
                  <div className="button-group">
                    <button 
                      className="add-cart" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLoggedIn) {
                          alert("⚠️ Access Restricted: Please login to your account first before adding items to your cart.");
                          if (triggerLogin) triggerLogin();
                        } else {
                          addToCart({ id: item.id, name: item.name, price: item.price, img: item.img });
                        }
                      }}
                    >
                      Add to Cart
                    </button>
                    <button className="buy-now" onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}>
                      Buy Now
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
      <BannerImage category={query} />

      <div className="product-page-container">
        <button className="btn-page-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {categories.includes(query) ? (
          <>
            <p className="collection-grid-sub" style={{ textAlign: 'center', marginTop: '10px' }}>FIND A FIT FOR YOUR HOUSE</p>
            <h2 className="collection-grid-title" style={{ textAlign: 'center', marginBottom: '40px', fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#3e322d', fontWeight: '500' }}>Discover Our Collections</h2>
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
            triggerLogin={triggerLogin}
          />
        )}
      </div>

      {categories.includes(query) && <CollectionSplit />}
    </div>
  );
};

export default ProductPage;