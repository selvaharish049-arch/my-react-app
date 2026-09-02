import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TrackOrder.css';

const API_BASE_URL = 'http://localhost:5000/api';

// Demo fallback orders if server is offline
const DEMO_ORDERS = [
  {
    orderId: 'SH-101',
    customerName: 'Ananya Sharma',
    phone: '9876543210',
    projectType: 'Modular Kitchen Layout',
    currentStep: 3,
    expectedCompletionDate: '2026-09-15',
    notes: 'Premium High-Gloss German Laminate & Blum Soft-Close Fittings.',
    steps: [
      { stepNumber: 1, title: 'Order Confirmed & Site Survey', date: '2026-08-20', description: 'Order confirmed and 3D laser measurement finished.' },
      { stepNumber: 2, title: '3D Design & Material Finalized', date: '2026-08-25', description: 'Wood veneer species and acrylic color tone approved by customer.' },
      { stepNumber: 3, title: 'Carpentry & Factory Production', date: '2026-09-01', description: 'CNC cutting and edge-banding in progress at master factory.' },
      { stepNumber: 4, title: 'Site Installation & Final Delivery', date: 'Upcoming', description: 'On-site assembly and quality inspection by Luxe technicians.' }
    ]
  },
  {
    orderId: 'SH-102',
    customerName: 'Karthick Raja',
    phone: '9876543210',
    projectType: 'Sliding Bedroom Wardrobe',
    currentStep: 2,
    expectedCompletionDate: '2026-09-20',
    notes: 'Floor-to-ceiling solid teak wood frame with tinted glass doors.',
    steps: [
      { stepNumber: 1, title: 'Order Confirmed & Site Survey', date: '2026-08-28', description: 'Design specification approved.' },
      { stepNumber: 2, title: '3D Design & Material Finalized', date: '2026-09-02', description: 'Material selection in progress.' },
      { stepNumber: 3, title: 'Carpentry & Factory Production', date: 'Upcoming', description: 'Scheduled for production.' },
      { stepNumber: 4, title: 'Site Installation & Final Delivery', date: 'Upcoming', description: 'Pending production completion.' }
    ]
  },
  {
    orderId: 'SH-103',
    customerName: 'Suresh Kumar',
    phone: '9443322110',
    projectType: 'Floating TV Unit Console',
    currentStep: 4,
    expectedCompletionDate: '2026-09-05',
    notes: 'Italian marble backing panel with LED warm ambient backlighting.',
    steps: [
      { stepNumber: 1, title: 'Order Confirmed & Site Survey', date: '2026-08-10', description: 'Survey complete.' },
      { stepNumber: 2, title: '3D Design & Material Finalized', date: '2026-08-15', description: 'Design approved.' },
      { stepNumber: 3, title: 'Carpentry & Factory Production', date: '2026-08-25', description: 'Manufacturing completed.' },
      { stepNumber: 4, title: 'Site Installation & Final Delivery', date: '2026-09-02', description: 'Dispatch team en route for home installation.' }
    ]
  }
];

