import React from 'react';
import ImageBanner from './ImageBanner';

/**
 * BannerImage wrapper for backward compatibility.
 * Delegates rendering to the centralized ImageBanner component.
 */
const BannerImage = ({ category }) => {
  return <ImageBanner type="product" category={category} />;
};

export default BannerImage;
