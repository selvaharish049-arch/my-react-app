import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TrackOrder.css';

const API_BASE_URL = 'http://localhost:5000/api';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState(searchParams.get('id') || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample order IDs for instant user testing
  const sampleOrderIds = ['SH-101', 'SH-102', 'SH-103'];

  // Auto-fetch if orderId is passed in URL query param ?id=SH-101
  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setOrderIdInput(queryId);
      fetchOrderStatus(queryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchOrderStatus = async (idToSearch) => {
    const query = (idToSearch || orderIdInput).trim();
    if (!query) {
      setError('Please enter your Order ID or registered phone number.');
      setOrderData(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to find project order.');
      }

      setOrderData(data);
    } catch (err) {
      setOrderData(null);
      setError(err.message || 'Error connecting to tracking service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrderStatus();
  };

  const handleSampleClick = (id) => {
    setOrderIdInput(id);
    fetchOrderStatus(id);
  };

  const getStepStatusText = (stepNum, currentStep) => {
    if (stepNum < currentStep) return 'Completed';
    if (stepNum === currentStep) return 'In Progress';
    return 'Upcoming';
  };

  return (
    <div className="track-order-page">
      {/* Hero Section */}
      <div className="track-hero-section">
        <div className="track-hero-container">
          <span className="track-hero-subtitle">LIVE PROJECT MONITOR</span>
          <h1 className="track-hero-title">Track Your Interior Project</h1>
          <p className="track-hero-desc">
            Stay updated with every phase of your home design, from order confirmation to final site installation.
          </p>

          {/* Search Card */}
          <form className="track-search-box" onSubmit={handleSearchSubmit}>
            <div className="track-input-wrapper">
              <span className="search-input-icon">🔍</span>
              <input 
                type="text"
                placeholder="Enter Order ID (e.g. SH-101) or Phone Number"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="track-input-field"
              />
            </div>
            <button type="submit" className="track-search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>

          {/* Sample Chips */}
          <div className="track-sample-chips">
            <span className="chips-label">Try Sample IDs:</span>
            {sampleOrderIds.map((id) => (
              <button 
                key={id} 
                className={`sample-chip ${orderIdInput.toUpperCase() === id ? 'active' : ''}`}
                onClick={() => handleSampleClick(id)}
                type="button"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="track-content-container">
        {/* Loading Spinner */}
        {loading && (
          <div className="track-status-card track-loading-card">
            <div className="spinner"></div>
            <p>Fetching project timeline details...</p>
          </div>
        )}

        {/* Error Alert Card */}
        {error && !loading && (
          <div className="track-status-card track-error-card">
            <div className="error-icon">⚠️</div>
            <h3>Project Not Found</h3>
            <p>{error}</p>
            <p className="error-tip">Tip: Try clicking one of the sample Order IDs above (e.g., <strong>SH-101</strong>) to test the live tracker.</p>
          </div>
        )}

        {/* Order Details & Timeline Card */}
        {orderData && !loading && (
          <div className="track-status-card track-details-card">
            
            {/* Order Header Summary */}
            <div className="project-header-row">
              <div className="project-id-badge">
                <span className="badge-tag">ORDER ID</span>
                <h2>{orderData.orderId}</h2>
              </div>
              <div className="project-type-badge">
                <span className="type-icon">🏠</span>
                <span>{orderData.projectType}</span>
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="customer-info-grid">
              <div className="info-item">
                <span className="info-label">Customer Name</span>
                <strong className="info-value">{orderData.customerName}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Contact Phone</span>
                <strong className="info-value">📞 {orderData.phone}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Current Progress</span>
                <strong className="info-value highlight">
                  Step {orderData.currentStep} of 4 — {getStepStatusText(orderData.currentStep, orderData.currentStep)}
                </strong>
              </div>
              <div className="info-item">
                <span className="info-label">Expected Completion</span>
                <strong className="info-value">{orderData.expectedCompletionDate || 'Under Schedule'}</strong>
              </div>
            </div>

            {orderData.notes && (
              <div className="project-notes-box">
                <span className="notes-icon">📌</span>
                <div>
                  <strong>Project Notes / Specification:</strong>
                  <p>{orderData.notes}</p>
                </div>
              </div>
            )}

            {/* VISUAL TIMELINE STEPPER */}
            <div className="timeline-section">
              <h3 className="timeline-heading">Project Execution Timeline</h3>
              
              {/* Stepper Grid Container */}
              <div className="timeline-stepper">
                {orderData.steps && orderData.steps.map((step, index) => {
                  const stepNum = step.stepNumber || index + 1;
                  const isCompleted = stepNum < orderData.currentStep;
                  const isActive = stepNum === orderData.currentStep;

                  let stepClass = 'pending';
                  if (isCompleted) stepClass = 'completed';
                  if (isActive) stepClass = 'active';

                  return (
                    <div key={stepNum} className={`timeline-step-item ${stepClass}`}>
                      {/* Step Circle & Connector */}
                      <div className="step-node-wrapper">
                        <div className="step-circle">
                          {isCompleted ? (
                            <span className="tick-icon">✓</span>
                          ) : isActive ? (
                            <span className="pulse-dot"></span>
                          ) : (
                            <span className="step-number">{stepNum}</span>
                          )}
                        </div>
                        {index < orderData.steps.length - 1 && (
                          <div className={`step-line ${isCompleted ? 'filled' : ''}`}></div>
                        )}
                      </div>

                      {/* Step Details Box */}
                      <div className="step-info-card">
                        <div className="step-title-row">
                          <h4 className="step-title">{step.title}</h4>
                          <span className={`status-pill ${stepClass}`}>
                            {getStepStatusText(stepNum, orderData.currentStep)}
                          </span>
                        </div>
                        {step.date && (
                          <p className="step-date">📅 {step.date}</p>
                        )}
                        {step.description && (
                          <p className="step-desc">{step.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
