import React from 'react';
import './Offer.css';

import img1 from '../assets/o1.png'; 
import img2 from '../assets/o2.png';
import img3 from '../assets/o3.png';

const Offer = () => {
  return (
    <div className="offer-wrapper">
      <div className="offer-container">
        {/* ஆஃபர் பெட்டி 1 */}
        <div className="offer-box">
          <img src={img1} alt="TV Unit" />
          <div className="offer-content">
        
            
            
          </div>
        </div>
        
        {/* ஆஃபர் பெட்டி 2 */}
        <div className="offer-box">
          <img src={img2} alt="Office Chair" />
          <div className="offer-content">
            
            
          </div>
        </div>

        {/* ஆஃபர் பெட்டி 3 */}
        <div className="offer-box">
          <img src={img3} alt="Home Temple" />
          <div className="offer-content">
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;