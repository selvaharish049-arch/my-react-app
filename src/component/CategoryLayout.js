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
  }, [loadProducts, isLoggedIn]);

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
        <p className="collection-grid-sub" style={{ textAlign: 'center', marginTop: '20px', letterSpacing: '2px', textTransform: 'uppercase', color: '#c98544', fontWeight: '700', fontSize: '11.5px' }}>
          INSPIRATION & REFERENCE DESIGNS
        </p>
        <h2 className="collection-grid-title" style={{ textAlign: 'center', marginBottom: '14px', fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#3e322d', fontWeight: '500' }}>
          Customized Interior Space Collections
        </h2>

        {/* Customization Callout Box */}
        <div style={{
          maxWidth: '860px',
          margin: '0 auto 36px auto',
          background: '#faf6f0',
          border: '1px solid #e8decb',
          borderRadius: '12px',
          padding: '18px 24px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
        }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#5c4e48' }}>
            💡 <strong>Love any of these interior designs?</strong> We can create a similar look specifically for your home. Every design is customized according to your home space, layout, style, colour preferences, storage requirements, materials, and budget.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>Loading inspiration designs...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#8c7d78' }}>No reference designs found in this category.</p>
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
                  const priceInfo = getPriceDetails(item.price, item);
                  return (
                    <div className="product-card-price-row">
                      <span className="product-card-current-price" style={{ fontSize: '13px', color: '#7a6b65' }}>
                        Est. Budget: <strong style={{ color: '#3e322d', fontSize: '15px' }}>{priceInfo.price}</strong>
                      </span>
                    </div>
                  );
                })()}
                
                {/* Customization Action Buttons */}
                <div className="button-group" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button 
                    className="add-cart" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(item);
                    }}
                    style={{ background: '#3e322d', color: '#fff', flex: 1, fontSize: '12px', padding: '9px 8px', borderRadius: '6px' }}
                  >
                    ✨ Customize
                  </button>

                  <button 
                    className="add-cart" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(item);
                    }}
                    style={{ background: '#c98544', color: '#fff', flex: 1, fontSize: '12px', padding: '9px 8px', borderRadius: '6px', fontWeight: 'bold' }}
                  >
                    📅 Book Consult
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
          userRole={userRole}
          triggerLogin={triggerLogin}
        />
      )}
    </div>
  );
};

export default CategoryLayout;
