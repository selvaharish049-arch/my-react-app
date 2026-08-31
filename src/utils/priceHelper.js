import React from 'react';

export const getPriceDetails = (priceStr) => {
  if (!priceStr) return { price: '₹0', original: '', discount: '' };
  const cleanPrice = parseInt(priceStr.toString().replace(/[₹,]/g, '')) || 0;
  if (!cleanPrice) return { price: priceStr, original: '', discount: '' };
  
  // Deterministic fake original price & discount based on price value
  const discountPercent = 40 + (cleanPrice % 15); // yields between 40% and 54%
  const originalPrice = Math.round(cleanPrice / (1 - discountPercent / 100));
  
  return {
    price: `₹${cleanPrice.toLocaleString()}`,
    original: `₹${originalPrice.toLocaleString()}`,
    discount: `${discountPercent}% OFF`
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
