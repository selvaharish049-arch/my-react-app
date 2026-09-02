import React, { useState, useEffect } from 'react';
import './OrderManagement.css';

const API_BASE_URL = 'http://localhost:5000/api';
const DELETED_ORDERS_KEY = 'luxe_deleted_orders_v2';

const DEMO_CUSTOMER_ORDERS = [
  {
    orderId: 'LX-1001',
    customerName: 'Ananya Sharma',
    phone: '9876543210',
    email: 'ananya@gmail.com',
    address: 'No 45, Anna Nagar, Chennai 600040',
    projectType: 'Luxe German Island Kitchen',
    totalAmount: '₹1,45,000',
    paymentMode: 'Cash on Delivery',
    currentStep: 3,
    expectedCompletionDate: '2026-09-15',
    orderDate: '2026-08-20',
    notes: 'Acrylic finish with soft-close Blum drawers & quartz countertop.'
  },
  {
    orderId: 'LX-1002',
    customerName: 'Karthick Raja',
    phone: '9876543210',
    email: 'karthick@gmail.com',
    address: 'Flat 3B, T. Nagar, Chennai 600017',
    projectType: 'Spacious Sliding Wardrobe',
    totalAmount: '₹55,000',
    paymentMode: 'Online Payment',
    currentStep: 2,
    expectedCompletionDate: '2026-09-20',
    orderDate: '2026-08-28',
    notes: 'Glass sliding doors with customized storage dividers.'
  },
  {
    orderId: 'LX-1003',
    customerName: 'Suresh Kumar',
    phone: '9443322110',
    email: 'suresh@gmail.com',
    address: 'Plot 12, Velachery, Chennai 600042',
    projectType: 'Floating Minimalist TV Console',
    totalAmount: '₹22,500',
    paymentMode: 'Cash on Delivery',
    currentStep: 4,
    expectedCompletionDate: '2026-09-05',
    orderDate: '2026-08-10',
    notes: 'Wall-mounted TV panel with ambient backlighting.'
  }
];

