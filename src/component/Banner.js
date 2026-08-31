import React from 'react';
import './Banner.css';

// Import Swiper components & modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules'; 

// Core Swiper styles CSS imports
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Import our high-quality generated assets as slides
import slide1 from '../assets/collection_banner_room.jpg'; 
import slide2 from '../assets/portfolio_penthouse.jpg'; 
import slide3 from '../assets/portfolio_townhouse.jpg'; 

const bannerSlides = [
  {
    img: slide1,
    title: 'Elevated Living Spaces, Timeless Design',
    desc: 'Customized premium home interiors made for modern living.'
  },
  {
    img: slide2,
    title: 'Curated Luxury, Personalized Comfort',
    desc: 'Handcrafted furniture and designer woodwork to elevate your home aesthetics.'
  },
  {
    img: slide3,
    title: 'Inspiring Layouts, Tailored Spaces',
    desc: 'Innovative space planning and bespoke architectural interior solutions.'
  }
];

const Banner = () => {
  return (
    <div className="banner-slider-container">
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectFade]}
        effect={'fade'} // Use fade transition instead of sliding
        navigation={true} 
        pagination={{ clickable: true }}
        autoplay={{ 
          delay: 5000,                  // 5 seconds auto rotation
          disableOnInteraction: false,   
          pauseOnMouseEnter: true       
        }}
        loop={true}                     
        speed={1000}                     
        className="bannerSwiper"
      >
        {bannerSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="banner-slide-wrapper">
              <img src={slide.img} alt={`Banner Slide ${index + 1}`} className="banner-slide-image" />
              <div className="banner-slide-overlay">
                <div className="banner-slide-content">
                  <h1 className="banner-slide-title">{slide.title}</h1>
                  <button className="banner-consultation-btn">Luxe Interior</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;