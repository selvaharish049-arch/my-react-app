import React, { useState, useEffect, useRef } from 'react';
import { getAllReviews, deleteReview, addReview } from '../data/reviewsData';
import './CustomerReviews.css';

// Import local image assets for testimonials
import testimonialLivingRoom from '../assets/testimonial_living_room.jpg';
import testimonialBedroom from '../assets/testimonial_bedroom.jpg';
import avatarAnanya from '../assets/avatar_ananya.jpg';
import avatarDefault from '../assets/avatar_default.jpg';

const CustomerReviews = ({ isLoggedIn, userRole }) => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [message, setMessage] = useState('');
  const autoPlayRef = useRef(null);

  // Hardcoded premium featured review to match the requested design exactly
  const featuredReviews = [
    {
      id: "featured-1",
      name: "Ananya Sharma",
      subtitle: "Homeowner, Mumbai",
      rating: 5,
      comment: "NESTÉ Interiors transformed our house into a beautiful, functional home. Their creativity and attention to detail are unmatched.",
      date: "2026-07-19",
      avatar: avatarAnanya,
      backdrop: testimonialLivingRoom
    }
  ];

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const list = await getAllReviews();
    setReviews(list);
  };

  // Merge featured review with backend reviews dynamically
  const getMergedReviews = () => {
    const dbReviews = reviews.map((rev, index) => {
      // Alternate backdrops and assign locations/subtitles
      const backdrop = index % 2 === 0 ? testimonialBedroom : testimonialLivingRoom;
      let subtitle = "Verified Customer";
      if (rev.name.toLowerCase().includes("sivakumar")) {
        subtitle = "Homeowner, Chennai";
      } else if (rev.name.toLowerCase().includes("deepika")) {
        subtitle = "Homeowner, Bangalore";
      } else if (rev.name.toLowerCase().includes("arun")) {
        subtitle = "Homeowner, Coimbatore";
      } else if (rev.name.toLowerCase().includes("priya")) {
        subtitle = "Homeowner, Madurai";
      }
      return {
        ...rev,
        subtitle,
        avatar: avatarDefault,
        backdrop
      };
    });
    return [...featuredReviews, ...dbReviews];
  };

  const mergedReviews = getMergedReviews();

  // Autoplay functionality
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mergedReviews.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    if (mergedReviews.length > 1) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedReviews.length]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    startAutoPlay(); // Reset timer on interaction
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      alert("Please fill in both Name and Review comment!");
      return;
    }

    const newReview = {
      name: formData.name,
      rating: parseInt(formData.rating) || 5,
      comment: formData.comment
    };

    const res = await addReview(newReview);
    if (res) {
      setFormData({ name: '', rating: 5, comment: '' });
      setMessage("⭐ Thank you! Your review has been published.");
      loadReviews();
      setActiveIndex(mergedReviews.length); // Slide to the newly added review
      setTimeout(() => setMessage(''), 4000);
    } else {
      alert("Failed to submit review. Is backend online?");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this customer review?")) {
      const res = await deleteReview(id);
      if (res && res.success) {
        // Adjust active index if deleting current review
        if (activeIndex >= mergedReviews.length - 1 && activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }
        loadReviews();
      } else {
        alert("Could not delete review.");
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`review-star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const currentReview = mergedReviews[activeIndex] || featuredReviews[0];

  return (
    <div className="customer-reviews-section">
      <div className="section-header">
        <h2>Customer Testimonials</h2>
      </div>

      <div className="reviews-main-layout">
        {/* Left Side: Testimonial Card Slider */}
        <div 
          className="testimonial-slider-container"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          <div className="testimonial-card">
            {/* Left half: content */}
            <div className="testimonial-left-panel">
              <span className="quote-mark">“</span>
              <p className="testimonial-comment">{currentReview.comment}</p>
              
              <div className="testimonial-bottom-row">
                <div className="testimonial-author-info">
                  <img 
                    src={currentReview.avatar} 
                    alt={currentReview.name} 
                    className="author-avatar" 
                  />
                  <div className="author-details">
                    <h4 className="author-name">{currentReview.name}</h4>
                    <p className="author-subtitle">{currentReview.subtitle}</p>
                  </div>
                </div>

                <div className="testimonial-stars-container">
                  {renderStars(currentReview.rating)}
                </div>
              </div>

              {/* Slider dots pagination */}
              <div className="slider-dots">
                {mergedReviews.map((_, idx) => (
                  <button
                    key={idx}
                    className={`slider-dot ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Admin delete action inside the active slide if it's a DB review */}
              {isLoggedIn && userRole === 'admin' && !currentReview.id.startsWith('featured') && (
                <button 
                  className="btn-delete-active-review" 
                  onClick={(e) => handleDelete(currentReview.id, e)}
                  title="Delete this review"
                >
                  🗑️ Delete Review
                </button>
              )}
            </div>

            {/* Right half: Image backdrop with smooth masking gradient */}
            <div 
              className="testimonial-right-panel"
              style={{ backgroundImage: `url(${currentReview.backdrop})` }}
            >
              <div className="image-shading-overlay"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Write a Review Form Card */}
        <div className="form-column-wrapper">
          {message && <div className="review-success-msg">{message}</div>}
          
          <div className="add-review-form-card">
            <div className="form-card-header">
              <h3>✍️ Write a Review</h3>
            </div>
            
            <form onSubmit={handleFormSubmit} className="review-submit-form">
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Sivakumar" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <select 
                  name="rating" 
                  value={formData.rating} 
                  onChange={handleInputChange}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3 - Average)</option>
                  <option value="2">⭐⭐ (2 - Poor)</option>
                  <option value="1">⭐ (1 - Terrible)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Review Comment *</label>
                <textarea 
                  name="comment" 
                  value={formData.comment} 
                  onChange={handleInputChange} 
                  placeholder="Share details of your experience..." 
                  rows="4"
                  required 
                />
              </div>

              <button type="submit" className="btn-submit-review">
                Post My Review ⭐
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;


