import React from 'react';
import './Choose.css';

const Choose = () => {
  return (
    <div className="choose-wrapper">
      <h2 className="choose-heading">Why Choose luxe interior?</h2>
      <div className="choose-container">
        <div className="choose-box">
          <div className="icon">😊</div>
          <p>20 Lakh+ Customers</p>
        </div>
        <div className="choose-box">
          <div className="icon">🚚</div>
          <p>Free Delivery</p>
        </div>
        <div className="choose-box">
          <div className="icon">🛡️</div>
          <p>Best Warranty*</p>
        </div>
        <div className="choose-box">
          <div className="icon">🛠️</div>
          <p>In House Mfg.</p>
        </div>
      </div>
    </div>
  );
};

export default Choose;