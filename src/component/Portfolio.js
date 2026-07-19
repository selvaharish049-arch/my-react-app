import React from 'react';
import './Portfolio.css';

// Import portfolio images
import apartmentImg from '../assets/portfolio_apartment.jpg';
import penthouseImg from '../assets/portfolio_penthouse.jpg';
import townhouseImg from '../assets/portfolio_townhouse.jpg';

const projects = [
  { name: 'Modern Apartment', img: apartmentImg },
  { name: 'Luxury Penthouse', img: penthouseImg },
  { name: 'Elegant Townhouse', img: townhouseImg },
];

const Portfolio = () => {
  return (
    <div className="portfolio-wrapper">
      {/* Title Styled in "Our Services" Theme */}
      <div className="portfolio-header">
        <h2>Our Portfolio</h2>
      </div>
      <p className="portfolio-subtitle">Discover Our Latest Projects</p>

      {/* Grid container for portfolio items */}
      <div className="portfolio-container">
        {projects.map((project, index) => (
          <div key={index} className="portfolio-box">
            <div className="portfolio-image-wrapper">
              <img src={project.img} alt={project.name} />
            </div>
            <h4 className="portfolio-project-name">{project.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
