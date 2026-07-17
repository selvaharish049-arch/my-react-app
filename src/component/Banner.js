import React from 'react';
import './Banner.css';

// Left slider-ku matum Swiper component matrum required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules'; 

// Core Swiper styles CSS imports
import 'swiper/css';
import 'swiper/css/navigation';

// --- LEFT SIDE SLIDER IMAGES (3 Images) ---
import leftImg1 from '../assets/a1.jpg'; 
import leftImg2 from '../assets/a2.jpg'; 
import leftImg3 from '../assets/a3.webp'; 

// --- RIGHT SIDE STATIC IMAGES (Single Image Each) ---
import rightTopChair from '../assets/a5.webp'; 
import rightBottomLamp from '../assets/ab.webp'; 

const Banner = () => {
  // Left side slider array list
  const leftSliderImages = [leftImg1, leftImg2, leftImg3];

  return (
    <div className="banner-grid-container">
      
      {/* LEFT SIDE: 3-Seconds Automatic Image Slider */}
      <div className="left-banner">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={true} 
          autoplay={{ 
            delay: 3000,                  // 3 seconds auto rotation
            disableOnInteraction: false,   
            pauseOnMouseEnter: true       
          }}
          loop={true}                     
          speed={800}                     
          className="mySwiper"
        >
          {leftSliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Left Banner Slide ${index + 1}`} className="responsive-img" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* RIGHT SIDE: Static Top and Bottom Single Images */}
      <div className="right-banner-container">
        
        {/* Right Top Area (Single Chair Image) */}
        <div className="right-box-wrapper">
          <img src={rightTopChair} alt="Featured Chair" className="responsive-img" />
        </div>
        
        {/* Right Bottom Area (Single Lamp Grid Image) */}
        <div className="right-box-wrapper">
          <img src={rightBottomLamp} alt="Modern Lamps" className="responsive-img" />
        </div>

      </div>

    </div>
  );
};

export default Banner;