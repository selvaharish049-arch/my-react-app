import React from 'react';
import './Bottom.css';

const Bottom = () => {
  return (
    <footer className="bottom-footer">
      <div className="footer-content">
        {/* Center: Luxe Links & Copyright */}
        <div className="footer-section">
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

        {/* Right Office Address */}
        <div className="footer-section address">
          <h3>Registered Office</h3>
          <p>
            The luxe interior Furniture's Pvt.Ltd----Tuticorin <br />
            3c/195A vallinayaga puram 5th street, Tuticorin--628008
          </p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#555' }}>
            📞 <strong>Contact:</strong> +91 6379183549 <br />
            📧 <strong>Email:</strong> selvaharish049@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Bottom;