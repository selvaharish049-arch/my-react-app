import React, { useState, useEffect } from 'react';
import './Banner.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules'; 

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import slide1 from '../assets/collection_banner_room.jpg'; 
import slide2 from '../assets/portfolio_penthouse.jpg'; 
import slide3 from '../assets/portfolio_townhouse.jpg'; 

const bannerSlidesData = {
  en: [
    { img: slide1, title: 'Elevated Living Spaces, Timeless Design', desc: 'Customized premium home interiors made for modern living.' },
    { img: slide2, title: 'Curated Luxury, Personalized Comfort', desc: 'Handcrafted furniture and designer woodwork to elevate your home aesthetics.' },
    { img: slide3, title: 'Inspiring Layouts, Tailored Spaces', desc: 'Innovative space planning and bespoke architectural interior solutions.' }
  ],
  hi: [
    { img: slide1, title: 'शानदार लग्जरी इंटीरियर और कस्टम डिजाइन', desc: 'आधुनिक जीवन शैली के लिए अनुकूलित प्रीमियम होम इंटीरियर्स।' },
    { img: slide2, title: 'प्रीमियम होम फर्नीचर और हस्तशिल्प लकड़ी का काम', desc: 'घर की खूबसूरती बढ़ाने के लिए हाथ से बने फर्नीचर।' },
    { img: slide3, title: 'जर्मन मॉड्यूलर किचन और लग्जरी वॉर्डरोब संग्रह', desc: 'अभिनव स्थान योजना और कस्टम इंटीरियर समाधान।' }
  ],
  ta: [
    { img: slide1, title: 'பிரமிக்க வைக்கும் லக்சுரி இன்டீரியர் & டிசைன்கள்', desc: 'நவீன வாழ்க்கைக்கு ஏற்ற தனிப்பயனாக்கப்பட்ட ஹோம் இன்டீரியர்.' },
    { img: slide2, title: 'பிரீமியம் ஹோம் பர்னிச்சர் & மர வேலைப்பாடுகள்', desc: 'வீட்டின் அழகை அதிகரிக்கும் கைவினை பர்னிச்சர்கள்.' },
    { img: slide3, title: 'ஜெர்மன் மாடுலார் கிச்சன் & வார்ட்ரோப் கலெக்ஷன்', desc: 'சிறந்த வடிவமைப்பு மற்றும் இன்டீரியர் தீர்வுகள்.' }
  ],
  ml: [
    { img: slide1, title: 'മനോഹരമായ ലക്ഷ്വറി ഇന്റീരിയറുകൾ', desc: 'ആധുനിക ജീവിതത്തിനായി നിർമ്മിച്ച പ്രീമിയം ഹോം ഇന്റീരിയറുകൾ.' },
    { img: slide2, title: 'ഹാൻഡ്ക്രാഫ്റ്റഡ് ഫർണിച്ചർ & തടി പണികൾ', desc: 'നിങ്ങളുടെ വീടിന്റെ ഭംഗി വർദ്ധിപ്പിക്കുന്നതിനുള്ള ഫർണിച്ചറുകൾ.' },
    { img: slide3, title: 'മോഡുലാർ അടുക്കള & ലക്ഷ്വറി അലമാരകൾ', desc: 'ആധുനിക ഡിസൈനുകളും മികച്ച ഇന്റീരിയർ സേവനങ്ങളും.' }
  ],
  te: [
    { img: slide1, title: 'అద్భుతమైన లగ్జరీ ఇంటీరియర్స్', desc: 'ఆధునిక జీవనశైలికి తగిన ప్రీమియం హోమ్ ఇంటీరియర్స్.' },
    { img: slide2, title: 'చేతితో తయారు చేసిన ఫర్నిచర్ & వుడ్ వర్క్', desc: 'మీ ఇంటి అందాన్ని పెంచే ప్రత్యేక డిజైన్లు.' },
    { img: slide3, title: 'మాడ్యులర్ కిచెన్ & లగ్జరీ వార్డ్‌రోబ్స్', desc: 'విశిష్టమైన స్పేస్ ప్లానింగ్ మరియు ఇంటీరియర్ సొల్యూషన్స్.' }
  ],
  kn: [
    { img: slide1, title: 'ಅದ್ಭುತ ಲಕ್ಷರಿ ಇಂಟೀರಿಯರ್ಸ್', desc: 'ಆಧುನಿಕ ಜೀವನಶೈಲಿಗೆ ಸೂಕ್ತವಾದ ಪ್ರೀಮಿಯಂ ಹೋಮ್ ಇಂಟೀರಿಯರ್ಸ್.' },
    { img: slide2, title: 'ಕರಕುಶಲ ಫರ್ನಿಚರ್ & ಮರದ ಕೆಲಸಗಳು', desc: 'ನಿಮ್ಮ ಮನೆಯ ಸೌಂದರ್ಯವನ್ನು ಹೆಚ್ಚಿಸುವ ವಿನ್ಯಾಸಗಳು.' },
    { img: slide3, title: 'ಮಾಡ್ಯುಲರ್ ಕಿಚನ್ & ಲಕ್ಷರಿ ವಾರ್ಡ್‌ರೋಬ್‌ಗಳು', desc: 'ಅತ್ಯುತ್ತಮ ಸ್ಪೇಸ್ ಪ್ಲಾನಿಂಗ್ ಮತ್ತು ಇಂಟೀರಿಯರ್ ಪರಿಹಾರಗಳು.' }
  ]
};

const Banner = () => {
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('luxe_lang') || 'en');

  useEffect(() => {
    const handleLangChange = () => {
      setCurrentLang(localStorage.getItem('luxe_lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const slides = bannerSlidesData[currentLang] || bannerSlidesData.en;

  return (
    <div className="banner-slider-container">
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectFade]}
        effect={'fade'}
        navigation={true} 
        pagination={{ clickable: true }}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false,   
          pauseOnMouseEnter: true       
        }}
        loop={true}                     
        speed={1000}                     
        className="bannerSwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="banner-slide-wrapper">
              <img src={slide.img} alt={`Banner Slide ${index + 1}`} className="banner-slide-image" />
              <div className="banner-slide-overlay">
                <div className="banner-slide-content">
                  <h1 className="banner-slide-title">{slide.title}</h1>
                  <button className="banner-consultation-btn">LUXE INTERIOR</button>
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