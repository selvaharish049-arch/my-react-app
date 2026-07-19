import React, { useState, useEffect, useCallback } from 'react';
import { getAllProducts, deleteCustomProduct } from '../data/productsData';
import BannerImage from './BannerImage';
import CollectionSplit from './CollectionSplit';
import ProductModal from './ProductModal';
import { getPriceDetails, renderStars } from '../utils/priceHelper';
import './CategoryLayout.css'; // Reuse existing product grid & card styles

const CategoryLayout = ({ category, isLoggedIn, userRole, addToCart, triggerLogin }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const all = await getAllProducts();
    setProducts(all.filter(p => p.category === category));
    setLoading(false);
  }, [category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await deleteCustomProduct(id);
      if (res && res.success) {
        loadProducts();
      } else {
        alert("Could not delete product.");
      }
    }
  };

  return (
    <div className="category-page-wrapper">
      {/* 1. Header Collection Banner */}
      <BannerImage category={category} />

      {/* 2. Products Grid List */}
      <div className="product-page-container">
        <p className="collection-grid-sub" style={{ textAlign: 'center', marginTop: '20px' }}>FIND A FIT FOR YOUR HOUSE</p>
        <h2 className="collection-grid-title" style={{ textAlign: 'center', marginBottom: '40px', fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#3e322d', fontWeight: '500' }}>Discover Our Collections</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#8c7d78' }}>No products found in this category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((item) => (
              <div 
                key={item.id} 
                className="product-item" 
                onClick={() => setSelectedProduct(item)} 
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {isLoggedIn && userRole === 'admin' && (
                  <button 
                    className="direct-delete-btn" 
                    onClick={(e) => handleDelete(item.id, e)}
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px', 
                      zIndex: 10, 
                      background: '#e53935', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '4px', 
                      fontWeight: 'bold', 
                      fontSize: '11px', 
                      cursor: 'pointer' 
                    }}
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

      {/* 4. Bottom Split Layout Section */}
      <CollectionSplit category={category} />

      {/* 5. Product Detail Modal */}
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
  );
};

export default CategoryLayout;