const getDeletedOrderIds = () => {
  try {
    const stored = localStorage.getItem(DELETED_ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveDeletedOrderIds = (list) => {
  try {
    localStorage.setItem(DELETED_ORDERS_KEY, JSON.stringify(list));
  } catch (e) {}
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Edit / Status Updater Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStep, setUpdateStep] = useState(1);
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateExpectedDate, setUpdateExpectedDate] = useState('');
  const [stageDates, setStageDates] = useState({
    1: '',
    2: '',
    3: '',
    4: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    let combinedOrders = [];
    const deletedIds = getDeletedOrderIds().map(id => String(id));

    const stored = localStorage.getItem('luxe_customer_orders');
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) combinedOrders = parsed;
      } catch (e) {}
    } else {
      // First time ever: initialize with default demo orders
      combinedOrders = DEMO_CUSTOMER_ORDERS;
      try {
        localStorage.setItem('luxe_customer_orders', JSON.stringify(DEMO_CUSTOMER_ORDERS));
      } catch (e) {}
    }

    // Filter out deleted IDs
    combinedOrders = combinedOrders.filter(o => o && o.orderId && !deletedIds.includes(String(o.orderId)));

    // Fast non-blocking fetch from backend API if available
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const response = await fetch(`${API_BASE_URL}/orders`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const serverData = await response.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          const map = new Map();
          [...combinedOrders, ...serverData].forEach(o => {
            if (o && o.orderId && !deletedIds.includes(String(o.orderId))) {
              map.set(String(o.orderId), o);
            }
          });
          combinedOrders = Array.from(map.values());
        }
      }
    } catch (err) {}

    setOrders(combinedOrders);
    setLoading(false);
  };

  // WhatsApp Reply Handler for Admin to reply directly to Customer's WhatsApp Number
  const handleWhatsAppReply = (ord) => {
    const rawNumber = ord.whatsappNumber || ord.phone || '';
    const phoneClean = rawNumber.replace(/[^\d]/g, '');
    const validPhone = phoneClean.length >= 10 ? phoneClean : '';
    if (!validPhone) {
      alert(`Customer WhatsApp number not available for order #${ord.orderId}.`);
      return;
    }
    const targetNumber = validPhone.startsWith('91') ? validPhone : `91${validPhone}`;
    
    const message = `*LUXE INTERIOR ADMIN ORDER RESPONSE*
----------------------------------------
Hello *${ord.customerName || 'Customer'}*,

Regarding your Website Order *#${ord.orderId}* (${ord.projectType}):
📌 *Current Progress Stage:* Step ${ord.currentStep || 1} of 4 (${getStepLabel(ord.currentStep || 1)})
💰 *Total Amount:* ${ord.totalAmount || '₹N/A'}
💳 *Payment Mode:* ${ord.paymentMode || 'Cash on Delivery'}
📍 *Delivery Address:* ${ord.address || 'As registered'}

Thank you for choosing Luxe Interior! Please reply if you have any questions.`;

    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Open Edit Modal
  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setUpdateStep(order.currentStep || 1);
    setUpdateNotes(order.notes || '');
    setUpdateExpectedDate(order.expectedCompletionDate || '');

    const datesMap = { 1: '', 2: '', 3: '', 4: '' };
    if (order.steps && Array.isArray(order.steps)) {
      order.steps.forEach(st => {
        datesMap[st.stepNumber] = st.date || '';
      });
    }
    setStageDates(datesMap);
  };

  // Save Status Update Handler
  const handleSaveStatusUpdate = async () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(ord => {
      if (String(ord.orderId) === String(selectedOrder.orderId)) {
        return {
          ...ord,
          currentStep: updateStep,
          notes: updateNotes,
          expectedCompletionDate: updateExpectedDate
        };
      }
      return ord;
    });

    setOrders(updatedOrders);

    // Save to localStorage
    try {
      localStorage.setItem('luxe_customer_orders', JSON.stringify(updatedOrders));
      localStorage.setItem('luxe_has_order_update', JSON.stringify({
        orderId: selectedOrder.orderId,
        step: updateStep,
        updatedAt: Date.now()
      }));
      window.dispatchEvent(new Event('orderStatusUpdated'));
    } catch (e) {}

    // Background sync to server
    try {
      await fetch(`${API_BASE_URL}/orders/update-status/${selectedOrder.orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: updateStep,
          stageDates: stageDates,
          notes: updateNotes,
          expectedCompletionDate: updateExpectedDate
        })
      });
    } catch (err) {}

    setMessage(`Order '${selectedOrder.orderId}' status updated to Step ${updateStep}! Notification sent.`);
    setSelectedOrder(null);
    setTimeout(() => setMessage(''), 4000);
  };

  // Delete Order Handler
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order '${orderId}'?`)) return;

    const idStr = String(orderId);

    // 1. Add to deleted IDs list so it never reappears on refresh
    const deletedIds = getDeletedOrderIds();
    if (!deletedIds.includes(idStr)) {
      deletedIds.push(idStr);
      saveDeletedOrderIds(deletedIds);
    }

    // 2. Filter local state
    const filtered = orders.filter(ord => String(ord.orderId) !== idStr);
    setOrders(filtered);

    // 3. Save updated list to localStorage (even if empty [])
    try {
      localStorage.setItem('luxe_customer_orders', JSON.stringify(filtered));
    } catch (e) {}

    // 4. Background server delete
    try {
      await fetch(`${API_BASE_URL}/orders/${idStr}`, { method: 'DELETE' });
    } catch (err) {}

    setMessage(`Order '${orderId}' removed permanently.`);
    setTimeout(() => setMessage(''), 4000);
  };

  const getStepLabel = (step) => {
    switch (parseInt(step, 10)) {
      case 1: return '1. Order Confirmed';
      case 2: return '2. Design & Material Selection';
      case 3: return '3. Carpentry & Production';
      case 4: return '4. Site Installation & Delivery';
      default: return '1. Order Confirmed';
    }
  };

  return (
    <div className="order-mgmt-container">
      
      {/* Header */}
      <div className="order-mgmt-header">
        <div>
          <h2>📦 Website Customer Orders Database</h2>
          <p>View all website customer bookings, send WhatsApp replies, and update project progress.</p>
        </div>
        <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
          🔄 Refresh Orders Database
        </button>
      </div>

      {/* Alert Notification Message */}
      {message && (
        <div className="order-toast-success">
          ✅ {message}
        </div>
      )}

      {/* ORDERS LIST TABLE */}
      <div className="mgmt-card orders-list-card">
        <h3>📋 Customer Website Bookings ({orders.length} orders)</h3>

        {loading ? (
          <p className="loading-text">Loading customer website orders...</p>
        ) : orders.length === 0 ? (
          <p className="empty-text">No customer orders recorded on the website yet.</p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Info</th>
                  <th>Project / Product</th>
                  <th>Total & Payment</th>
                  <th>Current Stage</th>
                  <th>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.orderId}>
                    <td>
                      <span className="table-order-id">{ord.orderId}</span>
                      {ord.orderDate && <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>📅 {ord.orderDate}</div>}
                    </td>
                    <td>
                      <strong>{ord.customerName}</strong>
                      <div style={{ fontSize: '12px', color: '#555' }}>📞 Phone: {ord.phone}</div>
                      {ord.whatsappNumber && <div style={{ fontSize: '12px', color: '#25D366', fontWeight: 'bold' }}>💬 WA: {ord.whatsappNumber}</div>}
                      {ord.email && <div style={{ fontSize: '11.5px', color: '#888' }}>📧 {ord.email}</div>}
                      {ord.address && <div style={{ fontSize: '11.5px', color: '#666', fontStyle: 'italic', maxWidth: '180px' }}>📍 {ord.address}</div>}
                    </td>
                    <td>
                      <span className="table-project-pill">{ord.projectType}</span>
                      {ord.notes && <div style={{ fontSize: '11.5px', color: '#777', marginTop: '4px' }}>{ord.notes}</div>}
                    </td>
                    <td>
                      <strong>{ord.totalAmount || '₹N/A'}</strong>
                      <div style={{ fontSize: '11.5px', color: '#2e7d32', fontWeight: 'bold' }}>{ord.paymentMode || 'Cash on Delivery'}</div>
                    </td>
                    <td>
                      <span className={`table-step-pill step-${ord.currentStep || 1}`}>
                        Step {ord.currentStep || 1}: {getStepLabel(ord.currentStep || 1).split('. ')[1]}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn-action-whatsapp"
                        onClick={() => handleWhatsAppReply(ord)}
                        style={{
                          background: '#25D366',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginRight: '6px'
                        }}
                        title="Reply Customer on WhatsApp"
                      >
                        💬 Reply via WhatsApp
                      </button>

                      <button 
                        className="btn-action-edit"
                        onClick={() => handleOpenEditModal(ord)}
                      >
                        ✏️ Update Status
                      </button>

                      <button 
                        className="btn-action-delete"
                        onClick={() => handleDeleteOrder(ord.orderId)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content update-modal">
            <div className="modal-header">
              <h3>Update Project Status — Order {selectedOrder.orderId}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="customer-sub-text">
                Customer: <strong>{selectedOrder.customerName}</strong> ({selectedOrder.phone})
              </p>

              {/* Stage Selector */}
              <div className="form-group">
                <label>Select Current Stage Progress (1 to 4):</label>
                <div className="stage-radio-group">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <label key={stepNum} className={`stage-radio-label ${updateStep === stepNum ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="stageStep"
                        value={stepNum}
                        checked={updateStep === stepNum}
                        onChange={() => setUpdateStep(stepNum)}
                      />
                      <span>{getStepLabel(stepNum)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes & Date */}
              <div className="form-group">
                <label>Expected Completion Date:</label>
                <input 
                  type="text" 
                  value={updateExpectedDate}
                  onChange={(e) => setUpdateExpectedDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="form-group">
                <label>Project Notes / Status Highlights:</label>
                <textarea 
                  rows="3"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Add notes for the customer..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedOrder(null)}>Cancel</button>
              <button className="btn-save-update" onClick={handleSaveStatusUpdate}>
                💾 Save Status Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManagement;
