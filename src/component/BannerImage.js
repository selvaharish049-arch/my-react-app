import React from 'react';
import './BannerImage.css';

// Banner imports
import kitchenBanner from '../assets/kb.avif';
import bedroomcupboardBanner from '../assets/cbb1.jpg';
import wardrobeBanner from '../assets/cb1.jpg';
import tvunitBanner from '../assets/d4.jpg';
import poojacupboardBanner from '../assets/pb1.webp';
import showcaseBanner from '../assets/sb3.avif';
import doorsBanner from '../assets/d0.jpg';
import furnitureBanner from '../assets/d2.jpg';
import woodenworkBanner from '../assets/ab.webp';

// Explore banner imports
import sofaBanner from '../assets/sb3.avif';
import bedBanner from '../assets/d2.jpg';
import diningBanner from '../assets/ab2.avif';
import tvunitExploreBanner from '../assets/d4.jpg';
import coffeetableBanner from '../assets/cbb1.jpg';
import mattressBanner from '../assets/mb.jpg';
import wardrobeExploreBanner from '../assets/d7.jpg';
import sofaCumBedBanner from '../assets/d8.jpg';
import bookshelfBanner from '../assets/d9.jpg';
import studyBanner from '../assets/d1.jpg';

const categoryBanners = {
  // Navbar categories
  'modularkitchen': kitchenBanner,
  'bedroomcupboard': bedroomcupboardBanner,
  'wardrobe': wardrobeBanner,
  'tvunit': tvunitBanner,
  'poojacupboard': poojacupboardBanner,
  'showcase': showcaseBanner,
  'woodendoors': doorsBanner,
  'furniture': furnitureBanner,
  'woodenwork': woodenworkBanner,

  // Explore categories
  'explore-sofa': sofaBanner,
  'explore-bed': bedBanner,
  'explore-dining': diningBanner,
  'explore-tvunit': tvunitExploreBanner,
  'explore-coffeetable': coffeetableBanner,
  'explore-mattress': mattressBanner,
  'explore-wardrobe': wardrobeExploreBanner,
  'explore-sofacumbed': sofaCumBedBanner,
  'explore-bookshelf': bookshelfBanner,
  'explore-study': studyBanner,
};

const BannerImage = ({ category }) => {
  const query = (category || '').trim().toLowerCase();
  const bannerImg = categoryBanners[query];

  if (!bannerImg) return null;

  return (
    <div className="category-banner-container">
      <img src={bannerImg} alt={`${query} Banner`} className="category-banner-image" />
    </div>
  );
};

export default BannerImage;
