import React, { useState, useEffect } from 'react';
import { getAllReviews, deleteReview, addReview } from '../data/reviewsData';
import './CustomerReviews.css';

const CustomerReviews = ({ isLoggedIn, userRole }) => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const list = await getAllReviews();
    setReviews(list);
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
      setTimeout(() => setMessage(''), 3000);
    } else {
      alert("Failed to submit review. Is backend online?");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer review?")) {
      const res = await deleteReview(id);
      if (res && res.success) {
        loadReviews();
      } else {
        alert("Could not delete review.");
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="review-star filled">★</span>);
      } else {
        stars.push(<span key={i} className="review-star empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="customer-reviews-section">
      <div className="section-header">
        <h2>💬 Reviews & Feedbacks</h2>
        <p>Verified comments and ratings shared by our customers.</p>
      </div>

      <div className="reviews-main-layout">
        {/* Reviews List */}
        <div className="reviews-list-container">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to write one!</p>
          ) : (
            <div className="reviews-list-grid">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-card-header">
                    <div className="review-user-avatar">
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="review-user-info">
                      <h4>{rev.name}</h4>
                      <span className="review-date">{rev.date}</span>
                    </div>
                  </div>

                  <div className="review-stars-row">
                    {renderStars(rev.rating)}
                  </div>

                  <p className="review-comment">"{rev.comment}"</p>

                  {isLoggedIn && userRole === 'admin' && (
                    <button 
                      className="btn-delete-review" 
                      onClick={() => handleDelete(rev.id)}
                      title="Delete Unwanted Review"
                    >
                      🗑️ Delete Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div className="add-review-form-card">
          <h3>✍️ Write a Review</h3>
          {message && <div className="review-success-msg">{message}</div>}
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
                placeholder="Share details of your purchase experience, product details, comfort level, and styling..." 
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
  );
};

export default CustomerReviews;
