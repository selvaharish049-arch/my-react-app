import React from 'react';
import './Bottom.css';

const Bottom = () => {
  return (
    <footer className="bottom-footer">
      <div className="footer-content">
        {/* லோகோ மற்றும் லிங்க்ஸ் */}
        <div className="footer-section">
          <h2 className="footer-logo">LUXE INTERIOR</h2>
          <div className="footer-links">
            <span>Terms of Use</span> | 
            <span> Security</span> | 
            <span> Return & Refund</span> | 
            <span> Payment Policy</span> | 
            <span> Grievance Cell</span>
          </div>
          <p className="copyright">
            © 2015-2026 luxe interior. All rights reserved.
          </p>
          <p className="company-name">The luxe interior Furnitures Private Limited</p>
        </div>

        {/* அலுவலக முகவரி */}
        <div className="footer-section address">
          <h3>Registered Office</h3>
          <p>
            The luxe interior Furniture's Pvt.Ltd----Tuticorin <br />
            3c/195A vallinayaga puram 5th street, Tuticorin--628008,
          </p>
          <p>Corporate Identity Number:----------</p>
        </div>
      </div>
    </footer>
  );
};

export default Bottom;