const TrackOrder = ({ triggerLogin }) => {
  const [searchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState(searchParams.get('id') || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setOrderIdInput(queryId);
      performSearch(queryId, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const performSearch = async (orderIdVal, phoneVal) => {
    const cleanOrderId = (orderIdVal !== undefined ? orderIdVal : orderIdInput).trim();
    const cleanPhone = (phoneVal !== undefined ? phoneVal : phoneInput).trim();

    if (!cleanOrderId && !cleanPhone) {
      setError('Please enter your Order ID or registered Phone Number.');
      setOrderData(null);
      return;
    }

    setLoading(true);
    setError('');

    // 1. Try Backend API first with fast 1.5s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const searchKey = cleanOrderId || cleanPhone;
      const response = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(searchKey)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
        setLoading(false);
        return;
      }
    } catch (err) {
      // Backend offline or timeout -> fallback to local lookup
    }

    // 2. Search local storage saved orders or fallback DEMO_ORDERS
    let localCustomOrders = [];
    try {
      const stored = localStorage.getItem('luxe_customer_orders');
      if (stored) localCustomOrders = JSON.parse(stored);
    } catch (e) {}

    const allLocalOrders = [...localCustomOrders, ...DEMO_ORDERS];

    const match = allLocalOrders.find(o => {
      const matchId = cleanOrderId && o.orderId && o.orderId.toLowerCase() === cleanOrderId.toLowerCase();
      const matchPhone = cleanPhone && o.phone && o.phone.replace(/[\s-]/g, '').includes(cleanPhone.replace(/[\s-]/g, ''));
      return matchId || matchPhone;
    });

    if (match) {
      setOrderData(match);
      setError('');
    } else {
      setOrderData(null);
      setError(`No active project found for "${cleanOrderId || cleanPhone}". Please check your Order ID or phone number.`);
    }

    setLoading(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    performSearch(orderIdInput, phoneInput);
  };

  const getStepStatusText = (stepNum, currentStep) => {
    if (stepNum < currentStep) return 'Completed';
    if (stepNum === currentStep) return 'In Progress';
    return 'Upcoming';
  };

  return (
    <div className="track-order-page-wrapper">
      {/* Top Banner Header */}
      <div className="track-page-header">
        <h1 className="track-main-title">Update Order & Live Project Tracking</h1>
        <p className="track-main-subtitle">
          View live order updates, production progress stages, and estimated delivery status. Enter your Order ID or registered Phone Number below.
        </p>
      </div>

      {/* Main Form & Illustration Container Card */}
      <div className="track-main-container">
        {/* Left Box: Form */}
        <div className="track-form-card">
          <form onSubmit={handleFormSubmit}>
            <div className="track-field-group">
              <label className="track-field-label">
                Order ID <span className="req-star">*</span>
              </label>
              <input 
                type="text" 
                className="track-text-input" 
                placeholder="Enter Order ID"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
            </div>

            <div className="track-field-group">
              <label className="track-field-label">
                Phone <span className="req-star">*</span>
              </label>
              <input 
                type="text" 
                className="track-text-input" 
                placeholder="Enter Phone Number"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
            </div>

            <div className="track-actions-row">
              <button type="submit" className="btn-track-submit" disabled={loading}>
                <span className="location-pin-icon">📍</span> {loading ? 'Searching...' : 'Track Order'}
              </button>

              <span className="or-login-text">
                OR <button type="button" className="login-link-btn" onClick={() => triggerLogin && triggerLogin()}>Login</button> & Track Order
              </span>
            </div>
          </form>

          {/* Quick Demo Chips */}
          <div className="quick-demo-chips">
            <span>Try Demo IDs: </span>
            {['SH-101', 'SH-102', 'SH-103'].map(id => (
              <button 
                key={id} 
                type="button" 
                className="demo-chip-btn"
                onClick={() => {
                  setOrderIdInput(id);
                  performSearch(id, '');
                }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Right Box: Delivery Illustration */}
        <div className="track-illustration-card">
          <div className="illustration-wrapper">
            <svg viewBox="0 0 500 320" className="track-vector-svg">
              <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f8fafd" />
                  <stop offset="100%" stopColor="#edf2f7" />
                </linearGradient>
                <linearGradient id="truckGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2c3e50" />
                  <stop offset="100%" stopColor="#34495e" />
                </linearGradient>
              </defs>

              {/* City Background Silhouette */}
              <path d="M 50,260 L 50,180 L 80,180 L 80,160 L 120,160 L 120,260 Z" fill="#e2e8f0" opacity="0.6"/>
              <path d="M 380,260 L 380,150 L 420,150 L 420,170 L 460,170 L 460,260 Z" fill="#e2e8f0" opacity="0.6"/>

              {/* Road */}
              <line x1="20" y1="260" x2="480" y2="260" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 6"/>

              {/* Smartphone GPS Screen Graphic */}
              <g transform="translate(190, 80)">
                <rect x="0" y="0" width="100" height="170" rx="16" fill="#ffffff" stroke="#2b3a4a" strokeWidth="4" />
                <rect x="8" y="8" width="84" height="140" rx="8" fill="#f1f5f9" />
                
                {/* Map Grid & Route Line */}
                <path d="M 20,40 Q 50,20 70,70 T 30,120" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="3 3"/>
                <circle cx="20" cy="40" r="6" fill="#1e3a8a"/>
                <circle cx="30" cy="120" r="7" fill="#ef4444"/>
                
                {/* Screen UI bars */}
                <rect x="20" y="152" width="16" height="4" rx="2" fill="#cbd5e1" />
                <rect x="42" y="152" width="16" height="4" rx="2" fill="#cbd5e1" />
                <rect x="64" y="152" width="16" height="4" rx="2" fill="#cbd5e1" />
              </g>

              {/* Stacked Delivery Packages */}
              <g transform="translate(70, 175)">
                <rect x="0" y="40" width="45" height="45" fill="#d97706" rx="4" />
                <line x1="22.5" y1="40" x2="22.5" y2="85" stroke="#b45309" strokeWidth="2" />
                <rect x="35" y="15" width="40" height="70" fill="#f59e0b" rx="4" />
                <line x1="35" y1="50" x2="75" y2="50" stroke="#d97706" strokeWidth="2" />
              </g>

              {/* Delivery Van / Truck */}
              <g transform="translate(280, 160)">
                {/* Truck Body */}
                <rect x="0" y="20" width="120" height="70" fill="url(#truckGrad)" rx="6" />
                <rect x="100" y="35" width="45" height="55" fill="#1e293b" rx="8" />
                <path d="M 120,45 L 140,45 L 145,65 L 120,65 Z" fill="#64748b" opacity="0.6"/>
                
                {/* Wheels */}
                <circle cx="30" cy="90" r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3"/>
                <circle cx="115" cy="90" r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3"/>
                <circle cx="30" cy="90" r="5" fill="#ffffff"/>
                <circle cx="115" cy="90" r="5" fill="#ffffff"/>
              </g>

              {/* Delivery Person Figure holding package */}
              <g transform="translate(260, 155)">
                {/* Head */}
                <circle cx="20" cy="15" r="9" fill="#fca5a5"/>
                <path d="M 12,12 Q 20,4 28,12 Z" fill="#fbbf24"/> {/* Cap */}
                {/* Body */}
                <rect x="12" y="25" width="16" height="35" fill="#fbbf24" rx="4"/>
                {/* Legs */}
                <line x1="15" y1="60" x2="15" y2="90" stroke="#1e293b" strokeWidth="4"/>
                <line x1="25" y1="60" x2="25" y2="90" stroke="#1e293b" strokeWidth="4"/>
                {/* Box in hands */}
                <rect x="-10" y="30" width="22" height="20" fill="#d97706" rx="2" stroke="#78350f" strokeWidth="1"/>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      <div className="track-results-wrapper">
        {loading && (
          <div className="track-status-card track-loading">
            <div className="spinner"></div>
            <p>Searching order database...</p>
          </div>
        )}

        {error && !loading && (
          <div className="track-status-card track-error-card">
            <div className="error-icon">⚠️</div>
            <h3>Project Order Not Found</h3>
            <p>{error}</p>
          </div>
        )}

        {orderData && !loading && (
          <div className="track-status-card track-details-card">
            <div className="project-header-row">
              <div className="project-id-badge">
                <span className="badge-tag">ORDER ID</span>
                <h2>{orderData.orderId}</h2>
              </div>
              <div className="project-type-badge">
                <span className="type-icon">🛋️</span>
                <span>{orderData.projectType}</span>
              </div>
            </div>

            <div className="customer-info-grid">
              <div className="info-item">
                <span className="info-label">Customer Name</span>
                <strong className="info-value">{orderData.customerName}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <strong className="info-value">📞 {orderData.phone}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Current Progress</span>
                <strong className="info-value highlight">
                  Step {orderData.currentStep} of 4 — {getStepStatusText(orderData.currentStep, orderData.currentStep)}
                </strong>
              </div>
              <div className="info-item">
                <span className="info-label">Estimated Delivery</span>
                <strong className="info-value">{orderData.expectedCompletionDate || 'On Schedule'}</strong>
              </div>
            </div>

            {orderData.notes && (
              <div className="project-notes-box">
                <span className="notes-icon">📌</span>
                <div>
                  <strong>Specifications / Notes:</strong>
                  <p>{orderData.notes}</p>
                </div>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="timeline-section">
              <h3 className="timeline-heading">Delivery Execution Timeline</h3>
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
                      <div className="step-node-wrapper">
                        <div className="step-circle">
                          {isCompleted ? '✓' : stepNum}
                        </div>
                        {index < orderData.steps.length - 1 && (
                          <div className={`step-line ${isCompleted ? 'filled' : ''}`}></div>
                        )}
                      </div>

                      <div className="step-info-card">
                        <div className="step-title-row">
                          <h4 className="step-title">{step.title}</h4>
                          <span className={`status-pill ${stepClass}`}>
                            {getStepStatusText(stepNum, orderData.currentStep)}
                          </span>
                        </div>
                        {step.date && <p className="step-date">📅 {step.date}</p>}
                        {step.description && <p className="step-desc">{step.description}</p>}
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
