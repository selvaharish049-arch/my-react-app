import React from 'react';
import './OurServices.css';

const OurServices = () => {
  return (
    <div className="services-wrapper">
      <div className="services-header">
        <h2>Our Services</h2>
      </div>

      <div className="services-container">
        {/* Interior Design */}
        <div className="service-box">
          <div className="service-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#8a7c75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="1" />
              <path d="M4 16l4.5-4.5a1 1 0 0 1 1.4 0l4.2 4.2" />
              <path d="M12 13l2.5-2.5a1 1 0 0 1 1.4 0L20 15" />
              <circle cx="9" cy="9" r="1.5" />
            </svg>
          </div>
          <h4 className="service-title">Interior Design</h4>
        </div>

        {/* Space Planning */}
        <div className="service-box">
          <div className="service-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#8a7c75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <path d="M9 3v18" />
              <path d="M9 12h12" />
              <path d="M3 10h6" />
              <path d="M15 12v9" />
            </svg>
          </div>
          <h4 className="service-title">Space Planning</h4>
        </div>

        {/* Custom Furniture */}
        <div className="service-box">
          <div className="service-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#8a7c75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11" />
              <rect x="4" y="14" width="16" height="4" rx="1" />
              <path d="M4 14V11a2 2 0 0 1 2-2" />
              <path d="M20 14V11a2 2 0 0 1-2-2" />
              <path d="M6 18v3" />
              <path d="M18 18v3" />
            </svg>
          </div>
          <h4 className="service-title">Custom Furniture</h4>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
