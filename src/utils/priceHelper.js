import React from 'react';

export const getPriceDetails = (priceStr, productObj = {}) => {
  if (!priceStr) return { price: '₹0', original: '', discount: '' };
  const cleanPrice = parseInt(priceStr.toString().replace(/[₹,]/g, '')) || 0;
  if (!cleanPrice) return { price: priceStr, original: '', discount: '' };
  
  if (productObj && productObj.discountPercent !== undefined && productObj.discountPercent !== null) {
    const discNum = parseInt(productObj.discountPercent, 10) || 0;
    const originalPrice = Math.round(cleanPrice / (1 - Math.min(discNum, 90) / 100));
    return {
      price: `₹${cleanPrice.toLocaleString()}`,
      original: productObj.original || `₹${originalPrice.toLocaleString()}`,
      discount: `-${discNum}%`
    };
  }

  if (productObj && productObj.original) {
    const origClean = parseInt(productObj.original.toString().replace(/[₹,]/g, '')) || 0;
    const disc = origClean > cleanPrice ? Math.round(((origClean - cleanPrice) / origClean) * 100) : 26;
    return {
      price: `₹${cleanPrice.toLocaleString()}`,
      original: `₹${origClean.toLocaleString()}`,
      discount: `-${disc}%`
    };
  }

  // Default discount calculation
  const discountPercent = 26;
  const originalPrice = Math.round(cleanPrice / (1 - discountPercent / 100));
  
  return {
    price: `₹${cleanPrice.toLocaleString()}`,
    original: `₹${originalPrice.toLocaleString()}`,
    discount: `-${discountPercent}%`
  };
};

export const renderStars = (rating) => {
  const stars = [];
  const rateVal = rating || 4.5;
  const floor = Math.floor(rateVal);
  for (let i = 1; i <= 5; i++) {
    if (i <= floor) {
      stars.push(<span key={i} className="product-card-star">★</span>);
    } else {
      stars.push(<span key={i} className="product-card-star" style={{ color: '#ccc' }}>☆</span>);
    }
  }
  
  // Deterministic ratings count based on rating value
  const ratingCount = Math.round((rateVal * 1000) % 850) + 35;
  return (
    <div className="product-card-rating-row">
      {stars}
      <span className="product-card-rating-count">({ratingCount})</span>
    </div>
  );
};
