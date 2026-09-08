import React, { useState, useEffect } from 'react';
import './FloatingContactWidget.css';

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const container = document.querySelector('.floating-contact-container');
      if (container && !container.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const instagramUrl = 'https://www.instagram.com/tuty_luxe_interiors';
  const whatsappUrl = 'https://wa.me/916379183549?text=' + encodeURIComponent('Hello Luxe Interior & Wood Works! I would like to enquire about custom interior design services.');
  const mailUrl = 'mailto:selvaharish049@gmail.com?subject=' + encodeURIComponent('Interior Design & Wood Works Enquiry - Luxe Interiors');

  return (
    <div className="floating-contact-container">
      {/* Floating Action Pills Stack */}
      <div className={`floating-pills-stack ${isOpen ? 'open' : 'closed'}`}>
        
        {/* 1. Instagram Pill Button */}
        <a 
          href={instagramUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="floating-pill-btn pill-instagram"
          title="Follow SH Interior & Wood Works (@tuty_luxe_interiors)"
        >
          <div className="pill-icon-circle instagram-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <span className="pill-text">Instagram</span>
        </a>

        {/* 2. WhatsApp Pill Button */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="floating-pill-btn pill-whatsapp"
          title="Chat on WhatsApp (+91 6379183549)"
        >
          <div className="pill-icon-circle whatsapp-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <span className="pill-text">WhatsApp</span>
        </a>

        {/* 3. Email / Mail Us Pill Button */}
        <a 
          href={mailUrl} 
          className="floating-pill-btn pill-mail"
          title="Send Email (selvaharish049@gmail.com)"
        >
          <div className="pill-icon-circle mail-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <span className="pill-text">Mail Us</span>
        </a>

      </div>

      {/* Main Toggle Floating Button */}
      <button 
        className={`floating-main-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Quick Contact Options"
        aria-label="Toggle Quick Contact Options"
      >
        <span className="pulse-beacon"></span>
        <svg className="icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
          <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
          <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
        </svg>
      </button>

    </div>
  );
};

export default FloatingContactWidget;
