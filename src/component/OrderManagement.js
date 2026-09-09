import React, { useState, useEffect } from 'react';
import './OrderManagement.css';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE_URL = isLocalhost ? 'http://localhost:5000/api' : 'https://selvaharish-interior-back.onrender.com/api';
const DELETED_ORDERS_KEY = 'luxe_deleted_orders_v2';

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
    const deletedIds = getDeletedOrderIds().map(id => String(id).toLowerCase().trim());

    const stored = localStorage.getItem('luxe_customer_orders');
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) combinedOrders = parsed;
      } catch (e) {}
    }

    // Filter out deleted IDs
    combinedOrders = combinedOrders.filter(o => o && o.orderId && !deletedIds.includes(String(o.orderId).toLowerCase().trim()));

    // Fast non-blocking fetch from backend API with 8-second timeout for Render response
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${API_BASE_URL}/orders`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const serverData = await response.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          const map = new Map();
          [...combinedOrders, ...serverData].forEach(o => {
            if (o && o.orderId) {
              const cleanId = String(o.orderId).toLowerCase().trim();
              if (!deletedIds.includes(cleanId)) {
                // Deduplicate by clean ID
                if (!map.has(cleanId)) {
                  map.set(cleanId, o);
                } else {
                  // Prefer server data or object with more fields
                  const prev = map.get(cleanId);
                  map.set(cleanId, { ...prev, ...o });
                }
              }
            }
          });
          combinedOrders = Array.from(map.values());
        }
      }
    } catch (err) {}

    // Deduplicate cleanly by normalized Order ID
    const finalMap = new Map();
    combinedOrders.forEach(o => {
      if (!o || !o.orderId) return;
      const cleanId = String(o.orderId).toLowerCase().trim();
      if (!deletedIds.includes(cleanId)) {
        finalMap.set(cleanId, o);
      }
    });

    const finalOrders = Array.from(finalMap.values());
    setOrders(finalOrders);
    setLoading(false);

    // Sync any unsynced local orders to backend server database so PC and Mobile show identical database orders
    try {
      finalOrders.forEach((ord) => {
        if (ord && ord.orderId) {
          fetch(`${API_BASE_URL}/orders/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ord)
          }).catch(() => {});
        }
      });
    } catch (e) {}
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

    // Save to localStorage & trigger targeted customer email notification
    try {
      localStorage.setItem('luxe_customer_orders', JSON.stringify(updatedOrders));
      
      const targetEmail = (selectedOrder.email || '').toLowerCase().trim();
      const targetPhone = (selectedOrder.phone || '').trim();

      const storedNotifs = localStorage.getItem('luxe_customer_notifications');
      const notifMap = storedNotifs ? JSON.parse(storedNotifs) : {};

      const notifItem = {
        orderId: selectedOrder.orderId,
        step: updateStep,
        updatedAt: Date.now()
      };

      if (targetEmail) {
        const existing = notifMap[targetEmail] || [];
        notifMap[targetEmail] = [notifItem, ...existing.filter(n => String(n.orderId) !== String(selectedOrder.orderId))];
      }
      if (targetPhone) {
        const existingP = notifMap[targetPhone] || [];
        notifMap[targetPhone] = [notifItem, ...existingP.filter(n => String(n.orderId) !== String(selectedOrder.orderId))];
      }

      localStorage.setItem('luxe_customer_notifications', JSON.stringify(notifMap));

      // Legacy fallback single update object
      localStorage.setItem('luxe_has_order_update', JSON.stringify({
        orderId: selectedOrder.orderId,
        customerEmail: targetEmail,
        customerPhone: targetPhone,
        step: updateStep,
        updatedAt: Date.now()
      }));

      window.dispatchEvent(new Event('orderStatusUpdated'));
      window.dispatchEvent(new Event('storage'));
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

    const idStr = String(orderId).trim();
    const idClean = idStr.toLowerCase();

    // 1. Add to deleted IDs list so it never reappears on refresh
    const deletedIds = getDeletedOrderIds().map(id => String(id).toLowerCase().trim());
    if (!deletedIds.includes(idClean)) {
      deletedIds.push(idClean);
      saveDeletedOrderIds(deletedIds);
    }

    // 2. Filter local state
    const filtered = orders.filter(ord => String(ord.orderId).toLowerCase().trim() !== idClean);
    setOrders(filtered);

    // 3. Save updated list to localStorage (even if empty [])
    try {
      localStorage.setItem('luxe_customer_orders', JSON.stringify(filtered));
      window.dispatchEvent(new Event('orderStatusUpdated'));
      window.dispatchEvent(new Event('storage'));
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
                  <th>PAN Card</th>
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
                      <strong style={{ color: '#c98544', fontSize: '13px' }}>🆔 {ord.panNumber || 'N/A'}</strong>
                    </td>
                    <td>
                      <span className="table-project-pill">{ord.projectType}</span>
                      {ord.notes && <div style={{ fontSize: '11.5px', color: '#777', marginTop: '4px' }}>{ord.notes}</div>}
                      {ord.customPic && (
                        <div style={{ marginTop: '6px' }}>
                          <a href={ord.customPic} target="_blank" rel="noreferrer">
                            <img src={ord.customPic} alt="Customer Reference" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #c98544' }} />
                          </a>
                          <div style={{ fontSize: '10.5px', color: '#c98544', fontWeight: 'bold' }}>📷 Photo Attached</div>
                        </div>
                      )}
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
                <label>Select Current Project Progress (Process Step 1 to 4):</label>
                <div className="stage-radio-group">
                  {[
                    { num: 1, label: 'Step 1: Order Confirmed & Site Survey' },
                    { num: 2, label: 'Step 2: 3D Design & Material Finalized' },
                    { num: 3, label: 'Step 3: Carpentry & Factory Production' },
                    { num: 4, label: 'Step 4: Site Installation & Final Delivery' }
                  ].map((st) => (
                    <label key={st.num} className={`stage-radio-label ${updateStep === st.num ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="stageStep"
                        value={st.num}
                        checked={updateStep === st.num}
                        onChange={() => setUpdateStep(st.num)}
                      />
                      <span>{st.label}</span>
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
