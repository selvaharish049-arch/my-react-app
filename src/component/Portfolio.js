import React, { useState, useRef } from 'react';
import './Portfolio.css';

// Default 3 portfolio images
import apartmentImg from '../assets/portfolio_apartment.jpg';
import penthouseImg from '../assets/portfolio_penthouse.jpg';
import townhouseImg from '../assets/portfolio_townhouse.jpg';

const initialProjects = [
  { id: 1, name: 'Modern Apartment', img: apartmentImg, subtitle: 'Luxury Interior Space' },
  { id: 2, name: 'Luxury Penthouse', img: penthouseImg, subtitle: 'Contemporary Architecture' },
  { id: 3, name: 'Elegant Townhouse', img: townhouseImg, subtitle: 'Premium Modern Decor' },
];

const Portfolio = ({ isLoggedIn, userRole }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [activeSlot, setActiveSlot] = useState(null); // Slot index to replace image
  const [previewImg, setPreviewImg] = useState(null);
  const fileInputRef = useRef(null);

  const isAdmin = isLoggedIn && userRole === 'admin';

  // Trigger file browser for specific slot (Admin only)
  const handleSlotClick = (index) => {
    if (!isAdmin) {
      alert("⚠️ Access Restricted: Only admin accounts can change portfolio images.");
      return;
    }
    setActiveSlot(index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && activeSlot !== null) {
      const imageUrl = URL.createObjectURL(file);
      setProjects((prev) => {
        const updated = [...prev];
        updated[activeSlot] = {
          ...updated[activeSlot],
          img: imageUrl,
        };
        return updated;
      });
    }
  };

  return (
    <div className="portfolio-wrapper">
      {/* Hidden File Input for uploading 3 images (Admin only) */}
      {isAdmin && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      )}

      {/* Header section */}
      <div className="portfolio-header">
        <h2>Our Portfolio</h2>
      </div>
      <p className="portfolio-subtitle">Discover Our Latest Projects</p>

      {/* Grid container for 3 portfolio image cards */}
      <div className="portfolio-container">
        {projects.map((project, index) => (
          <div key={project.id || index} className="portfolio-box">
            <div 
              className="portfolio-image-wrapper"
              onClick={() => setPreviewImg(project)}
            >
              <img src={project.img} alt={project.name} />
              <div className="portfolio-overlay">
                <span className="portfolio-zoom-icon">🔍 View</span>
              </div>
            </div>

            <h4 className="portfolio-project-name">{project.name}</h4>
            <p className="portfolio-project-sub">{project.subtitle}</p>

            {/* Admin only option to change image */}
            {isAdmin && (
              <button 
                className="portfolio-upload-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlotClick(index);
                }}
              >
                📷 Change Image {index + 1}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImg && (
        <div className="portfolio-modal-overlay" onClick={() => setPreviewImg(null)}>
          <div className="portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="portfolio-modal-close" onClick={() => setPreviewImg(null)}>✕</button>
            <img src={previewImg.img} alt={previewImg.name} className="portfolio-modal-img" />
            <h3>{previewImg.name}</h3>
            <p>{previewImg.subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
